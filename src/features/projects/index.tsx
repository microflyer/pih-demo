import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProjectCreateDialog } from './components/project-create-dialog'
import { ProjectDeleteDialog } from './components/project-delete-dialog'
import { TeamMembersDialog } from './components/project-team-members-dialog'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import { ProjectsProvider, useProjects } from './components/projects-provider'
import { ProjectsTable } from './components/projects-table'

const route = getRouteApi('/_authenticated/projects/')

function ProjectsContent() {
  const { projects, openDialog, setOpenDialog } = useProjects()
  const search = route.useSearch()
  const navigate = route.useNavigate()

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
        <ProjectsTable data={projects} search={search} navigate={navigate} />
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
