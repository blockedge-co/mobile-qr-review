"use client"

import { CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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

interface CombinedSelectionGroupedProps {
  selectedOption: string;
  setSelectedOption: (optionId: string) => void;
  projects: Project[];
  durations: Duration[];
  isLoaded: boolean;
}

export function CombinedSelectionGrouped({
  selectedOption,
  setSelectedOption,
  projects,
  durations,
  isLoaded,
}: CombinedSelectionGroupedProps) {
  // Helper to create option ID
  const getOptionId = (projectId: string, durationDays: string) => `${projectId}-${durationDays}`;

  // Helper to parse selected option
  const parseSelectedOption = (optionId: string) => {
    const [projectId, durationDays] = optionId.split('-');
    return { projectId, durationDays };
  };

  // Get selected values for display
  const getSelectedDisplay = () => {
    if (!selectedOption) return "Select a project and duration";
    
    const { projectId, durationDays } = parseSelectedOption(selectedOption);
    const project = projects.find(p => p.id === projectId);
    const duration = durations.find(d => d.days === durationDays);
    
    if (!project || !duration) return "Select a project and duration";
    
    return `${project.name} - ${duration.label}`;
  };

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
          <SelectValue>{getSelectedDisplay()}</SelectValue>
        </SelectTrigger>
        <SelectContent className="w-full max-h-[75vh] sm:max-h-[70vh]">
          {projects.map((project) => (
            <SelectGroup key={project.id}>
              <SelectLabel className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{project.country}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500 font-normal">{project.location}</div>
                  </div>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200 text-xs">
                    {project.certification}
                  </Badge>
                </div>
              </SelectLabel>
              
              {durations.map((duration) => {
                const optionId = getOptionId(project.id, duration.days);
                const isSelected = selectedOption === optionId;
                
                return (
                  <SelectItem 
                    key={optionId} 
                    value={optionId} 
                    className="py-3 pl-12"
                  >
                    <div className="w-full flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{duration.label}</span>
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
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-emerald-700">฿{duration.price}</div>
                          <div className="text-xs text-gray-500">
                            ฿{Math.round(duration.price / Number.parseInt(duration.days))}/day
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {/* Selected Option Details */}
      {selectedOption && (() => {
        const { projectId, durationDays } = parseSelectedOption(selectedOption);
        const project = projects.find(p => p.id === projectId);
        const duration = durations.find(d => d.days === durationDays);
        
        if (!project || !duration) return null;
        
        return (
          <div className="mt-6 space-y-4">
            {/* Selection Summary */}
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{project.country}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200 text-xs">
                      {project.certification}
                    </Badge>
                    <span className="text-xs text-emerald-600">• {project.impact}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Details */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold text-gray-900">{duration.label}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Price</div>
                <div className="font-semibold text-emerald-700">฿{duration.price}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">CO₂ Offset</div>
                <div className="font-semibold text-gray-900">{duration.co2} kg</div>
              </div>
            </div>
          </div>
        );
      })()}
    </Card>
  )
}