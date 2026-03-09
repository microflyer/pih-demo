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
  project?: Project
  date: string
}

export function TimeEntryDialog({ open, onOpenChange, project, date }: TimeEntryDialogProps) {
  const { addTimeEntry, getActivitiesForProject, getActivitiesForTheme, nonProjectThemes } = useMyTime()

  const isProjectBased = !!project

  const themeId = project ? project.theme_id ?? null : null
  const theme = themeId ? themes.find(t => t.id === themeId) : null
  const activities = isProjectBased
    ? getActivitiesForProject(project.id)
    : []

  const [selectedThemeId, setSelectedThemeId] = useState<string>('')
  const [activity, setActivity] = useState('')
  const [hours, setHours] = useState('')
  const [comments, setComments] = useState('')

  const themeActivities = selectedThemeId ? getActivitiesForTheme(selectedThemeId) : []

  // Reset form when dialog opens/closes or project changes
  useEffect(() => {
    if (open) {
      setSelectedThemeId('')
      setActivity('')
      setHours('')
      setComments('')
    }
  }, [open, project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!activity || !hours) return

    const finalThemeId = isProjectBased ? themeId : selectedThemeId

    addTimeEntry({
      activity,
      hours: parseFloat(hours),
      comments: comments || null,
      theme_id: finalThemeId,
      has_project: isProjectBased,
      project_id: isProjectBased ? project.id : null,
      date,
    })

    setActivity('')
    setHours('')
    setComments('')
    onOpenChange(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedThemeId('')
      setActivity('')
      setHours('')
      setComments('')
    }
    onOpenChange(isOpen)
  }

  const dialogTitle = isProjectBased
    ? `Log Time - ${project.name}`
    : 'Log Non-Project Time'

  const dialogDescription = isProjectBased
    ? `Record time spent on this project for ${date}`
    : `Record time for activities not linked to a project for ${date}`

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Theme - Selectable for non-project */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="theme" className="text-right">
                Theme {!isProjectBased && '*'}
              </Label>
              {isProjectBased ? (
                <Select value={themeId ?? ''} disabled>
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {theme && (
                      <SelectItem value={theme.id}>{theme.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <Select value={selectedThemeId} onValueChange={setSelectedThemeId} required>
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {nonProjectThemes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Activity - Required */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activity" className="text-right">
                Activity *
              </Label>
              <Select
                value={activity}
                onValueChange={setActivity}
                required
                disabled={isProjectBased ? false : !selectedThemeId}
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder={isProjectBased ? "Select activity" : "Select theme first"} />
                </SelectTrigger>
                <SelectContent>
                  {(isProjectBased ? activities : themeActivities).map((a) => (
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
                Type
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox id="has_project" checked={isProjectBased} disabled />
                <label
                  htmlFor="has_project"
                  className="text-sm text-muted-foreground"
                >
                  {isProjectBased ? 'Logged on project' : 'Non-project time'}
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
