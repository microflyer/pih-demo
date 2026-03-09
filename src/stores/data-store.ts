import {
  businessUnits as initialBusinessUnits,
  accounts as initialAccounts,
  themes as initialThemes,
  themeActivities as initialThemeActivities,
} from '@/entity-data'
import type { BusinessUnit } from '@/entity-types/business-unit'
import type { Account } from '@/entity-types/account'
import type { Theme } from '@/entity-types/theme'
import type { ThemeActivity } from '@/entity-types/theme-activity'
import { create } from 'zustand'

function nextBusinessUnitId(businessUnits: BusinessUnit[]): string {
  const nums = businessUnits
    .map((bu) => bu.id.replace(/^bu-/, ''))
    .filter((s) => /^\d+$/.test(s))
    .map(Number)
  const max = nums.length ? Math.max(...nums) : 0
  return `bu-${String(max + 1).padStart(3, '0')}`
}

function nextAccountId(accounts: Account[]): string {
  const nums = accounts
    .map((a) => a.id.replace(/^acc-/, ''))
    .filter((s) => /^\d+$/.test(s))
    .map(Number)
  const max = nums.length ? Math.max(...nums) : 0
  return `acc-${String(max + 1).padStart(3, '0')}`
}

function nextThemeId(themes: Theme[]): string {
  const nums = themes
    .map((t) => t.id.replace(/^theme-/, ''))
    .filter((s) => /^\d+$/.test(s))
    .map(Number)
  const max = nums.length ? Math.max(...nums) : 0
  return `theme-${String(max + 1).padStart(3, '0')}`
}

function nextThemeActivityId(activities: ThemeActivity[]): string {
  const nums = activities
    .map((a) => a.id.replace(/^activity-/, ''))
    .filter((s) => /^\d+$/.test(s))
    .map(Number)
  const max = nums.length ? Math.max(...nums) : 0
  return `activity-${String(max + 1).padStart(3, '0')}`
}

type DataStore = {
  // Business Units
  businessUnits: BusinessUnit[]
  addBusinessUnit: (businessUnit: BusinessUnit) => void
  updateBusinessUnit: (id: string, patch: Partial<BusinessUnit>) => void
  removeBusinessUnit: (id: string) => void
  getBusinessUnitById: (id: string) => BusinessUnit | undefined

  // Accounts
  accounts: Account[]
  addAccount: (account: Account) => void
  updateAccount: (id: string, patch: Partial<Account>) => void
  removeAccount: (id: string) => void
  getAccountById: (id: string) => Account | undefined
  getAccountsByBusinessUnitId: (businessUnitId: string) => Account[]

  // Themes
  themes: Theme[]
  addTheme: (theme: Theme) => void
  updateTheme: (id: string, patch: Partial<Theme>) => void
  removeTheme: (id: string) => void
  getThemeById: (id: string) => Theme | undefined

  // Theme Activities
  themeActivities: ThemeActivity[]
  addThemeActivity: (activity: ThemeActivity) => void
  updateThemeActivity: (id: string, patch: Partial<ThemeActivity>) => void
  removeThemeActivity: (id: string) => void
  getThemeActivityById: (id: string) => ThemeActivity | undefined
  getThemeActivitiesByThemeId: (themeId: string) => ThemeActivity[]
}

export const useDataStore = create<DataStore>()((set, get) => ({
  // Business Units
  businessUnits: initialBusinessUnits,
  addBusinessUnit: (businessUnit) =>
    set((state) => ({ businessUnits: [...state.businessUnits, businessUnit] })),
  updateBusinessUnit: (id, patch) =>
    set((state) => ({
      businessUnits: state.businessUnits.map((bu) =>
        bu.id === id ? { ...bu, ...patch } : bu
      ),
    })),
  removeBusinessUnit: (id) =>
    set((state) => ({
      businessUnits: state.businessUnits.filter((bu) => bu.id !== id),
      // Cascade delete: remove associated accounts
      accounts: state.accounts.filter((a) => a.business_unit_id !== id),
    })),
  getBusinessUnitById: (id) => get().businessUnits.find((bu) => bu.id === id),

  // Accounts
  accounts: initialAccounts,
  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),
  updateAccount: (id, patch) =>
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === id ? { ...a, ...patch } : a
      ),
    })),
  removeAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== id),
    })),
  getAccountById: (id) => get().accounts.find((a) => a.id === id),
  getAccountsByBusinessUnitId: (businessUnitId) =>
    get().accounts.filter((a) => a.business_unit_id === businessUnitId),

  // Themes
  themes: initialThemes,
  addTheme: (theme) => set((state) => ({ themes: [...state.themes, theme] })),
  updateTheme: (id, patch) =>
    set((state) => ({
      themes: state.themes.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
  removeTheme: (id) =>
    set((state) => ({
      themes: state.themes.filter((t) => t.id !== id),
      // Cascade delete: remove associated theme activities
      themeActivities: state.themeActivities.filter((a) => a.theme_id !== id),
    })),
  getThemeById: (id) => get().themes.find((t) => t.id === id),

  // Theme Activities
  themeActivities: initialThemeActivities,
  addThemeActivity: (activity) =>
    set((state) => ({ themeActivities: [...state.themeActivities, activity] })),
  updateThemeActivity: (id, patch) =>
    set((state) => ({
      themeActivities: state.themeActivities.map((a) =>
        a.id === id ? { ...a, ...patch } : a
      ),
    })),
  removeThemeActivity: (id) =>
    set((state) => ({
      themeActivities: state.themeActivities.filter((a) => a.id !== id),
    })),
  getThemeActivityById: (id) => get().themeActivities.find((a) => a.id === id),
  getThemeActivitiesByThemeId: (themeId) =>
    get().themeActivities.filter((a) => a.theme_id === themeId),
}))

// Helper functions to generate IDs
export { nextBusinessUnitId, nextAccountId, nextThemeId, nextThemeActivityId }
