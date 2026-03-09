import { useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { MyTimeProvider, useMyTime } from './providers/my-time-provider'
import { TimeStats } from './components/time-stats'
import { ProjectTimeItem } from './components/project-time-item'

function MyTimeContent() {
  const { projects } = useMyTime()

  const today = useMemo(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  const formattedDate = useMemo(() => {
    const d = new Date()
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  return (
    <>
      <Header fixed>
        <div />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Time</h2>
            <p className="text-muted-foreground">
              Track your time across projects
            </p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">
            {formattedDate}
          </div>
        </div>

        <TimeStats date={today} />

        <div className="space-y-2">
          {projects.map((project) => (
            <ProjectTimeItem
              key={project.id}
              project={project}
              date={today}
            />
          ))}
        </div>
      </Main>
    </>
  )
}

export function MyTime() {
  return (
    <MyTimeProvider>
      <MyTimeContent />
    </MyTimeProvider>
  )
}
