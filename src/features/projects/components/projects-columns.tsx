import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { accounts } from '@/entity-data/accounts'
import { businessUnits } from '@/entity-data/business-units'
import type { Project } from '@/entity-types/project'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

const businessUnitMap = new Map(businessUnits.map((bu) => [bu.id, bu.name]))
const accountMap = new Map(accounts.map((a) => [a.id, a.name]))

function formatShortDate(value: string | null): string {
  if (!value) return '—'
  try {
    const d = new Date(value)
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return value
  }
}

function formatCurrency(value: number | null): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number | null): string {
  if (value == null) return '—'
  return value.toLocaleString('en-US')
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className='text-muted-foreground'>—</span>

  const styles: Record<string, string> = {
    Active:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    Planning:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    Draft:
      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    Completed:
      'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
    'On Hold':
      'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
    Cancelled:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        styles[status] ||
          'border-slate-200 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      )}
    >
      {status}
    </span>
  )
}

function StageBadge({ stage }: { stage: string | null }) {
  if (!stage) return <span className='text-muted-foreground'>—</span>

  const styles: Record<string, string> = {
    Discovery:
      'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800',
    Proposal:
      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800',
    Execution:
      'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-200 dark:border-cyan-800',
    Closed:
      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        styles[stage] ||
          'border-slate-200 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      )}
    >
      {stage}
    </span>
  )
}

function ProjectTypeBadge({ type }: { type: string | null }) {
  if (!type) return <span className='text-muted-foreground'>—</span>

  const styles: Record<string, string> = {
    Delivery:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    Internal:
      'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800',
    'Proof of Concept':
      'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800',
    Lean: 'bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-800',
    GB: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
    BB: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        styles[type] ||
          'border-slate-200 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      )}
    >
      {type}
    </span>
  )
}

function BooleanBadge({ value }: { value: boolean | null }) {
  if (!value) return <span className='text-muted-foreground'>No</span>
  return (
    <span className='font-medium text-emerald-600 dark:text-emerald-400'>
      Yes
    </span>
  )
}

export const projectsColumns: ColumnDef<Project>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[1px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[1px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs text-muted-foreground'>
        {row.getValue('id') as string}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project Name' />
    ),
    cell: ({ row }) => {
      const project = row.original
      return (
        <Link
          to='/projects/$projectId'
          params={{ projectId: project.id }}
          className='cursor-pointer font-medium text-slate-700 hover:text-slate-900 hover:underline dark:text-slate-200 dark:hover:text-slate-100'
        >
          <LongText className='max-w-[200px]'>{project.name}</LongText>
        </Link>
      )
    },
    size: 250,
  },
  {
    id: 'business_unit',
    accessorFn: (row) =>
      businessUnitMap.get(row.business_unit_id) ?? row.business_unit_id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Business Unit' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>
        {businessUnitMap.get(row.original.business_unit_id) ??
          row.original.business_unit_id}
      </span>
    ),
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes(row.original.business_unit_id),
    size: 180,
  },
  {
    id: 'account',
    accessorFn: (row) => accountMap.get(row.account_id) ?? row.account_id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Account' />
    ),
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {accountMap.get(row.original.account_id) ?? row.original.account_id}
      </span>
    ),
    size: 180,
  },
  {
    accessorKey: 'project_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <ProjectTypeBadge type={row.getValue('project_type') as string | null} />
    ),
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 ||
      value.includes((row.getValue('project_type') as string) ?? ''),
    size: 140,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <StatusBadge status={row.getValue('status') as string | null} />
    ),
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 ||
      value.includes((row.getValue('status') as string) ?? ''),
    size: 100,
  },
  {
    accessorKey: 'stage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stage' />
    ),
    cell: ({ row }) => (
      <StageBadge stage={row.getValue('stage') as string | null} />
    ),
    size: 100,
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs'>
        {formatShortDate(row.original.start_date)}
      </span>
    ),
    size: 110,
  },
  {
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs'>
        {formatShortDate(row.original.end_date)}
      </span>
    ),
    size: 110,
  },
  {
    accessorKey: 'cost',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cost' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs'>
        {formatCurrency(row.original.cost)}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: 'revenue',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Revenue' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs'>
        {formatCurrency(row.original.revenue)}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: 'estimated_hours',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Est. Hours' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs'>
        {formatNumber(row.original.estimated_hours)}
      </span>
    ),
    size: 90,
  },
  {
    accessorKey: 'actual_hours',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actual Hours' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs'>
        {formatNumber(row.original.actual_hours)}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: 'is_billiable',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Billable' />
    ),
    cell: ({ row }) => <BooleanBadge value={row.original.is_billiable} />,
    size: 80,
  },
  {
    accessorKey: 'is_external',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='External' />
    ),
    cell: ({ row }) => <BooleanBadge value={row.original.is_external} />,
    size: 80,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
]
