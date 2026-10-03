import { NextRequest, NextResponse } from 'next/server'
import { fetchCashfreePayments } from '@/lib/cashfree'
import { findLeadByOrderId, updateLead } from '@/lib/lead-store'
import { markPaidAndNotify } from '@/lib/kundli-request'

function readWebhook(body: {
  data?: {
    order?: { order_id?: string }
    payment?: { cf_payment_id?: string | number; payment_status?: string }
    orderId?: string
    txStatus?: string
    referenceId?: string | number
  }
  orderId?: string
  txStatus?: string
  referenceId?: string | number
}) {
  const data = body.data || {}
  return {
    orderId: data.order?.order_id || data.orderId || body.orderId || '',
    status: data.payment?.payment_status || data.txStatus || body.txStatus || '',
    paymentId: data.payment?.cf_payment_id || data.referenceId || body.referenceId || null,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, status, paymentId: webhookPaymentId } = readWebhook(body)

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      )
    }

    const payments = await fetchCashfreePayments(orderId).catch(() => null)
    const confirmed = payments?.find((payment) => payment.payment_status === 'SUCCESS')
    const paymentId = confirmed?.cf_payment_id
      ? String(confirmed.cf_payment_id)
      : webhookPaymentId
        ? String(webhookPaymentId)
        : null

    if (confirmed) {
      await markPaidAndNotify(orderId, paymentId)
      return NextResponse.json({ success: true })
    }

    if (status === 'SUCCESS') {
      return NextResponse.json(
        { error: 'Payment was not confirmed with Cashfree yet' },
        { status: 500 }
      )
    }

    const lead = await findLeadByOrderId(orderId)

    if (lead) {
      await updateLead(lead.id, {
        paymentStatus: status === 'FAILED' ? 'failed' : 'pending',
        cashfreePaymentId: paymentId || lead.cashfreePaymentId,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
