import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckSquare,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Target,
  Timer,
  Trophy,
} from 'lucide-react'
import { motion } from 'motion/react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useUiStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
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

export function AppLayout() {
  useKeyboardShortcuts()
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  return (
    <div className="flex min-h-screen bg-background">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="hidden shrink-0 overflow-hidden border-r border-border/70 bg-card/50 md:block"
      >
        <div className="flex h-full w-60 flex-col p-4">
          <div className="mb-6 px-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Personal OS
            </Badge>
            <p className="mt-2 text-xs text-muted-foreground">Your productivity workspace</p>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <Menu className="size-4" />
            </Button>
            <span className="text-sm font-medium md:hidden">Personal OS</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <nav className="flex border-t border-border/70 md:hidden">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 py-2 text-[10px]',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
