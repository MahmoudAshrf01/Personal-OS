import { HeaderProfileStats } from '@/app/header-profile-stats'
import { ThemeToggle } from '@/components/theme-toggle'

export function MobileHeader() {
  return (
    <header className="flex shrink-0 flex-col gap-2 border-none bg-transparent px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold tracking-tight">Personal OS</span>
        <ThemeToggle size="lg" />
      </div>
      <HeaderProfileStats />
    </header>
  )
}
