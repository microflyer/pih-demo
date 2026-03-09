import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TimeEntriesProvider, useTimeEntries } from './components/time-entries-provider'
import { TimeEntriesFilters } from './components/time-entries-filters'
import { TimeEntriesTable } from './components/time-entries-table'
import { TimeEntriesPrimaryButtons } from './components/time-entries-primary-buttons'
import { TimeEntryDialog } from './components/time-entry-dialog'

function TimeEntriesContent() {
  const { openDialog, setOpenDialog, editEntry, setEditEntry } = useTimeEntries()

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setOpenDialog(false)
      setEditEntry(null)
    }
  }

  return (
    <>
      <TimeEntryDialog
        open={openDialog}
        onOpenChange={handleDialogOpenChange}
        editEntry={editEntry}
      />
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Time Entries</h2>
            <p className='text-muted-foreground'>Manage your time entries.</p>
          </div>
          <TimeEntriesPrimaryButtons />
        </div>

        <TimeEntriesFilters />

        <TimeEntriesTable />
      </Main>
    </>
  )
}

export function TimeEntries() {
  return (
    <TimeEntriesProvider>
      <TimeEntriesContent />
    </TimeEntriesProvider>
  )
}
