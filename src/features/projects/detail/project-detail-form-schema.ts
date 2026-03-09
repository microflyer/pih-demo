import { z } from 'zod'

const optionalString = z.string().nullable().optional()
const optionalNumber = z
  .union([
    z.string().transform((v) => (v === '' || v === undefined ? null : Number(v))),
    z.number(),
    z.null(),
  ])
  .optional()
  .nullable()

export const projectDetailFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  service_line: optionalString,
  process: optionalString,
  project_type: z.string().min(1, 'Project type is required'),
  tech_solution: optionalString,
  progear_id: optionalString,
  ops_mentor: optionalString,
  sdl_name: optionalString,
  sign_off_status: optionalString,
  bb: optionalString,
  digital_manager: optionalString,
  is_billiable: z.boolean(),
  is_external: z.boolean(),
  status: optionalString,
  status_reason: z.string(),
  stage: optionalString,
  business_unit_id: z.string().min(1, 'Business unit is required'),
  account_id: z.string().min(1, 'Account is required'),
  cost: optionalNumber,
  revenue: optionalNumber,
  estimated_hours: optionalNumber,
  initial_hours: optionalNumber,
  actual_hours: optionalNumber,
  one_time_cost: optionalNumber,
  potential_fte_saving: optionalNumber,
  actual_fte_saving: optionalNumber,
  actual_released_hc: optionalNumber,
  in_scope_fte: optionalNumber,
  business_impact: optionalNumber,
  start_date: optionalString,
  end_date: optionalString,
  theme_id: optionalString,
})

export type ProjectDetailFormValues = z.infer<typeof projectDetailFormSchema>
