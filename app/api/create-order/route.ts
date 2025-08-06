import { NextRequest, NextResponse } from 'next/server'

// Server-side only configuration
const API_CONFIG = {
  BASE_URL: 'https://pay.blockedge.earth',
  BEARER_TOKEN: process.env.API_BEARER_TOKEN || '99d40e6480dcef7549b3068d13b969473dd93616cd1a589a2a1d48cc9cd993bb',
  TIMEOUT: 10000
}

// Project token mapping
const PROJECT_TOKENS: { [key: string]: string } = {
  'forest-restoration': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  'mangrove-restoration': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 
  'renewable-energy': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
}

// Default beneficiary for testing
const DEFAULT_BENEFICIARY = {
  name: 'Carbon Credit Buyer',
  address: '0xAC5675D47B1Cd43C836dF6014D86B70B06173542'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, duration, price, co2, autoRenewal } = body

    // Validate required fields
    if (!projectId || !duration || !price || !co2) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create order payload
    const orderPayload = {
      retirementMessage: `Carbon credit purchase: ${projectId} for ${duration} days - ${co2}kg CO₂ offset`,
      token: PROJECT_TOKENS[projectId] || PROJECT_TOKENS['forest-restoration'],
      beneficiaryString: DEFAULT_BENEFICIARY.name,
      retireAmount: Math.round(co2 / 10), // Convert kg to 100kg units (0.1 ton)
      beneficiaryAddress: DEFAULT_BENEFICIARY.address,
      price: price,
      totalAmount: price * Math.round(co2 / 10)
    }

    // Make request to BlockEdge API
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.BEARER_TOKEN}`
      },
      body: JSON.stringify(orderPayload),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('BlockEdge API error:', response.status, errorText)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Order creation failed' },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    // Log successful order creation (server-side only)
    console.log('Order created:', {
      orderid: result.orderid,
      projectId,
      duration,
      price,
      co2
    })

    return NextResponse.json({
      orderid: result.orderid,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Order creation error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout' },
          { status: 408 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}