import React, { useState } from 'react'
import type { ThemeActivity } from '@/entity-types/theme-activity'
import { useDataStore, nextThemeActivityId } from '@/stores/data-store'
import useDialogState from '@/hooks/use-dialog-state'

export type ThemeActivitiesDialogType = 'create' | 'edit' | 'delete' | null

type ThemeActivitiesContextType = {
  themeActivities: ThemeActivity[]
  addThemeActivity: (activity: ThemeActivity) => void
  updateThemeActivity: (id: string, patch: Partial<ThemeActivity>) => void
  removeThemeActivity: (id: string) => void
  getThemeActivityById: (id: string) => ThemeActivity | undefined
  openDialog: ThemeActivitiesDialogType
  setOpenDialog: (v: ThemeActivitiesDialogType) => void
  currentThemeActivity: ThemeActivity | null
  setCurrentThemeActivity: React.Dispatch<React.SetStateAction<ThemeActivity | null>>
}

const ThemeActivitiesContext = React.createContext<ThemeActivitiesContextType | null>(null)

export function ThemeActivitiesProvider({ children }: { children: React.ReactNode }) {
  const themeActivities = useDataStore((s) => s.themeActivities)
  const addThemeActivityFn = useDataStore((s) => s.addThemeActivity)
  const updateThemeActivityFn = useDataStore((s) => s.updateThemeActivity)
  const removeThemeActivityFn = useDataStore((s) => s.removeThemeActivity)
  const getThemeActivityById = useDataStore((s) => s.getThemeActivityById)

  const [openDialog, setOpenDialog] = useDialogState<'create' | 'edit' | 'delete'>(
    null
  )
  const [currentThemeActivity, setCurrentThemeActivity] = useState<ThemeActivity | null>(null)

  const addThemeActivity = (activity: ThemeActivity) => {
    addThemeActivityFn(activity)
  }

  const updateThemeActivity = (id: string, patch: Partial<ThemeActivity>) => {
    updateThemeActivityFn(id, patch)
  }

  const removeThemeActivity = (id: string) => {
    removeThemeActivityFn(id)
  }

  const value: ThemeActivitiesContextType = {
    themeActivities,
    addThemeActivity,
    updateThemeActivity,
    removeThemeActivity,
    getThemeActivityById,
    openDialog,
    setOpenDialog,
    currentThemeActivity,
    setCurrentThemeActivity,
  }

  return (
    <ThemeActivitiesContext.Provider value={value}>
      {children}
    </ThemeActivitiesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeActivities() {
  const ctx = React.useContext(ThemeActivitiesContext)
  if (!ctx) {
    throw new Error('useThemeActivities must be used within ThemeActivitiesProvider')
  }
  return ctx
}

export { nextThemeActivityId }
