# Project Location Multi-Select Design

## Overview

Add a location field to the Project detail form that displays selected locations as removable chips, with a dropdown to add new locations. The data follows the existing many-to-many relationship pattern (project-link-location).

## Architecture & Data Flow

**Data Storage:**
- Use existing `project-link-location.ts` schema (id, project_id, location_id) in `src/entity-data/`
- Create mock data: generate 1-3 location links per project
- Access via `projects-provider.ts` - add `getLocationsByProjectId`, `addLocation`, `removeLocation` functions

**UI Components:**
- **Chips Display**: Show selected locations as `Badge` components with X button to remove
- **Add Dropdown**: Use `Combobox` or `Select` with `multiple` mode to add locations
- **Location Field**: Place in "Relationships" section next to Theme

## Visual Design

```
┌─────────────────────────────────────────────────────┐
│ Locations                                           │
│ ┌───────────────────────────────────────────────┐   │
│ │ [China ×] [Japan ×] [Hong Kong ×]   + Add   │   │
│ └───────────────────────────────────────────────┘   │
│                                                    │
│ When "Add" clicked → dropdown shows all locations  │
│ Selected ones already shown as chips               │
```

- Chips: Rounded badges with remove (X) icon on right
- Add button: Opens dropdown with checkbox-style multi-select
- Empty state: Show "No locations selected" or just "+ Add Location"

## Implementation Steps

1. **Create mock data file** (`src/entity-data/project-link-locations.ts`)
   - Generate 5-8 records linking projects to random locations

2. **Update projects-provider.ts**
   - Add functions: `getLocationsByProjectId`, `addProjectLocation`, `removeProjectLocation`

3. **Create location field component** (`project-locations-field.tsx`)
   - Display chips for selected locations
   - Dropdown to add new locations
   - Remove button on each chip

4. **Integrate into ProjectDetailForm**
   - Add to "Relationships" card section
   - Handle save (locations saved separately from main form)

## Component Details

### project-locations-field.tsx

Props:
- `projectId`: string - Current project ID
- `onChange`: () => void - Callback when locations change

Features:
- Display selected locations as removable chips
- "Add Location" button opens Popover with Checkbox list
- Filter out already-selected locations from dropdown
- Real-time updates to provider state
