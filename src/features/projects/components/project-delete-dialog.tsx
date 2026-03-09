import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Project } from '@/entity-types/project'

type ProjectDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  onConfirm: (projectId: string) => void
}

export function ProjectDeleteDialog({
  open,
  onOpenChange,
  project,
  onConfirm,
}: ProjectDeleteDialogProps) {
  if (!project) return null

  const handleDelete = () => {
    onConfirm(project.id)
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      destructive
      title='Delete project'
      desc={
        <>
          Are you sure you want to delete{' '}
          <span className='font-semibold'>{project.name}</span>? This will remove
          the project and its team associations. This action cannot be undone.
        </>
      }
      confirmText='Delete'
    />
  )
}
