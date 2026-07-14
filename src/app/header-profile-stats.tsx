import { Coins, Sparkles } from 'lucide-react'

import { XP_PER_LEVEL } from '@/domain/gamification'
import { gameEngine } from '@/engines/game-engine'
import { useUserProfile } from '@/hooks/use-user-profile'
import { cn } from '@/lib/utils'

export function HeaderProfileStats({ className }: { className?: string }) {
  const profile = useUserProfile()

  if (!profile) return null

  const xp = gameEngine.getXpProgress(profile.xp)

  return (
    <div className={cn('flex items-center gap-2 sm:gap-3', className)}>
      <div
        className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-medium sm:text-sm"
        title={`Level ${profile.level}`}
      >
        <Sparkles className="size-3.5 shrink-0 text-emerald-500 sm:size-4" />
        <span className="text-emerald-600 dark:text-emerald-400">Lv. {profile.level}</span>
      </div>

      <div
        className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-medium sm:gap-2 sm:text-sm"
        title={`${xp.current} / ${XP_PER_LEVEL} XP`}
      >
        <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-muted sm:block sm:w-16">
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
            style={{ width: `${xp.percent}%` }}
          />
        </div>
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {xp.current}/{XP_PER_LEVEL} XP
        </span>
      </div>

      <div
        className="flex items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-medium sm:text-sm"
        title={`${profile.coins} coins`}
      >
        <Coins className="size-3.5 shrink-0 text-amber-500 sm:size-4" />
        <span className="tabular-nums text-amber-600 dark:text-amber-400">{profile.coins}</span>
      </div>
    </div>
  )
}
