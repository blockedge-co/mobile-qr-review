// API utilities for order creation and payment processing
import { API_CONFIG, getApiUrl } from './config'

interface CreateOrderRequest {
  retire_message: string
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
        retire_message: `Carbon credit purchase: ${orderData.projectId} for ${orderData.duration} days - ${orderData.co2}kg CO₂ offset - ฿${orderData.price} ${orderData.autoRenewal ? '(Auto-renewal enabled)' : ''}`
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