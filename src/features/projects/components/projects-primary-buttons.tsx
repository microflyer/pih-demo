import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjects } from './projects-provider'

export function ProjectsPrimaryButtons() {
  const { setOpenDialog } = useProjects()

  return (
    <Button className='space-x-1' onClick={() => setOpenDialog('create')}>
      <span>New Project</span>
      <Plus size={18} />
    </Button>
  )
}
