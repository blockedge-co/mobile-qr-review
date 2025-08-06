"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function PaymentFailContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'Unknown'
  const error = searchParams.get('error') || 'Payment was not completed'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600">
            {error}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="font-semibold mb-4">Order Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-red-600">Failed</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Try Again
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            If you continue to have issues, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  )
}