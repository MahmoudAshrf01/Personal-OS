import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckSquare,
  LayoutDashboard,
  NotebookPen,
  Target,
  Timer,
  Trophy,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/notes', label: 'Notes', icon: NotebookPen },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/gamification', label: 'Rewards', icon: Trophy },
]
