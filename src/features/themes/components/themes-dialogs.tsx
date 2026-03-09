import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useThemes, nextThemeId } from './themes-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const themeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['project', 'non_project']),
})

type ThemeFormValues = z.infer<typeof themeSchema>

interface ThemesDialogsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemesDialogs({
  open,
  onOpenChange
}: ThemesDialogsProps) {
  const { themes, openDialog, currentTheme, addTheme, updateTheme, removeTheme } = useThemes()

  const isCreateDialog = openDialog === 'create'
  const isEditDialog = openDialog === 'edit'
  const isDeleteDialog = openDialog === 'delete'

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      name: '',
      type: 'project',
    },
  })

  useEffect(() => {
    if (isEditDialog && currentTheme) {
      form.reset({
        name: currentTheme.name,
        type: currentTheme.type,
      })
    } else if (isCreateDialog) {
      form.reset({
        name: '',
        type: 'project',
      })
    }
  }, [isEditDialog, isCreateDialog, currentTheme, form])

  const handleSubmit = (values: ThemeFormValues) => {
    if (isCreateDialog) {
      const newId = nextThemeId(themes)
      addTheme({
        id: newId,
        name: values.name,
        type: values.type,
      })
    } else if (isEditDialog && currentTheme) {
      updateTheme(currentTheme.id, {
        name: values.name,
        type: values.type,
      })
    }
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (currentTheme) {
      removeTheme(currentTheme.id)
      onOpenChange(false)
    }
  }

  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog
        open={open && (isCreateDialog || isEditDialog)}
        onOpenChange={onOpenChange}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {isCreateDialog ? 'Create Theme' : 'Edit Theme'}
            </DialogTitle>
            <DialogDescription>
              {isCreateDialog
                ? 'Add a new theme to the system.'
                : 'Update the theme details.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter theme name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='project'>Project</SelectItem>
                        <SelectItem value='non_project'>Non-Project</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit'>
                  {isCreateDialog ? 'Create' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={open && isDeleteDialog}
        onOpenChange={onOpenChange}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Theme</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this theme? This action will
              also delete all associated theme activities.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
