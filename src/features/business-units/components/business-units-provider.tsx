import React, { useState } from 'react'
import type { BusinessUnit } from '@/entity-types/business-unit'
import { useDataStore, nextBusinessUnitId } from '@/stores/data-store'
import useDialogState from '@/hooks/use-dialog-state'

export type BusinessUnitsDialogType = 'create' | 'edit' | 'delete' | null

type BusinessUnitsContextType = {
  businessUnits: BusinessUnit[]
  addBusinessUnit: (businessUnit: BusinessUnit) => void
  updateBusinessUnit: (id: string, patch: Partial<BusinessUnit>) => void
  removeBusinessUnit: (id: string) => void
  getBusinessUnitById: (id: string) => BusinessUnit | undefined
  openDialog: BusinessUnitsDialogType
  setOpenDialog: (v: BusinessUnitsDialogType) => void
  currentBusinessUnit: BusinessUnit | null
  setCurrentBusinessUnit: React.Dispatch<React.SetStateAction<BusinessUnit | null>>
}

const BusinessUnitsContext = React.createContext<BusinessUnitsContextType | null>(
  null
)

export function BusinessUnitsProvider({
  children
}: {
  children: React.ReactNode
}) {
  const businessUnits = useDataStore((s) => s.businessUnits)
  const addBusinessUnitFn = useDataStore((s) => s.addBusinessUnit)
  const updateBusinessUnitFn = useDataStore((s) => s.updateBusinessUnit)
  const removeBusinessUnitFn = useDataStore((s) => s.removeBusinessUnit)
  const getBusinessUnitById = useDataStore((s) => s.getBusinessUnitById)

  const [openDialog, setOpenDialog] = useDialogState<'create' | 'edit' | 'delete'>(
    null
  )
  const [currentBusinessUnit, setCurrentBusinessUnit] =
    useState<BusinessUnit | null>(null)

  const addBusinessUnit = (businessUnit: BusinessUnit) => {
    addBusinessUnitFn(businessUnit)
  }

  const updateBusinessUnit = (id: string, patch: Partial<BusinessUnit>) => {
    updateBusinessUnitFn(id, patch)
  }

  const removeBusinessUnit = (id: string) => {
    removeBusinessUnitFn(id)
  }

  const value: BusinessUnitsContextType = {
    businessUnits,
    addBusinessUnit,
    updateBusinessUnit,
    removeBusinessUnit,
    getBusinessUnitById,
    openDialog,
    setOpenDialog,
    currentBusinessUnit,
    setCurrentBusinessUnit,
  }

  return (
    <BusinessUnitsContext.Provider value={value}>
      {children}
    </BusinessUnitsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBusinessUnits() {
  const ctx = React.useContext(BusinessUnitsContext)
  if (!ctx) {
    throw new Error(
      'useBusinessUnits must be used within BusinessUnitsProvider'
    )
  }
  return ctx
}

export { nextBusinessUnitId }
