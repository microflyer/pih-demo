import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useProjects } from './projects-provider'

type ProjectDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDeleteDialog({
  open,
  onOpenChange,
}: ProjectDeleteDialogProps) {
  const navigate = useNavigate()
  const { currentProject, removeProject, setCurrentProject, setOpenDialog } =
    useProjects()

  if (!currentProject) return null

  const handleConfirm = () => {
    removeProject(currentProject.id)
    setCurrentProject(null)
    setOpenDialog(null)
    onOpenChange(false)
    toast.success('Project deleted')
    navigate({ to: '/projects' })
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setCurrentProject(null)
      setOpenDialog(null)
    }
    onOpenChange(isOpen)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={`Delete "${currentProject.name}"?`}
      desc={
        <>
          You are about to delete the project{' '}
          <strong>{currentProject.name}</strong>. This will also remove all team
          members associated with this project.
          <br />
          This action cannot be undone.
        </>
      }
      confirmText='Delete'
      destructive
      handleConfirm={handleConfirm}
    />
  )
}
