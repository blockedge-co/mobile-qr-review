"use client"

import { CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModalSelect, ModalSelectItem } from "@/components/ui/modal-select"

interface Project {
  id: string;
  name: string;
  location: string;
  country: string;
  impact: string;
  certification: string;
}

interface ProjectSelectionModalProps {
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  projects: Project[];
  isLoaded: boolean;
}

export function ProjectSelectionModal({
  selectedProject,
  setSelectedProject,
  projects,
  isLoaded,
}: ProjectSelectionModalProps) {
  const selectedProjectData = projects.find(p => p.id === selectedProject)
  
  return (
    <Card
      className={`p-4 sm:p-6 border-0 shadow-lg transition-all duration-700 mobile-card ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "300ms" }}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Select Project
      </h2>

      <ModalSelect
        value={selectedProject}
        onValueChange={setSelectedProject}
        placeholder="Select a project"
        title="Choose Carbon Credit Project"
        className="mb-4"
        triggerClassName="mobile-input focus-visible-ring min-h-[48px] touch-target"
        contentClassName="mobile-card"
      >
        {projects.map((project) => (
          <ModalSelectItem
            key={project.id}
            value={project.id}
            className="py-3 min-h-[5rem] touch-target focus-visible-ring"
          >
            <div className="w-full space-y-2 flex flex-col justify-center min-h-[4rem] min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0 select-none">
                    {project.country}
                  </span>
                  <div className="flex-1 min-h-[2rem] min-w-0">
                    <div className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                      {project.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {project.location}
                    </div>
                  </div>
                </div>
                {selectedProject === project.id && (
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <Badge 
                  variant="outline" 
                  className="text-emerald-700 border-emerald-200 text-xs px-2 py-0.5 truncate max-w-[100px] flex-shrink-0 select-none"
                >
                  {project.certification}
                </Badge>
                <span className="text-xs font-medium text-emerald-600 truncate min-w-0 select-none">
                  {project.impact}
                </span>
              </div>
            </div>
          </ModalSelectItem>
        ))}
      </ModalSelect>

      {/* Show selected project summary */}
      {selectedProjectData && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Selected Project</span>
          </div>
          <div className="text-sm text-emerald-700">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedProjectData.country}</span>
              <span className="font-medium">{selectedProjectData.name}</span>
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              {selectedProjectData.location} • {selectedProjectData.impact}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}