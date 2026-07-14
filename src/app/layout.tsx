import { NavLink, Outlet } from 'react-router-dom'

import { MobileBottomNav } from '@/app/mobile-bottom-nav'
import { MobileHeader } from '@/app/mobile-header'
import { NAV_ITEMS } from '@/app/nav-config'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { cn } from '@/lib/utils'

export function AppLayout() {
  useKeyboardShortcuts()

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border/70 bg-card/50 lg:flex lg:flex-col">
        <div className="flex h-full flex-col p-4">
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
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col max-lg:bg-transparent">
        <MobileHeader />

        <header className="hidden shrink-0 items-center justify-end border-b border-border/70 px-4 py-3 lg:flex">
          <ThemeToggle />
        </header>

        <main className="flex-1 pb-19 lg:pb-0">
          <Outlet />
        </main>

        <MobileBottomNav />
      </div>
    </div>
  )
}
