# My Time Feature Design

## Overview

Add a new "My Time" page to the sidebar (under Dashboard) that allows users to log time entries against projects with collapsible project sections and a daily time summary.

---

## Data Model Changes

### TimeEntry Entity

**File:** `src/entity-types/time-entry.ts`

```typescript
export interface TimeEntry {
  id: string
  activity: string
  hours: number
  comments: string | null
  theme_id: string | null
  has_project: boolean
  project_id: string | null
  date: string  // YYYY-MM-DD format
}
```

### Project Mock Data

**File:** `src/entity-data/projects.ts`

Add `theme_id` to relevant projects. For example:
- `proj-001` (NOMURA Digital Transformation) → `theme_id: 'theme-001'`
- `proj-002` (Coca Cola) → `theme_id: 'theme-002'`
- etc.

---

## Sidebar Navigation

**File:** `src/components/layout/data/sidebar-data.ts`

Add "My Time" item in the "General" group, below Dashboard:

```typescript
{
  title: 'My Time',
  url: '/my-time',
  icon: Clock,  // from lucide-react
}
```

---

## Page Layout

```
┌─────────────────────────────────────────────────────┐
│ Header: "My Time"                    [Today: Mar 9] │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │         Time Stats Component (compact)          │ │
│ │   Total: 6.5h  ████████░░  Project A: 3.0h    │ │
│ │                         Project B: 2.0h          │ │
│ │                         Project C: 1.5h          │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ ▼ Project A (Coding)              [+ Add Time]      │
│   ├─ Activity: Solution Development    2.0h      │
│   └─ Activity: UAT Execution           1.0h      │
│ ▼ Project B (Analysis)              [+ Add Time]   │
│ ▶ ... collapsed                                      │
│ ▼ Project C                         [+ Add Time]   │
└─────────────────────────────────────────────────────┘
```

---

## Components

### 1. My Time Page (`src/features/my-time/index.tsx`)

- Main container with Header, TimeStats, and ProjectTimeList
- Uses MyTimeProvider for state management

### 2. Time Stats Component (`src/features/my-time/components/time-stats.tsx`)

- Compact horizontal bar visualization
- Shows total hours for the day
- Breakdown by project with mini bars
- Muted colors, clean design

### 3. Project Time List (`src/features/my-time/components/project-time-list.tsx`)

- Lists active projects (excludes: Deployed, Dropped, On Hold)
- Each project is collapsible using shadcn/ui Collapsible

### 4. Time Entry Dialog (`src/features/my-time/components/time-entry-dialog.tsx`)

**Fields:**
- **Theme**: Disabled dropdown, displays project's theme name
- **Activity**: Dropdown, filtered by project's theme_id
- **Hours**: Number input (supports decimals: 1.5, 3.2)
- **Comments**: Textarea for notes
- **has_project**: Checked and disabled (always true in this context)

### 5. My Time Provider (`src/features/my-time/providers/my-time-provider.tsx`)

- Manages time entries state
- Provides functions to add/delete entries
- Filters projects by status

---

## Route

**File:** `src/routes/_authenticated/my-time.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { MyTime } from '@/features/my-time'

export const Route = createFileRoute('/_authenticated/my-time')({
  component: MyTime,
})
```

---

## State Management

- React Context (MyTimeProvider) for local state
- Mock data for initial time entries
- In-memory only (no persistence)

---

## Filtering Logic

1. **Projects**: Filter out where `status` is 'Deployed', 'Dropped', or 'On Hold'
2. **Activities**: Filter by project's `theme_id`
3. **Time Entries**: Filter by selected date (default: today)

---

## UI Patterns

- Use existing shadcn/ui components (Collapsible, Dialog, Select, etc.)
- Follow existing page patterns from Projects feature
- Consistent header/search/filter bar at top
