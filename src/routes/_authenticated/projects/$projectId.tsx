import { createFileRoute } from '@tanstack/react-router'
import { ProjectsProvider } from '@/features/projects/components/projects-provider'
import { ProjectDetail } from '@/features/projects/detail'

export const Route = createFileRoute('/_authenticated/projects/$projectId')({
  component: ProjectDetailRoute,
})

function ProjectDetailRoute() {
  const { projectId } = Route.useParams()
  return (
    <ProjectsProvider>
      <ProjectDetail projectId={projectId} />
    </ProjectsProvider>
  )
}
