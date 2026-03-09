import { useMyTime } from '../providers/my-time-provider'
import { projects } from '@/entity-data/projects'
import { themes } from '@/entity-data/themes'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// Sophisticated jewel-toned palette for premium feel
const PROJECT_COLORS = [
  '#0D9488', // Deep Teal
  '#B45309', // Rich Amber
  '#7C3AED', // Deep Violet
  '#BE185D', // Deep Rose
  '#0369A1', // Slate Blue
  '#A16207', // Warm Ochre
  '#15803D', // Forest Green
  '#6B21A8', // Deep Plum
]

interface TimeStatsProps {
  date: string
}

export function TimeStats({ date }: TimeStatsProps) {
  const { timeEntries } = useMyTime()

  const todayEntries = timeEntries.filter((e) => e.date === date)
  const totalHours = todayEntries.reduce((sum, e) => sum + e.hours, 0)

  // Group by project or theme (for non-project entries)
  const byProject = todayEntries.reduce((acc, entry) => {
    let name: string
    let key: string
    let isProject = entry.has_project && !!entry.project_id

    if (isProject && entry.project_id) {
      const project = projects.find((p) => p.id === entry.project_id)
      name = project?.name ?? 'Unknown'
      key = entry.project_id
    } else {
      const theme = themes.find((t) => t.id === entry.theme_id)
      name = theme?.name ?? 'Non-Project'
      key = `non-project-${entry.theme_id ?? 'none'}`
    }

    if (!acc[key]) {
      acc[key] = { name, hours: 0, isProject }
    }
    acc[key].hours += entry.hours
    return acc
  }, {} as Record<string, { name: string; hours: number; isProject: boolean }>)

  const projectEntries = Object.entries(byProject)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.hours - a.hours)

  if (totalHours === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 px-4 py-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium">No time logged today</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card/50 backdrop-blur-sm">
      {/* Compact header with total */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Today
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold tabular-nums text-foreground">
            {totalHours.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">hrs</span>
        </div>
      </div>

      {/* Horizontal bar visualization */}
      <div className="flex h-3 mx-3 mt-3 gap-px bg-border/30 rounded-full overflow-hidden">
        {projectEntries.map((project, index) => {
          const percentage = ((project.hours / totalHours) * 100).toFixed(1)
          return (
            <Tooltip key={project.id}>
              <TooltipTrigger asChild>
                <div
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  style={{
                    width: `${(project.hours / totalHours) * 100}%`,
                    backgroundColor: PROJECT_COLORS[index % PROJECT_COLORS.length],
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="flex flex-col gap-0.5">
                <span className="font-medium">{project.name}</span>
                <span className="text-gray-300">
                  {project.hours.toFixed(1)}h ({percentage}%)
                </span>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* Compact legend - inline pills */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 px-3 py-2.5">
        {projectEntries.map((project, index) => {
          const percentage = ((project.hours / totalHours) * 100).toFixed(0)
          return (
            <div
              key={project.id}
              className="flex items-center gap-1.5 group cursor-default"
            >
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: PROJECT_COLORS[index % PROJECT_COLORS.length],
                }}
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[120px]">
                {project.name}
              </span>
              <span className="text-xs font-medium tabular-nums text-foreground">
                {project.hours.toFixed(1)}h
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                ({percentage}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
