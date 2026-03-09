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
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProjectTimeItem({ project, date, isOpen: controlledIsOpen, onOpenChange }: ProjectTimeItemProps) {
  const { timeEntries, deleteTimeEntry } = useMyTime()
  const [internalIsOpen, setInternalIsOpen] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = onOpenChange ? (open: boolean) => onOpenChange(open) : setInternalIsOpen

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
        <div className="border rounded-md mb-1.5">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer hover:bg-muted/50 rounded-t-md">
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
                <span className="text-sm font-medium">{project.name}</span>
                {theme && (
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {theme.name}
                  </span>
                )}
                {totalHours > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    ({totalHours.toFixed(1)}h)
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-xs px-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setDialogOpen(true)
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-2.5 pb-2 space-y-1.5">
              {projectEntries.length === 0 ? (
                <p className="text-xs text-muted-foreground pl-5">
                  No time logged
                </p>
              ) : (
                projectEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="group relative flex items-start gap-3 pl-4 py-2 rounded-md border border-transparent hover:border-border hover:bg-card/50 transition-all duration-200"
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                      style={{
                        backgroundColor: index % 2 === 0 ? '#0D9488' : '#7C3AED',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{entry.activity}</div>
                      {entry.comments && (
                        <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {entry.comments}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs font-semibold tabular-nums">{entry.hours}h</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteTimeEntry(entry.id)}
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
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
