
"use client"

import { Shield, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PaymentSectionProps {
  isLoaded: boolean;
}

export function PaymentSection({ isLoaded }: PaymentSectionProps) {
  return (
    <Card
      className={`p-6 border-0 shadow-lg transition-all duration-700 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "900ms" }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment</h2>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-blue-900">PaySolution</div>
            <div className="text-sm text-blue-600">Secure payment gateway</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Lock className="h-4 w-4" />
          <span>Bank-grade security • SSL encrypted</span>
        </div>
      </div>
      <button className="w-full mt-4 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none text-base sm:text-lg">
        Proceed to Payment
      </button>
    </Card>
  )
}
