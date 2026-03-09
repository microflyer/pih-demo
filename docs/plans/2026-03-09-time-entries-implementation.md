# Time Entries Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Time Entries" page that allows users to query and manage all their time entries with filtering, sorting, pagination, and CRUD operations.

**Architecture:** Feature-based architecture with TanStack Table for data display. Use existing patterns from Tasks feature for table, dialogs, and provider. Reuse time entries data from entity-data.

**Tech Stack:** React, TypeScript, TanStack Router, TanStack Table, shadcn/ui components, Tailwind CSS v4

---

## Task 1: Add Sidebar Navigation Item

**Files:**
- Modify: `src/components/layout/data/sidebar-data.ts`

**Step 1: Add Calendar icon import**

Add `Calendar` to the lucide-react imports:

```typescript
import {
  AudioWaveform,
  Bell,
  Bug,
  Calendar,  // Add this
  Clock,
  Command,
  Construction,
  FileX,
  Folder,
  GalleryVerticalEnd,
  LayoutDashboard,
  Lock,
  Monitor,
  Palette,
  ServerOff,
  Settings,
  UserCog,
  UserX,
  Wrench,
} from 'lucide-react'
```

**Step 2: Add Time Entries nav item**

In `navGroups[0].items` (General group), add after Projects:

```typescript
{
  title: 'Time Entries',
  url: '/time-entries',
  icon: Calendar,
},
```

---

## Task 2: Create Time Entries Provider

**Files:**
- Create: `src/features/time-entries/components/time-entries-provider.tsx`

**Step 1: Create the provider**

```typescript
import { useState, useMemo, type ReactNode } from 'react'
import { timeEntries as initialTimeEntries } from '@/entity-data/time-entries'
import { projects } from '@/entity-data/projects'
import { themeActivities } from '@/entity-data/theme-activities'
import type { TimeEntry } from '@/entity-types/time-entry'
import type { Project } from '@/entity-types/project'
import type { ThemeActivity } from '@/entity-types/theme-activity'

interface TimeEntriesFilters {
  dateFrom: string | null
  dateTo: string | null
  projectId: string | null
  hasProject: boolean | null
}

interface TimeEntriesContextType {
  timeEntries: TimeEntry[]
  filteredEntries: TimeEntry[]
  filters: TimeEntriesFilters
  setFilters: (filters: TimeEntriesFilters) => void
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void
  updateTimeEntry: (id: string, entry: Partial<TimeEntry>) => void
  deleteTimeEntry: (id: string) => void
  projects: Project[]
  themeActivities: ThemeActivity[]
}

const TimeEntriesContext = createContext<TimeEntriesContextType | null>(null)

export function TimeEntriesProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries)
  const [filters, setFilters] = useState<TimeEntriesFilters>({
    dateFrom: null,
    dateTo: null,
    projectId: null,
    hasProject: null,
  })

  const filteredEntries = useMemo(() => {
    return timeEntries.filter((entry) => {
      // Date from filter
      if (filters.dateFrom && entry.date < filters.dateFrom) {
        return false
      }
      // Date to filter
      if (filters.dateTo && entry.date > filters.dateTo) {
        return false
      }
      // Project filter
      if (filters.projectId && entry.project_id !== filters.projectId) {
        return false
      }
      // Has project filter
      if (filters.hasProject !== null && entry.has_project !== filters.hasProject) {
        return false
      }
      return true
    })
  }, [timeEntries, filters])

  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: `te-${Date.now()}`,
    }
    setTimeEntries((prev) => [...prev, newEntry])
  }

  const updateTimeEntry = (id: string, updates: Partial<TimeEntry>) => {
    setTimeEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    )
  }

  const deleteTimeEntry = (id: string) => {
    setTimeEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <TimeEntriesContext.Provider
      value={{
        timeEntries,
        filteredEntries,
        filters,
        setFilters,
        addTimeEntry,
        updateTimeEntry,
        deleteTimeEntry,
        projects,
        themeActivities,
      }}
    >
      {children}
    </TimeEntriesContext.Provider>
  )
}

export function useTimeEntries() {
  const context = useContext(TimeEntriesContext)
  if (!context) {
    throw new Error('useTimeEntries must be used within TimeEntriesProvider')
  }
  return context
}
```

---

## Task 3: Create Time Entry Dialog Component

**Files:**
- Create: `src/features/time-entries/components/time-entry-dialog.tsx`

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
import { useTimeEntries } from './time-entries-provider'
import { themes } from '@/entity-data/themes'
import type { TimeEntry } from '@/entity-types/time-entry'

