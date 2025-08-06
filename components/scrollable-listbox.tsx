"use client"

import { useState } from "react"
import { ChevronDown, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  name: string
  location: string
  country: string
  impact: string
  certification: string
}

interface Duration {
  days: string
  label: string
  price: number
  co2: number
  popular?: boolean
}

interface ScrollableListboxProps {
  selectedOption: string
  setSelectedOption: (value: string) => void
  projects: Project[]
  durations: Duration[]
  isLoaded: boolean
}

export function ScrollableListbox({
  selectedOption,
  setSelectedOption,
  projects,
  durations,
  isLoaded,
}: ScrollableListboxProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Create all combinations
  const allOptions = projects.flatMap((project) =>
    durations.map((duration) => ({
      id: `${project.id}-${duration.days}`,
      project,
      duration,
    }))
  )

  // Get selected option for display
  const selectedOptionData = allOptions.find(opt => opt.id === selectedOption)

  const toggleExpanded = () => setIsExpanded(!isExpanded)

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId)
    setIsExpanded(false)
  }

  return (
    <Card
      className={`border-0 shadow-lg ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 0.7s" }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Select Project & Duration
        </h2>

        {/* Trigger Button */}
        <Button
          variant="outline"
          onClick={toggleExpanded}
          className="w-full justify-between p-4 h-auto text-left"
        >
          <div className="flex-1">
            {selectedOptionData ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedOptionData.project.country}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {selectedOptionData.project.name} - {selectedOptionData.duration.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedOptionData.project.location} • ฿{selectedOptionData.duration.price} • {selectedOptionData.duration.co2} kg CO₂
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Select a project and duration</span>
            )}
          </div>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`} 
          />
        </Button>

        {/* Scrollable List */}
        {isExpanded && (
          <div className="mt-4 border rounded-lg bg-white max-h-[400px] overflow-y-auto">
            {allOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedOption === option.id ? "bg-emerald-50 border-emerald-200" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.project.country}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {option.project.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className="text-emerald-700 border-emerald-200 text-xs flex-shrink-0"
                      >
                        {option.project.certification}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {option.project.location} • {option.project.impact}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {option.duration.label}
                        </span>
                        {option.duration.popular && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                          {option.duration.co2} kg CO₂
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-700">
                            ฿{option.duration.price}
                          </div>
                          <div className="text-xs text-gray-500">
                            ฿{Math.round(option.duration.price / Number.parseInt(option.duration.days))}/day
                          </div>
                        </div>
                        {selectedOption === option.id && (
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}