# Project Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Project CRUD: list with filters, create via modal (minimal fields) with redirect to detail, detail page as full editable form, and team management via drawer from list row.

**Architecture:** Feature module under `src/features/projects/`; list route `/projects`, detail route `/projects/$projectId`; in-memory state (React state or Zustand) seeded from `src/entity-data/projects.ts` and `teams.ts`; create modal and team drawer use Dialog/Drawer from shadcn/ui.

**Tech Stack:** React, TypeScript, TanStack Router, TanStack Table, react-hook-form + zod, shadcn/ui, Tailwind CSS. Data from entity-types and entity-data (no backend).

**Design reference:** `docs/plans/2025-03-08-project-management-design.md`

---

## Task 1: Entity data — projects and teams

**Files:**
- Create: `src/entity-data/projects.ts`
- Create: `src/entity-data/teams.ts`
- Modify: `src/entity-data/index.ts`

**Step 1: Create `src/entity-data/projects.ts`**

- Import `Project` from `@/entity-types/project`.
- Export `projects: Project[]` with 5–8 sample items. Use ids `proj-001` … `proj-008`. Use valid `business_unit_id` and `account_id` from existing `business-units.ts` and `accounts.ts`. Vary `project_type` (e.g. "Delivery", "Internal", "Proof of Concept"), `status`, `stage`, `start_date`, `end_date`, `is_billiable`. Set `status_reason: ''` where needed; other nullable fields can be `null`.

**Step 2: Create `src/entity-data/teams.ts`**

- Import `Team` from `@/entity-types/team`.
- Export `teams: Team[]` with sample rows: `project_id` from projects above, `user_id` from `src/entity-data/users.ts` (e.g. `user-303016074`). Use unique `id` per row (e.g. `team-001`, `team-002`).

**Step 3: Export from index**

- In `src/entity-data/index.ts`, add:
  - `export { projects } from './projects'`
  - `export { teams } from './teams'`

**Step 4: Verify**

- Run: `pnpm exec tsc --noEmit`
- Expected: No type errors.

**Step 5: Commit**

```bash
git add src/entity-data/projects.ts src/entity-data/teams.ts src/entity-data/index.ts
git commit -m "feat(data): add projects and teams entity data"
```

---

## Task 2: Projects list route and feature shell

**Files:**
- Create: `src/routes/_authenticated/projects/index.tsx`
- Create: `src/features/projects/index.tsx`

**Step 1: Create list route**

- In `src/routes/_authenticated/projects/index.tsx`: use `createFileRoute('/_authenticated/projects/')`, define a search schema (e.g. `page`, `pageSize`, optional filters for later). Component: render `Projects` from `@/features/projects`.

**Step 2: Create feature entry**

- In `src/features/projects/index.tsx`: export a `Projects` component that renders a minimal list page: same layout as Users (Header with Search, Theme, Profile; Main with a title "Projects" and placeholder text). Import and use projects from `@/entity-data` for now (read-only display not required yet; can show count or nothing).

**Step 3: Verify**

- Run: `pnpm dev`, open `/projects`. Expected: page loads without error, shows Projects heading.

**Step 4: Commit**

```bash
git add src/routes/_authenticated/projects/index.tsx src/features/projects/index.tsx
git commit -m "feat(projects): add projects list route and feature shell"
```

---

## Task 3: Projects provider and in-memory state

**Files:**
- Create: `src/features/projects/components/projects-provider.tsx`

**Step 1: Implement provider**

- Create a React context that holds: `projects` and `setProjects` (state initialized from `entity-data` `projects`), `teams` and `setTeams` (from `entity-data` `teams`). Provide helpers: `addProject(project)`, `updateProject(id, patch)`, `removeProject(id)`, `getProjectById(id)`, and for teams: `getTeamByProjectId(projectId)`, `addTeamMember(projectId, userId)`, `removeTeamMember(projectId, userId)`. Use `useState`; seed from `import { projects as initialProjects, teams as initialTeams } from '@/entity-data'`.

**Step 2: Export and use**

- Export `ProjectsProvider` and `useProjects` (or similar name). Wrap the `Projects` list page content with `ProjectsProvider` in `src/features/projects/index.tsx`.

**Step 3: Verify**

- Run: `pnpm exec tsc --noEmit`. Expected: No errors.

