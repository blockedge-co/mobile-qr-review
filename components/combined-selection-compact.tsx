"use client"

import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Leaf, Sun, Trees } from "lucide-react"

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

interface CombinedSelectionCompactProps {
  selectedOption: string;
  setSelectedOption: (optionId: string) => void;
  projects: Project[];
  durations: Duration[];
  isLoaded: boolean;
}

export function CombinedSelectionCompact({
  selectedOption,
  setSelectedOption,
  projects,
  durations,
  isLoaded,
}: CombinedSelectionCompactProps) {
  // Helper to create option ID
  const getOptionId = (projectId: string, durationDays: string) => `${projectId}-${durationDays}`;

  // Get icon for project type
  const getProjectIcon = (projectId: string) => {
    switch (projectId) {
      case "forest-restoration":
        return <Trees className="h-4 w-4" />;
      case "mangrove-restoration":
        return <Leaf className="h-4 w-4" />;
      case "renewable-energy":
        return <Sun className="h-4 w-4" />;
      default:
        return <Leaf className="h-4 w-4" />;
    }
  };

  // Create compact display for dropdown items
  const combinedOptions = projects.flatMap((project) =>
    durations.map((duration) => ({
      id: getOptionId(project.id, duration.days),
      project,
      duration,
    }))
  );

  // Get display text for selected value
  const getSelectedDisplay = () => {
    if (!selectedOption) return "Choose your carbon offset plan";
    
    const selected = combinedOptions.find(opt => opt.id === selectedOption);
    if (!selected) return "Choose your carbon offset plan";
    
    return (
      <div className="flex items-center gap-2">
        {getProjectIcon(selected.project.id)}
        <span>{selected.project.name} • {selected.duration.label} • ฿{selected.duration.price}</span>
      </div>
    );
  };

  return (
    <Card
      className={`p-6 border-0 shadow-lg transition-all duration-700 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "300ms" }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Plan</h2>

      <Select value={selectedOption} onValueChange={setSelectedOption}>
        <SelectTrigger className="w-full h-auto py-3">
          <SelectValue asChild>
            {getSelectedDisplay()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-full">
          <div className="p-2">
            <div className="grid gap-1">
              {combinedOptions.map((option) => (
                <SelectItem 
                  key={option.id} 
                  value={option.id}
                  className="p-0 cursor-pointer"
                >
                  <div className={`w-full p-3 rounded-lg transition-colors ${
                    selectedOption === option.id 
                      ? 'bg-emerald-50 border border-emerald-300' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5">{getProjectIcon(option.project.id)}</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {option.project.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {option.project.location} • {option.duration.label}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge 
                              variant="outline" 
                              className="text-xs py-0 h-5 text-emerald-700 border-emerald-200"
                            >
                              {option.project.certification}
                            </Badge>
                            {option.duration.popular && (
                              <Badge 
                                className="text-xs py-0 h-5 bg-emerald-100 text-emerald-700 border-0"
                              >
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-700">฿{option.duration.price}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {option.duration.co2} kg CO₂
                        </div>
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </div>
          </div>
        </SelectContent>
      </Select>

      {/* Compact Summary */}
      {selectedOption && (() => {
        const selected = combinedOptions.find(opt => opt.id === selectedOption);
        if (!selected) return null;
        
        return (
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Your Impact:</span>
              <span className="font-semibold text-emerald-700">
                {selected.project.impact} × {selected.duration.label.toLowerCase()}
              </span>
            </div>
          </div>
        );
      })()}
    </Card>
  )
}