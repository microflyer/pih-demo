import { type ColumnDef } from '@tanstack/react-table'
import { businessUnits } from '@/entity-data'
import type { Account } from '@/entity-types/account'
import { DataTableRowActions } from './data-table-row-actions'

const businessUnitMap = new Map(businessUnits.map((bu) => [bu.id, bu.name]))

export const accountsColumns: ColumnDef<Account>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'business_unit_id',
    header: 'Business Unit',
    cell: ({ row }) => {
      const businessUnitId = row.getValue('business_unit_id') as string
      return businessUnitMap.get(businessUnitId) || '—'
    },
    filterFn: 'includesString',
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
