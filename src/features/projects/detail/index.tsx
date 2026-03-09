import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Info } from 'lucide-react'
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

// Status badge color mapping
const STATUS_STYLES: Record<string, string> = {
  Active:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  Planning:
    'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  Draft:
    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
  Completed:
    'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  'On Hold':
    'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
  Cancelled:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
}

// Project type badge color mapping
const PROJECT_TYPE_STYLES: Record<string, string> = {
  Delivery:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
  Internal:
    'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300',
  'Proof of Concept':
    'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300',
  Lean: 'bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-950 dark:text-lime-300',
  GB: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
  BB: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
}

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
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='flex-1'>
            <Link
              to='/projects'
              className='inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              <svg
                className='me-1 h-4 w-4'
                fill='none'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path d='m15 18-6-6 6-6' />
              </svg>
              Back to list
            </Link>
            <div className='mt-2 flex flex-wrap items-center gap-3'>
              <h2 className='text-2xl font-bold tracking-tight'>
                {project.name}
              </h2>
              {project.project_type && (
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${
                    PROJECT_TYPE_STYLES[project.project_type] ||
                    'border-slate-200 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {project.project_type}
                </span>
              )}
              {project.status && (
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_STYLES[project.status] ||
                    'border-slate-200 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {project.status}
                </span>
              )}
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={handleDelete}
            className='cursor-pointer border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive'
          >
            Delete Project
          </Button>
        </div>

        {/* Two-column layout */}
        <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
          {/* Main form */}
          <div className='min-w-0'>
            <ProjectDetailForm project={project} />
          </div>

          {/* Sidebar */}
          <div className='space-y-4'>
            {/* Project Summary Card */}
            <Card className='shadow-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                  <Info className='h-4 w-4' />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'>
                    <svg
                      className='h-4 w-4'
                      fill='none'
                      height='24'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                    >
                      <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                      <polyline points='9 22 9 12 15 12 15 22' />
                    </svg>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                      Business Unit
                    </p>
                    <p className='truncate text-sm font-semibold'>
                      {businessUnit?.name ?? '—'}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'>
                    <svg
                      className='h-4 w-4'
                      fill='none'
                      height='24'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                    >
                      <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                      <circle cx='12' cy='7' r='4' />
                    </svg>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                      Account
                    </p>
                    <p className='truncate text-sm font-semibold'>
                      {account?.name ?? '—'}
                    </p>
                  </div>
                </div>

                {project.stage && (
                  <div className='flex items-start gap-3'>
                    <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400'>
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        height='24'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
                      </svg>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                        Stage
                      </p>
                      <p className='text-sm font-semibold'>{project.stage}</p>
                    </div>
                  </div>
                )}

                {(project.start_date || project.end_date) && (
                  <div className='flex items-start gap-3'>
                    <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'>
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        height='24'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <rect
                          height='18'
                          rx='2'
                          ry='2'
                          width='18'
                          x='3'
                          y='4'
                        />
                        <line x1='16' x2='16' y1='2' y2='6' />
                        <line x1='8' x2='8' y1='2' y2='6' />
                        <line x1='3' x2='21' y1='10' y2='10' />
                      </svg>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                        Timeline
                      </p>
                      <p className='text-sm font-semibold'>
                        {project.start_date
                          ? new Date(project.start_date).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : '—'}
                        {project.start_date && project.end_date && ' - '}
                        {project.end_date
                          ? new Date(project.end_date).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : ''}
                      </p>
                    </div>
                  </div>
                )}

                <div className='flex flex-wrap gap-2 pt-2'>
                  {project.is_billiable && (
                    <Badge className='cursor-pointer border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'>
                      <svg
                        className='me-1 h-3 w-3'
                        fill='none'
                        height='24'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <line x1='12' x2='12' y1='2' y2='22' />
                        <path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                      </svg>
                      Billable
                    </Badge>
                  )}
                  {project.is_external && (
                    <Badge
                      variant='outline'
                      className='cursor-pointer border-slate-300'
                    >
                      <svg
                        className='me-1 h-3 w-3'
                        fill='none'
                        height='24'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <circle cx='12' cy='12' r='10' />
                        <line x1='2' x2='22' y1='12' y2='12' />
                        <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
                      </svg>
                      External
                    </Badge>
                  )}
                </div>
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
