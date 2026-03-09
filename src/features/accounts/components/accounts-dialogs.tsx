import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAccounts, nextAccountId } from './accounts-provider'
import { businessUnits } from '@/entity-data'
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

const accountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  business_unit_id: z.string().min(1, 'Business Unit is required'),
})

type AccountFormValues = z.infer<typeof accountSchema>

interface AccountsDialogsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountsDialogs({
  open,
  onOpenChange
}: AccountsDialogsProps) {
  const { accounts, openDialog, currentAccount, addAccount, updateAccount, removeAccount } = useAccounts()

  const isCreateDialog = openDialog === 'create'
  const isEditDialog = openDialog === 'edit'
  const isDeleteDialog = openDialog === 'delete'

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      business_unit_id: '',
    },
  })

  useEffect(() => {
    if (isEditDialog && currentAccount) {
      form.reset({
        name: currentAccount.name,
        business_unit_id: currentAccount.business_unit_id,
      })
    } else if (isCreateDialog) {
      form.reset({
        name: '',
        business_unit_id: '',
      })
    }
  }, [isEditDialog, isCreateDialog, currentAccount, form])

  const handleSubmit = (values: AccountFormValues) => {
    if (isCreateDialog) {
      const newId = nextAccountId(accounts)
      addAccount({
        id: newId,
        name: values.name,
        business_unit_id: values.business_unit_id,
      })
    } else if (isEditDialog && currentAccount) {
      updateAccount(currentAccount.id, {
        name: values.name,
        business_unit_id: values.business_unit_id,
      })
    }
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (currentAccount) {
      removeAccount(currentAccount.id)
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
              {isCreateDialog ? 'Create Account' : 'Edit Account'}
            </DialogTitle>
            <DialogDescription>
              {isCreateDialog
                ? 'Add a new account to the system.'
                : 'Update the account details.'}
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
                      <Input placeholder='Enter account name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='business_unit_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a business unit' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessUnits.map((bu) => (
                          <SelectItem key={bu.id} value={bu.id}>
                            {bu.name}
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
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account?
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
