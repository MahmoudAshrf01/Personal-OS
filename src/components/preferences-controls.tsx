import { SoundToggle } from '@/components/sound-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

type PreferencesControlsProps = {
  className?: string
  size?: 'default' | 'lg'
}

export function PreferencesControls({ className, size = 'default' }: PreferencesControlsProps) {
  return (
    <div
      data-slot="button-group"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-xl border border-border/70 bg-background/80 p-0.5',
        className,
      )}
    >
      <SoundToggle grouped size={size} />
      <ThemeToggle grouped size={size} />
    </div>
  )
}
