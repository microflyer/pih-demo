import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ThemesDialogs } from './components/themes-dialogs'
import { ThemesPrimaryButtons } from './components/themes-primary-buttons'
import { ThemesProvider, useThemes } from './components/themes-provider'
import { ThemesTable } from './components/themes-table'

function ThemesContent() {
  const { themes, openDialog, setOpenDialog } = useThemes()

  return (
    <>
      <ThemesDialogs
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
            <h2 className='text-2xl font-bold tracking-tight'>Themes</h2>
            <p className='text-muted-foreground'>
              Create and manage themes.
            </p>
          </div>
          <ThemesPrimaryButtons />
        </div>
        <ThemesTable data={themes} />
      </Main>
    </>
  )
}

export function Themes() {
  return (
    <ThemesProvider>
      <ThemesContent />
    </ThemesProvider>
  )
}
