# Project Management Feature — Design

**Date:** 2025-03-08  
**Status:** Approved

## Goal

Add Project CRUD and list/detail UX: create via modal (minimal fields), view and edit on a detail route, manage project members from the list. Modern, clean UI with a premium feel.

## Decisions Summary

| Topic | Choice |
|-------|--------|
| Detail page | Always-editable form; stay on same page after save (B) |
| Team management | Separate entry from list row — "Manage members" opens drawer (B) |
| Create modal | Minimal required fields only; redirect to detail to complete (A) |
| List/detail structure | List route + param detail route — Approach 1 |

---

## 1. Architecture & Routes

- **Feature module:** `src/features/projects/` (same level as `users`, `tasks`). Contains list view, table/columns, create modal, detail page, and team-management entry plus data/types.
- **Routes:**
  - `GET /projects` — List page (table, filters, pagination, "New Project", row actions).
  - `GET /projects/$projectId` — Project detail page; full-page editable form; after create, redirect here.
- **Data:** Use `src/entity-types/project.ts` and `team.ts`. Add `projects.ts` (and optionally `teams.ts`) under `src/entity-data/`, export from `entity-data/index.ts`. List and detail read/write from this source (in-memory; use provider or simple store when no backend).
- **Nav:** Sidebar already has "Projects" → `/projects`. Row click (e.g. name) or "View" goes to `/projects/$projectId`; detail save stays on same page.

---

## 2. List Page

- **Default columns (left to right):** Name (link to detail), Business Unit (name), Account (name), Project Type, Status, Stage, Start / End date (short), Billable (yes/no or icon). Column visibility configurable (same as Users/Tasks).
- **Filters:** URL-synced column filters for `project_type`, `status`, `business_unit_id` (multi), optional `name` search. Pagination: `page`, `pageSize` via `useTableUrlState`.
- **Row actions (⋮):** View/Edit → navigate to `/projects/$projectId`; Manage members → open team drawer; Delete → confirm dialog, then stay on list.
- **Primary action:** "New Project" only, opens create modal.
- **Bulk actions:** Optional bulk delete; can be omitted initially.

---

## 3. Create Modal

- **Trigger:** "New Project" on list opens a modal (same Dialog style as Users).
- **Fields (minimal):** Name (required), Business Unit (required, select from entity-data), Account (required, select; filter by selected Business Unit), Project Type (required, select or combobox with preset options e.g. Delivery, Internal, PoC).
- **Validation:** Name non-empty; Business Unit, Account, Project Type required; show errors under fields.
- **Submit:** Create new project (id e.g. nanoid), other fields `null` or defaults (`status_reason: ''`, `is_billiable: false`, `is_external: false`). Persist to in-memory source, close modal, **navigate to `/projects/{newId}`** so user completes and saves on detail.
- **Layout:** Single-column form in modal, labels above controls, "Create" / "Cancel".

---

## 4. Detail Page

- **Route & load:** `/projects/$projectId`. Resolve project by id; if missing show Not Found or redirect to `/projects`. Same Header as list (Search, Theme, Profile).
- **Layout:** Two-column layout on desktop:
  - **Left (main):** Editable form sections
  - **Right (sidebar):** Project summary card + Team members quick view
- **Form groups (collapsible cards):**
  - **Basic Info:** name, project_type, service_line, process
  - **Technical:** tech_solution, progear_id
  - **Team:** ops_mentor, sdl_name, digital_manager, bb
  - **Status:** stage, status, status_reason, sign_off_status
  - **Financial:** is_billiable, is_external, cost, revenue, one_time_cost
  - **Hours:** estimated_hours, initial_hours, actual_hours
  - **FTE & Impact:** potential_fte_saving, actual_fte_saving, actual_released_hc, in_scope_fte, business_impact
  - **Dates:** start_date, end_date
  - **Relations:** business_unit_id, account_id (read-only), theme_id
- **Team Members Panel (sidebar):**
  - List of assigned users with avatar/initials
  - Add/Remove members button → opens member selection dialog
  - Users selected from `users` entity, filtered by those not yet assigned
- **Team Members Dialog:** Multi-select list of all users, search/filter by name, checkboxes to add/remove
- **Save:** Explicit "Save" button; write to in-memory source, stay on page, optional toast; validation errors under fields.

---

## 5. Team Management

- **Entry points:**
  1. Detail page sidebar (primary) — team members panel with add/remove buttons
  2. List row "Manage members" in ⋮ menu — opens dialog/drawer
- **UI (Dialog/Drawer):** Title shows project name + "Members". Add/remove users for this project only.
- **Content:** List current members (from `teams` for this `project_id`, show user name/SSO from users data). Per-row "Remove". "Add member" — pick user from list (users data), add to teams.
- **Data:** Only `teams` (project_id, user_id) created/removed; projects unchanged.

---

## 6. Data

- **`src/entity-data/projects.ts`:** Export `projects: Project[]` (type from entity-types). Add 5–8 sample rows with varied business_unit_id, account_id, project_type, status, stage, dates, billable; ids like `proj-001`; references valid in business-units and accounts.
- **`src/entity-data/teams.ts`:** Export `teams: Team[]`. Sample rows linking project_id to projects and user_id to users.
- **`src/entity-data/index.ts`:** Export `projects` and `teams`.
- **Writes:** All create/update/delete and team add/remove update in-memory state (e.g. React state or Zustand seeded from entity-data); page refresh resets to initial samples unless persistence is added later.

---

## Entity Types Reference

- **Project:** `src/entity-types/project.ts` (id, name, service_line, process, project_type, tech_solution, progear_id, ops_mentor, sdl_name, sign_off_status, bb, digital_manager, is_billiable, is_external, cost, revenue, estimated_hours, initial_hours, actual_hours, one_time_cost, potential_fte_saving, actual_fte_saving, actual_released_hc, in_scope_fte, business_impact, stage, status, status_reason, start_date, end_date, theme_id, business_unit_id, account_id).
- **Team:** `src/entity-types/team.ts` (id, project_id, user_id).
- **Existing:** `business-units.ts`, `accounts.ts`, `users.ts` in entity-data; use for dropdowns and team member list.
