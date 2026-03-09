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
