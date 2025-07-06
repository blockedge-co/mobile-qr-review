"use client"

import { CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string;
  name: string;
  location: string;
  country: string;
  impact: string;
  certification: string;
}

interface Duration {
  days: string;
  price: number;
  co2: number;
  label: string;
  popular?: boolean;
}

interface CombinedOption {
  id: string;
  projectId: string;
  durationDays: string;
  displayName: string;
  project: Project;
  duration: Duration;
}

interface CombinedSelectionProps {
  selectedOption: string;
  setSelectedOption: (optionId: string) => void;
  projects: Project[];
  durations: Duration[];
  isLoaded: boolean;
}

export function CombinedSelection({
  selectedOption,
  setSelectedOption,
  projects,
  durations,
  isLoaded,
}: CombinedSelectionProps) {
  // Create combined options by creating a cartesian product of projects and durations
  const combinedOptions: CombinedOption[] = projects.flatMap((project) =>
    durations.map((duration) => ({
      id: `${project.id}-${duration.days}`,
      projectId: project.id,
      durationDays: duration.days,
      displayName: `${project.name} - ${duration.label}`,
      project,
      duration,
    }))
  )

  return (
    <Card
      className={`p-6 border-0 shadow-lg transition-all duration-700 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "300ms" }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Project & Duration</h2>

      <Select value={selectedOption} onValueChange={setSelectedOption}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Select a project and duration" />
        </SelectTrigger>
        <SelectContent className="w-full max-h-[400px]">
          {combinedOptions.map((option) => (
            <SelectItem key={option.id} value={option.id} className="py-4 min-h-[8rem]">
              <div className="w-full space-y-3 flex flex-col justify-center min-h-[7rem]">
                {/* Project Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl flex-shrink-0">{option.project.country}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-base leading-tight">
                        {option.project.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{option.project.location}</div>
                    </div>
                  </div>
                  {selectedOption === option.id && (
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  )}
                </div>
                
                {/* Certification and Impact */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200 text-xs">
                    {option.project.certification}
                  </Badge>
                  <span className="text-xs text-emerald-600">{option.project.impact}</span>
                </div>

                {/* Duration and Price Info */}
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{option.duration.label}</span>
                    {option.duration.popular && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-emerald-700">฿{option.duration.price}</div>
                    <div className="text-xs text-gray-500">
                      {option.duration.co2} kg CO₂
                    </div>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Quick Stats */}
      {selectedOption && (() => {
        const selected = combinedOptions.find(opt => opt.id === selectedOption);
        if (!selected) return null;
        
        return (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Daily Impact</div>
              <div className="text-lg font-semibold text-emerald-700">
                {selected.project.impact}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Offset</div>
              <div className="text-lg font-semibold text-emerald-700">
                {selected.duration.co2} kg CO₂
              </div>
            </div>
          </div>
        );
      })()}
    </Card>
  )
}