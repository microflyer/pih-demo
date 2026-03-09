import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Switch } from '@/components/ui/switch'
import { businessUnits } from '@/entity-data/business-units'
import { accounts } from '@/entity-data/accounts'
import { themes } from '@/entity-data/themes'
import type { Project } from '@/entity-types/project'
import { useProjectsStore } from '@/stores/projects-store'
import {
  projectDetailFormSchema,
  type ProjectDetailFormValues,
} from './project-detail-form-schema'

const PROJECT_TYPES = [
  'Delivery',
  'Internal',
  'Proof of Concept',
] as const

function projectToFormValues(project: Project): ProjectDetailFormValues {
  return {
    name: project.name,
    service_line: project.service_line ?? '',
    process: project.process ?? '',
    project_type: project.project_type,
    tech_solution: project.tech_solution ?? '',
    progear_id: project.progear_id ?? '',
    ops_mentor: project.ops_mentor ?? '',
    sdl_name: project.sdl_name ?? '',
    sign_off_status: project.sign_off_status ?? '',
    bb: project.bb ?? '',
    digital_manager: project.digital_manager ?? '',
    is_billiable: project.is_billiable,
    is_external: project.is_external,
    status: project.status ?? '',
    status_reason: project.status_reason ?? '',
    stage: project.stage ?? '',
    business_unit_id: project.business_unit_id,
    account_id: project.account_id,
    cost: project.cost ?? undefined,
    revenue: project.revenue ?? undefined,
    estimated_hours: project.estimated_hours ?? undefined,
    initial_hours: project.initial_hours ?? undefined,
    actual_hours: project.actual_hours ?? undefined,
    one_time_cost: project.one_time_cost ?? undefined,
    potential_fte_saving: project.potential_fte_saving ?? undefined,
    actual_fte_saving: project.actual_fte_saving ?? undefined,
    actual_released_hc: project.actual_released_hc ?? undefined,
    in_scope_fte: project.in_scope_fte ?? undefined,
    business_impact: project.business_impact ?? undefined,
    start_date: project.start_date ?? '',
    end_date: project.end_date ?? '',
    theme_id: project.theme_id ?? '__none__',
  }
}

function formValuesToPatch(
  data: ProjectDetailFormValues
): Partial<Project> {
  const num = (v: number | null | undefined) =>
    v === undefined || v === null || Number.isNaN(v) ? null : v
  const str = (v: string | null | undefined) =>
    v === undefined || v === null ? null : v === '' ? null : v
  return {
    name: data.name,
    service_line: str(data.service_line),
    process: str(data.process),
    project_type: data.project_type,
    tech_solution: str(data.tech_solution),
    progear_id: str(data.progear_id),
    ops_mentor: str(data.ops_mentor),
    sdl_name: str(data.sdl_name),
    sign_off_status: str(data.sign_off_status),
    bb: str(data.bb),
    digital_manager: str(data.digital_manager),
    is_billiable: data.is_billiable,
    is_external: data.is_external,
    status: str(data.status),
    status_reason: data.status_reason ?? '',
    stage: str(data.stage),
    business_unit_id: data.business_unit_id,
    account_id: data.account_id,
    cost: num(data.cost as number | null),
    revenue: num(data.revenue as number | null),
    estimated_hours: num(data.estimated_hours as number | null),
    initial_hours: num(data.initial_hours as number | null),
    actual_hours: num(data.actual_hours as number | null),
    one_time_cost: num(data.one_time_cost as number | null),
    potential_fte_saving: num(data.potential_fte_saving as number | null),
    actual_fte_saving: num(data.actual_fte_saving as number | null),
    actual_released_hc: num(data.actual_released_hc as number | null),
    in_scope_fte: num(data.in_scope_fte as number | null),
    business_impact: num(data.business_impact as number | null),
    start_date: str(data.start_date),
    end_date: str(data.end_date),
    theme_id: data.theme_id === '__none__' || !data.theme_id ? null : data.theme_id,
  }
}

type ProjectDetailFormProps = {
  project: Project
}

export function ProjectDetailForm({ project }: ProjectDetailFormProps) {
  const updateProject = useProjectsStore((s) => s.updateProject)

  const form = useForm<ProjectDetailFormValues>({
    resolver: zodResolver(projectDetailFormSchema),
    defaultValues: projectToFormValues(project),
  })

  useEffect(() => {
    form.reset(projectToFormValues(project))
    // Reset form when navigating to a different project (by id only to avoid reset on store updates)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- project.id is intentional
  }, [project.id])

  const selectedBuId = form.watch('business_unit_id')
  const accountOptionsFiltered = selectedBuId
    ? accounts.filter((a) => a.business_unit_id === selectedBuId)
    : []

  function onSubmit(data: ProjectDetailFormValues) {
    updateProject(project.id, formValuesToPatch(data))
    toast.success('Project saved')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
      >
        <Card>
          <CardHeader>
            <CardTitle>Basic info</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
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
              name='project_type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROJECT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
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
              name='service_line'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service line</FormLabel>
                  <FormControl>
                    <Input placeholder='Service line' {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='process'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Process</FormLabel>
                  <FormControl>
                    <Input placeholder='Process' {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tech_solution'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech solution</FormLabel>
                  <FormControl>
                    <Input placeholder='Tech solution' {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='progear_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progear ID</FormLabel>
                  <FormControl>
                    <Input placeholder='Progear ID' {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ops_mentor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ops mentor</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sdl_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SDL name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sign_off_status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sign off status</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
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
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='digital_manager'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digital manager</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status_reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status reason</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='is_billiable'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <FormLabel>Billable</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='is_external'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <FormLabel>External</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business & account</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='business_unit_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business unit</FormLabel>
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
                  <FormLabel>Account</FormLabel>
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
                      {accountOptionsFiltered.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financials & hours</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            {(
              [
                'cost',
                'revenue',
                'estimated_hours',
                'initial_hours',
                'actual_hours',
                'one_time_cost',
                'potential_fte_saving',
                'actual_fte_saving',
                'actual_released_hc',
                'in_scope_fte',
                'business_impact',
              ] as const
            ).map((name) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='capitalize'>
                      {name.replace(/_/g, ' ')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dates & theme</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='start_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='end_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='theme_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? '__none__'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select theme' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='__none__'>None</SelectItem>
                      {themes.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className='flex justify-end'>
          <Button type='submit'>Save</Button>
        </div>
      </form>
    </Form>
  )
}
