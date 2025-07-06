"use client"

import { useEffect } from 'react'

interface PaymentFormProps {
  orderId: string
  amount: number
  merchantId: string
}

export function PaymentForm({ orderId, amount, merchantId }: PaymentFormProps) {
  useEffect(() => {
    // Auto-submit form on mount
    const form = document.getElementById('payso-form') as HTMLFormElement
    if (form) {
      form.submit()
    }
  }, [])

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
      {/* Visible form for debugging - remove style={{ display: 'none' }} to see the form */}
      <form 
        id="payso-form"
        method="POST" 
        action="https://payments.paysolutions.asia/payment"
      >
        <input type="hidden" name="customerId" value={merchantId} />
        <input type="hidden" name="refNo" value={orderId} />
        <input type="hidden" name="amount" value={amount.toFixed(2)} />
        <input type="hidden" name="currencyCode" value="THB" />
        <input type="hidden" name="productDetail" value={`Carbon Credit Purchase - Order ${orderId}`} />
        <input type="hidden" name="customerName" value="Carbon Credit Buyer" />
        <input type="hidden" name="customerEmail" value="customer@example.com" />
        <input type="hidden" name="customerPhone" value="0812345678" />
        <input type="hidden" name="lang" value="TH" />
        
        {/* Callback URLs - often required by payment gateways */}
        <input type="hidden" name="backendReturnUrl" value={`${window.location.origin}/api/payment/callback`} />
        <input type="hidden" name="frontendReturnUrl" value={`${window.location.origin}/payment/success?orderId=${orderId}`} />
        
        {/* Additional fields that might be required */}
        <input type="hidden" name="merchantDefined1" value={orderId} />
        <input type="hidden" name="merchantDefined2" value="Carbon Credit" />
        <input type="hidden" name="merchantDefined3" value="" />
        <input type="hidden" name="merchantDefined4" value="" />
        <input type="hidden" name="merchantDefined5" value="" />
        
        {/* Debug button - remove in production */}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit to PaySolutions (Debug)
        </button>
      </form>
      
      {/* Show form data for debugging */}
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <p>customerId (merchantId): {merchantId}</p>
        <p>refNo: {orderId}</p>
        <p>amount: {amount.toFixed(2)}</p>
        <p>currencyCode: THB</p>
      </div>
    </>
  )
}