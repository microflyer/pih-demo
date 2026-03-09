import React, { useState } from 'react'
import type { Theme } from '@/entity-types/theme'
import { useDataStore, nextThemeId } from '@/stores/data-store'
import useDialogState from '@/hooks/use-dialog-state'

export type ThemesDialogType = 'create' | 'edit' | 'delete' | null

type ThemesContextType = {
  themes: Theme[]
  addTheme: (theme: Theme) => void
  updateTheme: (id: string, patch: Partial<Theme>) => void
  removeTheme: (id: string) => void
  getThemeById: (id: string) => Theme | undefined
  openDialog: ThemesDialogType
  setOpenDialog: (v: ThemesDialogType) => void
  currentTheme: Theme | null
  setCurrentTheme: React.Dispatch<React.SetStateAction<Theme | null>>
}

const ThemesContext = React.createContext<ThemesContextType | null>(null)

export function ThemesProvider({ children }: { children: React.ReactNode }) {
  const themes = useDataStore((s) => s.themes)
  const addThemeFn = useDataStore((s) => s.addTheme)
  const updateThemeFn = useDataStore((s) => s.updateTheme)
  const removeThemeFn = useDataStore((s) => s.removeTheme)
  const getThemeById = useDataStore((s) => s.getThemeById)

  const [openDialog, setOpenDialog] = useDialogState<'create' | 'edit' | 'delete'>(
    null
  )
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)

  const addTheme = (theme: Theme) => {
    addThemeFn(theme)
  }

  const updateTheme = (id: string, patch: Partial<Theme>) => {
    updateThemeFn(id, patch)
  }

  const removeTheme = (id: string) => {
    removeThemeFn(id)
  }

  const value: ThemesContextType = {
    themes,
    addTheme,
    updateTheme,
    removeTheme,
    getThemeById,
    openDialog,
    setOpenDialog,
    currentTheme,
    setCurrentTheme,
  }

  return (
    <ThemesContext.Provider value={value}>
      {children}
    </ThemesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemes() {
  const ctx = React.useContext(ThemesContext)
  if (!ctx) {
    throw new Error('useThemes must be used within ThemesProvider')
  }
  return ctx
}

export { nextThemeId }
