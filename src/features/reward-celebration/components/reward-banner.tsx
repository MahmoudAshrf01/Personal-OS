import { Coins, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

import type { RewardCelebration } from '@/engines/reward-celebration-engine'
import { getRewardIcon } from '@/features/reward-celebration/lib/reward-icons'
import { cn } from '@/lib/utils'

const KIND_STYLES: Record<
  RewardCelebration['kind'],
  { iconGradient: string; iconColor: string; label: string }
> = {
  task_created: {
    iconGradient: 'from-sky-400 to-teal-500',
    iconColor: 'text-white',
    label: 'Created',
  },
  task_completed: {
    iconGradient: 'from-emerald-400 to-green-600',
    iconColor: 'text-white',
    label: 'Completed',
  },
  achievement: {
    iconGradient: 'from-amber-400 to-orange-500',
    iconColor: 'text-white',
    label: 'Achievement',
  },
  level_up: {
    iconGradient: 'from-violet-400 to-fuchsia-600',
    iconColor: 'text-white',
    label: 'Level Up',
  },
}

export function RewardBanner({
  celebration,
  phase,
}: {
  celebration: RewardCelebration
  phase: 'enter' | 'hold' | 'exit'
}) {
  const Icon = getRewardIcon(celebration.icon)
  const styles = KIND_STYLES[celebration.kind]

  return (
    <motion.div
      className="pointer-events-none fixed left-1/2 top-[28%] z-[100] w-[min(88vw,18rem)] -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 0.85, y: -16 }}
      animate={
        phase === 'exit'
          ? { opacity: 0, scale: 0.4, y: -28 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={
        phase === 'exit'
          ? { duration: 0.35, ease: 'easeIn' }
          : { type: 'spring', stiffness: 420, damping: 18 }
      }
    >
      <div className="rounded-2xl border border-border/80 bg-card/95 px-3 py-2.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <motion.div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm',
              styles.iconGradient,
            )}
            animate={{ rotate: [-5, 5, 0] }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Icon className={cn('size-5', styles.iconColor)} strokeWidth={2.25} />
          </motion.div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {styles.label}
              {celebration.mergeCount > 1 ? ` · ×${celebration.mergeCount}` : ''}
            </p>
            <p className="truncate text-sm font-semibold text-foreground">{celebration.title}</p>
          </div>
        </div>

        {(celebration.xpGain > 0 || celebration.coinGain > 0) && (
          <div className="mt-2 flex items-center gap-2 border-t border-border/60 pt-2">
            {celebration.xpGain > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Sparkles className="size-3" />+{celebration.xpGain} XP
              </span>
            ) : null}
            {celebration.coinGain > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Coins className="size-3" />+{celebration.coinGain}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </motion.div>
  )
}
