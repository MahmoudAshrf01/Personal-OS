import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'

import { NAV_ITEMS } from '@/app/nav-config'
import { cn } from '@/lib/utils'

function isNavActive(pathname: string, to: string) {
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

export function MobileBottomNav() {
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const container = scrollRef.current
    const active = activeRef.current
    if (!container || !active) return

    const scrollLeft =
      active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2

    container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }, [pathname])

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
      <div
        ref={scrollRef}
        className="flex items-end gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = isNavActive(pathname, item.to)

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              ref={isActive ? activeRef : undefined}
              className="group shrink-0"
            >
              <motion.div
                layout
                whileTap={{ scale: isActive ? 1 : 0.94 }}
                className={cn(
                  'relative flex min-w-[4.25rem] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-colors',
                  isActive ? 'min-w-[5rem] py-2.5' : 'hover:bg-muted/80 active:bg-muted',
                )}
              >
                {isActive ? (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 rounded-2xl bg-primary shadow-md"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                ) : null}

                <motion.span
                  layout
                  className={cn(
                    'relative z-10 flex items-center justify-center',
                    isActive ? 'size-6' : 'size-5',
                  )}
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  <item.icon
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive
                        ? 'size-5 text-primary-foreground'
                        : 'size-[1.125rem] text-muted-foreground group-hover:text-foreground',
                    )}
                  />
                </motion.span>

                <motion.span
                  layout
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    opacity: isActive ? 1 : 0.9,
                  }}
                  className={cn(
                    'relative z-10 max-w-[5.5rem] truncate text-center text-[10px] leading-none font-medium transition-colors',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground group-hover:text-foreground',
                  )}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
