"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing-header"
import { LandingHero } from "@/components/landing-hero"
import { AccordionListbox } from "@/components/accordion-listbox"
import { AutoRenewal } from "@/components/auto-renewal"
import { PaymentSection } from "@/components/payment-section"
import { OrderSummary } from "@/components/order-summary"
import { GoogleReviews } from "@/components/google-reviews"

export default function CarbonCreditLanding() {
  const [selectedOption, setSelectedOption] = useState("forest-restoration-30")
  const [autoRenewal, setAutoRenewal] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const projects = [
    {
      id: "forest-restoration",
      name: "Forest Restoration Thailand",
      location: "Northern Thailand",
      country: "🇹🇭",
      impact: "31 kg CO₂/day",
      certification: "Gold Standard",
    },
    {
      id: "mangrove-restoration",
      name: "Mangrove Restoration",
      location: "Coastal Thailand",
      country: "🇹🇭",
      impact: "28 kg CO₂/day",
      certification: "VCS Verified",
    },
    {
      id: "renewable-energy",
      name: "Solar Energy Project",
      location: "Brandenburg, Germany",
      country: "🇩🇪",
      impact: "35 kg CO₂/day",
      certification: "CDM Certified",
    },
  ]

  const durations = [
    { days: "7", price: 89, co2: 217, label: "1 Week" }, // ~31 kg/day * 7 days = 217 kg
    { days: "30", price: 299, co2: 930, label: "1 Month", popular: true }, // ~31 kg/day * 30 days = 930 kg
    { days: "90", price: 799, co2: 2790, label: "3 Months" }, // ~31 kg/day * 90 days = 2790 kg
  ]

  // Parse the selected option to get project and duration
  // Expected format: "project-id-duration" (e.g., "forest-restoration-30")
  const parts = selectedOption.split('-')
  const selectedDurationDays = parts[parts.length - 1] // Last part is always duration
  const selectedProjectId = parts.slice(0, -1).join('-') // Everything before last part is project ID
  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const selectedDuration = durations.find(d => d.days === selectedDurationDays)
  
  const selectedPrice = selectedDuration?.price || 299
  const selectedCO2 = selectedDuration?.co2 || 310
  const selectedDurationLabel = selectedDuration?.label || "1 Month"

  return (
    <div className="min-h-screen bg-gray-50 smooth-scroll" data-testid="landing-content">
      <LandingHeader isLoaded={isLoaded} />
      <LandingHero isLoaded={isLoaded} />

      <div className="px-4 py-8 max-w-md mx-auto space-y-6 sm:space-y-8 overflow-hidden">
        <AccordionListbox
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          projects={projects}
          durations={durations}
          isLoaded={isLoaded}
        />
        <AutoRenewal autoRenewal={autoRenewal} setAutoRenewal={setAutoRenewal} isLoaded={isLoaded} />
        <PaymentSection isLoaded={isLoaded} />
        <OrderSummary
          selectedCO2={selectedCO2}
          selectedDurationLabel={selectedDurationLabel}
          autoRenewal={autoRenewal}
          selectedPrice={selectedPrice}
          isLoaded={isLoaded}
        />
        <GoogleReviews isLoaded={isLoaded} />
      </div>

      {/* Purchase Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg max-w-full overflow-hidden safe-area-inset-bottom backdrop-blur-sm bg-white/95">
        <div className="max-w-md mx-auto overflow-hidden">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-4 px-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mobile-button focus-visible-ring"
            onClick={() => {
              console.log("Processing payment...")
            }}
          >
            <span className="truncate">Complete Purchase - ฿{selectedPrice}</span>
          </Button>
          <div className="text-center mt-2 text-xs text-gray-500 px-2">
            <span className="inline-flex items-center gap-1">
              <span>🔒</span>
              <span className="truncate">Secure payment • 30-day guarantee</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom padding - account for safe area */}
      <div className="h-32 sm:h-40" />
    </div>
  )
}