import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeActivities } from './theme-activities-provider'

export function ThemeActivitiesPrimaryButtons() {
  const { setOpenDialog } = useThemeActivities()

  return (
    <Button
      onClick={() => setOpenDialog('create')}
      size='sm'
      className='h-9 gap-2'
    >
      <Plus className='h-4 w-4' />
      Create Theme Activity
    </Button>
  )
}
