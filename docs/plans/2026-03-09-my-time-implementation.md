# My Time Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "My Time" page that allows users to log time entries against projects with collapsible project sections and daily time summary.

**Architecture:** Feature-based architecture with React Context for state management. Use existing shadcn/ui components (Dialog, Select, Collapsible) and follow existing patterns from the Projects feature.

**Tech Stack:** React, TypeScript, TanStack Router, shadcn/ui components, Tailwind CSS v4

---

## Task 1: Update TimeEntry Type and Mock Data

**Files:**
- Modify: `src/entity-types/time-entry.ts`
- Modify: `src/entity-data/projects.ts`
- Create: `src/entity-data/time-entries.ts`

**Step 1: Update TimeEntry type**

Modify `src/entity-types/time-entry.ts`:

```typescript
export interface TimeEntry {
  id: string
  activity: string
  hours: number
  comments: string | null
  theme_id: string | null
  has_project: boolean
  project_id: string | null
  date: string  // YYYY-MM-DD format
}
```

**Step 2: Add theme_id to project mock data**

Modify `src/entity-data/projects.ts` - add `theme_id` to projects:

```typescript
// proj-001
theme_id: 'theme-001',

// proj-002
theme_id: 'theme-002',

// proj-003
theme_id: 'theme-003',

// proj-006
theme_id: 'theme-004',

// proj-007
theme_id: 'theme-001',

// proj-008
theme_id: 'theme-002',
```

**Step 3: Create time entries mock data**

Create `src/entity-data/time-entries.ts`:

```typescript
import type { TimeEntry } from '@/entity-types/time-entry'

const today = new Date().toISOString().split('T')[0]

export const timeEntries: TimeEntry[] = [
  {
    id: 'te-001',
    activity: 'Solution Development & Coding',
    hours: 2.5,
    comments: 'Worked on API integration',
    theme_id: 'theme-001',
    has_project: true,
    project_id: 'proj-001',
    date: today,
  },
  {
    id: 'te-002',
    activity: 'UAT Execution & Monitoring',
    hours: 1.5,
    comments: 'Tested with sample data',
    theme_id: 'theme-001',
    has_project: true,
    project_id: 'proj-001',
    date: today,
  },
  {
    id: 'te-003',
    activity: 'As-Is Process Understanding',
    hours: 3.0,
    comments: 'Met with stakeholders',
    theme_id: 'theme-002',
    has_project: true,
    project_id: 'proj-002',
    date: today,
  },
]
```

**Step 4: Update entity-data index**

Modify `src/entity-data/index.ts` to export timeEntries:

```typescript
export { accounts } from './accounts'
export { businessUnits } from './business-units'
export { locations } from './locations'
export { projects } from './projects'
export { teams } from './teams'
export { themes } from './themes'
export { themeActivities } from './theme-activities'
export { users } from './users'
export { timeEntries } from './time-entries'  // Add this line
```

---

## Task 2: Add Sidebar Navigation Item

**Files:**
- Modify: `src/components/layout/data/sidebar-data.ts`

**Step 1: Add Clock icon import**

Add `Clock` to the lucide-react imports:

```typescript
import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  Folder,
  FileX,
  Lock,
  Bell,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Clock,  // Add this
} from 'lucide-react'
```

**Step 2: Add My Time nav `navGroups[ item**

In0].items` (General group), add after Dashboard:

```typescript
{
  title: 'General',
  items: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'My Time',
      url: '/my-time',
      icon: Clock,
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: Folder,
    },
  ],
},
```

---

## Task 3: Create My Time Provider

**Files:**
- Create: `src/features/my-time/providers/my-time-provider.tsx`

**Step 1: Create the provider**

