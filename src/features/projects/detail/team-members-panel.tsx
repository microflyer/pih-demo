import { users } from '@/entity-data/users'
import type { Project } from '@/entity-types/project'
import { UserPlus, Users, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProjects } from '../components/projects-provider'

function DepartmentBadge({ department }: { department: string | null }) {
  if (!department) return null

  const styles: Record<string, string> = {
    LDT: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
    Digital:
      'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400',
    Technology:
      'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-400',
    Operations:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
  }

  return (
    <Badge
      className={`${
        styles[department] ||
        'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
      } cursor-pointer px-2 py-0 text-[10px] font-semibold tracking-wider uppercase`}
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
                className='group flex items-center justify-between rounded-lg border bg-card p-2.5 transition-all duration-200 hover:border-emerald-500/30 dark:hover:border-emerald-700/40'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground'>
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
                  className='h-7 w-7 cursor-pointer text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive'
                  onClick={() => removeTeamMember(project.id, user.id)}
                >
                  <X className='h-3.5 w-3.5' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
