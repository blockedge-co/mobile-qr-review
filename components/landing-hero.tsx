
"use client"

import { Globe, TrendingUp } from "lucide-react"

interface LandingHeroProps {
  isLoaded: boolean;
}

export function LandingHero({ isLoaded }: LandingHeroProps) {
  return (
    <section
      className={`bg-gradient-to-br from-emerald-600 to-green-700 px-4 py-16 text-white transition-all duration-700 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 px-2">Offset Your Carbon Footprint</h1>
        <p className="text-emerald-100 mb-8 px-2 text-sm sm:text-base">Choose verified projects that make a real impact</p>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 sm:p-6 mx-2">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold">2.4M+</div>
              <div className="text-xs text-emerald-200 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">Tons Offset</span>
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">850K+</div>
              <div className="text-xs text-emerald-200 flex items-center justify-center gap-1">
                <Globe className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">Trees Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
