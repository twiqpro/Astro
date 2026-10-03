'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ZodiacBackdrop from '@/components/ZodiacBackdrop'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get('order_id')
      
      if (!orderId) {
        setStatus('error')
        setMessage('Order ID not found')
        return
      }

      const leadDataStr = sessionStorage.getItem('pendingLeadData')
      const leadData = leadDataStr ? JSON.parse(leadDataStr) : undefined

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            leadData,
          }),
        })

        const data = await response.json()

        if (data.success && data.isPaid) {
          setStatus('success')
          setMessage('Payment successful! Your Kundli report will be prepared by our experienced astrologers and sent to your email and phone within 24 hours.')
          sessionStorage.removeItem('pendingLeadData')
        } else {
          setStatus('error')
          setMessage('Payment verification failed. Please contact support with your order ID.')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('Failed to verify payment. Please contact support.')
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="relative min-h-screen bg-cream flex items-center justify-center px-4">
      <ZodiacBackdrop />
      <div className="relative max-w-md w-full">
        {status === 'loading' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">Verifying Payment...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
              <p className="text-gray-700">{message}</p>
            </div>
            
            <div className="bg-gold-soft border-l-4 border-gold p-4 mb-6">
              <p className="text-sm text-ink">
                <strong>What happens next?</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-ink mt-2 space-y-1">
                <li>Our experienced astrologer will analyze your birth details</li>
                <li>A comprehensive Kundli report will be prepared manually</li>
                <li>You will receive the report via email and WhatsApp within 24 hours</li>
              </ul>
            </div>

            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`}
              className="block w-full bg-plum hover:bg-plum-dark text-gold-soft font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Back to Home
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Issue</h1>
              <p className="text-gray-700">{message}</p>
            </div>

            <div className="space-y-3">
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`}
                className="block w-full bg-plum hover:bg-plum-dark text-gold-soft font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                Try Again
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
