
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
      className={`p-6 border-0 shadow-lg transition-all duration-700 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "300ms" }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Project</h2>

      <Select value={selectedProject} onValueChange={setSelectedProject}>
        <SelectTrigger className="w-full mb-4 max-w-full">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent className="w-full max-w-[90vw] sm:max-w-none">
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id} className="py-4 min-h-[5.5rem]">
              <div className="w-full space-y-3 flex flex-col justify-center min-h-[4.5rem]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl flex-shrink-0">{project.country}</span>
                    <div className="flex-1 min-h-[2.5rem]">
                      <div className="font-medium text-gray-900 text-base leading-tight">{project.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{project.location}</div>
                    </div>
                  </div>
                  {selectedProject === project.id && (
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                    {project.certification}
                  </Badge>
                  <span className="text-sm font-medium text-emerald-600">{project.impact}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  )
}
