import { getCloudflareContext } from "@opennextjs/cloudflare"
import { prisma } from "@/lib/prisma"
import type { KundliRequestInput } from "@/lib/kundli-request"

export type StoredLead = {
  id: string
  createdAt: Date
  fullName: string
  gender: string
  dateOfBirth: Date
  birthTime: string
  birthPlace: string
  latitude: number
  longitude: number
  email: string
  phone: string
  paymentStatus: string
  cashfreeOrderId: string | null
  cashfreePaymentId: string | null
  amountPaise: number
  currency: string
  notifiedAt: Date | null
}

type LeadPatch = Partial<
  Pick<StoredLead, "paymentStatus" | "cashfreePaymentId" | "notifiedAt">
>

type D1Statement = {
  bind(...values: unknown[]): D1Statement
  first<T>(): Promise<T | null>
  run(): Promise<{ meta?: { changes?: number } }>
}

type LeadDatabase = {
  prepare(query: string): D1Statement
}

type LeadRow = {
  id: string
  created_at: string
  updated_at: string
  full_name: string
  gender: string
  date_of_birth: string
  birth_time: string
  birth_place: string
  latitude: number
  longitude: number
  email: string
  phone: string
  payment_status: string
  cashfree_order_id: string | null
  cashfree_payment_id: string | null
  amount_paise: number
  currency: string
  notified_at: string | null
}

function requestColumns(input: KundliRequestInput) {
  return {
    fullName: input.fullName,
    gender: input.gender,
    dateOfBirth: new Date(`${input.dateOfBirth}T00:00:00.000Z`),
    birthTime: input.birthTime,
    birthPlace: input.birthPlace,
    latitude: input.latitude,
    longitude: input.longitude,
    email: input.email,
    phone: input.phone,
  }
}

function fromRow(row: LeadRow): StoredLead {
  return {
    id: row.id,
    createdAt: new Date(row.created_at),
    fullName: row.full_name,
    gender: row.gender,
    dateOfBirth: new Date(row.date_of_birth),
    birthTime: row.birth_time,
    birthPlace: row.birth_place,
    latitude: row.latitude,
    longitude: row.longitude,
    email: row.email,
    phone: row.phone,
    paymentStatus: row.payment_status,
    cashfreeOrderId: row.cashfree_order_id,
    cashfreePaymentId: row.cashfree_payment_id,
    amountPaise: row.amount_paise,
    currency: row.currency,
    notifiedAt: row.notified_at ? new Date(row.notified_at) : null,
  }
}

async function getD1() {
  try {
    const { env } = await getCloudflareContext({ async: true })
    return ((env as { DB?: LeadDatabase }).DB ?? null)
  } catch {
    return null
  }
}

export async function insertLead(orderId: string, input: KundliRequestInput) {
  const details = requestColumns(input)
  const db = await getD1()
  if (!db) {
    return prisma.kundliLead.create({
      data: {
        ...details,
        paymentStatus: "pending",
        cashfreeOrderId: orderId,
        amountPaise: 49900,
        currency: "INR",
      },
    })
  }

  const now = new Date().toISOString()
  const id = crypto.randomUUID()
  await db
    .prepare(
      `INSERT INTO kundli_leads (
        id, created_at, updated_at, full_name, gender, date_of_birth, birth_time,
        birth_place, latitude, longitude, email, phone, payment_status,
        cashfree_order_id, amount_paise, currency
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 49900, 'INR')`
    )
    .bind(
      id,
      now,
      now,
      details.fullName,
      details.gender,
      details.dateOfBirth.toISOString(),
      details.birthTime,
      details.birthPlace,
      details.latitude,
      details.longitude,
      details.email,
      details.phone,
      orderId
    )
    .run()

  const stored = await findLeadByOrderId(orderId)
  if (!stored) {
    throw new Error("Birth details were not stored")
  }
  return stored
}

export async function findLeadByOrderId(orderId: string) {
  const db = await getD1()
  if (!db) {
    return prisma.kundliLead.findFirst({
      where: { cashfreeOrderId: orderId },
    })
  }

  const row = await db
    .prepare("SELECT * FROM kundli_leads WHERE cashfree_order_id = ? LIMIT 1")
    .bind(orderId)
    .first<LeadRow>()
  return row ? fromRow(row) : null
}

export async function updateLead(id: string, patch: LeadPatch) {
  const db = await getD1()
  if (!db) {
    return prisma.kundliLead.update({
      where: { id },
      data: patch,
    })
  }

  const current = await db
    .prepare("SELECT * FROM kundli_leads WHERE id = ? LIMIT 1")
    .bind(id)
    .first<LeadRow>()
  if (!current) {
    throw new Error("Saved request was not found")
  }

  const paymentStatus = patch.paymentStatus ?? current.payment_status
  const paymentId =
    patch.cashfreePaymentId !== undefined
      ? patch.cashfreePaymentId
      : current.cashfree_payment_id
  const notifiedAt =
    patch.notifiedAt !== undefined
      ? patch.notifiedAt?.toISOString() ?? null
      : current.notified_at

  await db
    .prepare(
      `UPDATE kundli_leads
       SET payment_status = ?, cashfree_payment_id = ?, notified_at = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(paymentStatus, paymentId, notifiedAt, new Date().toISOString(), id)
    .run()

  const row = await db
    .prepare("SELECT * FROM kundli_leads WHERE id = ? LIMIT 1")
    .bind(id)
    .first<LeadRow>()
  if (!row) throw new Error("Saved request was not found")
  return fromRow(row)
}

export async function claimLeadNotification(id: string) {
  const db = await getD1()
  if (!db) {
    const claimed = await prisma.kundliLead.updateMany({
      where: { id, notifiedAt: null },
      data: { notifiedAt: new Date() },
    })
    return claimed.count === 1
  }

  const result = await db
    .prepare(
      `UPDATE kundli_leads
       SET notified_at = ?, updated_at = ?
       WHERE id = ? AND notified_at IS NULL`
    )
    .bind(new Date().toISOString(), new Date().toISOString(), id)
    .run()
  return result.meta?.changes === 1
}
