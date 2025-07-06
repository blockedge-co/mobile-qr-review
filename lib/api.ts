// Client-side API utilities

interface OrderData {
  projectId: string
  duration: string
  price: number
  co2: number
  autoRenewal: boolean
}

interface CreateOrderResponse {
  orderid: string
  message?: string
  error?: string
}

export async function createOrder(orderData: OrderData): Promise<string> {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    const result: CreateOrderResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.error || `Order creation failed: ${response.status}`)
    }

    if (!result.orderid) {
      throw new Error('No order ID received')
    }

    return result.orderid
  } catch (error) {
    console.error('Error creating order:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Failed to create order. Please try again.')
  }
}

export async function processPayment(orderId: string) {
  // Generate PaySo payment URL
  // According to the flow: POST orderid to PaySo
  const paymentUrl = `https://pay.blockedge.earth/payment/${orderId}`
  
  return {
    success: true,
    paymentUrl,
    orderId
  }
}