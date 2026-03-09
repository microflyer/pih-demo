import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BusinessUnitsDialogs } from './components/business-units-dialogs'
import { BusinessUnitsPrimaryButtons } from './components/business-units-primary-buttons'
import { BusinessUnitsProvider, useBusinessUnits } from './components/business-units-provider'
import { BusinessUnitsTable } from './components/business-units-table'

function BusinessUnitsContent() {
  const { businessUnits, openDialog, setOpenDialog } = useBusinessUnits()

  return (
    <>
      <BusinessUnitsDialogs
        open={openDialog !== null}
        onOpenChange={(open) => {
          if (!open) setOpenDialog(null)
        }}
      />
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Business Units</h2>
            <p className='text-muted-foreground'>
              Create and manage business units.
            </p>
          </div>
          <BusinessUnitsPrimaryButtons />
        </div>
        <BusinessUnitsTable data={businessUnits} />
      </Main>
    </>
  )
}

export function BusinessUnits() {
  return (
    <BusinessUnitsProvider>
      <BusinessUnitsContent />
    </BusinessUnitsProvider>
  )
}
