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
