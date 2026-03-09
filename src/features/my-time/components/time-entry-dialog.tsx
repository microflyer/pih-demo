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
