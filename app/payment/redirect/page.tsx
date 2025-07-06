"use client"

import { useSearchParams } from 'next/navigation'
import { PaymentForm } from '@/components/payment-form'
import { useEffect, useState, Suspense } from 'react'

function PaymentRedirectContent() {
  const searchParams = useSearchParams()
  const [isRedirecting, setIsRedirecting] = useState(true)
  
  const orderId = searchParams.get('orderId') || ''
  const amount = parseFloat(searchParams.get('amount') || '0')
  const merchantId = '62551562'

  useEffect(() => {
    // Show loading state briefly before redirect
    const timer = setTimeout(() => {
      setIsRedirecting(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!orderId || !amount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Payment Request</h1>
          <p className="text-gray-600">Missing order information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-emerald-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isRedirecting ? 'Preparing Payment...' : 'Ready for Payment'}
          </h1>
          <p className="text-gray-600">Order ID: {orderId}</p>
          <p className="text-gray-600">Amount: ฿{amount}</p>
          {!isRedirecting && (
            <p className="text-green-600 mt-2">Form loaded - You can now submit to PaySolutions below</p>
          )}
        </div>
        
        <div className="mt-8">
          <PaymentForm 
            orderId={orderId}
            amount={amount}
            merchantId={merchantId}
          />
        </div>
      </div>
    </div>
  )
}

export default function PaymentRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentRedirectContent />
    </Suspense>
  )
}