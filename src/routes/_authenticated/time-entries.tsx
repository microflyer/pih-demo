import { createFileRoute } from '@tanstack/react-router'
import { TimeEntries } from '@/features/time-entries'

export const Route = createFileRoute('/_authenticated/time-entries')({
  component: TimeEntries,
})
