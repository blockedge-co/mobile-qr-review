import { NextRequest, NextResponse } from 'next/server'

// PaySolutions API configuration
const PAYSO_CONFIG = {
  // PaySolutions payment redirect URL
  PAYMENT_URL: 'https://payments.paysolutions.asia/payment',
  MERCHANT_ID: process.env.PAYSO_MERCHANT_ID || '62551562',
  // Add other required fields as needed
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount } = body

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create form data for PaySolutions redirect
    // Based on standard PaySolutions integration
    const formData = new URLSearchParams({
      merchantId: PAYSO_CONFIG.MERCHANT_ID,
      refNo: orderId, // Use our orderId as reference number
      amount: amount.toFixed(2),
      currencyCode: 'THB',
      productDetail: `Carbon Credit Purchase - Order ${orderId}`,
      // Add BlockEdge orderId for reference
      userDefined1: orderId,
      // Optional: Add customer info if available
      customerName: 'Carbon Credit Buyer',
      customerEmail: '',
      customerPhone: '',
      // Language
      lang: 'TH',
    })

    // Generate the payment redirect URL with query parameters
    const paymentUrl = `${PAYSO_CONFIG.PAYMENT_URL}?${formData.toString()}`
    
    console.log('PaySolutions redirect URL:', paymentUrl)
    
    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}