import { users } from '@/entity-data/users'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useProjects } from './projects-provider'

function DepartmentBadge({ department }: { department: string | null }) {
  if (!department) return null

  const isLDT = department === 'LDT'

  return (
    <Badge
      className={`${
        isLDT
          ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
          : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
      } px-2 py-0 text-[10px] font-semibold uppercase tracking-wider`}
    >
      {department}
    </Badge>
  )
}

type TeamMembersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamMembersDialog({
  open,
  onOpenChange,
}: TeamMembersDialogProps) {
  const {
    currentProject,
    getTeamsByProjectId,
    addTeamMember,
    removeTeamMember,
    setOpenDialog,
    setCurrentProject,
  } = useProjects()

  if (!currentProject) return null

  const currentTeamUserIds = getTeamsByProjectId(currentProject.id).map(
    (t) => t.user_id
  )
  const availableUsers = users.filter((u) => !currentTeamUserIds.includes(u.id))
  const assignedUsers = users.filter((u) => currentTeamUserIds.includes(u.id))

  const handleAddMember = (userId: string) => {
    addTeamMember(currentProject.id, userId)
  }

  const handleRemoveMember = (userId: string) => {
    removeTeamMember(currentProject.id, userId)
  }

  const handleClose = () => {
    setCurrentProject(null)
    setOpenDialog('members')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
          <DialogDescription>
            Manage members for {currentProject.name}
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-[400px] space-y-6 overflow-y-auto'>
          {/* Current Members */}
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Current Members</h4>
            {assignedUsers.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                No members assigned yet.
              </p>
            ) : (
              <div className='space-y-2'>
                {assignedUsers.map((user) => (
                  <div
                    key={user.id}
                    className='flex items-center justify-between rounded-md border p-3'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium'>
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </div>
                      <div className='flex flex-col'>
                        <p className='text-sm font-medium'>
                          {user.first_name} {user.last_name}
                        </p>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <span>SSO: {user.sso}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <DepartmentBadge department={user.department} />
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleRemoveMember(user.id)}
                        className='h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Members */}
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Add Members</h4>
            {availableUsers.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                All users are already assigned.
              </p>
            ) : (
              <div className='space-y-2'>
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className='flex items-center justify-between rounded-md border p-3'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium'>
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </div>
                      <div className='flex flex-col'>
                        <p className='text-sm font-medium'>
                          {user.first_name} {user.last_name}
                        </p>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <span>SSO: {user.sso}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <DepartmentBadge department={user.department} />
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => handleAddMember(user.id)}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
