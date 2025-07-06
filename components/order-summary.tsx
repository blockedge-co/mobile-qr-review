
"use client"

import { Card } from "@/components/ui/card"

interface OrderSummaryProps {
  selectedCO2: number;
  selectedDurationLabel: string;
  autoRenewal: boolean;
  selectedPrice: number;
  isLoaded: boolean;
}

export function OrderSummary({
  selectedCO2,
  selectedDurationLabel,
  autoRenewal,
  selectedPrice,
  isLoaded,
}: OrderSummaryProps) {
  return (
    <Card
      className={`p-4 sm:p-6 border-0 shadow-lg bg-emerald-50 border-emerald-200 transition-all duration-700 mobile-card ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "1100ms" }}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-emerald-900 mb-4">Summary</h2>

      <div className="space-y-3 mb-6 overflow-hidden">
        <div className="flex justify-between gap-2">
          <span className="text-gray-600 truncate">CO₂ Offset</span>
          <span className="font-medium whitespace-nowrap select-none">{selectedCO2} kg</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-gray-600 truncate">Duration</span>
          <span className="font-medium whitespace-nowrap select-none">{selectedDurationLabel}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-gray-600 truncate">Auto-renewal</span>
          <span className="font-medium whitespace-nowrap select-none">{autoRenewal ? "Yes" : "No"}</span>
        </div>
        <div className="border-t border-emerald-200 pt-3">
          <div className="flex justify-between items-center gap-2">
            <span className="text-lg font-semibold text-gray-900 truncate">Total</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-700 whitespace-nowrap select-none">฿{selectedPrice}</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 text-sm text-gray-600">
        <input 
          type="checkbox" 
          className="rounded border-emerald-300 text-emerald-600 flex-shrink-0 mt-0.5 touch-target focus-visible-ring" 
          defaultChecked 
          aria-label="Agree to terms and conditions"
        />
        <span className="break-words select-text">I agree to the terms and conditions</span>
      </div>
    </Card>
  )
}
