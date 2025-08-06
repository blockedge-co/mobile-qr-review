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
  // For PaySolutions, we need to use a form POST, not a direct redirect
  // So we'll redirect to our intermediate page that will auto-submit the form
  const paymentUrl = `/payment/redirect?orderId=${orderId}&amount=${amount}`
  
  return {
    success: true,
    paymentUrl,
    orderId
  }
}