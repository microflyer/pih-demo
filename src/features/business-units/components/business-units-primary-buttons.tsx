import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBusinessUnits } from './business-units-provider'

export function BusinessUnitsPrimaryButtons() {
  const { setOpenDialog } = useBusinessUnits()

  return (
    <Button
      onClick={() => setOpenDialog('create')}
      size='sm'
      className='h-9 gap-2'
    >
      <Plus className='h-4 w-4' />
      Create Business Unit
    </Button>
  )
}
