import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useThemeActivities, nextThemeActivityId } from './theme-activities-provider'
import { themes } from '@/entity-data'
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

const themeActivitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  theme_id: z.string().min(1, 'Theme is required'),
})

type ThemeActivityFormValues = z.infer<typeof themeActivitySchema>

interface ThemeActivitiesDialogsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeActivitiesDialogs({
  open,
  onOpenChange
}: ThemeActivitiesDialogsProps) {
  const { themeActivities, openDialog, currentThemeActivity, addThemeActivity, updateThemeActivity, removeThemeActivity } = useThemeActivities()

  const isCreateDialog = openDialog === 'create'
  const isEditDialog = openDialog === 'edit'
  const isDeleteDialog = openDialog === 'delete'

  const form = useForm<ThemeActivityFormValues>({
    resolver: zodResolver(themeActivitySchema),
    defaultValues: {
      name: '',
      theme_id: '',
    },
  })

  useEffect(() => {
    if (isEditDialog && currentThemeActivity) {
      form.reset({
        name: currentThemeActivity.name,
        theme_id: currentThemeActivity.theme_id,
      })
    } else if (isCreateDialog) {
      form.reset({
        name: '',
        theme_id: '',
      })
    }
  }, [isEditDialog, isCreateDialog, currentThemeActivity, form])

  const handleSubmit = (values: ThemeActivityFormValues) => {
    if (isCreateDialog) {
      const newId = nextThemeActivityId(themeActivities)
      addThemeActivity({
        id: newId,
        name: values.name,
        theme_id: values.theme_id,
      })
    } else if (isEditDialog && currentThemeActivity) {
      updateThemeActivity(currentThemeActivity.id, {
        name: values.name,
        theme_id: values.theme_id,
      })
    }
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (currentThemeActivity) {
      removeThemeActivity(currentThemeActivity.id)
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
              {isCreateDialog ? 'Create Theme Activity' : 'Edit Theme Activity'}
            </DialogTitle>
            <DialogDescription>
              {isCreateDialog
                ? 'Add a new theme activity to the system.'
                : 'Update the theme activity details.'}
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
                      <Input placeholder='Enter activity name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='theme_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a theme' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))}
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
            <DialogTitle>Delete Theme Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this theme activity?
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
