import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { accounts } from '@/entity-data/accounts'
import { businessUnits } from '@/entity-data/business-units'
import type { Project } from '@/entity-types/project'
import {
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Users,
  Calendar,
  Briefcase,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjects } from './projects-provider'

const businessUnitMap = new Map(businessUnits.map((bu) => [bu.id, bu.name]))
const accountMap = new Map(accounts.map((a) => [a.id, a.name]))

const PROJECT_TYPE_COLORS: Record<string, string> = {
  Delivery: 'bg-blue-500',
  Internal: 'bg-green-500',
  'Proof of Concept': 'bg-purple-500',
}

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-500',
  Planning: 'bg-yellow-500',
  Draft: 'bg-gray-400',
  Completed: 'bg-blue-500',
  'On Hold': 'bg-orange-500',
  Cancelled: 'bg-red-500',
}

const STAGE_COLORS: Record<string, string> = {
  Discovery: 'bg-indigo-400',
  Proposal: 'bg-amber-400',
  Execution: 'bg-blue-500',
  Closed: 'bg-gray-500',
}

function formatShortDate(value: string | null): string {
  if (!value) return '—'
  try {
    const d = new Date(value)
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

function getProjectInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

type ProjectsListProps = {
  projects: Project[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [buFilter, setBuFilter] = useState<string>('all')

  const filteredProjects = projects.filter((project) => {
    if (
      searchQuery &&
      !project.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    if (typeFilter !== 'all' && project.project_type !== typeFilter) {
      return false
    }
    if (statusFilter !== 'all' && project.status !== statusFilter) {
      return false
    }
    if (buFilter !== 'all' && project.business_unit_id !== buFilter) {
      return false
    }
    return true
  })

  const projectTypes = [
    ...new Set(projects.map((p) => p.project_type).filter(Boolean)),
  ]
  const statuses = [...new Set(projects.map((p) => p.status).filter(Boolean))]

  return (
    <div className='flex flex-1 flex-col gap-6'>
      {/* Search and Filters */}
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative max-w-md flex-1'>
            <Search className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search projects...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='ps-9'
            />
          </div>
        </div>

        {/* Filter Chips */}
        <ScrollArea className='w-full pb-2 whitespace-nowrap'>
          <div className='flex w-max items-center gap-2'>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className='h-8 w-[160px] bg-background'>
                <SelectValue placeholder='Project Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                {projectTypes.map((type) => (
                  <SelectItem key={type} value={type!}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='h-8 w-[140px] bg-background'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status!}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={buFilter} onValueChange={setBuFilter}>
              <SelectTrigger className='h-8 w-[180px] bg-background'>
                <SelectValue placeholder='Business Unit' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Business Units</SelectItem>
                {businessUnits.map((bu) => (
                  <SelectItem key={bu.id} value={bu.id}>
                    {bu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(typeFilter !== 'all' ||
              statusFilter !== 'all' ||
              buFilter !== 'all') && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setTypeFilter('all')
                  setStatusFilter('all')
                  setBuFilter('all')
                }}
                className='h-8 text-muted-foreground'
              >
                Clear filters
              </Button>
            )}
          </div>
          <ScrollBar orientation='horizontal' className='invisible' />
        </ScrollArea>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className='flex flex-1 items-center justify-center py-12'>
          <div className='text-center'>
            <Briefcase className='mx-auto h-12 w-12 text-muted-foreground/50' />
            <h3 className='mt-4 text-lg font-semibold'>No projects found</h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              Try adjusting your search or filters
            </p>
          </div>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

type ProjectCardProps = {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  const { setCurrentProject, setOpenDialog } = useProjects()
  const navigate = useNavigate()

  const businessUnit = businessUnitMap.get(project.business_unit_id)
  const account = accountMap.get(project.account_id)

  const handleEdit = () => {
    navigate({ to: '/projects/$projectId', params: { projectId: project.id } })
  }

  const handleDelete = () => {
    setCurrentProject(project)
    setOpenDialog('delete')
  }

  const handleManageMembers = () => {
    setCurrentProject(project)
    setOpenDialog('members')
  }

  return (
    <div className='group relative flex flex-col rounded-xl border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'>
      {/* Header */}
      <div className='flex items-start gap-3'>
        {/* Project Avatar */}
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
            PROJECT_TYPE_COLORS[project.project_type || ''] || 'bg-gray-500'
          )}
        >
          {getProjectInitials(project.name)}
        </div>

        {/* Project Info */}
        <div className='min-w-0 flex-1'>
          <Link
            to='/projects/$projectId'
            params={{ projectId: project.id }}
            className='block truncate font-semibold hover:text-primary'
          >
            {project.name}
          </Link>
          <p className='mt-0.5 truncate text-sm text-muted-foreground'>
            {businessUnit || '—'}
          </p>
        </div>

        {/* Actions Menu */}
        <div className='opacity-0 transition-opacity group-hover:opacity-100'>
          <div className='relative'>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
            <div className='absolute end-0 top-full z-10 mt-1 hidden w-40 rounded-md border bg-background py-1 shadow-lg group-hover:block'>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start px-2'
                onClick={handleEdit}
              >
                <Pencil className='me-2 h-4 w-4' />
                Edit
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start px-2'
                onClick={handleManageMembers}
              >
                <Users className='me-2 h-4 w-4' />
                Team
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start px-2 text-destructive hover:text-destructive'
                onClick={handleDelete}
              >
                <Trash2 className='me-2 h-4 w-4' />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badges */}
      <div className='mt-4 flex flex-wrap gap-1.5'>
        {project.status && (
          <Badge
            variant='secondary'
            className={cn(
              'gap-1.5 px-2 py-0.5 text-xs font-medium',
              STATUS_COLORS[project.status] && 'text-white'
            )}
            style={{
              backgroundColor: STATUS_COLORS[project.status]
                ? undefined
                : undefined,
            }}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                STATUS_COLORS[project.status] || 'bg-gray-400'
              )}
            />
            {project.status}
          </Badge>
        )}
        {project.stage && (
          <Badge variant='outline' className='gap-1.5 px-2 py-0.5 text-xs'>
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                STAGE_COLORS[project.stage] || 'bg-gray-400'
              )}
            />
            {project.stage}
          </Badge>
        )}
        <Badge variant='secondary' className='px-2 py-0.5 text-xs'>
          {project.project_type || '—'}
        </Badge>
      </div>

      {/* Details */}
      <div className='mt-4 space-y-2 text-sm'>
        {account && (
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Building2 className='h-3.5 w-3.5' />
            <span className='truncate'>{account}</span>
          </div>
        )}
        {(project.start_date || project.end_date) && (
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Calendar className='h-3.5 w-3.5' />
            <span>
              {formatShortDate(project.start_date)}
              {project.start_date && project.end_date && ' - '}
              {formatShortDate(project.end_date)}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='mt-4 flex items-center justify-between border-t pt-3'>
        <div className='flex gap-3'>
          {project.is_billiable && (
            <Badge variant='default' className='text-xs'>
              Billable
            </Badge>
          )}
          {project.is_external && (
            <Badge variant='outline' className='text-xs'>
              External
            </Badge>
          )}
        </div>
        <Link
          to='/projects/$projectId'
          params={{ projectId: project.id }}
          className='text-xs font-medium text-primary hover:underline'
        >
          View details
        </Link>
      </div>
    </div>
  )
}
