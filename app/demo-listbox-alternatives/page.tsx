"use client"

import { useState, useEffect } from "react"
import { ScrollableListbox } from "@/components/scrollable-listbox"
import { AccordionListbox } from "@/components/accordion-listbox"

export default function DemoListboxAlternatives() {
  const [selectedScrollable, setSelectedScrollable] = useState("forest-restoration-30")
  const [selectedAccordion, setSelectedAccordion] = useState("forest-restoration-30")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const projects = [
    {
      id: "forest-restoration",
      name: "Forest Restoration Thailand",
      location: "Chiang Mai, Thailand",
      country: "🇹🇭",
      impact: "31 kg CO₂/day",
      certification: "Verified"
    },
    {
      id: "mangrove-conservation",
      name: "Mangrove Conservation",
      location: "Krabi, Thailand",
      country: "🇹🇭",
      impact: "28 kg CO₂/day",
      certification: "Gold Standard"
    },
    {
      id: "solar-energy",
      name: "Solar Energy Project",
      location: "Nakhon Ratchasima, Thailand",
      country: "🇹🇭",
      impact: "35 kg CO₂/day",
      certification: "VCS"
    }
  ]

  const durations = [
    { days: "7", label: "1 Week", price: 217, co2: 217, popular: false },
    { days: "30", label: "1 Month", price: 930, co2: 930, popular: true },
    { days: "90", label: "3 Months", price: 2790, co2: 2790, popular: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Listbox Alternative Implementations
        </h1>
        <p className="text-center text-gray-600 mb-12">
          These are alternatives to dropdown selects that don't have z-index or height conflicts
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Scrollable Listbox */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Scrollable Listbox
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Click to expand, shows all options in a scrollable container. Fixed height, no z-index issues.
            </p>
            <ScrollableListbox
              selectedOption={selectedScrollable}
              setSelectedOption={setSelectedScrollable}
              projects={projects}
              durations={durations}
              isLoaded={isLoaded}
            />
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <strong>Selected:</strong> {selectedScrollable}
            </div>
          </div>

          {/* Accordion Listbox */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Accordion Listbox
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Expand projects to see duration options. No overlays, natural document flow.
            </p>
            <AccordionListbox
              selectedOption={selectedAccordion}
              setSelectedOption={setSelectedAccordion}
              projects={projects}
              durations={durations}
              isLoaded={isLoaded}
            />
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <strong>Selected:</strong> {selectedAccordion}
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Comparison</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-emerald-700 mb-2">Scrollable Listbox</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ No z-index conflicts</li>
                <li>✅ Fixed height container</li>
                <li>✅ Scrollable content</li>
                <li>✅ Simple interaction</li>
                <li>⚠️ Takes more vertical space when open</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-emerald-700 mb-2">Accordion Listbox</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ No z-index conflicts</li>
                <li>✅ Natural document flow</li>
                <li>✅ Progressive disclosure</li>
                <li>✅ Clear project grouping</li>
                <li>⚠️ More clicks for selection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}