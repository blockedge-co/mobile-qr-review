
"use client"

import { Shield, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PaymentSectionProps {
  isLoaded: boolean;
}

export function PaymentSection({ isLoaded }: PaymentSectionProps) {
  return (
    <Card
      className={`p-4 sm:p-6 border-0 shadow-lg transition-all duration-700 mobile-card ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "900ms" }}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Payment</h2>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 overflow-hidden mobile-card">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 select-none">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-blue-900 truncate select-none">PaySolution</div>
            <div className="text-sm text-blue-600 truncate select-none">Secure payment gateway</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-700 select-none">
          <Lock className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Bank-grade security • SSL encrypted</span>
        </div>
      </div>
    </Card>
  )
}
