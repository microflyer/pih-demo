export interface Project {
  id: string
  name: string
  service_line: string | null
  process: string | null
  project_type: string
  tech_solution: string | null
  progear_id: string | null
  ops_mentor: string | null
  sdl_name: string | null
  sign_off_status: string | null
  bb: string | null
  digital_manager: string | null
  is_billiable: boolean
  is_external: boolean
  cost: number | null
  revenue: number | null
  estimated_hours: number | null
  initial_hours: number | null
  actual_hours: number | null
  one_time_cost: number | null
  potential_fte_saving: number | null
  actual_fte_saving: number | null
  actual_released_hc: number | null
  in_scope_fte: number | null
  business_impact: number | null
  stage: string | null
  status: string | null
  status_reason: string
  start_date: string | null
  end_date: string | null
  theme_id: string | null
}
