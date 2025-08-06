
"use client"

import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Duration {
  days: string;
  price: number;
  co2: number;
  label: string;
  popular?: boolean;
}

interface DurationSelectionProps {
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  durations: Duration[];
  isLoaded: boolean;
}

export function DurationSelection({
  selectedDuration,
  setSelectedDuration,
  durations,
  isLoaded,
}: DurationSelectionProps) {
  return (
    <Card
      className={`p-4 sm:p-6 border-0 shadow-lg transition-all duration-700 mobile-card ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "500ms" }}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Choose Duration</h2>

      <Select value={selectedDuration} onValueChange={setSelectedDuration}>
        <SelectTrigger className="w-full mb-4 mobile-input focus-visible-ring min-h-[48px] touch-target">
          <SelectValue placeholder="Select a duration" />
        </SelectTrigger>
        <SelectContent className="mobile-card">
          {durations.map((duration) => (
            <SelectItem 
              key={duration.days} 
              value={duration.days} 
              className="py-3 touch-target focus-visible-ring"
            >
              <div className="w-full space-y-2 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm truncate">{duration.label}</span>
                      {duration.popular && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs flex-shrink-0 select-none">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate select-none">{duration.co2} kg CO₂ offset</div>
                  </div>
                  <div className="text-right flex-shrink-0 select-none">
                    <div className="text-xl font-bold text-emerald-700 whitespace-nowrap">฿{duration.price}</div>
                    <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
                      ฿{Math.round(duration.price / Number.parseInt(duration.days))}/day
                    </div>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  )
}
