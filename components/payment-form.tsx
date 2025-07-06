"use client"

import { useEffect, useState } from 'react'

interface PaymentFormProps {
  orderId: string
  amount: number
  merchantId: string
}

export function PaymentForm({ orderId, amount, merchantId }: PaymentFormProps) {
  const [origin, setOrigin] = useState('')
  
  useEffect(() => {
    // Set origin after component mounts (client-side only)
    setOrigin(window.location.origin)
    
    // Auto-submit form after origin is set
    const timer = setTimeout(() => {
      const form = document.getElementById('payso-form') as HTMLFormElement
      if (form && origin) {
        console.log('Auto-submitting form to PaySolutions...')
        form.submit()
      }
    }, 1500) // Wait for origin to be set
    
    return () => clearTimeout(timer)
  }, [origin])

  // Log form data for debugging
  console.log('PaySolutions Form Data:', {
    merchantId,
    refNo: orderId,
    amount: amount.toFixed(2),
    currencyCode: 'THB',
    productDetail: `Carbon Credit Purchase - Order ${orderId}`,
  })

  return (
    <>
      {/* Simplified form with minimal required fields */}
      <form 
        id="payso-form"
        method="POST" 
        action="https://payments.paysolutions.asia/payment"
      >
        {/* Basic required fields */}
        <input type="hidden" name="merchantId" value={merchantId} />
        <input type="hidden" name="orderNo" value={orderId} />
        <input type="hidden" name="amount" value={amount.toFixed(2)} />
        <input type="hidden" name="currency" value="THB" />
        <input type="hidden" name="description" value="Carbon Credit Purchase" />
        
        {/* Customer info */}
        <input type="hidden" name="buyerName" value="Test User" />
        <input type="hidden" name="buyerEmail" value="test@example.com" />
        <input type="hidden" name="buyerPhone" value="0801234567" />
        
        {/* Return URLs */}
        <input type="hidden" name="successUrl" value={`${origin}/payment/success?orderId=${orderId}`} />
        <input type="hidden" name="failUrl" value={`${origin}/payment/fail?orderId=${orderId}`} />
        <input type="hidden" name="callbackUrl" value={`${origin}/api/payment/callback`} />
        
        {/* Language */}
        <input type="hidden" name="lang" value="th" />
        
        {/* Debug button - remove in production */}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          {origin ? 'Submit to PaySolutions (Manual)' : 'Loading...'}
        </button>
        
        {/* Auto-submit info */}
        <div className="mt-2 text-xs text-gray-500">
          Auto-submit will trigger in 1.5 seconds after page load
        </div>
      </form>
      
      {/* Show simplified form data for debugging */}
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-bold mb-2">PaySolutions Form Data:</h3>
        <p><strong>merchantId:</strong> {merchantId}</p>
        <p><strong>orderNo:</strong> {orderId}</p>
        <p><strong>amount:</strong> {amount.toFixed(2)}</p>
        <p><strong>currency:</strong> THB</p>
        <p><strong>description:</strong> Carbon Credit Purchase</p>
        <p><strong>successUrl:</strong> {origin}/payment/success</p>
        <p><strong>callbackUrl:</strong> {origin}/api/payment/callback</p>
        <p><strong>Status:</strong> {origin ? 'Ready to submit' : 'Loading...'}</p>
        
        <div className="mt-2 text-xs text-red-600">
          <p><strong>Note:</strong> If getting 500 error, the field names might be wrong.</p>
          <p>Contact PaySolutions with merchant ID {merchantId} for exact field requirements.</p>
        </div>
      </div>
    </>
  )
}