import React, { useState } from 'react'
import type { Account } from '@/entity-types/account'
import { useDataStore, nextAccountId } from '@/stores/data-store'
import useDialogState from '@/hooks/use-dialog-state'

export type AccountsDialogType = 'create' | 'edit' | 'delete' | null

type AccountsContextType = {
  accounts: Account[]
  addAccount: (account: Account) => void
  updateAccount: (id: string, patch: Partial<Account>) => void
  removeAccount: (id: string) => void
  getAccountById: (id: string) => Account | undefined
  openDialog: AccountsDialogType
  setOpenDialog: (v: AccountsDialogType) => void
  currentAccount: Account | null
  setCurrentAccount: React.Dispatch<React.SetStateAction<Account | null>>
}

const AccountsContext = React.createContext<AccountsContextType | null>(null)

export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const accounts = useDataStore((s) => s.accounts)
  const addAccountFn = useDataStore((s) => s.addAccount)
  const updateAccountFn = useDataStore((s) => s.updateAccount)
  const removeAccountFn = useDataStore((s) => s.removeAccount)
  const getAccountById = useDataStore((s) => s.getAccountById)

  const [openDialog, setOpenDialog] = useDialogState<'create' | 'edit' | 'delete'>(
    null
  )
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null)

  const addAccount = (account: Account) => {
    addAccountFn(account)
  }

  const updateAccount = (id: string, patch: Partial<Account>) => {
    updateAccountFn(id, patch)
  }

  const removeAccount = (id: string) => {
    removeAccountFn(id)
  }

  const value: AccountsContextType = {
    accounts,
    addAccount,
    updateAccount,
    removeAccount,
    getAccountById,
    openDialog,
    setOpenDialog,
    currentAccount,
    setCurrentAccount,
  }

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccounts() {
  const ctx = React.useContext(AccountsContext)
  if (!ctx) {
    throw new Error('useAccounts must be used within AccountsProvider')
  }
  return ctx
}

export { nextAccountId }
