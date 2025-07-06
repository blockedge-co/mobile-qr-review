"use client"

import { DualDropdownExample } from "@/components/dual-dropdown-example"

export default function DropdownComparisonDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dropdown Implementation Comparison
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compare the Standard Radix Select with the new Modal-Style Select implementation. 
            Each approach has its strengths and ideal use cases.
          </p>
        </div>

        <DualDropdownExample />
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Technical Implementation Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Standard Select Architecture</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Built on Radix UI Select primitives</p>
                <p>• Uses Popover positioning strategy</p>
                <p>• Native browser dropdown behavior</p>
                <p>• Lightweight DOM footprint</p>
                <p>• Excellent accessibility out of the box</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Modal Select Architecture</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Built on Radix UI Dialog primitives</p>
                <p>• Uses modal overlay strategy</p>
                <p>• Custom interaction patterns</p>
                <p>• Responsive design system</p>
                <p>• Touch-optimized interface</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Migration Strategy</h4>
            <p className="text-sm text-yellow-800">
              The Modal Select can be used as a drop-in replacement for the Standard Select 
              with minimal API changes. Both components share the same core props and patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}