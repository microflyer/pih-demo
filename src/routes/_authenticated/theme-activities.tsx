import { createFileRoute } from '@tanstack/react-router'
import { ThemeActivities } from '@/features/theme-activities'

export const Route = createFileRoute('/_authenticated/theme-activities')({
  component: ThemeActivities,
})
