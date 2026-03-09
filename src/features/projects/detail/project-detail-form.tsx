import { useState } from 'react'
import { z } from 'zod'
import { useForm, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { accounts } from '@/entity-data/accounts'
import { businessUnits } from '@/entity-data/business-units'
import { themes } from '@/entity-data/themes'
import type { Project } from '@/entity-types/project'
import { ChevronDown, ChevronRight, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type='number'
              placeholder={placeholder ?? '0'}
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
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(v) => field.onChange(v || undefined)}
            value={(field.value as string) ?? ''}
          >
            <FormControl>
              <SelectTrigger>
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

function CollapsibleSection({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='flex w-full justify-between px-4 py-3 font-semibold'
        >
          <span>{title}</span>
          {isOpen ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-4 px-4 pb-4'>
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function ProjectDetailForm({ project }: ProjectDetailFormProps) {
  const navigate = useNavigate()
  const { updateProject } = useProjects()

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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Basic Info */}
        <div className='rounded-md border'>
          <CollapsibleSection title='Basic Info' defaultOpen={true}>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Project name' {...field} />
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
          </CollapsibleSection>
        </div>

        {/* Technical */}
        <div className='rounded-md border'>
          <CollapsibleSection title='Technical'>
            <div className='grid gap-4 md:grid-cols-2'>
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
          </CollapsibleSection>
        </div>

        {/* Team */}
        <div className='rounded-md border'>
          <CollapsibleSection title='Team'>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='ops_mentor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ops Mentor</FormLabel>
                    <FormControl>
                      <Input placeholder='Name' {...field} />
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
                      <Input placeholder='Name' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='digital_manager'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Digital Manager</FormLabel>
                    <FormControl>
                      <Input placeholder='Name' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bb'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BB</FormLabel>
                    <FormControl>
                      <Input placeholder='Name' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleSection>
        </div>

        {/* Status */}
        <div className='rounded-md border'>
          <CollapsibleSection title='Status'>
            <div className='grid gap-4 md:grid-cols-2'>
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
                      <Input placeholder='Reason' {...field} />
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
          </CollapsibleSection>
        </div>

        {/* Financial */}
        <div className='rounded-md border'>
          <CollapsibleSection title='Financial'>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='is_billiable'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                    <FormControl>
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Billable</FormLabel>
                      <FormDescription>
                        This project charges clients for time
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='is_external'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                    <FormControl>
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>External</FormLabel>
                      <FormDescription>
                        This is an external client project
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <NumberField control={form.control} name='cost' label='Cost' />
              <NumberField
                control={form.control}
                name='revenue'
                label='Revenue'
              />
              <NumberField
                control={form.control}
                name='one_time_cost'
                label='One-time Cost'
              />
            </div>
          </CollapsibleSection>
        </div>

        {/* Hours */}
        <div className='rounded-md border'>
          <CollapsibleSection title='Hours'>
            <div className='grid gap-4 md:grid-cols-3'>
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
          </CollapsibleSection>
        </div>

        {/* FTE & Impact */}
        <div className='rounded-md border'>
          <CollapsibleSection title='FTE & Impact'>
            <div className='grid gap-4 md:grid-cols-3'>
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
                label='Business Impact'
              />
            </div>
          </CollapsibleSection>
        </div>

        {/* Dates */}
        <div className='rounded-md border'>
          <CollapsibleSection title='Dates'>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
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
                      <Input type='date' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleSection>
        </div>

        {/* Relations */}
        <div className='rounded-md border'>
          <CollapsibleSection title='Relations' defaultOpen={true}>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='business_unit_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Unit *</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v)
                        form.setValue('account_id', '')
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormLabel>Account *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedBuId}
                    >
                      <FormControl>
                        <SelectTrigger>
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
          </CollapsibleSection>
        </div>

        {/* Save Button */}
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate({ to: '/projects' })}
          >
            Cancel
          </Button>
          <Button type='submit'>
            <Save className='mr-2 h-4 w-4' />
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
