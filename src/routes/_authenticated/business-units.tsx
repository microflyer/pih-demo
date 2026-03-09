import { createFileRoute } from '@tanstack/react-router'
import { BusinessUnits } from '@/features/business-units'

export const Route = createFileRoute('/_authenticated/business-units')({
  component: BusinessUnits,
})
