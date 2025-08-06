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

interface AccordionListboxProps {
  selectedOption: string
  setSelectedOption: (value: string) => void
  projects: Project[]
  durations: Duration[]
  isLoaded: boolean
}

export function AccordionListbox({
  selectedOption,
  setSelectedOption,
  projects,
  durations,
  isLoaded,
}: AccordionListboxProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null)

  // Parse selected option to get project and duration
  const parseSelectedOption = (optionId: string) => {
    const parts = optionId.split('-')
    const durationDays = parts.pop()
    const projectId = parts.join('-')
    return { projectId, durationDays }
  }

  const { projectId: selectedProjectId } = selectedOption 
    ? parseSelectedOption(selectedOption) 
    : { projectId: null }

  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const selectedDuration = selectedOption 
    ? durations.find(d => selectedOption.endsWith(`-${d.days}`))
    : null

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  const handleSelect = (projectId: string, durationDays: string) => {
    const optionId = `${projectId}-${durationDays}`
    setSelectedOption(optionId)
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

        {/* Selected Option Display */}
        {selectedProject && selectedDuration && (
          <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedProject.country}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {selectedProject.name} - {selectedDuration.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedProject.location} • ฿{selectedDuration.price} • {selectedDuration.co2} kg CO₂
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        )}

        {/* Accordion List */}
        <div className="space-y-2">
          {projects.map((project) => {
            const isExpanded = expandedProject === project.id
            const isSelected = selectedProjectId === project.id

            return (
              <div
                key={project.id}
                className={`border rounded-lg overflow-hidden ${
                  isSelected ? "border-emerald-200 bg-emerald-50" : "border-gray-200"
                }`}
              >
                {/* Project Header */}
                <Button
                  variant="ghost"
                  onClick={() => toggleProject(project.id)}
                  className="w-full justify-between p-4 h-auto text-left hover:bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.country}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-left">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-left">
                        {project.location} • {project.impact}
                      </p>
                      <Badge 
                        variant="outline" 
                        className="text-emerald-700 border-emerald-200 text-xs mt-1"
                      >
                        {project.certification}
                      </Badge>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`} 
                  />
                </Button>

                {/* Duration Options */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-white">
                    {durations.map((duration) => {
                      const optionId = `${project.id}-${duration.days}`
                      const isDurationSelected = selectedOption === optionId

                      return (
                        <div
                          key={duration.days}
                          onClick={() => handleSelect(project.id, duration.days)}
                          className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                            isDurationSelected ? "bg-emerald-50" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {duration.label}
                              </span>
                              {duration.popular && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-gray-500">
                                {duration.co2} kg CO₂
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-emerald-700">
                                  ฿{duration.price}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ฿{Math.round(duration.price / Number.parseInt(duration.days))}/day
                                </div>
                              </div>
                              {isDurationSelected && (
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}