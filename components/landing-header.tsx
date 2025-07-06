
"use client"

import { ArrowLeft, Leaf, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LandingHeaderProps {
  isLoaded: boolean;
}

export function LandingHeader({ isLoaded }: LandingHeaderProps) {
  return (
    <header
      className={`bg-white border-b border-gray-100 sticky top-0 z-50 transition-all duration-500 safe-area-inset-top ${
        isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="px-4 py-4 flex items-center justify-between overflow-hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-gray-50 active:bg-gray-100 flex-shrink-0 mobile-button focus-visible-ring" 
          onClick={() => window.history.back()} 
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-center select-none">
          <Leaf className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-gray-900 truncate">Carbon Credits</span>
        </div>
        <Badge variant="outline" className="text-emerald-700 border-emerald-200 flex-shrink-0 text-xs select-none">
          <Shield className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Verified</span>
          <span className="sm:hidden">✓</span>
        </Badge>
      </div>
    </header>
  )
}
