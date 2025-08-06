# PaySolutions Payment Integration Guide

## Overview

This document explains the complete API integration flow for PaySolutions payment gateway in the Carbon Credit Landing page. The integration involves three main APIs:

1. **BlockEdge Order Creation API** - Creates order in our system
2. **Internal Payment Processing API** - Prepares PaySolutions redirect
3. **PaySolutions Payment Gateway** - Processes actual payment

The flow uses HTTP POST redirect method to send users to PaySolutions payment page.

## API Endpoints

### 1. BlockEdge Order Creation
```
POST https://pay.blockedge.earth/api/orders
Authorization: Bearer 99d40e6480dcef7549b3068d13b969473dd93616cd1a589a2a1d48cc9cd993bb
```

### 2. Internal Payment Processing  
```
POST /api/process-payment
```

### 3. PaySolutions Payment Gateway
```
POST https://payments.paysolutions.asia/payment
```

## Required Form Fields

### Core Payment Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `merchantId` | string | ✅ | Merchant identifier from PaySolutions | `62551562` |
| `refNo` | string | ✅ | **12-digit random number** | `847392610583` |
| `amount` | string | ✅ | Payment amount (2 decimal places) | `1.00` |
| `currencyCode` | string | ✅ | Currency code | `THB` |
| `productDetail` | string | ✅ | **Use orderId here** | `ORDER_67890_TEST` |

### Customer Information

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `customerName` | string | ✅ | Customer full name | `Test User` |
| `customerEmail` | string | ✅ | Customer email address | `test@example.com` |
| `customerPhone` | string | ✅ | Customer phone number | `0801234567` |

### Return URLs

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `backendReturnUrl` | string | ✅ | Server callback URL | `https://domain.com/api/payment/callback` |
| `frontendReturnUrl` | string | ✅ | Success redirect URL | `https://domain.com/payment/success` |
| `successReturnUrl` | string | ❌ | Alternative success URL | `https://domain.com/payment/success` |
| `failReturnUrl` | string | ❌ | Failed payment URL | `https://domain.com/payment/fail` |

### Optional Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `lang` | string | ❌ | Interface language | `TH` or `EN` |

## 🎯 Critical Solution

### The 500 Error Fix

PaySolutions was returning 500 errors due to incorrect field formats. The solution:

1. **refNo**: Must be a **12-digit random number**
   ```javascript
   const refNo = Math.floor(Math.random() * 999999999999).toString().padStart(12, '0')
   ```

2. **productDetail**: Must contain the **orderId** (not a description)
   ```javascript
   const productDetail = orderId // e.g., "ORDER_67890_TEST"
   ```

## Complete API Integration Flow

### Frontend Implementation

```typescript
// Complete payment flow in React component
const handlePayment = async () => {
  if (isProcessingPayment) return
  
  setIsProcessingPayment(true)
  try {
    // Step 1: Create order via BlockEdge API
    console.log("Creating order...")
    const orderId = await createOrder({
      projectId: selectedProjectId || "forest-restoration",
      duration: selectedDurationDays || "30", 
      price: selectedPrice,
      co2: selectedCO2,
      autoRenewal
    })
    
    console.log("Order created:", orderId)
    
    // Step 2: Process payment and get redirect URL
    const paymentResult = await processPayment(orderId, selectedPrice)
    
    if (paymentResult.success && paymentResult.paymentUrl) {
      console.log("Redirecting to payment:", paymentResult.paymentUrl)
      
      // Step 3: Redirect to PaySolutions
      window.location.href = paymentResult.paymentUrl
    } else {
      throw new Error("Failed to generate payment URL")
    }
    
  } catch (error) {
    console.error("Payment failed:", error)
    alert("Payment failed. Please try again.")
  } finally {
    setIsProcessingPayment(false)
  }
}
```

### API Function Implementations

#### 1. BlockEdge Order Creation (`/lib/api.ts`)

