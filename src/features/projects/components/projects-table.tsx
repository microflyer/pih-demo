import { useState } from 'react'
import {
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { businessUnits } from '@/entity-data/business-units'
import type { Project } from '@/entity-types/project'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { projectsColumns as columns } from './projects-columns'

type ProjectsTableProps = {
  data: Project[]
}

export function ProjectsTable({ data }: ProjectsTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder='Search projects...'
        searchKey='name'
        filters={[
          {
            columnId: 'project_type',
            title: 'Project Type',
            options: [
              { label: 'Lean', value: 'Lean' },
              { label: 'GB', value: 'GB' },
              { label: 'BB', value: 'BB' },
            ],
          },
          {
            columnId: 'status',
            title: 'Status',
            options: [
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
            ],
          },
          {
            columnId: 'business_unit',
            title: 'Business Unit',
            options: businessUnits.map((bu) => ({
              label: bu.name,
              value: bu.id,
            })),
          },
        ]}
      />
      <div className='rounded-md border border-border'>
        <Table className='audit-table'>
          <TableHeader className='bg-muted/50'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className='border-b border-border hover:bg-transparent'
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className='h-10 bg-muted/50 text-xs font-semibold tracking-wide text-muted-foreground uppercase'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'h-11 border-b border-border transition-colors duration-200',
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                    'cursor-pointer hover:bg-muted/40'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='py-1.5 text-sm'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
