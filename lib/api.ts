// API utilities for order creation and payment processing
import { API_CONFIG, getApiUrl } from './config'

interface CreateOrderRequest {
  retirementMessage: string
  token: string
  beneficiaryString: string
  retireAmount: number
  beneficiaryAddress: string
  price: number
  totalAmount: number
}

interface CreateOrderResponse {
  orderid: string
}

interface OrderData {
  projectId: string
  duration: string
  price: number
  co2: number
  autoRenewal: boolean
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

export async function createOrder(orderData: OrderData): Promise<string> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CREATE_ORDER), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.BEARER_TOKEN}`
      },
      body: JSON.stringify({
        retirementMessage: `Carbon credit purchase: ${orderData.projectId} for ${orderData.duration} days - ${orderData.co2}kg CO₂ offset`,
        token: PROJECT_TOKENS[orderData.projectId] || PROJECT_TOKENS['forest-restoration'],
        beneficiaryString: DEFAULT_BENEFICIARY.name,
        retireAmount: Math.round(orderData.co2 / 10), // Convert kg to 100kg units (0.1 ton)
        beneficiaryAddress: DEFAULT_BENEFICIARY.address,
        price: orderData.price,
        totalAmount: orderData.price * Math.round(orderData.co2 / 10)
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Order creation failed: ${response.status} ${response.statusText}`)
    }

    const result: CreateOrderResponse = await response.json()
    return result.orderid
  } catch (error) {
    console.error('Error creating order:', error)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.')
      }
      if (error.message.includes('401')) {
        throw new Error('Unauthorized. Please check API credentials.')
      }
      if (error.message.includes('404')) {
        throw new Error('API endpoint not found. Please contact support.')
      }
    }
    
    throw new Error('Failed to create order. Please try again.')
  }
}

export async function processPayment(orderId: string, amount: number) {
  // This would integrate with PaySo API
  // For now, just log the process
  console.log('Processing payment:', { orderId, amount })
  
  // TODO: Implement PaySo integration
  // POST to PaySo with orderid
  // Return payment URL or confirmation
  
  return {
    success: true,
    paymentUrl: `https://payso.example.com/pay/${orderId}`,
    orderId
  }
}