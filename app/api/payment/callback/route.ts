import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the callback data from PaySolutions
    console.log('PaySolutions Callback:', body)
    
    // Here you would typically:
    // 1. Verify the payment status
    // 2. Update your database
    // 3. Send confirmation emails
    // 4. Update order status in BlockEdge system
    
    return NextResponse.json({
      status: 'received',
      message: 'Payment callback processed'
    })
    
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Some payment gateways send GET requests for callbacks
  const { searchParams } = new URL(request.url)
  
  console.log('PaySolutions GET Callback:', Object.fromEntries(searchParams.entries()))
  
  return NextResponse.json({
    status: 'received',
    message: 'Payment callback processed'
  })
}