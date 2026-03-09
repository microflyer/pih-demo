import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTimeEntries } from './time-entries-provider'

export function TimeEntriesPrimaryButtons() {
  const { setOpenDialog } = useTimeEntries()

  return (
    <Button className='space-x-1' onClick={() => setOpenDialog(true)}>
      <span>Add Entry</span>
      <Plus size={18} />
    </Button>
  )
}
