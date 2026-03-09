import { createFileRoute } from '@tanstack/react-router'
import { MyTime } from '@/features/my-time'

export const Route = createFileRoute('/_authenticated/my-time')({
  component: MyTime,
})