interface TimeEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editEntry?: TimeEntry | null
}

export function TimeEntryDialog({ open, onOpenChange, editEntry }: TimeEntryDialogProps) {
  const { addTimeEntry, updateTimeEntry, projects, themeActivities } = useTimeEntries()

  const [date, setDate] = useState('')
  const [hasProject, setHasProject] = useState(true)
  const [projectId, setProjectId] = useState('')
  const [themeId, setThemeId] = useState('')
  const [activity, setActivity] = useState('')
  const [hours, setHours] = useState('')
  const [comments, setComments] = useState('')

  // Set initial values when dialog opens for editing
  useEffect(() => {
    if (open) {
      if (editEntry) {
        setDate(editEntry.date)
        setHasProject(editEntry.has_project)
        setProjectId(editEntry.project_id ?? '')
        setThemeId(editEntry.theme_id ?? '')
        setActivity(editEntry.activity)
        setHours(editEntry.hours.toString())
        setComments(editEntry.comments ?? '')
      } else {
        // Reset for new entry
        setDate(new Date().toISOString().split('T')[0])
        setHasProject(true)
        setProjectId('')
        setThemeId('')
        setActivity('')
        setHours('')
        setComments('')
      }
    }
  }, [open, editEntry])

  // Get activities based on theme
  const activities = themeActivities.filter((a) => a.theme_id === themeId)

  // Get project theme when project is selected
  const selectedProject = projects.find((p) => p.id === projectId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !activity || !hours) return

    const entryData = {
      date,
      has_project: hasProject,
      project_id: hasProject ? projectId : null,
      theme_id: hasProject ? selectedProject?.theme_id : themeId,
      activity,
      hours: parseFloat(hours),
      comments: comments || null,
    }

    if (editEntry) {
      updateTimeEntry(editEntry.id, entryData)
    } else {
      addTimeEntry(entryData)
    }

    onOpenChange(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setDate('')
      setHasProject(true)
      setProjectId('')
      setThemeId('')
      setActivity('')
      setHours('')
      setComments('')
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editEntry ? 'Edit Time Entry' : 'Add Time Entry'}</DialogTitle>
          <DialogDescription>
            {editEntry ? 'Edit the time entry details.' : 'Log a new time entry.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Date - Required */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {/* has_project - Checkbox */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Project</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="has_project"
                  checked={hasProject}
                  onCheckedChange={(checked) => setHasProject(!!checked)}
                />
                <label htmlFor="has_project" className="text-sm">
                  Log on project
                </label>
              </div>
            </div>

            {/* Project - Only when hasProject is checked */}
            {hasProject && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project" className="text-right">
                  Project *
                </Label>
                <Select value={projectId} onValueChange={setProjectId} required={hasProject}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Theme - Disabled when hasProject is checked */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="theme" className="text-right">
                Theme
              </Label>
              <Select
                value={hasProject ? (selectedProject?.theme_id ?? '') : themeId}
                onValueChange={setThemeId}
                disabled={hasProject}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editEntry ? 'Save Changes' : 'Add Entry'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

---

## Task 4: Create Time Entries Filters Component

**Files:**
- Create: `src/features/time-entries/components/time-entries-filters.tsx`

**Step 1: Create the filters component**

```typescript
import { useTimeEntries } from './time-entries-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function TimeEntriesFilters() {
  const { filters, setFilters, projects } = useTimeEntries()

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Date From */}
      <div className="flex items-center gap-2">
        <Label htmlFor="dateFrom" className="whitespace-nowrap">
          From:
        </Label>
        <Input
          id="dateFrom"
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={(e) => updateFilter('dateFrom', e.target.value || null)}
          className="w-36"
        />
      </div>

      {/* Date To */}
      <div className="flex items-center gap-2">
        <Label htmlFor="dateTo" className="whitespace-nowrap">
          To:
        </Label>
        <Input
          id="dateTo"
          type="date"
          value={filters.dateTo ?? ''}
          onChange={(e) => updateFilter('dateTo', e.target.value || null)}
          className="w-36"
        />
      </div>

      {/* Project Filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="projectFilter" className="whitespace-nowrap">
          Project:
        </Label>
        <Select
          value={filters.projectId ?? ''}
          onValueChange={(value) => updateFilter('projectId', value || null)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Has Project Filter */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="hasProjectFilter"
          checked={filters.hasProject ?? false}
          onCheckedChange={(checked) => {
            if (checked) {
              updateFilter('hasProject', true)
            } else {
              updateFilter('hasProject', null)
            }
          }}
        />
        <Label htmlFor="hasProjectFilter" className="whitespace-nowrap">
          Has Project
        </Label>
      </div>

      {/* Clear Filters */}
      {(filters.dateFrom || filters.dateTo || filters.projectId || filters.hasProject !== null) && (
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({
              dateFrom: null,
              dateTo: null,
              projectId: null,
              hasProject: null,
            })
          }
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}
```

---

## Task 5: Create Time Entries Columns

**Files:**
- Create: `src/features/time-entries/components/time-entries-columns.tsx`

**Step 1: Create the columns definition**

```typescript
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { projects } from '@/entity-data/projects'
import { themes } from '@/entity-data/themes'
import { DataTableRowActions } from './time-entries-row-actions'
import type { TimeEntry } from '@/entity-types/time-entry'

export const timeEntriesColumns: ColumnDef<TimeEntry>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as string
      return <span>{date}</span>
    },
  },
  {
    accessorKey: 'project_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => {
      const projectId = row.original.project_id
      const project = projects.find((p) => p.id === projectId)
      return <span>{project?.name ?? '-'}</span>
    },
  },
  {
    accessorKey: 'activity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity" />
    ),
    cell: ({ row }) => {
      const activity = row.getValue('activity') as string
      return <span>{activity}</span>
    },
  },
  {
    accessorKey: 'hours',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hours" />
    ),
    cell: ({ row }) => {
      const hours = row.getValue('hours') as number
      return <span className="font-medium">{hours.toFixed(1)}h</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
```

---

## Task 6: Create Time Entries Row Actions

**Files:**
- Create: `src/features/time-entries/components/time-entries-row-actions.tsx`

**Step 1: Create the row actions component**

```typescript
import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTimeEntries } from './time-entries-provider'
import { TimeEntryDialog } from './time-entry-dialog'
import type { TimeEntry } from '@/entity-types/time-entry'

interface DataTableRowActionsProps {
  row: {
    original: TimeEntry
  }
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { deleteTimeEntry } = useTimeEntries()
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <TimeEntryDialog open={editOpen} onOpenChange={setEditOpen} editEntry={row.original} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => deleteTimeEntry(row.original.id)}
            className="text-red-600 focus:text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
```

---

## Task 7: Create Time Entries Table Component

**Files:**
- Create: `src/features/time-entries/components/time-entries-table.tsx**

**Step 1: Create the table component**

```typescript
'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  sorting,
  filtering,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useTimeEntries } from './time-entries-provider'
import { timeEntriesColumns } from './time-entries-columns'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

export function TimeEntriesTable() {
  const { filteredEntries } = useTimeEntries()
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])

  const table = useReactTable({
    data: filteredEntries,
    columns: timeEntriesColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={timeEntriesColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

---

## Task 8: Create Time Entries Main Page

**Files:**
- Create: `src/features/time-entries/index.tsx`

**Step 1: Create the main page component**

```typescript
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { TimeEntriesProvider } from './components/time-entries-provider'
import { TimeEntriesFilters } from './components/time-entries-filters'
import { TimeEntriesTable } from './components/time-entries-table'
import { TimeEntryDialog } from './components/time-entry-dialog'

function TimeEntriesContent() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <TimeEntryDialog open={createOpen} onOpenChange={setCreateOpen} />
      <Header fixed>
        <div />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Time Entries</h2>
            <p className="text-muted-foreground">
              Manage your time entries
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>

        <TimeEntriesFilters />

        <TimeEntriesTable />
      </Main>
    </>
  )
}

export function TimeEntries() {
  return (
    <TimeEntriesProvider>
      <TimeEntriesContent />
    </TimeEntriesProvider>
  )
}
```

---

## Task 9: Create Route

**Files:**
- Create: `src/routes/_authenticated/time-entries.tsx`

**Step 1: Create the route file**

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { TimeEntries } from '@/features/time-entries'

export const Route = createFileRoute('/_authenticated/time-entries')({
  component: TimeEntries,
})
```

---

## Task 10: Verify and Test

**Step 1: Run the dev server**

Run: `pnpm dev`

**Step 2: Navigate to /time-entries**

Open browser and verify:
- Sidebar shows "Time Entries" under Projects
- Page loads with filters and table
- Add Entry button opens dialog
- Filters work correctly
- Edit/Delete actions work

---

**Plan complete.**
