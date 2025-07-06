
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

interface ProjectSelectionProps {
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  projects: Project[];
  isLoaded: boolean;
}

export function ProjectSelection({
  selectedProject,
  setSelectedProject,
  projects,
  isLoaded,
}: ProjectSelectionProps) {
  return (
    <Card
      className={`p-4 sm:p-6 border-0 shadow-lg transition-all duration-700 mobile-card ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "300ms" }}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Select Project</h2>

      <Select value={selectedProject} onValueChange={setSelectedProject}>
        <SelectTrigger className="w-full mb-4 mobile-input focus-visible-ring min-h-[48px] touch-target">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent className="mobile-card">
          {projects.map((project) => (
            <SelectItem 
              key={project.id} 
              value={project.id} 
              className="py-3 min-h-[5rem] touch-target focus-visible-ring"
            >
              <div className="w-full space-y-2 flex flex-col justify-center min-h-[4rem] min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0 select-none">{project.country}</span>
                    <div className="flex-1 min-h-[2rem] min-w-0">
                      <div className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">{project.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate">{project.location}</div>
                    </div>
                  </div>
                  {selectedProject === project.id && (
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200 text-xs px-2 py-0.5 truncate max-w-[100px] flex-shrink-0 select-none">
                    {project.certification}
                  </Badge>
                  <span className="text-xs font-medium text-emerald-600 truncate min-w-0 select-none">{project.impact}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  )
}
