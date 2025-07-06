"use client"

import { useEffect, useState } from 'react'

interface PaymentFormProps {
  orderId: string
  amount: number
  merchantId: string
}

export function PaymentForm({ orderId, amount, merchantId }: PaymentFormProps) {
  const [origin, setOrigin] = useState('')
  
  // Generate numeric reference number from orderId
  const numericRefNo = orderId.replace(/[^0-9]/g, '') || Date.now().toString()
  
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
      {/* Try different PaySolutions field formats */}
      <form 
        id="payso-form"
        method="POST" 
        action="https://payments.paysolutions.asia/payment"
      >
        {/* Format 1: Standard field names */}
        <input type="hidden" name="merchantId" value={merchantId} />
        <input type="hidden" name="orderRef" value={numericRefNo} />
        <input type="hidden" name="amount" value={amount.toFixed(2)} />
        <input type="hidden" name="currencyCode" value="THB" />
        <input type="hidden" name="productDetail" value="Carbon Credit Purchase" />
        
        {/* Format 2: Alternative field names */}
        <input type="hidden" name="customerId" value={merchantId} />
        <input type="hidden" name="refNo" value={numericRefNo} />
        <input type="hidden" name="orderNo" value={numericRefNo} />
        
        {/* Customer information */}
        <input type="hidden" name="customerName" value="Test User" />
        <input type="hidden" name="customerEmail" value="test@example.com" />
        <input type="hidden" name="customerPhone" value="0801234567" />
        
        {/* Return URLs - try different naming conventions */}
        <input type="hidden" name="backendReturnUrl" value={`${origin}/api/payment/callback`} />
        <input type="hidden" name="frontendReturnUrl" value={`${origin}/payment/success?orderId=${orderId}`} />
        <input type="hidden" name="successReturnUrl" value={`${origin}/payment/success?orderId=${orderId}`} />
        <input type="hidden" name="failReturnUrl" value={`${origin}/payment/fail?orderId=${orderId}`} />
        
        {/* Language */}
        <input type="hidden" name="lang" value="TH" />
        
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
        <p><strong>Original orderNo:</strong> {orderId}</p>
        <p><strong>Numeric refNo:</strong> {numericRefNo}</p>
        <p><strong>amount:</strong> {amount.toFixed(2)}</p>
        <p><strong>currencyCode:</strong> THB</p>
        <p><strong>productDetail:</strong> Carbon Credit Purchase</p>
        <p><strong>backendReturnUrl:</strong> {origin}/api/payment/callback</p>
        <p><strong>frontendReturnUrl:</strong> {origin}/payment/success</p>
        <p><strong>Status:</strong> {origin ? 'Ready to submit' : 'Loading...'}</p>
        
        <div className="mt-2 text-xs text-green-600">
          <p><strong>Fixed:</strong> Reference number is now numeric only: {numericRefNo}</p>
        </div>
      </div>
    </>
  )
}