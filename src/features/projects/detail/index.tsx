import { Link } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useProjectsStore } from '@/stores/projects-store'

type ProjectDetailProps = {
  projectId: string
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const getProjectById = useProjectsStore((s) => s.getProjectById)
  const project = getProjectById(projectId)

  if (!project) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <p className='text-muted-foreground'>Project not found.</p>
          <Link to='/projects' className='text-primary hover:underline'>
            Back to list
          </Link>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div>
            <Link
              to='/projects'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              ← Back to list
            </Link>
            <h2 className='mt-1 text-2xl font-bold tracking-tight'>
              {project.name}
            </h2>
            <p className='text-muted-foreground'>
              Project details and edit form will be here.
            </p>
          </div>
        </div>
      </Main>
    </>
  )
}
