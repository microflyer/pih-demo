import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AccountsDialogs } from './components/accounts-dialogs'
import { AccountsPrimaryButtons } from './components/accounts-primary-buttons'
import { AccountsProvider, useAccounts } from './components/accounts-provider'
import { AccountsTable } from './components/accounts-table'

function AccountsContent() {
  const { accounts, openDialog, setOpenDialog } = useAccounts()

  return (
    <>
      <AccountsDialogs
        open={openDialog !== null}
        onOpenChange={(open) => {
          if (!open) setOpenDialog(null)
        }}
      />
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Accounts</h2>
            <p className='text-muted-foreground'>
              Create and manage accounts.
            </p>
          </div>
          <AccountsPrimaryButtons />
        </div>
        <AccountsTable data={accounts} />
      </Main>
    </>
  )
}

export function Accounts() {
  return (
    <AccountsProvider>
      <AccountsContent />
    </AccountsProvider>
  )
}
