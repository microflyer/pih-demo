import { useMemo, useState } from 'react'
import { locations } from '@/entity-data/locations'
import { Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useProjects } from './projects-provider'

type ProjectLocationsFieldProps = {
  projectId: string
}

export function ProjectLocationsField({
  projectId,
}: ProjectLocationsFieldProps) {
  const { getLocationsByProjectId, addProjectLocation, removeProjectLocation } =
    useProjects()
  const [open, setOpen] = useState(false)

  const projectLocations = getLocationsByProjectId(projectId)

  const selectedLocationIds = useMemo(
    () => projectLocations.map((pll) => pll.location_id),
    [projectLocations]
  )

  const selectedLocations = useMemo(
    () =>
      projectLocations.map((pll) => {
        const location = locations.find((l) => l.id === pll.location_id)
        return { ...pll, locationName: location?.name ?? 'Unknown' }
      }),
    [projectLocations]
  )

  const availableLocations = useMemo(
    () => locations.filter((l) => !selectedLocationIds.includes(l.id)),
    [selectedLocationIds]
  )

  const handleAddLocation = (locationId: string) => {
    addProjectLocation(projectId, locationId)
  }

  const handleRemoveLocation = (id: string) => {
    removeProjectLocation(id)
  }

  return (
    <div className='space-y-2'>
      <label className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
        Locations
      </label>

      <div className='flex min-h-[42px] flex-wrap gap-2 rounded-md border border-input p-2'>
        {selectedLocations.length === 0 ? (
          <span className='p-1 text-sm text-muted-foreground'>
            No locations selected
          </span>
        ) : (
          selectedLocations.map((item) => (
            <Badge
              key={item.id}
              variant='secondary'
              className='gap-1 py-1 pr-1 pl-2'
            >
              {item.locationName}
              <Button
                variant='ghost'
                size='icon'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => handleRemoveLocation(item.id)}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          ))
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='h-8 gap-1'
            disabled={availableLocations.length === 0}
          >
            <Plus className='h-3 w-3' />
            Add Location
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' align='start'>
          <div className='max-h-[250px] overflow-y-auto p-2'>
            {availableLocations.length === 0 ? (
              <p className='p-2 text-sm text-muted-foreground'>
                All locations are selected
              </p>
            ) : (
              <div className='space-y-1'>
                {availableLocations.map((location) => (
                  <div
                    key={location.id}
                    className='flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent'
                    onClick={() => {
                      handleAddLocation(location.id)
                      if (availableLocations.length === 1) {
                        setOpen(false)
                      }
                    }}
                  >
                    <Checkbox id={location.id} />
                    <label
                      htmlFor={location.id}
                      className='flex-1 cursor-pointer text-sm'
                    >
                      {location.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
