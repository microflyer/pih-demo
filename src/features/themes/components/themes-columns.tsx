import { type ColumnDef } from '@tanstack/react-table'
import type { Theme } from '@/entity-types/theme'
import { Badge } from '@/components/ui/badge'
import { DataTableRowActions } from './data-table-row-actions'

export const themesColumns: ColumnDef<Theme>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <Badge variant={type === 'project' ? 'default' : 'secondary'}>
          {type === 'project' ? 'Project' : 'Non-Project'}
        </Badge>
      )
    },
    filterFn: 'includesString',
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
