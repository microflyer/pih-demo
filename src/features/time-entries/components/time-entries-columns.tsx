import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { projects } from '@/entity-data/projects'
import { DataTableRowActions } from './time-entries-row-actions'
import type { TimeEntry } from '@/entity-types/time-entry'

export const timeEntriesColumns: ColumnDef<TimeEntry>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as string
      return <span>{date}</span>
    },
  },
  {
    accessorKey: 'project_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => {
      const projectId = row.original.project_id
      const project = projects.find((p) => p.id === projectId)
      return <span>{project?.name ?? '-'}</span>
    },
  },
  {
    accessorKey: 'activity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity" />
    ),
    cell: ({ row }) => {
      const activity = row.getValue('activity') as string
      return <span>{activity}</span>
    },
  },
  {
    accessorKey: 'hours',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hours" />
    ),
    cell: ({ row }) => {
      const hours = row.getValue('hours') as number
      return <span className="font-medium">{hours.toFixed(1)}h</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
