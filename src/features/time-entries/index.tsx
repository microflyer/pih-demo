import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { TimeEntriesProvider } from './components/time-entries-provider'
import { TimeEntriesFilters } from './components/time-entries-filters'
import { TimeEntriesTable } from './components/time-entries-table'
import { TimeEntryDialog } from './components/time-entry-dialog'

function TimeEntriesContent() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <TimeEntryDialog open={createOpen} onOpenChange={setCreateOpen} />
      <Header fixed>
        <div />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Time Entries</h2>
            <p className="text-muted-foreground">
              Manage your time entries
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
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
