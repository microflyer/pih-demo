import { users } from '@/entity-data/users'
import type { Project } from '@/entity-types/project'
import { UserPlus, Users, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProjects } from '../components/projects-provider'

function DepartmentBadge({ department }: { department: string | null }) {
  if (!department) return null

  const isLDT = department === 'LDT'

  return (
    <Badge
      className={`${
        isLDT
          ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
          : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
      } px-2 py-0 text-[10px] font-semibold tracking-wider uppercase`}
    >
      {department}
    </Badge>
  )
}

type TeamMembersPanelProps = {
  project: Project
  onManageMembers: () => void
}

export function TeamMembersPanel({
  project,
  onManageMembers,
}: TeamMembersPanelProps) {
  const { getTeamsByProjectId, removeTeamMember } = useProjects()

  const teams = getTeamsByProjectId(project.id)
  const teamUserIds = teams.map((t) => t.user_id)
  const teamUsers = users.filter((u) => teamUserIds.includes(u.id))

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Users className='h-4 w-4' />
            Team Members
          </CardTitle>
          <Button variant='ghost' size='sm' onClick={onManageMembers}>
            <UserPlus className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {teamUsers.length === 0 ? (
          <div className='py-4 text-center'>
            <p className='text-sm text-muted-foreground'>No members assigned</p>
            <Button
              variant='outline'
              size='sm'
              className='mt-2'
              onClick={onManageMembers}
            >
              Add Members
            </Button>
          </div>
        ) : (
          <div className='space-y-2'>
            {teamUsers.map((user) => (
              <div
                key={user.id}
                className='flex items-center justify-between rounded-md border p-2'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-medium ring-1 ring-border'>
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </div>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium'>
                      {user.first_name} {user.last_name}
                    </p>
                    <div className='flex items-center gap-2'>
                      <p className='text-xs text-muted-foreground'>
                        {user.sso}
                      </p>
                      <DepartmentBadge department={user.department} />
                    </div>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 text-muted-foreground hover:text-destructive'
                  onClick={() => removeTeamMember(project.id, user.id)}
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
