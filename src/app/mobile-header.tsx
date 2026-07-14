import { HeaderProfileStats } from '@/app/header-profile-stats'
import { PreferencesControls } from '@/components/preferences-controls'

export function MobileHeader() {
  return (
    <header className="flex shrink-0 flex-col gap-2 border-none bg-transparent px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold tracking-tight">Personal OS</span>
        <PreferencesControls size="lg" />
      </div>
      <HeaderProfileStats />
    </header>
  )
}
