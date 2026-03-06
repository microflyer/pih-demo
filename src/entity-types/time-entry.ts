export interface TimeEntry {
  id: string
  activity: string
  hours: number
  comments: string | null
  theme_id: string | null
  has_project: boolean
  project_id: string | null
}
