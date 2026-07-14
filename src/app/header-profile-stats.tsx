import { Coins, Sparkles } from 'lucide-react'
import { motion, useAnimationControls } from 'motion/react'
import { useEffect, useRef } from 'react'

import { XP_PER_LEVEL } from '@/domain/gamification'
import { gameEngine } from '@/engines/game-engine'
import {
  headerRewardTargets,
  type HeaderRewardTarget,
} from '@/features/reward-celebration/lib/header-reward-targets'
import { useUserProfile } from '@/hooks/use-user-profile'
import { cn } from '@/lib/utils'

function useRegisterTarget(target: HeaderRewardTarget) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    headerRewardTargets.register(target, el)
    return () => headerRewardTargets.unregister(target, el)
  }, [target])
  return ref
}

function usePulseControls(target: HeaderRewardTarget) {
  const controls = useAnimationControls()
  useEffect(() => {
    return headerRewardTargets.onPulse((hit) => {
      if (hit !== target) return
      void controls.start({
        scale: [1, 1.28, 0.94, 1.08, 1],
        transition: { duration: 0.45, ease: 'easeOut' },
      })
    })
  }, [controls, target])
  return controls
}

export function HeaderProfileStats({ className }: { className?: string }) {
  const profile = useUserProfile()
  const levelRef = useRegisterTarget('level')
  const xpRef = useRegisterTarget('xp')
  const coinsRef = useRegisterTarget('coins')
  const levelControls = usePulseControls('level')
  const xpControls = usePulseControls('xp')
  const coinsControls = usePulseControls('coins')

  if (!profile) return null

  const xp = gameEngine.getXpProgress(profile.xp)

  return (
    <div className={cn('flex items-center gap-2 sm:gap-3', className)}>
      <motion.div
        ref={levelRef}
        data-reward-target="level"
        animate={levelControls}
        className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-medium sm:text-sm"
        title={`Level ${profile.level}`}
      >
        <Sparkles className="size-3.5 shrink-0 text-emerald-500 sm:size-4" />
        <span className="text-emerald-600 dark:text-emerald-400">Lv. {profile.level}</span>
      </motion.div>

      <motion.div
        ref={xpRef}
        data-reward-target="xp"
        animate={xpControls}
        className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-medium sm:gap-2 sm:text-sm"
        title={`${xp.current} / ${XP_PER_LEVEL} XP`}
      >
        <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-muted sm:block sm:w-16">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={false}
            animate={{ width: `${xp.percent}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </div>
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {xp.current}/{XP_PER_LEVEL} XP
        </span>
      </motion.div>

      <motion.div
        ref={coinsRef}
        data-reward-target="coins"
        animate={coinsControls}
        className="flex items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-medium sm:text-sm"
        title={`${profile.coins} coins`}
      >
        <Coins className="size-3.5 shrink-0 text-amber-500 sm:size-4" />
        <span className="tabular-nums text-amber-600 dark:text-amber-400">{profile.coins}</span>
      </motion.div>
    </div>
  )
}
