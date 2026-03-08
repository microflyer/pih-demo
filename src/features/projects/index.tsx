import { useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProjectCreateDialog } from './components/project-create-dialog'
import { ProjectDeleteDialog } from './components/project-delete-dialog'
import { TeamMembersDialog } from './components/project-team-members-dialog'
import { ProjectsList } from './components/projects-list'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import { ProjectsProvider, useProjects } from './components/projects-provider'
import { ProjectsTable } from './components/projects-table'

type ViewMode = 'list' | 'board'

function ProjectsContent() {
  const { projects, openDialog, setOpenDialog } = useProjects()
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  return (
    <>
      <ProjectCreateDialog
        open={openDialog === 'create'}
        onOpenChange={(open) => {
          if (!open) setOpenDialog('create')
        }}
      />
      <TeamMembersDialog
        open={openDialog === 'members'}
        onOpenChange={(open: boolean) => {
          if (!open) setOpenDialog('members')
        }}
      />

      <ProjectDeleteDialog
        open={openDialog === 'delete'}
        onOpenChange={(open) => {
          if (!open) setOpenDialog('delete')
        }}
      />
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          {/* View Toggle */}
          <div className='flex items-center gap-1 rounded-md border bg-background p-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size='sm'
                  className='h-8 px-2'
                  onClick={() => setViewMode('list')}
                >
                  <List className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'board' ? 'secondary' : 'ghost'}
                  size='sm'
                  className='h-8 px-2'
                  onClick={() => setViewMode('board')}
                >
                  <LayoutGrid className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Board view</TooltipContent>
            </Tooltip>
          </div>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>Create and manage projects.</p>
          </div>
          <ProjectsPrimaryButtons />
        </div>
        {viewMode === 'list' ? (
          <ProjectsTable data={projects} />
        ) : (
          <ProjectsList projects={projects} />
        )}
      </Main>
    </>
  )
}

export function Projects() {
  return (
    <ProjectsProvider>
      <ProjectsContent />
    </ProjectsProvider>
  )
}
