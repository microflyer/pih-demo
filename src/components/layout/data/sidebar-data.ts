import {
  Activity,
  AudioWaveform,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  Monitor,
  Palette,
  Settings,
  UserCog,
  Wallet,
  Wrench,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Project Intelligence Hub',
      logo: Command,
      plan: 'China Digital',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'My Time',
          url: '/my-time',
          icon: Clock,
        },
        {
          title: 'Projects',
          url: '/projects',
          icon: Briefcase,
        },
        {
          title: 'Time Entries',
          url: '/time-entries',
          icon: Calendar,
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          title: 'Business Units',
          url: '/business-units',
          icon: Building2,
        },
        {
          title: 'Accounts',
          url: '/accounts',
          icon: Wallet,
        },
        {
          title: 'Themes',
          url: '/themes',
          icon: Palette,
        },
        {
          title: 'Theme Activities',
          url: '/theme-activities',
          icon: Activity,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
      ],
    },
  ],
}
