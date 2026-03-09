# Time Entries Feature Design

## Overview

Add a "Time Entries" page under Projects in the sidebar that allows users to query and manage all their time entries with filtering, sorting, pagination, and CRUD operations.

---

## Sidebar Navigation

**File:** `src/components/layout/data/sidebar-data.ts`

Add "Time Entries" item in the "General" group under Projects:

```typescript
{
  title: 'General',
  items: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'My Time', url: '/my-time', icon: Clock },
    { title: 'Projects', url: '/projects', icon: Folder },
    { title: 'Time Entries', url: '/time-entries', icon: Calendar },
  ],
},
```

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header: "Time Entries"                    [+ Add Entry]    │
├─────────────────────────────────────────────────────────────┤
│ Filters:                                                   │
│ [Date From] - [Date To]  [Project ▼]  [Has Project ☑]    │
├─────────────────────────────────────────────────────────────┤
│ Time Entries Table:                                        │
│ ┌────────────┬────────────────────────┬────────────────┬──────┐
│ │ Date       │ Project               │ Activity       │ Hours│
│ ├────────────┼────────────────────────┼────────────────┼──────┤
│ │ 2026-03-09 │ NOMURA Digital Trans..│ Coding         │ 2.5h │
│ │ 2026-03-09 │ Coca Cola Process     │ Analysis       │ 3.0h │
│ │ 2026-03-08 │ Consumer Goods PoC    │ Workshop       │ 1.5h │
│ └────────────┴────────────────────────┴────────────────┴──────┘
│                                       [Prev] 1 [Next]     │
└─────────────────────────────────────────────────────────────┘
```

---

## Filters

- **Date From**: Date picker
- **Date To**: Date picker
- **Project**: Dropdown (all projects, or specific project)
- **Has Project**: Checkbox (filter by has_project flag)

---

## Time Entry Form (Create/Edit Dialog)

**Fields:**
- **Date**: Date picker (required, defaults to today)
- **has_project**: Checkbox (editable)
  - If **checked**: Show project dropdown (required), theme disabled, activity dropdown
  - If **unchecked**: Hide project dropdown, show theme dropdown, activity dropdown
- **Project**: Dropdown (when has_project is checked)
- **Theme**: Dropdown (disabled when has_project is checked, enabled otherwise)
- **Activity**: Dropdown (filtered by selected theme)
- **Hours**: Number input (supports decimals like 1.5, 3.2)
- **Comments**: Textarea (optional)

---

## Data Table Features

- **Columns**: Date, Project, Activity, Hours
- **Sorting**: By any column
- **Pagination**: Standard pagination
- **Row Actions**: Click to edit, delete button
- **URL State Sync**: Filters sync with URL params

---

## Component Structure

```
src/features/time-entries/
├── index.tsx                    # Main page component
├── components/
│   ├── time-entries-table.tsx   # Data table
│   ├── time-entries-columns.tsx  # Column definitions
│   ├── time-entries-dialogs.tsx  # Create/Edit dialogs
│   ├── time-entries-filters.tsx  # Filter bar
│   └── time-entries-provider.tsx # Context for state
└── lib/
    └── time-entries-utils.ts    # Helper functions
```

---

## State Management

- React Context for local CRUD state
- Reuse time entries from entity-data
- URL sync for filters (dateFrom, dateTo, projectId, hasProject)

---

## Design Decisions

1. **Filter by Date Range**: Allows users to view entries across multiple days
2. **has_project Toggle**: Enables filtering entries that are project-related vs non-project
3. **Editable has_project**: Provides flexibility for users to log time with or without a project
4. **URL State**: Filters persist in URL for shareability

---

## Route

**File:** `src/routes/_authenticated/time-entries.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { TimeEntries } from '@/features/time-entries'

export const Route = createFileRoute('/_authenticated/time-entries')({
  component: TimeEntries,
})
```
