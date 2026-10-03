'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import PlacesAutocomplete from '@/components/PlacesAutocomplete'
import HomeLanding from '@/components/HomeLanding'
import { load } from '@cashfreepayments/cashfree-js'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const

function formatDob(isoDate: string) {
  const [year, month, day] = isoDate.split('-')
  const monthName = MONTHS[Number(month) - 1]
  if (!year || !monthName || !day) return ''
  return `${day} -${monthName} -${year}`
}

function todayIsoDate() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${month}-${day}`
}

const FOCUS_OPTIONS = ['Money', 'Career', 'Health', 'Marriage'] as const

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['Male', 'Female'], { message: 'Please select a gender' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  birthTime: z.string().min(1, 'Birth time is required'),
  birthPlace: z.string().min(1, 'Birth place is required'),
  latitude: z.number(),
  longitude: z.number(),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  specialFocus: z.array(z.enum(FOCUS_OPTIONS)).min(1, 'Choose at least one focus'),
})

type FormData = z.infer<typeof formSchema>

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [placeData, setPlaceData] = useState<{ name: string; lat: number; lng: number } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { specialFocus: [] },
  })

  const dateOfBirth = watch('dateOfBirth')

  useEffect(() => {
    if (window.location.hostname === 'www.moolank.life') {
      const next = new URL(window.location.href)
      next.protocol = 'https:'
      next.hostname = 'moolank.life'
      window.location.replace(next.toString())
    }
  }, [])

  const handlePlaceSelect = (place: { name: string; lat: number; lng: number }) => {
    setPlaceData(place)
    setValue('birthPlace', place.name)
    setValue('latitude', place.lat)
    setValue('longitude', place.lng)
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          birthTime: data.birthTime,
          birthPlace: data.birthPlace,
          latitude: data.latitude,
          longitude: data.longitude,
          email: data.email,
          phone: data.phone,
          specialFocus: data.specialFocus,
        }),
      })

      const result = await orderResponse.json()

      if (!orderResponse.ok || !result.saved || !result.orderId) {
        throw new Error(result.error || 'Could not save your details')
      }

      sessionStorage.setItem('pendingLeadData', JSON.stringify({
        ...data,
        orderId: result.orderId,
      }))

      if (!result.paymentReady || !result.sessionId) {
        alert('Your birth details are saved. Payment could not start, and the request was not discarded.')
        return
      }

      const cashfree = await load({ mode: result.cashfreeMode === 'production' ? 'production' : 'sandbox' })
      const checkout = await cashfree.checkout({
        paymentSessionId: result.sessionId,
        redirectTarget: '_self',
      })
      if (checkout?.error) {
        throw new Error(checkout.error.message || 'Cashfree could not open checkout')
      }
    } catch (error) {
      console.error('Payment initiation error:', error)
      alert(error instanceof Error ? error.message : 'Could not save your details. Please submit again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <HomeLanding
      form={
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('fullName')}
                type="text"
                className="w-full px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Male', 'Female'].map((option) => (
                  <label key={option} className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg cursor-pointer text-gray-900 hover:bg-gold-soft has-[:checked]:bg-plum has-[:checked]:text-gold-soft has-[:checked]:border-plum">
                    <input
                      {...register('gender')}
                      type="radio"
                      value={option}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="flex items-center w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-gold focus-within:border-transparent">
                    <span className={dateOfBirth ? 'text-gray-900' : 'text-gray-400'}>
                      {dateOfBirth ? formatDob(dateOfBirth) : '02 -oct -2026'}
                    </span>
                  </div>
                  <input
                    {...register('dateOfBirth')}
                    type="date"
                    min="1900-01-01"
                    max={todayIsoDate()}
                    aria-label="Date of Birth"
                    className="dob-picker absolute inset-0 z-10 h-full w-full cursor-pointer"
                    onMouseDown={(event) => {
                      event.preventDefault()
                    }}
                    onClick={(event) => {
                      const input = event.currentTarget
                      if (typeof input.showPicker === 'function') {
                        try {
                          input.showPicker()
                        } catch {
                          // The calendar is already open.
                        }
                      }
                    }}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Birth Time <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('birthTime')}
                  type="time"
                  className="w-full px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                {errors.birthTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Birth Place <span className="text-red-500">*</span>
              </label>
              <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />
              {errors.birthPlace && (
                <p className="text-red-500 text-sm mt-1">{errors.birthPlace.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="9876543210"
                maxLength={10}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                The handwritten kundli and answers are sent to this number
              </p>
            </div>

            <div>
              <p className="block text-sm font-semibold text-gray-700 mb-1">
                Special focus <span className="text-red-500">*</span>
              </p>
              <p className="text-xs text-gray-500 mb-2">Choose every area the astrologer should answer. You can select more than one.</p>
              <div className="grid grid-cols-2 gap-3">
                {FOCUS_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg cursor-pointer text-gray-900 hover:bg-gold-soft has-[:checked]:bg-plum has-[:checked]:text-gold-soft has-[:checked]:border-plum">
                    <input
                      {...register('specialFocus')}
                      type="checkbox"
                      value={option}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
              {errors.specialFocus && (
                <p className="text-red-500 text-sm mt-1">{errors.specialFocus.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-plum hover:bg-plum-dark text-gold-soft font-bold py-4 px-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Request my handwritten Kundli for ₹499'}
            </button>
          </form>
      }
    />
  )
}
