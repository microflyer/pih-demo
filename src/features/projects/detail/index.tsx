import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { accounts } from '@/entity-data/accounts'
import { businessUnits } from '@/entity-data/business-units'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProjectDeleteDialog } from '@/features/projects/components/project-delete-dialog'
import { TeamMembersDialog } from '@/features/projects/components/project-team-members-dialog'
import { useProjects } from '@/features/projects/components/projects-provider'
import { ProjectDetailForm } from './project-detail-form'
import { TeamMembersPanel } from './team-members-panel'

type ProjectDetailProps = {
  projectId: string
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const { getProjectById, setCurrentProject } = useProjects()
  const project = getProjectById(projectId)
  const [membersDialogOpen, setMembersDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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

  const businessUnit = businessUnits.find(
    (bu) => bu.id === project.business_unit_id
  )
  const account = accounts.find((a) => a.id === project.account_id)

  const handleManageMembers = () => {
    setCurrentProject(project)
    setMembersDialogOpen(true)
  }

  const handleDelete = () => {
    setCurrentProject(project)
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <TeamMembersDialog
        open={membersDialogOpen}
        onOpenChange={setMembersDialogOpen}
      />
      <ProjectDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
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
        {/* Back link and title */}
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
          </div>
          <Button variant='destructive' size='sm' onClick={handleDelete}>
            Delete Project
          </Button>
        </div>

        {/* Two-column layout */}
        <div className='grid gap-6 lg:grid-cols-[1fr_300px]'>
          {/* Main form */}
          <div className='min-w-0'>
            <ProjectDetailForm project={project} />
          </div>

          {/* Sidebar */}
          <div className='space-y-4'>
            {/* Project Summary Card */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-1'>
                  <p className='text-xs text-muted-foreground'>Business Unit</p>
                  <p className='text-sm font-medium'>
                    {businessUnit?.name ?? '—'}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-xs text-muted-foreground'>Account</p>
                  <p className='text-sm font-medium'>{account?.name ?? '—'}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-xs text-muted-foreground'>Project Type</p>
                  <Badge variant='secondary' className='font-normal'>
                    {project.project_type ?? '—'}
                  </Badge>
                </div>
                <div className='flex gap-2'>
                  {project.is_billiable && (
                    <Badge variant='default'>Billable</Badge>
                  )}
                  {project.is_external && (
                    <Badge variant='outline'>External</Badge>
                  )}
                </div>
                {project.status && (
                  <div className='space-y-1'>
                    <p className='text-xs text-muted-foreground'>Status</p>
                    <Badge variant='outline' className='capitalize'>
                      {project.status}
                    </Badge>
                  </div>
                )}
                {project.stage && (
                  <div className='space-y-1'>
                    <p className='text-xs text-muted-foreground'>Stage</p>
                    <p className='text-sm'>{project.stage}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Members Panel */}
            <TeamMembersPanel
              project={project}
              onManageMembers={handleManageMembers}
            />
          </div>
        </div>
      </Main>
    </>
  )
}
