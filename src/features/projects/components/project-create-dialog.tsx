import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { accounts } from '@/entity-data/accounts'
import { businessUnits } from '@/entity-data/business-units'
import type { Project } from '@/entity-types/project'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjects } from './projects-provider'
import { nextProjectId } from '@/stores/projects-store'

const PROJECT_TYPES = [
  { label: 'Lean', value: 'Lean' },
  { label: 'GB', value: 'GB' },
  { label: 'BB', value: 'BB' },
] as const

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  business_unit_id: z.string().min(1, 'Business unit is required.'),
  account_id: z.string().min(1, 'Account is required.'),
  project_type: z.string().min(1, 'Project type is required.'),
})

type CreateProjectForm = z.infer<typeof createProjectSchema>

type ProjectCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectCreateDialog({
  open,
  onOpenChange,
}: ProjectCreateDialogProps) {
  const navigate = useNavigate()
  const { addProject, setOpenDialog, projects } = useProjects()

  const form = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      business_unit_id: '',
      account_id: '',
      project_type: '',
    },
  })

  const selectedBuId = form.watch('business_unit_id')
  const accountOptions = selectedBuId
    ? accounts
        .filter((a) => a.business_unit_id === selectedBuId)
        .map((a) => ({ label: a.name, value: a.id }))
    : []

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset()
    onOpenChange(next)
  }

  function onSubmit(data: CreateProjectForm) {
    const id = nextProjectId(projects)
    const project: Project = {
      id,
      name: data.name,
      service_line: null,
      process: null,
      project_type: data.project_type,
      tech_solution: null,
      progear_id: null,
      ops_mentor: null,
      sdl_name: null,
      sign_off_status: null,
      bb: null,
      digital_manager: null,
      is_billiable: false,
      is_external: false,
      cost: null,
      revenue: null,
      estimated_hours: null,
      initial_hours: null,
      actual_hours: null,
      one_time_cost: null,
      potential_fte_saving: null,
      actual_fte_saving: null,
      actual_released_hc: null,
      in_scope_fte: null,
      business_impact: null,
      stage: null,
      status: null,
      status_reason: '',
      start_date: null,
      end_date: null,
      theme_id: null,
      business_unit_id: data.business_unit_id,
      account_id: data.account_id,
    }
    addProject(project)
    setOpenDialog('create')
    form.reset()
    onOpenChange(false)
    navigate({ to: '/projects/$projectId', params: { projectId: id } })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Create a new project. You can add more details on the next page.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Project name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='business_unit_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Unit</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v)
                      form.setValue('account_id', '')
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select business unit' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {businessUnits.map((bu) => (
                        <SelectItem key={bu.id} value={bu.id}>
                          {bu.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='account_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedBuId}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select account' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accountOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='project_type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROJECT_TYPES.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
