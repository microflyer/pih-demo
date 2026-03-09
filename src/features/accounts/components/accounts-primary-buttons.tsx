import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAccounts } from './accounts-provider'

export function AccountsPrimaryButtons() {
  const { setOpenDialog } = useAccounts()

  return (
    <Button
      onClick={() => setOpenDialog('create')}
      size='sm'
      className='h-9 gap-2'
    >
      <Plus className='h-4 w-4' />
      Create Account
    </Button>
  )
}
