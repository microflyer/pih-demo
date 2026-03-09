import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import type { Project } from '@/entity-types/project'
import { Pencil, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProjects } from './projects-provider'

type DataTableRowActionsProps = {
  row: Row<Project>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const navigate = useNavigate()
  const { setOpenDialog, setCurrentProject } = useProjects()
  const project = row.original

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[180px]'>
        <DropdownMenuItem
          onClick={() =>
            navigate({
              to: '/projects/$projectId',
              params: { projectId: project.id },
            })
          }
        >
          View / Edit
          <Pencil className='ms-auto h-4 w-4' />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentProject(project)
            setOpenDialog('members')
          }}
        >
          Manage members
          <Users className='ms-auto h-4 w-4' />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentProject(project)
            setOpenDialog('delete')
          }}
          className='text-destructive focus:text-destructive'
        >
          Delete
          <Trash2 className='ms-auto h-4 w-4' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
