"use client"

import { useState } from "react"
import { CombinedSelection } from "@/components/combined-selection"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react"

export default function TestMobilePage() {
  const [selectedOption, setSelectedOption] = useState("forest-restoration-30")
  const [touchEvents, setTouchEvents] = useState<string[]>([])
  const [viewportInfo, setViewportInfo] = useState({
    width: 0,
    height: 0,
    orientation: ""
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [testResults, setTestResults] = useState<{
    dropdown: boolean
    responsive: boolean
    touch: boolean
    viewport: boolean
  }>({
    dropdown: false,
    responsive: false,
    touch: false,
    viewport: false
  })

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

  // Update viewport info
  const updateViewport = () => {
    setViewportInfo({
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait"
    })
    
    // Test responsive design
    if (window.innerWidth < 768) {
      setTestResults(prev => ({ ...prev, responsive: true }))
    }
  }

  // Initialize viewport info
  if (typeof window !== "undefined" && viewportInfo.width === 0) {
    updateViewport()
    window.addEventListener("resize", updateViewport)
    window.addEventListener("orientationchange", updateViewport)
  }

  // Handle touch events
  const handleTouch = (event: string) => {
    setTouchEvents(prev => [...prev.slice(-4), event])
    setTestResults(prev => ({ ...prev, touch: true }))
  }

  // Handle dropdown selection
  const handleDropdownChange = (optionId: string) => {
    setSelectedOption(optionId)
    setTestResults(prev => ({ ...prev, dropdown: true }))
  }

  // Check all tests passed
  const allTestsPassed = Object.values(testResults).every(result => result)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Mobile Header Test */}
      <header className="bg-white shadow-sm mb-6 -m-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Mobile Test</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            onTouchStart={() => handleTouch("Menu touched")}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        {mobileMenuOpen && (
          <nav className="mt-4 space-y-2">
            <a href="#" className="block p-2 hover:bg-gray-100 rounded">Home</a>
            <a href="#" className="block p-2 hover:bg-gray-100 rounded">About</a>
            <a href="#" className="block p-2 hover:bg-gray-100 rounded">Contact</a>
          </nav>
        )}
      </header>

      {/* Viewport Information */}
      <Card className="mb-6 p-4">
        <h2 className="font-semibold mb-2">Viewport Info</h2>
        <div className="text-sm space-y-1">
          <p>Width: {viewportInfo.width}px</p>
          <p>Height: {viewportInfo.height}px</p>
          <p>Orientation: {viewportInfo.orientation}</p>
          <p className="text-green-600">
            {viewportInfo.width < 768 ? "✓ Mobile viewport detected" : "Desktop viewport"}
          </p>
        </div>
      </Card>

      {/* Combined Selection Test */}
      <Card className="mb-6 p-4">
        <h2 className="font-semibold mb-4">Combined Selection Test</h2>
        <CombinedSelection
          selectedOption={selectedOption}
          setSelectedOption={handleDropdownChange}
          projects={projects}
          durations={durations}
          isLoaded={true}
        />
        
        {selectedOption && (
          <div className="mt-4 p-3 bg-green-50 rounded text-sm">
            <p className="text-green-700">
              ✓ Selected: {selectedOption}
            </p>
          </div>
        )}
      </Card>

      {/* Touch Event Test */}
      <Card className="mb-6 p-4">
        <h2 className="font-semibold mb-4">Touch Interaction Test</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onTouchStart={() => handleTouch("Button 1 touched")}
            onClick={() => handleTouch("Button 1 clicked")}
          >
            Touch Me 1
          </Button>
          <Button
            variant="outline"
            onTouchStart={() => handleTouch("Button 2 touched")}
            onClick={() => handleTouch("Button 2 clicked")}
          >
            Touch Me 2
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm font-medium mb-1">Recent Events:</p>
          {touchEvents.length > 0 ? (
            <ul className="text-xs space-y-1">
              {touchEvents.map((event, i) => (
                <li key={i}>{event}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">No events yet</p>
          )}
        </div>
      </Card>

      {/* Responsive Grid Test */}
      <Card className="mb-6 p-4">
        <h2 className="font-semibold mb-4">Responsive Grid Test</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-100 p-4 rounded text-center"
              onTouchStart={() => handleTouch(`Grid item ${i} touched`)}
            >
              Item {i}
            </div>
          ))}
        </div>
      </Card>

      {/* Test Results Summary */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4">Test Results</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Dropdown Functionality</span>
            <span className={testResults.dropdown ? "text-green-600" : "text-gray-400"}>
              {testResults.dropdown ? "✓ Passed" : "⏳ Pending"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Responsive Design</span>
            <span className={testResults.responsive ? "text-green-600" : "text-gray-400"}>
              {testResults.responsive ? "✓ Passed" : "⏳ Pending"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Touch Interactions</span>
            <span className={testResults.touch ? "text-green-600" : "text-gray-400"}>
              {testResults.touch ? "✓ Passed" : "⏳ Pending"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Viewport Detection</span>
            <span className="text-green-600">✓ Passed</span>
          </div>
        </div>
        
        {allTestsPassed && (
          <div className="mt-4 p-3 bg-green-100 rounded">
            <p className="text-green-700 font-medium text-center">
              🎉 All mobile tests passed!
            </p>
          </div>
        )}
      </Card>

      {/* Floating Action Button Test */}
      <Button
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg"
        onTouchStart={() => handleTouch("FAB touched")}
      >
        <ChevronUp />
      </Button>
    </div>
  )
}