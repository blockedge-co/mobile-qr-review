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

  return (
    <form 
      id="payso-form"
      method="POST" 
      action="https://payments.paysolutions.asia/payment"
      style={{ display: 'none' }}
    >
      <input type="hidden" name="merchantId" value={merchantId} />
      <input type="hidden" name="refNo" value={orderId} />
      <input type="hidden" name="amount" value={amount.toFixed(2)} />
      <input type="hidden" name="currencyCode" value="THB" />
      <input type="hidden" name="productDetail" value={`Carbon Credit Purchase - Order ${orderId}`} />
      <input type="hidden" name="userDefined1" value={orderId} />
      <input type="hidden" name="customerName" value="Carbon Credit Buyer" />
      <input type="hidden" name="lang" value="TH" />
    </form>
  )
}