import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { MyTimeProvider, useMyTime } from './providers/my-time-provider'
import { TimeStats } from './components/time-stats'
import { ProjectTimeItem } from './components/project-time-item'
import { NonProjectTime } from './components/non-project-time'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react'

function MyTimeContent() {
  const { projects } = useMyTime()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({})

  const dateString = useMemo(() => {
    return format(selectedDate, 'yyyy-MM-dd')
  }, [selectedDate])

  const formattedDate = useMemo(() => {
    return format(selectedDate, 'EEE, MMM d')
  }, [selectedDate])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const isAllExpanded = projects.every(p => expandedProjects[p.id] !== false)
  const isAllCollapsed = projects.every(p => expandedProjects[p.id] === false)

  const toggleAll = () => {
    if (isAllExpanded) {
      // Collapse all
      const allCollapsed: Record<string, boolean> = {}
      projects.forEach(p => { allCollapsed[p.id] = false })
      setExpandedProjects(allCollapsed)
    } else {
      // Expand all
      const allExpanded: Record<string, boolean> = {}
      projects.forEach(p => { allExpanded[p.id] = true })
      setExpandedProjects(allExpanded)
    }
  }

  const handleProjectToggle = (projectId: string, open: boolean) => {
    setExpandedProjects(prev => ({ ...prev, [projectId]: open }))
  }

  const isProjectExpanded = (projectId: string) => {
    // Default to true if not set
    return expandedProjects[projectId] !== false
  }

  return (
    <>
      <Header fixed>
        <div />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Time</h2>
            <p className="text-muted-foreground">
              Track your time across projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAll}
              className="h-8"
              disabled={isAllExpanded && isAllCollapsed}
            >
              {isAllExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Expand All
                </>
              )}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formattedDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TimeStats date={dateString} />

        {/* Projects Section */}
        <div className="rounded-lg bg-muted/60 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">
            Projects
          </div>
          <div className="rounded-md bg-card p-2 space-y-2">
            {projects.map((project) => (
              <ProjectTimeItem
                key={project.id}
                project={project}
                date={dateString}
                isOpen={isProjectExpanded(project.id)}
                onOpenChange={(open) => handleProjectToggle(project.id, open)}
              />
            ))}
          </div>
        </div>

        {/* Non-Project Section */}
        <div className="rounded-lg bg-muted/60 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">
            Non-Projects
          </div>
          <div className="rounded-md bg-card p-2">
            <NonProjectTime date={dateString} />
          </div>
        </div>
      </Main>
    </>
  )
}

export function MyTime() {
  return (
    <MyTimeProvider>
      <MyTimeContent />
    </MyTimeProvider>
  )
}
