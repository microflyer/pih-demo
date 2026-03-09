import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { projects } from '@/entity-data/projects'
import { themes } from '@/entity-data/themes'
import { timeEntries as initialTimeEntries } from '@/entity-data/time-entries'
import { themeActivities } from '@/entity-data/theme-activities'
import type { TimeEntry } from '@/entity-types/time-entry'
import type { Project } from '@/entity-types/project'
import type { ThemeActivity } from '@/entity-types/theme-activity'
import type { Theme } from '@/entity-types/theme'

interface MyTimeContextType {
  projects: Project[]
  themes: Theme[]
  nonProjectThemes: Theme[]
  timeEntries: TimeEntry[]
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void
  deleteTimeEntry: (id: string) => void
  getActivitiesForProject: (projectId: string) => ThemeActivity[]
  getActivitiesForTheme: (themeId: string) => ThemeActivity[]
  getThemeForProject: (projectId: string) => string | null
}

const MyTimeContext = createContext<MyTimeContextType | null>(null)

const EXCLUDED_STATUSES = ['Deployed', 'Dropped', 'On Hold']

export function MyTimeProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries)

  const activeProjects = useMemo(() => {
    return projects.filter(
      (p) => p.status && !EXCLUDED_STATUSES.includes(p.status)
    )
  }, [])

  const nonProjectThemes = useMemo(() => {
    return themes.filter((t) => t.type === 'non_project')
  }, [])

  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: `te-${Date.now()}`,
    }
    setTimeEntries((prev) => [...prev, newEntry])
  }

  const deleteTimeEntry = (id: string) => {
    setTimeEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const getActivitiesForProject = (projectId: string): ThemeActivity[] => {
    const project = projects.find((p) => p.id === projectId)
    if (!project?.theme_id) return themeActivities
    return themeActivities.filter((a) => a.theme_id === project.theme_id)
  }

  const getThemeForProject = (projectId: string): string | null => {
    const project = projects.find((p) => p.id === projectId)
    return project?.theme_id ?? null
  }

  const getActivitiesForTheme = (themeId: string): ThemeActivity[] => {
    return themeActivities.filter((a) => a.theme_id === themeId)
  }

  return (
    <MyTimeContext.Provider
      value={{
        projects: activeProjects,
        themes,
        nonProjectThemes,
        timeEntries,
        addTimeEntry,
        deleteTimeEntry,
        getActivitiesForProject,
        getActivitiesForTheme,
        getThemeForProject,
      }}
    >
      {children}
    </MyTimeContext.Provider>
  )
}

export function useMyTime() {
  const context = useContext(MyTimeContext)
  if (!context) {
    throw new Error('useMyTime must be used within MyTimeProvider')
  }
  return context
}
