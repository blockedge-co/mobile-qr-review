"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectSelectionModal } from "@/components/project-selection-modal"

// Import the original project selection for comparison
import { ProjectSelection } from "@/components/project-selection"

// Simple options for standard select
const simpleOptions = [
  { id: "7-days", name: "7 Days", description: "Short term" },
  { id: "30-days", name: "30 Days", description: "Medium term" },
  { id: "90-days", name: "90 Days", description: "Long term" },
]

// Complex project data for modal select
const complexProjects = [
  {
    id: "forest-1",
    name: "Amazon Rainforest Conservation Project - Protecting Critical Biodiversity Hotspots",
    location: "Acre, Brazil",
    country: "🇧🇷",
    impact: "2.5 tons CO2/year",
    certification: "VCS"
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
    id: "solar-1",
    name: "Large-Scale Solar Power Generation Facility - Clean Energy Transition",
    location: "Rajasthan, India",
    country: "🇮🇳",
    impact: "5.2 tons CO2/year",
    certification: "CDM"
  },
]

export function DualDropdownExample() {
  const [selectedDuration, setSelectedDuration] = useState("")
  const [selectedProject, setSelectedProject] = useState("")
  const [currentTab, setCurrentTab] = useState("standard")

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Dropdown Implementation Comparison</h2>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard Select</TabsTrigger>
            <TabsTrigger value="modal">Modal Select</TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Standard Radix Select</h3>
              <p className="text-sm text-blue-800">
                Best for simple, short lists with basic content. Uses native dropdown positioning.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">Lightweight</Badge>
                <Badge variant="outline" className="text-xs">Native Feel</Badge>
                <Badge variant="outline" className="text-xs">Form Controls</Badge>
              </div>
            </div>

            <ProjectSelection
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              projects={complexProjects}
              isLoaded={true}
            />
          </TabsContent>

          <TabsContent value="modal" className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h3 className="font-semibold text-emerald-900 mb-2">Modal-Style Select</h3>
              <p className="text-sm text-emerald-800">
                Perfect for complex content, long lists, and mobile-first design. Uses modal overlay.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">Mobile-First</Badge>
                <Badge variant="outline" className="text-xs">No Clipping</Badge>
                <Badge variant="outline" className="text-xs">Rich Content</Badge>
              </div>
            </div>

            <ProjectSelectionModal
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              projects={complexProjects}
              isLoaded={true}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">When to Use Standard Select</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Short lists (&lt; 10 items)</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Simple text-only options</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Standard form controls</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Maximum performance needed</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">When to Use Modal Select</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Long lists (&gt; 10 items)</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Complex multi-line content</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Mobile-first applications</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Viewport clipping issues</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Integration Tips</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Progressive Enhancement</h4>
            <p className="text-sm text-gray-600">
              Start with Standard Select for simple use cases and upgrade to Modal Select when you need:
              complex content, better mobile experience, or encounter viewport issues.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">API Compatibility</h4>
            <p className="text-sm text-gray-600">
              Both implementations use the same basic API (value, onValueChange, placeholder) making 
              migration straightforward when needed.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}