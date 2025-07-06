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

export async function processPayment(orderId: string, amount: number) {
  try {
    // Call server-side API to process payment
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, amount })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Payment processing failed')
    }

    return result
  } catch (error) {
    console.error('Error processing payment:', error)
    
    // Fallback to direct URL if API fails
    return {
      success: true,
      paymentUrl: `https://pay.blockedge.earth/payment/${orderId}`,
      orderId
    }
  }
}