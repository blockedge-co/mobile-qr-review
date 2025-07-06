"use client"

import { useEffect, useState } from 'react'

interface PaymentFormProps {
  orderId: string
  amount: number
  merchantId: string
}

export function PaymentForm({ orderId, amount, merchantId }: PaymentFormProps) {
  const [origin, setOrigin] = useState('')
  const [bypassMode, setBypassMode] = useState(false)
  const [refNoFormat, setRefNoFormat] = useState<'timestamp' | 'padded' | 'alphanumeric' | 'simple'>('timestamp')
  
  // PaySolutions Solution: 12-digit random refNo + orderId in productDetail
  const refNo = Math.floor(Math.random() * 999999999999).toString().padStart(12, '0')
  const productDetail = orderId // Use orderId as productDetail instead of description
  
  useEffect(() => {
    // Set origin after component mounts (client-side only)
    setOrigin(window.location.origin)
    
    // Check if bypass mode is enabled via URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    setBypassMode(urlParams.get('bypass') === 'true')
    
    // Auto-submit or bypass after origin is set
    const timer = setTimeout(() => {
      if (bypassMode) {
        // Bypass PaySolutions and go directly to success page
        window.location.href = `${origin}/payment/success?orderId=${orderId}&status=bypass`
      } else {
        const form = document.getElementById('payso-form') as HTMLFormElement
        if (form && origin) {
          console.log('Auto-submitting form to PaySolutions...')
          form.submit()
        }
      }
    }, 1500) // Wait for origin to be set
    
    return () => clearTimeout(timer)
  }, [origin, bypassMode, orderId])

  // Log form data for debugging
  console.log('PaySolutions Form Data (SOLUTION):', {
    merchantId,
    refNo: refNo + ' (12-digit random)',
    amount: amount.toFixed(2),
    currencyCode: 'THB',
    productDetail: productDetail + ' (orderId as productDetail)',
    solution: 'refNo=12ตัวสุ่ม, productDetail=orderId'
  })

  const handleBypass = () => {
    window.location.href = `${origin}/payment/success?orderId=${orderId}&status=bypass`
  }

  return (
    <>
      {bypassMode ? (
        <div className="text-center">
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg mb-4">
            <h3 className="font-bold text-yellow-800">Bypass Mode Enabled</h3>
            <p className="text-yellow-700">Redirecting to success page in 1.5 seconds...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Try different PaySolutions field formats */}
          <form 
            id="payso-form"
            method="POST" 
            action="https://payments.paysolutions.asia/payment"
          >
        {/* PaySolutions SOLUTION: 12-digit refNo + orderId in productDetail */}
        <input type="hidden" name="merchantId" value={merchantId} />
        <input type="hidden" name="refNo" value={refNo} />
        <input type="hidden" name="amount" value={amount.toFixed(2)} />
        <input type="hidden" name="currencyCode" value="THB" />
        <input type="hidden" name="productDetail" value={productDetail} />
        
        {/* Alternative field names for compatibility */}
        <input type="hidden" name="orderRef" value={refNo} />
        <input type="hidden" name="customerId" value={merchantId} />
        <input type="hidden" name="orderNo" value={refNo} />
        
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
        
            {/* PaySolutions Solution Info */}
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 text-green-800">✅ PaySolutions Solution Applied:</h4>
              <div className="text-xs text-green-700 space-y-1">
                <p><strong>refNo:</strong> {refNo} (12-digit random)</p>
                <p><strong>productDetail:</strong> {productDetail} (orderId)</p>
                <p className="text-green-600 font-medium">This should bypass the 500 error!</p>
              </div>
            </div>

            {/* Debug button - remove in production */}
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              {origin ? 'Submit to PaySolutions (Manual)' : 'Loading...'}
            </button>
            
            {/* Bypass button for testing */}
            <button 
              type="button" 
              onClick={handleBypass}
              className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Bypass to Success
            </button>
            
            {/* Auto-submit info */}
            <div className="mt-2 text-xs text-gray-500">
              Auto-submit will trigger in 1.5 seconds after page load
            </div>
          </form>
          
          {/* Show simplified form data for debugging */}
          <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
            <h3 className="font-bold mb-2">PaySolutions Form Data (FINAL):</h3>
            <p><strong>merchantId:</strong> {merchantId}</p>
            <p><strong>refNo:</strong> {refNo} <span className="text-green-600">(12-digit random)</span></p>
            <p><strong>amount:</strong> {amount.toFixed(2)}</p>
            <p><strong>currencyCode:</strong> THB</p>
            <p><strong>productDetail:</strong> {productDetail} <span className="text-green-600">(orderId)</span></p>
            <p><strong>backendReturnUrl:</strong> {origin}/api/payment/callback</p>
            <p><strong>frontendReturnUrl:</strong> {origin}/payment/success</p>
            <p><strong>Status:</strong> {origin ? 'Ready to submit' : 'Loading...'}</p>
            
            <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-800">
              <p><strong>✅ SOLUTION APPLIED:</strong></p>
              <p>• refNo = 12-digit random number</p>
              <p>• productDetail = orderId (not description)</p>
              <p>• Should bypass PaySolutions 500 error</p>
            </div>
          </div>
        </>
      )}
    </>
  )
}