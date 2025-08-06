
"use client"

import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface AutoRenewalProps {
  autoRenewal: boolean;
  setAutoRenewal: (checked: boolean) => void;
  isLoaded: boolean;
}

export function AutoRenewal({
  autoRenewal,
  setAutoRenewal,
  isLoaded,
}: AutoRenewalProps) {
  return (
    <Card
      className={`p-4 sm:p-6 border-0 shadow-lg transition-all duration-700 mobile-card ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "700ms" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Auto-renewal</h3>
          <p className="text-sm text-gray-500 truncate">Maintain consistent impact</p>
        </div>
        <Switch
          checked={autoRenewal}
          onCheckedChange={setAutoRenewal}
          className="data-[state=checked]:bg-emerald-600 touch-target focus-visible-ring flex-shrink-0"
          aria-label="Enable auto-renewal"
        />
      </div>
    </Card>
  )
}
