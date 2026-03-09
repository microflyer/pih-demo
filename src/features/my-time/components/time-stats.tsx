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
