import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { timeEntries as initialTimeEntries } from '@/entity-data/time-entries'
import { projects } from '@/entity-data/projects'
import { themeActivities } from '@/entity-data/theme-activities'
import type { TimeEntry } from '@/entity-types/time-entry'
import type { Project } from '@/entity-types/project'
import type { ThemeActivity } from '@/entity-types/theme-activity'

interface TimeEntriesFilters {
  dateFrom: string | null
  dateTo: string | null
  projectId: string | null
  hasProject: boolean | null
}

interface TimeEntriesContextType {
  timeEntries: TimeEntry[]
  filteredEntries: TimeEntry[]
  filters: TimeEntriesFilters
  setFilters: (filters: TimeEntriesFilters) => void
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void
  updateTimeEntry: (id: string, entry: Partial<TimeEntry>) => void
  deleteTimeEntry: (id: string) => void
  projects: Project[]
  themeActivities: ThemeActivity[]
}

const TimeEntriesContext = createContext<TimeEntriesContextType | null>(null)

export function TimeEntriesProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries)
  const [filters, setFilters] = useState<TimeEntriesFilters>({
    dateFrom: null,
    dateTo: null,
    projectId: null,
    hasProject: null,
  })

  const filteredEntries = useMemo(() => {
    return timeEntries.filter((entry) => {
      // Date from filter
      if (filters.dateFrom && entry.date < filters.dateFrom) {
        return false
      }
      // Date to filter
      if (filters.dateTo && entry.date > filters.dateTo) {
        return false
      }
      // Project filter
      if (filters.projectId && entry.project_id !== filters.projectId) {
        return false
      }
      // Has project filter
      if (filters.hasProject !== null && entry.has_project !== filters.hasProject) {
        return false
      }
      return true
    })
  }, [timeEntries, filters])

  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: `te-${Date.now()}`,
    }
    setTimeEntries((prev) => [...prev, newEntry])
  }

  const updateTimeEntry = (id: string, updates: Partial<TimeEntry>) => {
    setTimeEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    )
  }

  const deleteTimeEntry = (id: string) => {
    setTimeEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <TimeEntriesContext.Provider
      value={{
        timeEntries,
        filteredEntries,
        filters,
        setFilters,
        addTimeEntry,
        updateTimeEntry,
        deleteTimeEntry,
        projects,
        themeActivities,
      }}
    >
      {children}
    </TimeEntriesContext.Provider>
  )
}

export function useTimeEntries() {
  const context = useContext(TimeEntriesContext)
  if (!context) {
    throw new Error('useTimeEntries must be used within TimeEntriesProvider')
  }
  return context
}
