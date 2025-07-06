"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing-header"
import { LandingHero } from "@/components/landing-hero"
import { CombinedSelection } from "@/components/combined-selection"
import { CombinedSelectionGrouped } from "@/components/combined-selection-grouped"
import { AutoRenewal } from "@/components/auto-renewal"
import { PaymentSection } from "@/components/payment-section"
import { OrderSummary } from "@/components/order-summary"
import { GoogleReviews } from "@/components/google-reviews"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DemoCombinedSelection() {
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

  // Parse selected option to get project and duration
  const parseSelectedOption = (optionId: string) => {
    const parts = optionId.split('-');
    const durationDays = parts.pop();
    const projectId = parts.join('-');
    return { projectId, durationDays };
  };

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
        {/* Demo Tabs */}
        <Tabs defaultValue="flat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flat">Flat List</TabsTrigger>
            <TabsTrigger value="grouped">Grouped by Project</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flat" className="mt-6">
            <CombinedSelection
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              projects={projects}
              durations={durations}
              isLoaded={isLoaded}
            />
          </TabsContent>
          
          <TabsContent value="grouped" className="mt-6">
            <CombinedSelectionGrouped
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              projects={projects}
              durations={durations}
              isLoaded={isLoaded}
            />
          </TabsContent>
        </Tabs>

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