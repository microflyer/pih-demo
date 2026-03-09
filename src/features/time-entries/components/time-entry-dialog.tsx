import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

interface TimeEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editEntry?: TimeEntry | null
}

function getDefaultValues(editEntry: TimeEntry | null | undefined) {
  if (editEntry) {
    return {
      date: new Date(editEntry.date),
      hasProject: editEntry.has_project,
      projectId: editEntry.project_id ?? '',
      themeId: editEntry.theme_id ?? '',
      activity: editEntry.activity,
      hours: editEntry.hours.toString(),
      comments: editEntry.comments ?? '',
    }
  }
  return {
    date: new Date(),
    hasProject: true,
    projectId: '',
    themeId: '',
    activity: '',
    hours: '',
    comments: '',
  }
}

export function TimeEntryDialog({ open, onOpenChange, editEntry }: TimeEntryDialogProps) {
  const { addTimeEntry, updateTimeEntry, projects, themeActivities } = useTimeEntries()

  // Use key to reset form when dialog opens/closes or editEntry changes
  const [formKey, setFormKey] = useState(0)

  // Reset form when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormKey((k) => k + 1)
    }
    onOpenChange(isOpen)
  }

  const defaultValues = getDefaultValues(editEntry)

  const [date, setDate] = useState(defaultValues.date)
  const [hasProject, setHasProject] = useState(defaultValues.hasProject)
  const [projectId, setProjectId] = useState(defaultValues.projectId)
  const [themeId, setThemeId] = useState(defaultValues.themeId)
  const [activity, setActivity] = useState(defaultValues.activity)
  const [hours, setHours] = useState(defaultValues.hours)
  const [comments, setComments] = useState(defaultValues.comments)

  // Get activities based on theme
  const activities = themeActivities.filter((a) => a.theme_id === themeId)

  // Filter themes based on hasProject
  const availableThemes = hasProject ? themes : themes.filter((t) => t.type === 'non_project')

  // Get project theme when project is selected
  const selectedProject = projects.find((p) => p.id === projectId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !activity || !hours) return

    const dateString = format(date, 'yyyy-MM-dd')

    const entryData = {
      date: dateString,
      has_project: hasProject,
      project_id: hasProject ? projectId : null,
      theme_id: hasProject ? (selectedProject?.theme_id ?? null) : themeId || null,
      activity,
      hours: parseFloat(hours),
      comments: comments || null,
    }

    if (editEntry) {
      updateTimeEntry(editEntry.id, entryData)
    } else {
      addTimeEntry(entryData)
    }

    handleOpenChange(false)
  }

  return (
    <Dialog
      key={formKey}
      open={open}
      onOpenChange={handleOpenChange}
    >
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className="col-span-3 w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selected) => selected && setDate(selected)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                  <SelectTrigger className="col-span-3 w-full">
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
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {availableThemes.map((t) => (
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
                <SelectTrigger className="col-span-3 w-full">
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
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editEntry ? 'Save Changes' : 'Add Entry'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
