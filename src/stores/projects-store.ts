import {
  projects as initialProjects,
  teams as initialTeams,
  projectLinkLocations as initialProjectLinkLocations,
} from '@/entity-data'
import type { Project } from '@/entity-types/project'
import type { ProjectLinkLocation } from '@/entity-types/project-link-location'
import type { Team } from '@/entity-types/team'
import { create } from 'zustand'

export function nextProjectId(projects: Project[]): string {
  const nums = projects
    .map((p) => p.id.replace(/^proj-/, ''))
    .filter((s) => /^\d+$/.test(s))
    .map(Number)
  const max = nums.length ? Math.max(...nums) : 0
  return `proj-${String(max + 1).padStart(3, '0')}`
}

function nextTeamId(teams: Team[]): string {
  const nums = teams
    .map((t) => t.id.replace(/^team-/, ''))
    .filter((s) => /^\d+$/.test(s))
    .map(Number)
  const max = nums.length ? Math.max(...nums) : 0
  return `team-${String(max + 1).padStart(3, '0')}`
}

type ProjectsStore = {
  projects: Project[]
  teams: Team[]
  projectLinkLocations: ProjectLinkLocation[]
  addProject: (project: Project) => void
  updateProject: (id: string, patch: Partial<Project>) => void
  removeProject: (id: string) => void
  getProjectById: (id: string) => Project | undefined
  getTeamsByProjectId: (projectId: string) => Team[]
  addTeamMember: (projectId: string, userId: string) => void
  removeTeamMember: (projectId: string, userId: string) => void
  getLocationsByProjectId: (projectId: string) => ProjectLinkLocation[]
  addProjectLocation: (projectId: string, locationId: string) => void
  removeProjectLocation: (id: string) => void
}

export const useProjectsStore = create<ProjectsStore>()((set, get) => ({
  projects: initialProjects,
  teams: initialTeams,
  projectLinkLocations: initialProjectLinkLocations,

  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),

  updateProject: (id, patch) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      ),
    })),

  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      teams: state.teams.filter((t) => t.project_id !== id),
      projectLinkLocations: state.projectLinkLocations.filter(
        (pll) => pll.project_id !== id
      ),
    })),

  getProjectById: (id) => get().projects.find((p) => p.id === id),

  getTeamsByProjectId: (projectId) =>
    get().teams.filter((t) => t.project_id === projectId),

  addTeamMember: (projectId, userId) =>
    set((state) => {
      const exists = state.teams.some(
        (t) => t.project_id === projectId && t.user_id === userId
      )
      if (exists) return state
      const id = nextTeamId(state.teams)
      return {
        teams: [...state.teams, { id, project_id: projectId, user_id: userId }],
      }
    }),

  removeTeamMember: (projectId, userId) =>
    set((state) => ({
      teams: state.teams.filter(
        (t) => !(t.project_id === projectId && t.user_id === userId)
      ),
    })),

  getLocationsByProjectId: (projectId) =>
    get().projectLinkLocations.filter((pll) => pll.project_id === projectId),

  addProjectLocation: (projectId, locationId) =>
    set((state) => {
      const exists = state.projectLinkLocations.some(
        (pll) => pll.project_id === projectId && pll.location_id === locationId
      )
      if (exists) return state
      const nums = state.projectLinkLocations
        .map((pll) => pll.id.replace(/^pll-/, ''))
        .filter((s) => /^\d+$/.test(s))
        .map(Number)
      const max = nums.length ? Math.max(...nums) : 0
      const id = `pll-${String(max + 1).padStart(3, '0')}`
      return {
        projectLinkLocations: [
          ...state.projectLinkLocations,
          { id, project_id: projectId, location_id: locationId },
        ],
      }
    }),

  removeProjectLocation: (id) =>
    set((state) => ({
      projectLinkLocations: state.projectLinkLocations.filter(
        (pll) => pll.id !== id
      ),
    })),
}))