**Step 4: Commit**

```bash
git add src/features/projects/components/projects-provider.tsx src/features/projects/index.tsx
git commit -m "feat(projects): add projects provider with in-memory state"
```

---

## Task 4: Projects table and columns

**Files:**
- Create: `src/features/projects/components/projects-columns.tsx`
- Create: `src/features/projects/components/projects-table.tsx`

**Step 1: Column definitions**

- In `projects-columns.tsx`, define TanStack Table columns for: select (checkbox), name (link to `/projects/$projectId`), business unit (resolve name from entity-data), account (resolve name), project_type, status, stage, start_date, end_date (formatted short), is_billiable (badge or icon). Use `DataTableColumnHeader` and existing UI components; follow `users-columns.tsx` patterns.

**Step 2: Table component**

- In `projects-table.tsx`, use `useReactTable` with data from props, columns from step 1, `useTableUrlState` for pagination and column filters (name text, project_type, status, business_unit_id as needed). Render Table, TableHeader, TableBody, DataTablePagination, DataTableToolbar. Accept `data`, `search`, `navigate` props like UsersTable.

**Step 3: Wire list page**

- In `src/features/projects/index.tsx`, use `useProjects()` to get projects, pass to `ProjectsTable` with route `search` and `navigate` from `getRouteApi('/_authenticated/projects/')`.

**Step 4: Verify**

- Run dev server, open `/projects`. Expected: Table shows project rows with correct columns.

**Step 5: Commit**

```bash
git add src/features/projects/components/projects-columns.tsx src/features/projects/components/projects-table.tsx src/features/projects/index.tsx
git commit -m "feat(projects): add projects table and columns"
```

---

## Task 5: Projects route search schema

**Files:**
- Modify: `src/routes/_authenticated/projects/index.tsx`

**Step 1: Align search schema with table**

- Add/update `validateSearch` with zod schema: `page`, `pageSize`, optional `name` (string), optional `project_type` (array or string per existing pattern), optional `status` (array), optional `business_unit_id` (array). Match keys used in `useTableUrlState` in projects-table.

**Step 2: Verify**

- Change page size or filter in UI; URL should update. Refresh; state should persist.

**Step 3: Commit**

```bash
git add src/routes/_authenticated/projects/index.tsx
git commit -m "feat(projects): add list route search schema for filters and pagination"
```

---

## Task 6: Row actions and primary button

**Files:**
- Create: `src/features/projects/components/data-table-row-actions.tsx`
- Create: `src/features/projects/components/projects-primary-buttons.tsx`
- Modify: `src/features/projects/components/projects-columns.tsx` (add row actions column)
- Modify: `src/features/projects/components/projects-provider.tsx` (dialog/drawer state)

**Step 1: Provider dialog state**

- In `projects-provider.tsx`, add state: `openDialog: 'create' | 'edit' | 'delete' | 'members' | null`, `currentProject: Project | null`. Provide setters so "New Project" opens create, row actions can open edit (navigate to detail), delete (open delete dialog), or members (open team drawer).

**Step 2: Row actions component**

- Create `data-table-row-actions.tsx`: dropdown with View/Edit (navigate to `/projects/$projectId`), Manage members (set current project and open members drawer), Delete (set current project and open delete dialog). Use `useNavigate` and provider context.

**Step 3: Primary buttons**

- Create `projects-primary-buttons.tsx`: single button "New Project" that sets openDialog to 'create' (or opens create modal via provider).

**Step 4: Add actions column**

- In `projects-columns.tsx`, add a column with `DataTableRowActions` (or inline actions) that receives the row.

**Step 5: Wire list page**

- In `src/features/projects/index.tsx`, render `ProjectsPrimaryButtons` in the header area and ensure table passes row actions.

**Step 6: Verify**

- Click "New Project" opens modal (modal implemented in next task). Row menu shows View/Edit, Manage members, Delete.

**Step 7: Commit**

```bash
git add src/features/projects/components/projects-provider.tsx src/features/projects/components/data-table-row-actions.tsx src/features/projects/components/projects-primary-buttons.tsx src/features/projects/components/projects-columns.tsx src/features/projects/index.tsx
git commit -m "feat(projects): add row actions and New Project button"
```

---

## Task 7: Create project modal

