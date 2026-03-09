import { type ColumnDef } from '@tanstack/react-table'
import { themes } from '@/entity-data'
import type { ThemeActivity } from '@/entity-types/theme-activity'
import { DataTableRowActions } from './data-table-row-actions'

const themeMap = new Map(themes.map((t) => [t.id, t.name]))

export const themeActivitiesColumns: ColumnDef<ThemeActivity>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'theme_id',
    header: 'Theme',
    cell: ({ row }) => {
      const themeId = row.getValue('theme_id') as string
      return themeMap.get(themeId) || '—'
    },
    filterFn: 'includesString',
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