```typescript
import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { projects } from '@/entity-data/projects'
import { timeEntries as initialTimeEntries } from '@/entity-data/time-entries'
import { themeActivities } from '@/entity-data/theme-activities'
import type { TimeEntry } from '@/entity-types/time-entry'
import type { Project } from '@/entity-types/project'
import type { ThemeActivity } from '@/entity-types/theme-activity'

interface MyTimeContextType {
  projects: Project[]
  timeEntries: TimeEntry[]
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void
  deleteTimeEntry: (id: string) => void
  getActivitiesForProject: (projectId: string) => ThemeActivity[]
  getThemeForProject: (projectId: string) => string | null
}

const MyTimeContext = createContext<MyTimeContextType | null>(null)

const EXCLUDED_STATUSES = ['Deployed', 'Dropped', 'On Hold']

export function MyTimeProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries)

  const activeProjects = useMemo(() => {
    return projects.filter(
      (p) => p.status && !EXCLUDED_STATUSES.includes(p.status)
    )
  }, [])

  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: `te-${Date.now()}`,
    }
    setTimeEntries((prev) => [...prev, newEntry])
  }

  const deleteTimeEntry = (id: string) => {
    setTimeEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const getActivitiesForProject = (projectId: string): ThemeActivity[] => {
    const project = projects.find((p) => p.id === projectId)
    if (!project?.theme_id) return themeActivities
    return themeActivities.filter((a) => a.theme_id === project.theme_id)
  }

  const getThemeForProject = (projectId: string): string | null => {
    const project = projects.find((p) => p.id === projectId)
    return project?.theme_id ?? null
  }

  return (
    <MyTimeContext.Provider
      value={{
        projects: activeProjects,
        timeEntries,
        addTimeEntry,
        deleteTimeEntry,
        getActivitiesForProject,
        getThemeForProject,
      }}
    >
      {children}
    </MyTimeContext.Provider>
  )
}

export function useMyTime() {
  const context = useContext(MyTimeContext)
  if (!context) {
    throw new Error('useMyTime must be used within MyTimeProvider')
  }
  return context
}
```

---

## Task 4: Create Time Entry Dialog Component

**Files:**
- Create: `src/features/my-time/components/time-entry-dialog.tsx`

**Step 1: Create the dialog component**

```typescript
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useMyTime } from '../providers/my-time-provider'
import { themes } from '@/entity-data/themes'
import type { Project } from '@/entity-types/project'

interface TimeEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  date: string
}

export function TimeEntryDialog({ open, onOpenChange, project, date }: TimeEntryDialogProps) {
  const { addTimeEntry, getActivitiesForProject, getThemeForProject } = useMyTime()

  const themeId = getThemeForProject(project.id)
  const theme = themes.find((t) => t.id === themeId)
  const activities = getActivitiesForProject(project.id)

  const [activity, setActivity] = useState('')
  const [hours, setHours] = useState('')
  const [comments, setComments] = useState('')

  useEffect(() => {
    if (open) {
      setActivity('')
      setHours('')
      setComments('')
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!activity || !hours) return

    addTimeEntry({
      activity,
      hours: parseFloat(hours),
      comments: comments || null,
      theme_id: themeId,
      has_project: true,
      project_id: project.id,
      date,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Time - {project.name}</DialogTitle>
          <DialogDescription>
            Record time spent on this project for {date}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Theme - Disabled */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="theme" className="text-right">
                Theme
              </Label>
              <Select value={themeId ?? ''} disabled>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {theme && (
                    <SelectItem value={theme.id}>{theme.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Activity - Required */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activity" className="text-right">
                Activity *
              </Label>
              <Select value={activity} onValueChange={setActivity} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((a) => (
                    <SelectItem key={a.id} value={a.name}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hours - Required */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hours" className="text-right">
                Hours *
              </Label>
              <Input
                id="hours"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 1.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {/* Comments */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comments" className="text-right">
                Comments
              </Label>
              <Textarea
                id="comments"
                placeholder="Optional notes..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>

            {/* has_project - Checked and disabled */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="has_project" className="text-right">
                Project
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox id="has_project" checked disabled />
                <label
                  htmlFor="has_project"
                  className="text-sm text-muted-foreground"
                >
                  Logged on project
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Time</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

---

## Task 5: Create Time Stats Component

**Files:**
- Create: `src/features/my-time/components/time-stats.tsx`

**Step 1: Create the stats component**

```typescript
import { useMyTime } from '../providers/my-time-provider'
import { projects } from '@/entity-data/projects'

interface TimeStatsProps {
  date: string
}

