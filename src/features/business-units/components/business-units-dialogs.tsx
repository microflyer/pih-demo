import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBusinessUnits, nextBusinessUnitId } from './business-units-provider'
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

const businessUnitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  vp_name: z.string().optional(),
})

type BusinessUnitFormValues = z.infer<typeof businessUnitSchema>

interface BusinessUnitsDialogsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BusinessUnitsDialogs({
  open,
  onOpenChange
}: BusinessUnitsDialogsProps) {
  const { businessUnits, openDialog, currentBusinessUnit, addBusinessUnit, updateBusinessUnit, removeBusinessUnit } = useBusinessUnits()

  const isCreateDialog = openDialog === 'create'
  const isEditDialog = openDialog === 'edit'
  const isDeleteDialog = openDialog === 'delete'

  const form = useForm<BusinessUnitFormValues>({
    resolver: zodResolver(businessUnitSchema),
    defaultValues: {
      name: '',
      vp_name: '',
    },
  })

  useEffect(() => {
    if (isEditDialog && currentBusinessUnit) {
      form.reset({
        name: currentBusinessUnit.name,
        vp_name: currentBusinessUnit.vp_name || '',
      })
    } else if (isCreateDialog) {
      form.reset({
        name: '',
        vp_name: '',
      })
    }
  }, [isEditDialog, isCreateDialog, currentBusinessUnit, form])

  const handleSubmit = (values: BusinessUnitFormValues) => {
    if (isCreateDialog) {
      const newId = nextBusinessUnitId(businessUnits)
      addBusinessUnit({
        id: newId,
        name: values.name,
        vp_name: values.vp_name || '',
      })
    } else if (isEditDialog && currentBusinessUnit) {
      updateBusinessUnit(currentBusinessUnit.id, {
        name: values.name,
        vp_name: values.vp_name || '',
      })
    }
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (currentBusinessUnit) {
      removeBusinessUnit(currentBusinessUnit.id)
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
              {isCreateDialog ? 'Create Business Unit' : 'Edit Business Unit'}
            </DialogTitle>
            <DialogDescription>
              {isCreateDialog
                ? 'Add a new business unit to the system.'
                : 'Update the business unit details.'}
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
                      <Input placeholder='Enter business unit name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='vp_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VP Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter VP name' {...field} />
                    </FormControl>
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
            <DialogTitle>Delete Business Unit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this business unit? This action will
              also delete all associated accounts.
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
