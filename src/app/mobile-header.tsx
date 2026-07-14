import { ThemeToggle } from '@/components/theme-toggle'

export function MobileHeader() {
  return (
    <header className="flex shrink-0 items-center justify-between border-none bg-transparent px-4 py-3 lg:hidden">
      <span className="text-base font-semibold tracking-tight">Personal OS</span>
      <ThemeToggle size="lg" />
    </header>
  )
}
