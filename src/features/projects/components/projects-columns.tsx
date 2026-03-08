import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { businessUnits } from '@/entity-data/business-units'
import { accounts } from '@/entity-data/accounts'
import type { Project } from '@/entity-types/project'
import { DataTableRowActions } from './data-table-row-actions'

const businessUnitMap = new Map(businessUnits.map((bu) => [bu.id, bu.name]))
const accountMap = new Map(accounts.map((a) => [a.id, a.name]))

function formatShortDate(value: string | null): string {
  if (!value) return '—'
  try {
    const d = new Date(value)
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return value
  }
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
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const project = row.original
      return (
        <Link
          to='/projects/$projectId'
          params={{ projectId: project.id }}
          className='font-medium text-primary hover:underline'
        >
          <LongText className='max-w-40'>{project.name}</LongText>
        </Link>
      )
    },
    meta: {
      className: cn(
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell'
      ),
    },
    enableHiding: false,
  },
  {
    id: 'business_unit',
    accessorFn: (row) => businessUnitMap.get(row.business_unit_id) ?? row.business_unit_id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Business Unit' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {businessUnitMap.get(row.original.business_unit_id) ?? row.original.business_unit_id}
      </span>
    ),
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes(row.original.business_unit_id),
  },
  {
    id: 'account',
    accessorFn: (row) => accountMap.get(row.account_id) ?? row.account_id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Account' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {accountMap.get(row.original.account_id) ?? row.original.account_id}
      </span>
    ),
  },
  {
    accessorKey: 'project_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project Type' />
    ),
    cell: ({ row }) => (
      <Badge variant='secondary' className='font-normal'>
        {row.getValue('project_type') as string}
      </Badge>
    ),
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes((row.getValue('project_type') as string) ?? ''),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string | null
      if (!status) return <span className='text-muted-foreground'>—</span>
      return (
        <Badge variant='outline' className='capitalize'>
          {status}
        </Badge>
      )
    },
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes((row.getValue('status') as string) ?? ''),
  },
  {
    accessorKey: 'stage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stage' />
    ),
    cell: ({ row }) => {
      const stage = row.getValue('stage') as string | null
      return (
        <span className='text-muted-foreground'>{stage ?? '—'}</span>
      )
    },
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground text-sm'>
        {formatShortDate(row.original.start_date)}
      </span>
    ),
  },
  {
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground text-sm'>
        {formatShortDate(row.original.end_date)}
      </span>
    ),
  },
  {
    accessorKey: 'is_billiable',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Billable' />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.is_billiable ? 'default' : 'secondary'}>
        {row.original.is_billiable ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
