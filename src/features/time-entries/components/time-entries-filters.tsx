import { useTimeEntries } from './time-entries-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

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
      <div className="flex items-center gap-2">
        <Label htmlFor="dateFrom" className="whitespace-nowrap">
          From:
        </Label>
        <Input
          id="dateFrom"
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={(e) => updateFilter('dateFrom', e.target.value || null)}
          className="w-36"
        />
      </div>

      {/* Date To */}
      <div className="flex items-center gap-2">
        <Label htmlFor="dateTo" className="whitespace-nowrap">
          To:
        </Label>
        <Input
          id="dateTo"
          type="date"
          value={filters.dateTo ?? ''}
          onChange={(e) => updateFilter('dateTo', e.target.value || null)}
          className="w-36"
        />
      </div>

      {/* Project Filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="projectFilter" className="whitespace-nowrap">
          Project:
        </Label>
        <Select
          value={filters.projectId ?? ''}
          onValueChange={(value) => updateFilter('projectId', value || null)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All projects</SelectItem>
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
