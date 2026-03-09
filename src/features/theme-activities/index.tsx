import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ThemeActivitiesDialogs } from './components/theme-activities-dialogs'
import { ThemeActivitiesPrimaryButtons } from './components/theme-activities-primary-buttons'
import { ThemeActivitiesProvider, useThemeActivities } from './components/theme-activities-provider'
import { ThemeActivitiesTable } from './components/theme-activities-table'

function ThemeActivitiesContent() {
  const { themeActivities, openDialog, setOpenDialog } = useThemeActivities()

  return (
    <>
      <ThemeActivitiesDialogs
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
            <h2 className='text-2xl font-bold tracking-tight'>Theme Activities</h2>
            <p className='text-muted-foreground'>
              Create and manage theme activities.
            </p>
          </div>
          <ThemeActivitiesPrimaryButtons />
        </div>
        <ThemeActivitiesTable data={themeActivities} />
      </Main>
    </>
  )
}

export function ThemeActivities() {
  return (
    <ThemeActivitiesProvider>
      <ThemeActivitiesContent />
    </ThemeActivitiesProvider>
  )
}
