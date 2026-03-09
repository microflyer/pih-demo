import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemes } from './themes-provider'

export function ThemesPrimaryButtons() {
  const { setOpenDialog } = useThemes()

  return (
    <Button
      onClick={() => setOpenDialog('create')}
      size='sm'
      className='h-9 gap-2'
    >
      <Plus className='h-4 w-4' />
      Create Theme
    </Button>
  )
}
