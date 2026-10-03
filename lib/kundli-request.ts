import { getCloudflareContext } from '@opennextjs/cloudflare'
import { Resend } from 'resend'
import { z } from 'zod'
import {
  claimLeadNotification,
  findLeadByOrderId,
  insertLead,
  updateLead,
  type StoredLead,
} from '@/lib/lead-store'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export const kundliRequestSchema = z.object({
  fullName: z.string().min(2),
  gender: z.enum(['Male', 'Female']),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().min(1),
  birthPlace: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  specialFocus: z.array(z.enum(['Money', 'Career', 'Health', 'Marriage'])).min(1),
})

export type KundliRequestInput = z.infer<typeof kundliRequestSchema>

type SavedLead = StoredLead

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function formatStoredDob(date: Date) {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = MONTHS[date.getUTCMonth()]
  return `${day} -${month} -${date.getUTCFullYear()}`
}

export function formatBirthTime(value: string) {
  const [hourText, minuteText = '00'] = value.split(':')
  const hour = Number(hourText)
  if (!Number.isFinite(hour)) return value
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${String(hour12).padStart(2, '0')}:${minuteText.slice(0, 2)} ${period}`
}

export async function createPendingLead(orderId: string, input: KundliRequestInput) {
  let lastError: unknown
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await insertLead(orderId, input)
    } catch (error) {
      lastError = error
      const existing = await findLeadByOrderId(orderId).catch(() => null)
      if (existing) return existing
    }
  }
  throw lastError
}

async function emailSettings() {
  let apiKey = process.env.RESEND_API_KEY
  let to = process.env.NOTIFY_EMAIL || 'twiq.pro@gmail.com'
  let from = process.env.RESEND_FROM || 'moolank <alerts@twiq.pro>'

  try {
    const { env } = await getCloudflareContext({ async: true })
    const bindings = env as {
      RESEND_API_KEY?: string
      NOTIFY_EMAIL?: string
      RESEND_FROM?: string
    }
    apiKey = bindings.RESEND_API_KEY || apiKey
    to = bindings.NOTIFY_EMAIL || to
    from = bindings.RESEND_FROM || from
  } catch {
    // Local Next.js has no Cloudflare bindings.
  }

  return { apiKey, to, from }
}

async function sendAstrologyRequestEmail(lead: SavedLead) {
  const { apiKey, to, from } = await emailSettings()
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }

  const resend = new Resend(apiKey)
  const amount = `${lead.currency} ${(lead.amountPaise / 100).toFixed(2)}`
  const submittedAt = Number.isNaN(lead.createdAt.getTime())
    ? ''
    : lead.createdAt.toISOString().replace('T', ' ').replace('.000Z', ' UTC')
  const rows = [
    ['Submitted', submittedAt],
    ['Name', lead.fullName],
    ['Gender', lead.gender],
    ['Date of birth', formatStoredDob(lead.dateOfBirth)],
    ['Birth time', formatBirthTime(lead.birthTime)],
    ['Birth place', lead.birthPlace],
    ['Latitude', String(lead.latitude)],
    ['Longitude', String(lead.longitude)],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Special focus', lead.specialFocus || ''],
    ['Payment status', lead.paymentStatus],
    ['Amount', amount],
    ['Order ID', lead.cashfreeOrderId || ''],
    ['Payment ID', lead.cashfreePaymentId || ''],
    ['Request ID', lead.id],
  ]
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')

  const html = `
    <h1>New moolank request</h1>
    <p>Every detail saved for this request is below, including payment status.</p>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse">
      ${rows
        .map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`)
        .join('')}
    </table>
  `

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New moolank request — ${lead.fullName}`,
    text,
    html,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function markPaidAndNotify(orderId: string, paymentId: string | null, fallback?: KundliRequestInput) {
  let lead = await findLeadByOrderId(orderId)

  if (!lead && fallback) {
    lead = await createPendingLead(orderId, fallback)
  }

  if (!lead) return null

  lead = await updateLead(lead.id, {
    paymentStatus: 'paid',
    cashfreePaymentId: paymentId || lead.cashfreePaymentId,
  })

  const claimed = await claimLeadNotification(lead.id)
  if (!claimed) return lead

  try {
    await sendAstrologyRequestEmail({ ...lead, paymentStatus: 'paid' })
  } catch (error) {
    await updateLead(lead.id, { notifiedAt: null })
    console.error('Astrology request email failed:', error)
  }

  return lead
}
