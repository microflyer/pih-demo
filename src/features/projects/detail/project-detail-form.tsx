import { useMemo } from 'react'
import { z } from 'zod'
import { useForm, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { accounts } from '@/entity-data/accounts'
import { businessUnits } from '@/entity-data/business-units'
import { teams } from '@/entity-data/teams'
import { themes } from '@/entity-data/themes'
import { users } from '@/entity-data/users'
import type { Project } from '@/entity-types/project'
import { DatePicker } from '@/components/date-picker'
import {
  Save,
  Info,
  Wrench,
  Users,
  Flag,
  DollarSign,
  Clock,
  TrendingUp,
  Link2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
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
import { useProjects } from '@/features/projects/components/projects-provider'

const PROJECT_TYPES = [
  { label: 'Lean', value: 'Lean' },
  { label: 'GB', value: 'GB' },
  { label: 'BB', value: 'BB' },
] as const

const SERVICE_LINES = [
  { label: 'Consulting', value: 'Consulting' },
  { label: 'Analytics', value: 'Analytics' },
  { label: 'Integration', value: 'Integration' },
  { label: 'Automation', value: 'Automation' },
  { label: 'Compliance', value: 'Compliance' },
] as const

const PROCESSES = [
  { label: 'Order to Cash', value: 'Order to Cash' },
  { label: 'Record to Report', value: 'Record to Report' },
  { label: 'Purchase to Pay', value: 'Purchase to Pay' },
  { label: 'Lead to Cash', value: 'Lead to Cash' },
] as const

const STAGES = [
  { label: 'Define', value: 'Define' },
  { label: 'Measure', value: 'Measure' },
  { label: 'Analyze', value: 'Analyze' },
  { label: 'Improve', value: 'Improve' },
  { label: 'Control', value: 'Control' },
] as const

const STATUSES = [
  { label: 'As-Is Assessment', value: 'As-Is Assessment' },
  { label: 'To-Be Design', value: 'To-Be Design' },
  { label: 'SOP Creation', value: 'SOP Creation' },
  { label: 'IT Setup', value: 'IT Setup' },
  { label: 'Coding To Be Started', value: 'Coding To Be Started' },
  { label: 'Coding', value: 'Coding' },
  { label: 'UAT', value: 'UAT' },
  { label: 'Deployed', value: 'Deployed' },
  { label: 'To Be Started', value: 'To Be Started' },
  { label: 'Dropped', value: 'Dropped' },
  { label: 'On Hold', value: 'On Hold' },
] as const

const SIGN_OFF_STATUSES = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Define Signed Off', value: 'Define Signed Off' },
  { label: 'Final Signed Off', value: 'Final Signed Off' },
] as const

const TECH_SOLUTIONS = [
  { label: 'Agentic AI', value: 'Agentic AI' },
  { label: 'GenAI', value: 'GenAI' },
  { label: 'Workflow', value: 'Workflow' },
  { label: 'RPA', value: 'RPA' },
  { label: 'QPA', value: 'QPA' },
] as const

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  project_type: z.string().min(1, 'Project type is required.'),
  service_line: z.string().optional(),
  process: z.string().optional(),
  tech_solution: z.string().optional(),
  progear_id: z.string().optional(),
  ops_mentor: z.string().optional(),
  sdl_name: z.string().optional(),
  digital_manager: z.string().optional(),
  bb: z.string().optional(),
  stage: z.string().optional(),
  status: z.string().optional(),
  status_reason: z.string().optional(),
  sign_off_status: z.string().optional(),
  is_billiable: z.boolean().optional(),
  is_external: z.boolean().optional(),
  cost: z.number().nullable().optional(),
  revenue: z.number().nullable().optional(),
  estimated_hours: z.number().nullable().optional(),
  initial_hours: z.number().nullable().optional(),
  actual_hours: z.number().nullable().optional(),
  one_time_cost: z.number().nullable().optional(),
  potential_fte_saving: z.number().nullable().optional(),
  actual_fte_saving: z.number().nullable().optional(),
  actual_released_hc: z.number().nullable().optional(),
  in_scope_fte: z.number().nullable().optional(),
  business_impact: z.number().nullable().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  business_unit_id: z.string().min(1, 'Business unit is required.'),
  account_id: z.string().min(1, 'Account is required.'),
  theme_id: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof createProjectSchema>

type ProjectDetailFormProps = {
  project: Project
}

function NumberField({
  control,
  name,
  label,
  placeholder,
}: {
  control: Control<ProjectFormValues>
  name: keyof ProjectFormValues
  label: string
  placeholder?: string
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type='number'
              placeholder={placeholder ?? '0'}
              className='mt-1.5'
              value={field.value != null ? String(field.value) : ''}
              onChange={(e) => {
                const val = e.target.value
                field.onChange(val === '' ? null : Number(val))
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function SelectField({
  control,
  name,
  label,
  options,
  placeholder,
}: {
  control: Control<ProjectFormValues>
  name: keyof ProjectFormValues
  label: string
  options: readonly { label: string; value: string }[]
  placeholder?: string
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
            {label}
          </FormLabel>
          <Select
            onValueChange={(v) => field.onChange(v || undefined)}
            value={(field.value as string) ?? ''}
          >
            <FormControl>
              <SelectTrigger className='mt-1.5 w-full'>
                <SelectValue placeholder={placeholder ?? 'Select...'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
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
  )
}

function CardSection({
  title,
  children,
  icon,
}: {
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-base font-semibold'>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 pt-0'>{children}</CardContent>
    </Card>
  )
}

export function ProjectDetailForm({ project }: ProjectDetailFormProps) {
  const navigate = useNavigate()
  const { updateProject } = useProjects()

  // Get team members for this project
  const projectTeamUserIds = useMemo(() => {
    return teams
      .filter((t) => t.project_id === project.id)
      .map((t) => t.user_id)
  }, [project.id])

  const teamMembers = useMemo(() => {
    return users.filter((u) => projectTeamUserIds.includes(u.id))
  }, [projectTeamUserIds])

  const bbOptions = useMemo(() => {
    return teamMembers
      .filter((u) => u.department === 'LDT')
      .map((u) => ({ label: `${u.first_name} ${u.last_name}`, value: u.id }))
  }, [teamMembers])

  const digitalManagerOptions = useMemo(() => {
    return teamMembers
      .filter((u) => u.department === 'Digital')
      .map((u) => ({ label: `${u.first_name} ${u.last_name}`, value: u.id }))
  }, [teamMembers])

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project.name,
      project_type: project.project_type,
      service_line: project.service_line ?? '',
      process: project.process ?? '',
      tech_solution: project.tech_solution ?? '',
      progear_id: project.progear_id ?? '',
      ops_mentor: project.ops_mentor ?? '',
      sdl_name: project.sdl_name ?? '',
      digital_manager: project.digital_manager ?? '',
      bb: project.bb ?? '',
      stage: project.stage ?? '',
      status: project.status ?? '',
      status_reason: project.status_reason ?? '',
      sign_off_status: project.sign_off_status ?? '',
      is_billiable: project.is_billiable,
      is_external: project.is_external,
      cost: project.cost,
      revenue: project.revenue,
      estimated_hours: project.estimated_hours,
      initial_hours: project.initial_hours,
      actual_hours: project.actual_hours,
      one_time_cost: project.one_time_cost,
      potential_fte_saving: project.potential_fte_saving,
      actual_fte_saving: project.actual_fte_saving,
      actual_released_hc: project.actual_released_hc,
      in_scope_fte: project.in_scope_fte,
      business_impact: project.business_impact,
      start_date: project.start_date ?? '',
      end_date: project.end_date ?? '',
      business_unit_id: project.business_unit_id,
      account_id: project.account_id,
      theme_id: project.theme_id ?? '',
    },
  })

  const selectedBuId = form.watch('business_unit_id')
  const accountOptions = selectedBuId
    ? accounts.filter((a) => a.business_unit_id === selectedBuId)
    : []

  function onSubmit(data: ProjectFormValues) {
    updateProject(project.id, {
      ...data,
      service_line: data.service_line || null,
      process: data.process || null,
      tech_solution: data.tech_solution || null,
      progear_id: data.progear_id || null,
      ops_mentor: data.ops_mentor || null,
      sdl_name: data.sdl_name || null,
      digital_manager: data.digital_manager || null,
      bb: data.bb || null,
      stage: data.stage || null,
      status: data.status || null,
      status_reason: data.status_reason || '',
      sign_off_status: data.sign_off_status || null,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      theme_id: data.theme_id || null,
    })
    toast.success('Project saved')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        {/* Basic Info */}
        <div>
          <CardSection
            title='Basic Information'
            icon={<Info className='h-4 w-4 text-emerald-600' />}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='sm:col-span-2'>
                    <FormLabel className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                      Project Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter project name'
                        className='mt-1.5'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SelectField
                control={form.control}
                name='project_type'
                label='Project Type *'
                options={PROJECT_TYPES}
                placeholder='Select type'
              />
              <SelectField
                control={form.control}
                name='service_line'
                label='Service Line'
                options={SERVICE_LINES}
                placeholder='Select...'
              />
              <SelectField
                control={form.control}
                name='process'
                label='Process'
                options={PROCESSES}
                placeholder='Select...'
              />
            </div>
          </CardSection>
        </div>

        {/* Technical */}
        <div>
          <CardSection
            title='Technical Details'
            icon={<Wrench className='h-4 w-4 text-blue-600' />}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <SelectField
                control={form.control}
                name='tech_solution'
                label='Tech Solution'
                options={TECH_SOLUTIONS}
                placeholder='Select...'
              />
              <FormField
                control={form.control}
                name='progear_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progear ID</FormLabel>
                    <FormControl>
                      <Input placeholder='PG-XXX' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardSection>
        </div>

        {/* Team */}
        <div>
          <CardSection
            title='Team Members'
            icon={<Users className='h-4 w-4 text-violet-600' />}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='ops_mentor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ops Mentor</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter name' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='sdl_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SDL Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter name' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <SelectField
                control={form.control}
                name='digital_manager'
                label='Digital Manager'
                options={digitalManagerOptions}
                placeholder='Select...'
              />
              <SelectField
                control={form.control}
                name='bb'
                label='BB (LDT)'
                options={bbOptions}
                placeholder='Select...'
              />
            </div>
          </CardSection>
        </div>

        {/* Status */}
        <div>
          <CardSection
            title='Project Status'
            icon={<Flag className='h-4 w-4 text-amber-600' />}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <SelectField
                control={form.control}
                name='stage'
                label='Stage'
                options={STAGES}
                placeholder='Select...'
              />
              <SelectField
                control={form.control}
                name='status'
                label='Status'
                options={STATUSES}
                placeholder='Select...'
              />
              <FormField
                control={form.control}
                name='status_reason'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Reason</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter reason' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <SelectField
                control={form.control}
                name='sign_off_status'
                label='Sign-off Status'
                options={SIGN_OFF_STATUSES}
                placeholder='Select...'
              />
            </div>
          </CardSection>
        </div>

        {/* Financial */}
        <div>
          <CardSection
            title='Financial'
            icon={<DollarSign className='h-4 w-4 text-green-600' />}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='is_billiable'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-sm font-medium'>
                        Billable
                      </FormLabel>
                      <FormDescription className='text-xs'>
                        Project charges clients for time
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        className='ml-2'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='is_external'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-sm font-medium'>
                        External
                      </FormLabel>
                      <FormDescription className='text-xs'>
                        External client project
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        className='ml-2'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <NumberField
                control={form.control}
                name='cost'
                label='Cost ($)'
              />
              <NumberField
                control={form.control}
                name='revenue'
                label='Revenue ($)'
              />
              <NumberField
                control={form.control}
                name='one_time_cost'
                label='One-time Cost ($)'
              />
            </div>
          </CardSection>
        </div>

        {/* Hours */}
        <div>
          <CardSection
            title='Hours Tracking'
            icon={<Clock className='h-4 w-4 text-cyan-600' />}
          >
            <div className='grid gap-4 sm:grid-cols-3'>
              <NumberField
                control={form.control}
                name='estimated_hours'
                label='Estimated Hours'
              />
              <NumberField
                control={form.control}
                name='initial_hours'
                label='Initial Hours'
              />
              <NumberField
                control={form.control}
                name='actual_hours'
                label='Actual Hours'
              />
            </div>
          </CardSection>
        </div>

        {/* FTE & Impact */}
        <div>
          <CardSection
            title='FTE & Impact'
            icon={<TrendingUp className='h-4 w-4 text-rose-600' />}
          >
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <NumberField
                control={form.control}
                name='potential_fte_saving'
                label='Potential FTE Saving'
              />
              <NumberField
                control={form.control}
                name='actual_fte_saving'
                label='Actual FTE Saving'
              />
              <NumberField
                control={form.control}
                name='actual_released_hc'
                label='Actual Released HC'
              />
              <NumberField
                control={form.control}
                name='in_scope_fte'
                label='In-scope FTE'
              />
              <NumberField
                control={form.control}
                name='business_impact'
                label='Business Impact ($)'
              />
            </div>
          </CardSection>
        </div>

        {/* Dates */}
        <div>
          <CardSection
            title='Project Timeline'
            icon={<Clock className='h-4 w-4 text-orange-600' />}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value ? parseISO(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        placeholder='Select start date'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='end_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value ? parseISO(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        placeholder='Select end date'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardSection>
        </div>

        {/* Relations */}
        <div>
          <CardSection
            title='Relationships'
            icon={<Link2 className='h-4 w-4 text-indigo-600' />}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='business_unit_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                      Business Unit *
                    </FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v)
                        form.setValue('account_id', '')
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='mt-1.5 w-full'>
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
                    <FormLabel className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                      Account *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedBuId}
                    >
                      <FormControl>
                        <SelectTrigger className='mt-1.5 w-full'>
                          <SelectValue placeholder='Select account' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accountOptions.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SelectField
                control={form.control}
                name='theme_id'
                label='Theme'
                options={themes.map((t) => ({ label: t.name, value: t.id }))}
                placeholder='Select...'
              />
            </div>
          </CardSection>
        </div>

        {/* Save Button */}
        <div className='flex justify-end gap-3 pt-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate({ to: '/projects' })}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button type='submit' className='cursor-pointer'>
            <Save className='mr-2 h-4 w-4' />
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