```typescript
export async function createOrder(orderData: {
  projectId: string
  duration: string
  price: number
  co2: number
  autoRenewal: boolean
}): Promise<string> {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error('Failed to create order')
  }

  const result = await response.json()
  return result.orderId
}
```

#### 2. Payment Processing (`/lib/api.ts`)

```typescript
export async function processPayment(orderId: string, amount: number): Promise<{
  success: boolean
  paymentUrl?: string
  error?: string
}> {
  const response = await fetch('/api/process-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId, amount }),
  })

  if (!response.ok) {
    throw new Error('Failed to process payment')
  }

  return response.json()
}
```

### Server-Side API Routes

#### 1. Create Order Route (`/app/api/create-order/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

const API_CONFIG = {
  BASE_URL: 'https://pay.blockedge.earth',
  BEARER_TOKEN: process.env.API_BEARER_TOKEN || '99d40e6480dcef7549b3068d13b969473dd93616cd1a589a2a1d48cc9cd993bb',
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // Generate unique order ID
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    const orderId = `ORDER_${timestamp}_${random}`
    
    // Call BlockEdge API
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.BEARER_TOKEN}`,
      },
      body: JSON.stringify({
        orderId,
        projectId: orderData.projectId,
        duration: orderData.duration,
        price: orderData.price,
        co2Amount: orderData.co2,
        autoRenewal: orderData.autoRenewal,
        status: 'pending'
      }),
    })

    if (!response.ok) {
      throw new Error(`BlockEdge API error: ${response.status}`)
    }

    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      orderId: orderId,
      blockEdgeResponse: result
    })
    
  } catch (error) {
    console.error('Order creation failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
```

