import React, { useCallback, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import {
  projects as initialProjects,
  teams as initialTeams,
} from '@/entity-data'
import type { Project } from '@/entity-types/project'
import type { Team } from '@/entity-types/team'

export type ProjectsDialogType = 'create' | 'delete' | 'members' | null

type ProjectsContextType = {
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  teams: Team[]
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
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

function nextTeamId(teams: Team[]): string {
  const nums = teams
    .map((t) => t.id.replace(/^team-/, ''))
    .filter((s) => /^\d+$/.test(s))
    .map(Number)
  const max = nums.length ? Math.max(...nums) : 0
  return `team-${String(max + 1).padStart(3, '0')}`
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [openDialog, setOpenDialog] = useDialogState<ProjectsDialogType>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [...prev, project])
  }, [])

  const updateProject = useCallback(
    (id: string, patch: Partial<Project>) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      )
    },
    []
  )

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTeams((prev) => prev.filter((t) => t.project_id !== id))
  }, [])

  const getProjectById = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  )

  const getTeamsByProjectId = useCallback(
    (projectId: string) => teams.filter((t) => t.project_id === projectId),
    [teams]
  )

  const addTeamMember = useCallback((projectId: string, userId: string) => {
    setTeams((prev) => {
      const exists = prev.some(
        (t) => t.project_id === projectId && t.user_id === userId
      )
      if (exists) return prev
      const id = nextTeamId(prev)
      return [...prev, { id, project_id: projectId, user_id: userId }]
    })
  }, [])

  const removeTeamMember = useCallback(
    (projectId: string, userId: string) => {
      setTeams((prev) =>
        prev.filter(
          (t) => !(t.project_id === projectId && t.user_id === userId)
        )
      )
    },
    []
  )

  const value: ProjectsContextType = {
    projects,
    setProjects,
    teams,
    setTeams,
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
