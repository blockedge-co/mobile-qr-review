// API utilities for order creation and payment processing

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
    const response = await fetch('http://localhost:3000/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_SECRET_BEARER_TOKEN_HERE'
      },
      body: JSON.stringify({
        retire_message: `Carbon credit purchase: ${orderData.projectId} for ${orderData.duration} days - ${orderData.co2}kg CO₂ offset - ฿${orderData.price} ${orderData.autoRenewal ? '(Auto-renewal enabled)' : ''}`
      })
    })

    if (!response.ok) {
      throw new Error(`Order creation failed: ${response.status} ${response.statusText}`)
    }

    const result: CreateOrderResponse = await response.json()
    return result.orderid
  } catch (error) {
    console.error('Error creating order:', error)
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