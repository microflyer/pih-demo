import { type ColumnDef } from '@tanstack/react-table'
import type { BusinessUnit } from '@/entity-types/business-unit'
import { DataTableRowActions } from './data-table-row-actions'

export const businessUnitsColumns: ColumnDef<BusinessUnit>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'vp_name',
    header: 'VP Name',
    cell: ({ row }) => {
      const value = row.getValue('vp_name') as string
      return value || '—'
    },
    filterFn: 'includesString',
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
