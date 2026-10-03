import { NextRequest, NextResponse } from 'next/server'
import { fetchCashfreePayments } from '@/lib/cashfree'
import { findLeadByOrderId, updateLead } from '@/lib/lead-store'
import { kundliRequestSchema, markPaidAndNotify } from '@/lib/kundli-request'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, leadData } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      )
    }

    const payments = await fetchCashfreePayments(orderId)

    if (payments.length === 0) {
      return NextResponse.json(
        { error: 'No payment found for this order' },
        { status: 404 }
      )
    }

    const payment = payments[0]
    const isPaid = payment.payment_status === 'SUCCESS'
    const paymentId = payment.cf_payment_id ? String(payment.cf_payment_id) : null
    const fallback = kundliRequestSchema.safeParse(leadData)

    if (!isPaid) {
      const existingLead = await findLeadByOrderId(orderId)

      if (existingLead) {
        await updateLead(existingLead.id, {
          paymentStatus: 'pending',
          cashfreePaymentId: paymentId || existingLead.cashfreePaymentId,
        })
      }

      return NextResponse.json({
        success: true,
        isPaid: false,
        leadId: existingLead?.id,
        message: 'Payment pending',
      })
    }

    const lead = await markPaidAndNotify(orderId, paymentId, fallback.success ? fallback.data : undefined)

    if (!lead) {
      return NextResponse.json(
        { error: 'Birth details were not saved for this order' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      isPaid: true,
      leadId: lead.id,
      message: 'Payment verified and lead saved',
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
