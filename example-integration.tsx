// Example integration of combined selection component
// This shows how to replace the separate ProjectSelection and DurationSelection components

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing-header"
import { LandingHero } from "@/components/landing-hero"

// Import the combined selection component (choose one of these)
import { CombinedSelection } from "@/components/combined-selection"
// import { CombinedSelectionGrouped } from "@/components/combined-selection-grouped"
// import { CombinedSelectionCompact } from "@/components/combined-selection-compact"

import { AutoRenewal } from "@/components/auto-renewal"
import { PaymentSection } from "@/components/payment-section"
import { OrderSummary } from "@/components/order-summary"
import { GoogleReviews } from "@/components/google-reviews"

export default function ExampleIntegration() {
  // Single state for combined selection instead of separate project and duration states
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
    { days: "7", price: 89, co2: 72, label: "1 Week" },
    { days: "30", price: 299, co2: 310, label: "1 Month", popular: true },
    { days: "90", price: 799, co2: 930, label: "3 Months" },
  ]

  // Helper function to parse the selected option
  const parseSelectedOption = (optionId: string) => {
    const parts = optionId.split('-');
    const durationDays = parts.pop();
    const projectId = parts.join('-');
    return { projectId, durationDays };
  };

  // Extract current selection for order summary
  const { projectId, durationDays } = parseSelectedOption(selectedOption);
  const selectedDuration = durations.find((d) => d.days === durationDays);
  const selectedPrice = selectedDuration?.price || 299;
  const selectedCO2 = selectedDuration?.co2 || 310;
  const selectedDurationLabel = selectedDuration?.label || "1 Month";

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader isLoaded={isLoaded} />
      <LandingHero isLoaded={isLoaded} />

      <div className="px-4 py-8 max-w-md mx-auto space-y-8">
        {/* Replace both ProjectSelection and DurationSelection with one component */}
        <CombinedSelection
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          projects={projects}
          durations={durations}
          isLoaded={isLoaded}
        />
        
        {/* Alternative implementations:
        
        <CombinedSelectionGrouped
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          projects={projects}
          durations={durations}
          isLoaded={isLoaded}
        />
        
        <CombinedSelectionCompact
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          projects={projects}
          durations={durations}
          isLoaded={isLoaded}
        />
        */}

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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => {
              console.log("Processing payment...")
              console.log("Selected option:", selectedOption)
              console.log("Project ID:", projectId)
              console.log("Duration days:", durationDays)
              console.log("Price:", selectedPrice)
            }}
          >
            Complete Purchase - ฿{selectedPrice}
          </Button>
          <div className="text-center mt-2 text-xs text-gray-500">🔒 Secure payment • 30-day guarantee</div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-24" />
    </div>
  )
}

/*
MIGRATION NOTES:

1. State Management:
   - Replace separate `selectedProject` and `selectedDuration` states with single `selectedOption` state
   - Use the format: `${projectId}-${durationDays}` (e.g., "forest-restoration-30")

2. Component Replacement:
   - Remove `<ProjectSelection />` and `<DurationSelection />` components
   - Replace with one of the combined selection components

3. Props Extraction:
   - Use `parseSelectedOption()` helper to extract project and duration from the combined selection
   - Pass the extracted values to other components like OrderSummary

4. Component Options:
   - `CombinedSelection`: Flat list showing all project-duration combinations
   - `CombinedSelectionGrouped`: Grouped by project with duration options underneath
   - `CombinedSelectionCompact`: More compact mobile-friendly design

5. Benefits:
   - Reduced UI complexity (one dropdown instead of two)
   - Better mobile experience with less scrolling
   - Clearer pricing comparison across all options
   - Unified selection state management
*/