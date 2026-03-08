import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Projects } from '@/features/projects'

const projectsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  name: z.string().optional().catch(''),
  project_type: z.array(z.string()).optional().catch([]),
  status: z.array(z.string()).optional().catch([]),
  business_unit_id: z.array(z.string()).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/projects/')({
  validateSearch: projectsSearchSchema,
  component: Projects,
})
