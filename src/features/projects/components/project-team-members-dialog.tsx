import { users } from '@/entity-data/users'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProjects } from './projects-provider'

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
                      <div>
                        <p className='text-sm font-medium'>
                          {user.first_name} {user.last_name}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          SSO: {user.sso}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleRemoveMember(user.id)}
                      className='text-destructive hover:text-destructive'
                    >
                      Remove
                    </Button>
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
                      <div>
                        <p className='text-sm font-medium'>
                          {user.first_name} {user.last_name}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          SSO: {user.sso}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleAddMember(user.id)}
                    >
                      Add
                    </Button>
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
