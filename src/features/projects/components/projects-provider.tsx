import React, { useState } from 'react'
import type { Project } from '@/entity-types/project'
import type { Team } from '@/entity-types/team'
import { useProjectsStore } from '@/stores/projects-store'
import useDialogState from '@/hooks/use-dialog-state'

export type ProjectsDialogType = 'create' | 'delete' | 'members' | null

type ProjectsContextType = {
  projects: Project[]
  teams: Team[]
  addProject: (project: Project) => void
  updateProject: (id: string, patch: Partial<Project>) => void
  removeProject: (id: string) => void
  getProjectById: (id: string) => Project | undefined
  getTeamsByProjectId: (projectId: string) => Team[]
  addTeamMember: (projectId: string, userId: string) => void
  removeTeamMember: (projectId: string, userId: string) => void
  openDialog: ProjectsDialogType
  setOpenDialog: (v: ProjectsDialogType) => void
  currentProject: Project | null
  setCurrentProject: React.Dispatch<React.SetStateAction<Project | null>>
}

const ProjectsContext = React.createContext<ProjectsContextType | null>(null)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const projects = useProjectsStore((s) => s.projects)
  const teams = useProjectsStore((s) => s.teams)
  const addProject = useProjectsStore((s) => s.addProject)
  const updateProject = useProjectsStore((s) => s.updateProject)
  const removeProject = useProjectsStore((s) => s.removeProject)
  const getProjectById = useProjectsStore((s) => s.getProjectById)
  const getTeamsByProjectId = useProjectsStore((s) => s.getTeamsByProjectId)
  const addTeamMember = useProjectsStore((s) => s.addTeamMember)
  const removeTeamMember = useProjectsStore((s) => s.removeTeamMember)

  const [openDialog, setOpenDialog] = useDialogState<
    'create' | 'delete' | 'members'
  >(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  const value: ProjectsContextType = {
    projects,
    teams,
    addProject,
    updateProject,
    removeProject,
    getProjectById,
    getTeamsByProjectId,
    addTeamMember,
    removeTeamMember,
    openDialog,
    setOpenDialog,
    currentProject,
    setCurrentProject,
  }

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProjects() {
  const ctx = React.useContext(ProjectsContext)
  if (!ctx) {
    throw new Error('useProjects must be used within ProjectsProvider')
  }
  return ctx
}
