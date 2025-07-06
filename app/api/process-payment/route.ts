import { NextRequest, NextResponse } from 'next/server'

// PaySolutions API configuration
const PAYSO_CONFIG = {
  // Update with actual PaySolutions endpoint
  PAYMENT_URL: process.env.PAYSO_PAYMENT_URL || 'https://pay.blockedge.earth/api/payso/redirect',
  MERCHANT_ID: process.env.PAYSO_MERCHANT_ID || '',
  API_KEY: process.env.PAYSO_API_KEY || ''
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

    // Option 1: If PaySo requires a POST to get payment URL
    try {
      const paysoResponse = await fetch(PAYSO_CONFIG.PAYMENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderid: orderId,
          amount: amount,
          currency: 'THB',
          // Add other required PaySo parameters
        })
      })

      if (paysoResponse.ok) {
        const result = await paysoResponse.json()
        if (result.paymentUrl) {
          return NextResponse.json({
            success: true,
            paymentUrl: result.paymentUrl,
            orderId
          })
        }
      }
    } catch (error) {
      console.log('PaySo POST failed, falling back to redirect URL')
    }

    // Option 2: Direct redirect URL (if POST is not required)
    // This follows the pattern from your curl example where orderId is already created
    const paymentUrl = `https://pay.blockedge.earth/payment/${orderId}`
    
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