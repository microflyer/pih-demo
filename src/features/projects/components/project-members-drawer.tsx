import { useState } from 'react'
import { users } from '@/entity-data'
import type { Project } from '@/entity-types/project'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useProjects } from './projects-provider'

type ProjectMembersDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
}

function userDisplayName(userId: string): string {
  const user = users.find((u) => u.id === userId)
  if (!user) return userId
  return `${user.first_name} ${user.last_name}`.trim() || user.sso
}

function userSso(userId: string): string {
  const user = users.find((u) => u.id === userId)
  return user?.sso ?? userId
}

export function ProjectMembersDrawer({
  open,
  onOpenChange,
  project,
}: ProjectMembersDrawerProps) {
  const { getTeamsByProjectId, addTeamMember, removeTeamMember } = useProjects()
  const [addValue, setAddValue] = useState('')

  if (!project) return null

  const members = getTeamsByProjectId(project.id)
  const memberUserIds = new Set(members.map((m) => m.user_id))
  const availableUsers = users.filter((u) => !memberUserIds.has(u.id))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col sm:max-w-md'>
        <SheetHeader className='text-start'>
          <SheetTitle>{project.name} — Members</SheetTitle>
          <SheetDescription>
            Add or remove team members. Changes apply immediately.
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-1 flex-col gap-4 overflow-hidden p-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Add member</label>
            <Select
              value={addValue}
              onValueChange={(userId) => {
                if (userId && userId !== '__none__') {
                  addTeamMember(project.id, userId)
                  setAddValue('')
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a user to add' />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.length === 0 ? (
                  <SelectItem value='__none__' disabled>
                    All users are already members
                  </SelectItem>
                ) : (
                  availableUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {`${u.first_name} ${u.last_name}`.trim() || u.sso} ({u.sso})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='min-h-0 flex-1 space-y-2 overflow-auto'>
            <label className='text-sm font-medium'>Current members</label>
            {members.length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                No members yet. Add one above.
              </p>
            ) : (
              <ul className='space-y-2'>
                {members.map((m) => (
                  <li
                    key={m.id}
                    className='flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2'
                  >
                    <span className='text-sm'>
                      {userDisplayName(m.user_id)}
                      <span className='text-muted-foreground ms-1'>
                        ({userSso(m.user_id)})
                      </span>
                    </span>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='text-destructive hover:text-destructive'
                      onClick={() => removeTeamMember(project.id, m.user_id)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