**Files:**
- Create: `src/features/projects/components/project-create-dialog.tsx`
- Modify: `src/features/projects/index.tsx` (render dialog)
- Modify: `src/features/projects/components/projects-provider.tsx` (expose open/close for create)

**Step 1: Create dialog component**

- Use `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`. Form fields: Name (Input), Business Unit (Select from `businessUnits`), Account (Select, options filtered by selected business_unit_id from `accounts`), Project Type (Select with options e.g. "Delivery", "Internal", "Proof of Concept"). Use react-hook-form + zod: name required, business_unit_id required, account_id required, project_type required.

**Step 2: Submit handler**

- On submit: generate id with `crypto.randomUUID()` (or `proj-` + short id). Build full `Project` with other fields `null` or defaults (`status_reason: ''`, `is_billiable: false`, `is_external: false`). Call provider `addProject(project)`, close dialog, `navigate(`/projects/${newId}`)`.

**Step 3: Wire to list page**

- Render `ProjectCreateDialog` when provider openDialog === 'create'. Pass onOpenChange to close.

**Step 4: Verify**

- Click "New Project", fill required fields, submit. Expected: redirect to `/projects/{newId}`. Detail page not built yet — can 404 or show placeholder.

**Step 5: Commit**

```bash
git add src/features/projects/components/project-create-dialog.tsx src/features/projects/components/projects-provider.tsx src/features/projects/index.tsx
git commit -m "feat(projects): add create project modal with redirect to detail"
```

---

## Task 8: Detail route and page shell

**Files:**
- Create: `src/routes/_authenticated/projects/$projectId.tsx`
- Create: `src/features/projects/detail/index.tsx` (or `project-detail.tsx`)

**Step 1: Create detail route**

- In `src/routes/_authenticated/projects/$projectId.tsx`, use `createFileRoute('/_authenticated/projects/$projectId')`. Component loads project by `params.projectId`. If not found, show not-found or redirect to `/projects`. Otherwise render detail component with project.

**Step 2: Detail page component**

- Detail component receives projectId (from route). It must read project from same source as list (provider is list-scoped; detail is separate route). Options: (a) use a shared store (Zustand) for projects/teams that both list and detail use, or (b) pass data via route loader. For simplicity, use a shared store or re-export same initial data and a way to get/update (e.g. a small projects store in `src/stores/` or context at root). Design doc says "in-memory state" — recommend adding a small Zustand store in `src/stores/projects-store.ts` that holds projects and teams, seeded from entity-data, and used by both list provider and detail page. Then detail page reads project by id from store; if missing, not found.

**Step 3: Detail shell**

- Render same Header as list. Main: title with project name, "Back to list" link to `/projects`, and placeholder for form (next task).

**Step 4: Verify**

- From list click name or View/Edit; expected: detail route loads. New project redirect from create should land here.

**Step 5: Commit**

```bash
git add src/routes/_authenticated/projects/\$projectId.tsx src/features/projects/detail/index.tsx src/stores/projects-store.ts
git commit -m "feat(projects): add detail route and page shell with shared store"
```

---

## Task 9: Detail page form — sections and save

**Files:**
- Create: `src/features/projects/detail/project-detail-form.tsx` (or split by section)
- Modify: `src/features/projects/detail/index.tsx`

**Step 1: Form schema**

- Zod schema matching Project (or a subset). All fields optional except name if required. Map form values to Project for update.

**Step 2: Sections**

- Basic info: name, service_line, process, project_type, tech_solution, progear_id, ops_mentor, sdl_name, sign_off_status, bb, digital_manager, is_billiable, is_external, status, status_reason, stage. Use Collapsible or card with heading.
- Business & account: business_unit_id, account_id (selects; account filtered by business_unit).
- Financials & hours: cost, revenue, estimated_hours, initial_hours, actual_hours, one_time_cost, potential_fte_saving, actual_fte_saving, actual_released_hc, in_scope_fte, business_impact. Number inputs.
- Dates & theme: start_date, end_date (DatePicker or input type date), theme_id if themes exist.

**Step 3: Layout**

- Use Form, FormField, FormItem, FormLabel, FormControl, FormMessage. Two-column grid where appropriate. "Back to list" and "Save" button. Save calls store update (or provider update), stay on page, optional toast.

