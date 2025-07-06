"use client"

import { useState } from "react"
import { ProjectSelectionModal } from "@/components/project-selection-modal"

const sampleProjects = [
  {
    id: "forest-1",
    name: "Amazon Rainforest Conservation Project - Protecting Critical Biodiversity Hotspots",
    location: "Acre, Brazil",
    country: "🇧🇷",
    impact: "2.5 tons CO2/year",
    certification: "VCS"
  },
  {
    id: "forest-2", 
    name: "Sustainable Forest Management Initiative - Community-Based Conservation",
    location: "British Columbia, Canada",
    country: "🇨🇦",
    impact: "1.8 tons CO2/year",
    certification: "CSA"
  },
  {
    id: "forest-3",
    name: "Tropical Forest Restoration and Protection Program",
    location: "Borneo, Malaysia",
    country: "🇲🇾",
    impact: "3.2 tons CO2/year",
    certification: "PEFC"
  },
  {
    id: "mangrove-1",
    name: "Coastal Mangrove Restoration Initiative - Marine Ecosystem Protection",
    location: "Sundarbans, Bangladesh",
    country: "🇧🇩",
    impact: "4.1 tons CO2/year",
    certification: "VCS"
  },
  {
    id: "mangrove-2",
    name: "Blue Carbon Mangrove Conservation Project",
    location: "Everglades, Florida",
    country: "🇺🇸",
    impact: "2.9 tons CO2/year",
    certification: "ACR"
  },
  {
    id: "mangrove-3",
    name: "Community-Based Mangrove Reforestation Program",
    location: "Mindanao, Philippines",
    country: "🇵🇭",
    impact: "3.7 tons CO2/year",
    certification: "VCS"
  },
  {
    id: "solar-1",
    name: "Large-Scale Solar Power Generation Facility - Clean Energy Transition",
    location: "Rajasthan, India",
    country: "🇮🇳",
    impact: "5.2 tons CO2/year",
    certification: "CDM"
  },
  {
    id: "solar-2",
    name: "Distributed Solar Energy Program - Rural Electrification",
    location: "Atacama Desert, Chile",
    country: "🇨🇱",
    impact: "4.8 tons CO2/year",
    certification: "VCS"
  },
  {
    id: "solar-3",
    name: "Community Solar Initiative - Renewable Energy Access",
    location: "Andalusia, Spain",
    country: "🇪🇸",
    impact: "3.9 tons CO2/year",
    certification: "GS"
  },
  {
    id: "wind-1",
    name: "Offshore Wind Energy Development Project",
    location: "North Sea, Denmark",
    country: "🇩🇰",
    impact: "6.1 tons CO2/year",
    certification: "VCS"
  }
]

export default function DemoModalDropdown() {
  const [selectedProject, setSelectedProject] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Modal-Style Dropdown Demo
          </h1>
          <p className="text-gray-600">
            Alternative dropdown implementation with modal overlay for better mobile experience
          </p>
        </div>

        <div className="space-y-6">
          <ProjectSelectionModal
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            projects={sampleProjects}
            isLoaded={isLoaded}
          />

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Features of Modal-Style Dropdown</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Mobile-First Design:</strong> Full-screen overlay on mobile devices for optimal usability
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Desktop Modal:</strong> Centered modal dialog on desktop with scrollable content
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>No Viewport Conflicts:</strong> Modal overlay prevents clipping and positioning issues
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Consistent Height:</strong> Fixed container height ensures predictable layout
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Accessibility:</strong> Proper ARIA attributes and keyboard navigation
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Touch-Friendly:</strong> Large touch targets and smooth animations
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Implementation Notes</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Uses Radix UI Dialog for robust modal functionality</p>
              <p>• Responsive design: full-screen on mobile, centered modal on desktop</p>
              <p>• Automatic height management with scroll areas</p>
              <p>• No header conflicts due to modal overlay approach</p>
              <p>• Maintains all existing styling and functionality</p>
            </div>
          </div>

          {selectedProject && (
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold mb-2 text-emerald-900">Current Selection</h3>
              <p className="text-sm text-emerald-700">
                Selected Project ID: <code className="bg-emerald-100 px-2 py-1 rounded">{selectedProject}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}