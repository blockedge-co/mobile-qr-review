"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createOrder } from "@/lib/api"

export default function DemoApiTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testCreateOrder = async () => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      console.log("Testing create order API...")
      const orderId = await createOrder({
        projectId: "forest-restoration",
        duration: "1",
        price: 1,
        co2: 31,
        autoRenewal: false
      })
      
      setResult(`Order created successfully! Order ID: ${orderId}`)
      console.log("Order ID:", orderId)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error("API test failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          API Test Page
        </h1>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create Order API Test</h2>
          <p className="text-gray-600 mb-6">
            Test the create order API with 1 baht test data
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Test Data:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Project: Forest Restoration Thailand</li>
                <li>• Duration: 1 day</li>
                <li>• Price: ฿1</li>
                <li>• CO₂ Offset: 31 kg</li>
                <li>• Auto Renewal: No</li>
              </ul>
            </div>

            <Button 
              onClick={testCreateOrder}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating Order..." : "Test Create Order"}
            </Button>

            {result && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-1">Success!</h3>
                <p className="text-green-700">{result}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="font-medium text-red-800 mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
                <p className="text-sm text-red-600 mt-2">
                  Make sure the API server is accessible at https://pay.blockedge.earth/
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">API Integration Details</h2>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-yellow-800 mb-1">⚠️ Authentication Required</h3>
            <p className="text-yellow-700 text-sm">
              API returned "Unauthorized". You need to set the correct bearer token in environment variables.
              Create a .env.local file with: NEXT_PUBLIC_API_BEARER_TOKEN=your_actual_token
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium">Endpoint:</h3>
              <code className="bg-gray-100 px-2 py-1 rounded">POST https://pay.blockedge.earth/api/create-order</code>
            </div>
            <div>
              <h3 className="font-medium">Headers:</h3>
              <ul className="bg-gray-100 p-2 rounded">
                <li>Content-Type: application/json</li>
                <li>Authorization: Bearer [from environment variable]</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Request Body:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{
  "retire_message": "Carbon credit purchase: forest-restoration for 1 days - 31kg CO₂ offset - ฿1"
}`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium">Expected Response:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs">
{`{
  "orderid": "z9c1x2y3v4b5n6m"
}`}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}