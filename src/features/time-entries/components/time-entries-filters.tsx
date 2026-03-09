import { useState } from 'react'
import { useTimeEntries } from './time-entries-provider'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format, parse } from 'date-fns'

interface DateFilterProps {
  label: string
  value: string | null
  onChange: (value: string | null) => void
}

function DateFilter({ label, value, onChange }: DateFilterProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  )

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected)
    if (selected) {
      onChange(format(selected, 'yyyy-MM-dd'))
    } else {
      onChange(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Label className="whitespace-nowrap">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className="w-40 justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function TimeEntriesFilters() {
  const { filters, setFilters, projects } = useTimeEntries()

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Date From */}
      <DateFilter
        label="From:"
        value={filters.dateFrom}
        onChange={(value) => updateFilter('dateFrom', value)}
      />

      {/* Date To */}
      <DateFilter
        label="To:"
        value={filters.dateTo}
        onChange={(value) => updateFilter('dateTo', value)}
      />

      {/* Project Filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="projectFilter" className="whitespace-nowrap">
          Project:
        </Label>
        <Select
          value={filters.projectId ?? ''}
          onValueChange={(value) => updateFilter('projectId', value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Has Project Filter */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="hasProjectFilter"
          checked={filters.hasProject ?? false}
          onCheckedChange={(checked) => {
            if (checked) {
              updateFilter('hasProject', true)
            } else {
              updateFilter('hasProject', null)
            }
          }}
        />
        <Label htmlFor="hasProjectFilter" className="whitespace-nowrap">
          Has Project
        </Label>
      </div>

      {/* Clear Filters */}
      {(filters.dateFrom || filters.dateTo || filters.projectId || filters.hasProject !== null) && (
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({
              dateFrom: null,
              dateTo: null,
              projectId: null,
              hasProject: null,
            })
          }
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}