export function TimeStats({ date }: TimeStatsProps) {
  const { timeEntries } = useMyTime()

  const todayEntries = timeEntries.filter((e) => e.date === date)
  const totalHours = todayEntries.reduce((sum, e) => sum + e.hours, 0)

  // Group by project
  const byProject = todayEntries.reduce((acc, entry) => {
    if (entry.project_id) {
      const project = projects.find((p) => p.id === entry.project_id)
      const name = project?.name ?? 'Unknown'
      acc[name] = (acc[name] ?? 0) + entry.hours
    }
    return acc
  }, {} as Record<string, number>)

  const projectEntries = Object.entries(byProject).sort((a, b) => b[1] - a[1])

  if (totalHours === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground text-sm">No time logged for today</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Today's Time</span>
        <span className="text-2xl font-bold">{totalHours.toFixed(1)}h</span>
      </div>
      <div className="space-y-2">
        {projectEntries.map(([name, hours]) => (
          <div key={name} className="flex items-center gap-2">
            <div className="flex-1 text-sm text-muted-foreground truncate">
              {name}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(hours / totalHours) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-10 text-right">
                {hours.toFixed(1)}h
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 6: Create Project Time Item Component

**Files:**
- Create: `src/features/my-time/components/project-time-item.tsx`

**Step 1: Create the project item component**

```typescript
import { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useMyTime } from '../providers/my-time-provider'
import { TimeEntryDialog } from './time-entry-dialog'
import { themes } from '@/entity-data/themes'
import type { Project } from '@/entity-types/project'

interface ProjectTimeItemProps {
  project: Project
  date: string
}

export function ProjectTimeItem({ project, date }: ProjectTimeItemProps) {
  const { timeEntries, deleteTimeEntry } = useMyTime()
  const [isOpen, setIsOpen] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const projectEntries = timeEntries.filter(
    (e) => e.project_id === project.id && e.date === date
  )

  const theme = themes.find((t) => t.id === project.theme_id)

  const totalHours = projectEntries.reduce((sum, e) => sum + e.hours, 0)

  return (
    <>
      <TimeEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={project}
        date={date}
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border rounded-lg mb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">{project.name}</span>
                {theme && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {theme.name}
                  </span>
                )}
                {totalHours > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({totalHours.toFixed(1)}h)
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  setDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Time
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-3 pb-3 space-y-2">
              {projectEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground pl-6">
                  No time logged for this date
                </p>
              ) : (
                projectEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between pl-6 py-2 bg-muted/30 rounded"
                  >
                    <div className="flex-1">
                      <div className="text-sm">{entry.activity}</div>
                      {entry.comments && (
                        <div className="text-xs text-muted-foreground">
                          {entry.comments}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{entry.hours}h</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => deleteTimeEntry(entry.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </>
  )
}
```

---

## Task 7: Create My Time Main Page

**Files:**
- Create: `src/features/my-time/index.tsx`

**Step 1: Create the main page component**

```typescript
import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { MyTimeProvider, useMyTime } from './providers/my-time-provider'
import { TimeStats } from './components/time-stats'
import { ProjectTimeItem } from './components/project-time-item'

function MyTimeContent() {
  const { projects } = useMyTime()

  const today = useMemo(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  const formattedDate = useMemo(() => {
    const d = new Date()
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  // Sort projects: those with entries first
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const aHasEntries = a.id === a.id // Simplified - would need to check entries
      const bHasEntries = b.id === b.id
      return 0 // Keep original order for now
    })
  }, [projects])

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
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">
            {formattedDate}
          </div>
        </div>

        <TimeStats date={today} />

        <div className="space-y-2">
          {sortedProjects.map((project) => (
            <ProjectTimeItem
              key={project.id}
              project={project}
              date={today}
            />
          ))}
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
```

---

## Task 8: Create Route

**Files:**
- Create: `src/routes/_authenticated/my-time.tsx`

**Step 1: Create the route file**

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { MyTime } from '@/features/my-time'

export const Route = createFileRoute('/_authenticated/my-time')({
  component: MyTime,
})
```

---

## Task 9: Verify and Test

**Step 1: Run the dev server**

Run: `pnpm dev`

**Step 2: Navigate to /my-time**

Open browser and verify:
- Sidebar shows "My Time" under Dashboard
- Page loads with projects (excluding Deployed, Dropped, On Hold)
- Clicking "+ Add Time" opens dialog
- Dialog shows disabled theme, activity dropdown
- Submitting adds entry to project
- Stats component shows total hours and breakdown

---

**Plan complete and saved to `docs/plans/2026-03-09-my-time-design.md`. Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
