import { NextRequest, NextResponse } from 'next/server'
import { findLeadByOrderId, updateLead } from '@/lib/lead-store'
import { markPaidAndNotify } from '@/lib/kundli-request'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, txStatus, referenceId } = body.data || body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      )
    }

    const isPaid = txStatus === 'SUCCESS'
    const paymentId = referenceId ? String(referenceId) : null

    if (isPaid) {
      await markPaidAndNotify(orderId, paymentId)
      return NextResponse.json({ success: true })
    }

    const lead = await findLeadByOrderId(orderId)

    if (lead) {
      await updateLead(lead.id, {
        paymentStatus: txStatus === 'FAILED' ? 'failed' : 'pending',
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