#### 2. Process Payment Route (`/app/api/process-payment/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json()
    
    // Generate payment redirect URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const paymentUrl = `${baseUrl}/payment/redirect?orderId=${orderId}&amount=${amount}`
    
    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId,
      amount
    })
    
  } catch (error) {
    console.error('Payment processing failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
```

#### 3. PaySolutions Form Generation (`/components/payment-form.tsx`)

```typescript
export function PaymentForm({ orderId, amount, merchantId }: PaymentFormProps) {
  const [origin, setOrigin] = useState('')
  
  // PaySolutions Solution: 12-digit random refNo + orderId in productDetail
  const refNo = Math.floor(Math.random() * 999999999999).toString().padStart(12, '0')
  const productDetail = orderId // Use orderId as productDetail instead of description
  
  useEffect(() => {
    setOrigin(window.location.origin)
    
    // Auto-submit form after origin is set
    const timer = setTimeout(() => {
      const form = document.getElementById('payso-form') as HTMLFormElement
      if (form && origin) {
        console.log('Auto-submitting form to PaySolutions...')
        form.submit()
      }
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [origin])

  return (
    <form 
      id="payso-form"
      method="POST" 
      action="https://payments.paysolutions.asia/payment"
    >
      {/* PaySolutions SOLUTION: 12-digit refNo + orderId in productDetail */}
      <input type="hidden" name="merchantId" value={merchantId} />
      <input type="hidden" name="refNo" value={refNo} />
      <input type="hidden" name="amount" value={amount.toFixed(2)} />
      <input type="hidden" name="currencyCode" value="THB" />
      <input type="hidden" name="productDetail" value={productDetail} />
      
      {/* Customer information */}
      <input type="hidden" name="customerName" value="Test User" />
      <input type="hidden" name="customerEmail" value="test@example.com" />
      <input type="hidden" name="customerPhone" value="0801234567" />
      
      {/* Return URLs */}
      <input type="hidden" name="backendReturnUrl" value={`${origin}/api/payment/callback`} />
      <input type="hidden" name="frontendReturnUrl" value={`${origin}/payment/success?orderId=${orderId}`} />
      <input type="hidden" name="failReturnUrl" value={`${origin}/payment/fail?orderId=${orderId}`} />
      
      {/* Language */}
      <input type="hidden" name="lang" value="TH" />
    </form>
  )
}
```

### Payment Redirect Page (`/app/payment/redirect/page.tsx`)

```typescript
export default function PaymentRedirectPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''
  const amount = parseFloat(searchParams.get('amount') || '0')
  const merchantId = '62551562'

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Preparing Payment...</h1>
        <p>Order ID: {orderId}</p>
        <p>Amount: ฿{amount}</p>
        
        <PaymentForm 
          orderId={orderId}
          amount={amount}
          merchantId={merchantId}
        />
      </div>
    </div>
  )
}
```

## Complete Payment Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant CreateOrderAPI
    participant ProcessPaymentAPI
    participant PaymentRedirect
    participant BlockEdge
    participant PaySolutions
    participant Bank

    User->>Frontend: Click "Complete Purchase"
    Frontend->>CreateOrderAPI: POST /api/create-order
    CreateOrderAPI->>BlockEdge: POST https://pay.blockedge.earth/api/orders
    BlockEdge-->>CreateOrderAPI: Order created response
    CreateOrderAPI-->>Frontend: orderId
    
    Frontend->>ProcessPaymentAPI: POST /api/process-payment
    ProcessPaymentAPI-->>Frontend: paymentUrl (/payment/redirect)
    
    Frontend->>PaymentRedirect: Redirect to payment page
    PaymentRedirect->>PaymentRedirect: Generate 12-digit refNo
    PaymentRedirect->>PaymentRedirect: Auto-submit form (1.5s delay)
    PaymentRedirect->>PaySolutions: POST form data
    
    PaySolutions->>User: Show payment page
    User->>PaySolutions: Enter payment details
    PaySolutions->>Bank: Process payment
    Bank-->>PaySolutions: Payment result
    PaySolutions->>Frontend: Callback to backendReturnUrl
    PaySolutions->>User: Redirect to frontendReturnUrl (success/fail)
```

## API Call Sequence

### 1. User Clicks Purchase Button

```typescript
// Frontend button onClick handler
onClick={async () => {
  if (isProcessingPayment) return
  setIsProcessingPayment(true)
  
  try {
    // Step 1: Create order
    const orderId = await createOrder({...})
    
    // Step 2: Process payment  
    const paymentResult = await processPayment(orderId, amount)
    
    // Step 3: Redirect to payment
    window.location.href = paymentResult.paymentUrl
  } catch (error) {
    // Handle errors
  } finally {
    setIsProcessingPayment(false)
  }
}
```

### 2. createOrder() Function Call

```
Frontend → /api/create-order → https://pay.blockedge.earth/api/orders
```

**Request:**
```json
{
  "projectId": "forest-restoration",
  "duration": "30", 
  "price": 299,
  "co2": 930,
  "autoRenewal": false
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORDER_1738812345_789",
  "blockEdgeResponse": {...}
}
```

### 3. processPayment() Function Call

```
Frontend → /api/process-payment → Return redirect URL
```

**Request:**
```json
{
  "orderId": "ORDER_1738812345_789",
  "amount": 299
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "http://localhost:3000/payment/redirect?orderId=ORDER_1738812345_789&amount=299",
  "orderId": "ORDER_1738812345_789",
  "amount": 299
}
```

### 4. PaySolutions Form Submission

```
Payment Redirect Page → https://payments.paysolutions.asia/payment
```

**Form Data:**
```json
{
  "merchantId": "62551562",
  "refNo": "847392610583",
  "amount": "299.00",
  "currencyCode": "THB", 
  "productDetail": "ORDER_1738812345_789",
  "customerName": "Test User",
  "customerEmail": "test@example.com",
  "customerPhone": "0801234567",
  "backendReturnUrl": "http://localhost:3000/api/payment/callback",
  "frontendReturnUrl": "http://localhost:3000/payment/success?orderId=ORDER_1738812345_789",
  "failReturnUrl": "http://localhost:3000/payment/fail?orderId=ORDER_1738812345_789",
  "lang": "TH"
}
```

## Callback Handling

### Backend Callback (`/api/payment/callback`)

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Verify payment status
  // Update database
  // Send confirmation email
  // Update BlockEdge order status
  
  return NextResponse.json({ status: 'received' })
}
```

### Frontend Redirect

- **Success**: `/payment/success?orderId=ORDER_67890_TEST`
- **Failure**: `/payment/fail?orderId=ORDER_67890_TEST&error=payment_failed`

## Testing & Development

### Test Flow

1. **Start Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Access Application**
   ```
   http://localhost:3000
   ```

3. **Test Payment Flow**
   - Select "1 Day (Test)" option for ฿1
   - Click "Complete Purchase"
   - Watch console logs for API calls
   - Verify redirect to PaySolutions

### Test Data & Configuration

```javascript
// Test configuration
const testConfig = {
  merchantId: "62551562",
  testAmount: "1.00",         // ฿1 for testing
  testProduct: "1 Day (Test)", // Cheapest option
  blockEdgeAPI: "https://pay.blockedge.earth",
  paysoAPI: "https://payments.paysolutions.asia/payment"
}
```

### Bypass Mode for Testing

Add `?bypass=true` to skip PaySolutions and go directly to success page:

```
http://localhost:3000/?bypass=true
http://localhost:3000/payment/redirect?orderId=TEST&amount=1&bypass=true
```

### Console Debugging

The application logs detailed information in browser console:

```javascript
// Step 1: Order creation
"Creating order..."
"Order created: ORDER_1738812345_789"

// Step 2: Payment processing  
"Redirecting to payment: /payment/redirect?orderId=ORDER_1738812345_789&amount=1"

// Step 3: PaySolutions form
"PaySolutions Form Data (SOLUTION): {
  refNo: '847392610583 (12-digit random)',
  productDetail: 'ORDER_1738812345_789 (orderId as productDetail)'
}"

// Step 4: Auto-submit
"Auto-submitting form to PaySolutions..."
```

## Troubleshooting

### Common Issues

1. **500 Error**: 
   - ✅ **Fixed**: Use 12-digit random refNo + orderId in productDetail

2. **Invalid Amount**: 
   - Ensure amount has 2 decimal places: `"1.00"` not `"1"`

3. **Missing Required Fields**: 
   - All core fields must be present and non-empty

4. **URL Format**: 
   - Return URLs must be absolute URLs with protocol

### Debug Information

The payment form shows real-time debug information including:
- Generated refNo (12-digit random)
- productDetail (orderId)
- All form fields being sent to PaySolutions

## File Structure

```
/app
  /api
    /create-order
      route.ts              # BlockEdge order creation API
    /process-payment
      route.ts              # Payment processing API  
    /payment
      /callback
        route.ts            # PaySolutions callback handler
  /payment
    /redirect
      page.tsx              # Payment redirect page
    /success
      page.tsx              # Payment success page
    /fail  
      page.tsx              # Payment failure page
  page.tsx                  # Main landing page

/components
  payment-form.tsx          # PaySolutions form component
  
/lib
  api.ts                    # API utility functions

/docs
  PAYSO-INTEGRATION.md      # This documentation
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
API_BEARER_TOKEN=99d40e6480dcef7549b3068d13b969473dd93616cd1a589a2a1d48cc9cd993bb
```

## Production Checklist

- [ ] Update merchantId to production value
- [ ] Set production return URLs in environment variables
- [ ] Remove debug information and console logs
- [ ] Enable proper error logging and monitoring
- [ ] Test callback handling with real PaySolutions data
- [ ] Verify SSL certificates for all endpoints
- [ ] Set up payment transaction monitoring
- [ ] Configure proper CORS policies
- [ ] Test with real payment amounts
- [ ] Validate all error scenarios

## Security Notes

- Never expose sensitive merchant credentials in frontend code
- Validate all callback data from PaySolutions
- Use HTTPS for all return URLs
- Implement proper error handling
- Log all payment transactions for auditing

---

*Generated for Carbon Credit Landing - PaySolutions Integration*