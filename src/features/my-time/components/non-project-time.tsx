import { useState, useMemo } from 'react'
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

interface NonProjectTimeProps {
  date: string
}

export function NonProjectTime({ date }: NonProjectTimeProps) {
  const { timeEntries, deleteTimeEntry } = useMyTime()
  const [isOpen, setIsOpen] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Filter non-project time entries for this date
  const nonProjectEntries = useMemo(() => {
    return timeEntries.filter(
      (e) => e.date === date && !e.has_project
    )
  }, [timeEntries, date])

  const totalHours = nonProjectEntries.reduce((sum, e) => sum + e.hours, 0)

  // Group by theme
  const byTheme = useMemo(() => {
    return nonProjectEntries.reduce((acc, entry) => {
      const theme = themes.find((t) => t.id === entry.theme_id)
      const name = theme?.name ?? 'Unknown'
      if (!acc[name]) {
        acc[name] = []
      }
      acc[name].push(entry)
      return acc
    }, {} as Record<string, typeof nonProjectEntries>)
  }, [nonProjectEntries])

  const themeGroups = Object.entries(byTheme)

  return (
    <>
      <TimeEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={date}
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="rounded-md">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer hover:bg-muted/50 rounded-t-md">
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
                <span className="text-sm font-medium">Time Entries</span>
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
              {nonProjectEntries.length === 0 ? (
                <p className="text-xs text-muted-foreground pl-5">
                  No non-project time logged
                </p>
              ) : (
                themeGroups.map(([themeName, entries]) => (
                  <div key={themeName} className="space-y-1">
                    <div className="text-[10px] font-medium text-muted-foreground pl-4 pt-1">
                      {themeName}
                    </div>
                    {entries.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="group relative flex items-start gap-3 pl-4 py-2 rounded-md border border-transparent hover:border-border hover:bg-card/50 transition-all duration-200"
                      >
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
                          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
                            {entry.hours}h
                          </span>
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
                    ))}
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
