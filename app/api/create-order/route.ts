import { NextRequest, NextResponse } from 'next/server'
import { createCashfreeOrder } from '@/lib/cashfree'
import { createPendingLead, kundliRequestSchema } from '@/lib/kundli-request'

export async function POST(req: NextRequest) {
  try {
    const parsed = kundliRequestSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing or invalid birth details' },
        { status: 400 }
      )
    }

    const input = parsed.data
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`
    let lead
    try {
      lead = await createPendingLead(orderId, input)
    } catch (error) {
      console.error('Failed to store astrology request:', error)
      return NextResponse.json(
        { saved: false, error: 'Could not save your details. Please submit again.' },
        { status: 500 }
      )
    }

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://moolank.life'
      const response = await createCashfreeOrder({
        orderId,
        amount: 499,
        customerId: `cust_${Date.now()}`,
        customerName: input.fullName,
        customerEmail: input.email,
        customerPhone: input.phone,
        returnUrl: `${appUrl}/payment-success?order_id=${orderId}`,
        notifyUrl: `${appUrl}/api/webhook`,
      })

      return NextResponse.json({
        saved: true,
        paymentReady: true,
        orderId: response.orderId,
        sessionId: response.paymentSessionId,
        orderToken: response.paymentSessionId,
        cashfreeMode: response.mode,
        leadId: lead.id,
      })
    } catch (error) {
      console.error('Payment setup failed after the request was saved:', error)
      return NextResponse.json({
        saved: true,
        paymentReady: false,
        orderId,
        leadId: lead.id,
      })
    }
  } catch (error: any) {
    console.error('Error creating Cashfree order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