**Step 4: Wire**

- Detail page loads project from store; pass to form as defaultValues. On save, update store and show success.

**Step 5: Verify**

- Edit fields and save. List page should show updated data when navigating back (same store).

**Step 6: Commit**

```bash
git add src/features/projects/detail/project-detail-form.tsx src/features/projects/detail/index.tsx
git commit -m "feat(projects): add detail form with sections and save"
```

---

## Task 10: Delete project dialog

**Files:**
- Create: `src/features/projects/components/project-delete-dialog.tsx`
- Modify: `src/features/projects/index.tsx` (render when openDialog === 'delete')
- Modify: `src/features/projects/components/projects-provider.tsx` (currentProject for delete)

**Step 1: Delete dialog**

- Dialog with title "Delete project?", description with project name. Confirm button calls provider/store `removeProject(id)`, close dialog, stay on list. Cancel closes dialog.

**Step 2: Wire**

- When openDialog === 'delete' and currentProject set, render ProjectDeleteDialog. On confirm, remove from store and close.

**Step 3: Verify**

- Row action Delete → confirm → project removed from list.

**Step 4: Commit**

```bash
git add src/features/projects/components/project-delete-dialog.tsx src/features/projects/index.tsx src/features/projects/components/projects-provider.tsx
git commit -m "feat(projects): add delete project dialog"
```

---

## Task 11: Team members drawer

**Files:**
- Create: `src/features/projects/components/project-members-drawer.tsx`
- Modify: `src/features/projects/index.tsx` (render when openDialog === 'members')

**Step 1: Drawer component**

- Use Sheet (right side) or Drawer. Title: project name + " — Members". List current members: from teams filter by project_id, map user_id to user display name (from entity-data users). Each row: name/sso, Remove button. "Add member" control: select user from users list (exclude already added); on select, add team row (generate id, project_id, user_id) and update store. No Save button; add/remove apply immediately.

**Step 2: Wire**

- When openDialog === 'members' and currentProject set, render ProjectMembersDrawer. On close, clear currentProject.

**Step 3: Verify**

- Row action "Manage members" opens drawer; add and remove members; list updates.

**Step 4: Commit**

```bash
git add src/features/projects/components/project-members-drawer.tsx src/features/projects/index.tsx
git commit -m "feat(projects): add team members drawer"
```

---

## Task 12: List page dialogs wiring and polish

**Files:**
- Create: `src/features/projects/components/projects-dialogs.tsx` (optional wrapper)
- Modify: `src/features/projects/index.tsx`

**Step 1: Centralize dialogs**

- Render create dialog, delete dialog, and members drawer from list page based on provider state (or keep inline). Ensure "New Project" opens create; row actions open edit (navigate), delete, or members correctly.

**Step 2: Sync list with store**

- List page must read projects from the same store used by create/detail/delete. If provider holds a local state copy, either lift store to be the single source (recommended) or ensure provider state is updated when returning from detail. Prefer single store (Zustand) for projects and teams so list, detail, create, delete, and members all stay in sync.

**Step 3: Verify**

- Full flow: create project → detail → edit and save → back to list → delete; manage members from list. No console errors; lint clean.

**Step 4: Commit**

```bash
git add src/features/projects/index.tsx
git commit -m "chore(projects): wire dialogs and ensure single source of truth for list"
```

---

## Task 13: Lint and route tree

**Files:**
- Modify: (any files with lint issues)
- Check: `src/routeTree.gen.ts` (generated; do not edit by hand)

**Step 1: Generate route tree**

- Run: `pnpm dev` or TanStack Router’s generate step if separate. Ensure `_authenticated/projects/` and `_authenticated/projects/$projectId` are present in route tree.

**Step 2: Lint**

- Run: `pnpm lint`
- Fix any reported issues.

**Step 3: Commit**

```bash
git add (changed files)
git commit -m "chore(projects): lint and route tree"
```

---

## Execution options

Plan saved to `docs/plans/2025-03-08-project-management.md`.

**Two ways to run it:**

1. **Subagent-driven (this session)** — I run one subagent per task, review between tasks, and iterate quickly.
2. **Parallel session (separate)** — You open a new session (e.g. in a worktree), use the executing-plans skill there, and run with checkpoints.

Which do you prefer?
