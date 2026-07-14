import { Coins, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { headerRewardTargets } from '@/features/reward-celebration/lib/header-reward-targets'
import { soundEngine } from '@/lib/sounds/sound-engine'
import { cn } from '@/lib/utils'

type FlyingKind = 'xp' | 'coins'

interface FlyingIcon {
  id: string
  kind: FlyingKind
  size: number
  startX: number
  startY: number
  midX: number
  midY: number
  endX: number
  endY: number
  delay: number
  rotate: number
}

function resolveTarget(kind: FlyingKind): { x: number; y: number } {
  return (
    headerRewardTargets.getVisibleCenter(kind) ?? {
      x: kind === 'coins' ? window.innerWidth - 80 : window.innerWidth - 180,
      y: 48,
    }
  )
}

/** Map reward amount → burst particle count (more reward = denser burst). */
function burstCount(amount: number, perUnit: number, min: number, max: number) {
  if (amount <= 0) return 0
  return Math.min(max, Math.max(min, Math.round(amount / perUnit)))
}

function buildIcons(
  origin: { x: number; y: number },
  xpGain: number,
  coinGain: number,
): FlyingIcon[] {
  const icons: FlyingIcon[] = []
  const xpTarget = resolveTarget('xp')
  const coinTarget = resolveTarget('coins')

  const xpCount = burstCount(xpGain, 5, 4, 14)
  const coinCount = burstCount(coinGain, 2, 5, 18)

  const pushBurst = (
    kind: FlyingKind,
    count: number,
    target: { x: number; y: number },
    delayBase: number,
  ) => {
    for (let i = 0; i < count; i++) {
      // Fan out in a circle like a pickup burst
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
      const radius = 18 + Math.random() * 52
      const startX = origin.x + Math.cos(angle) * radius
      const startY = origin.y + Math.sin(angle) * radius * 0.7
      const endX = target.x + (Math.random() - 0.5) * 14
      const endY = target.y + (Math.random() - 0.5) * 10
      const bend = Math.cos(angle) * (30 + Math.random() * 55)
      const size = 18 + Math.random() * 10

      icons.push({
        id: `${kind}-${i}`,
        kind,
        size,
        startX,
        startY,
        midX: (startX + endX) / 2 + bend * 0.35,
        midY: Math.min(startY, endY) - (50 + Math.random() * 55),
        endX,
        endY,
        delay: delayBase + i * 0.028 + Math.random() * 0.04,
        rotate: (Math.random() - 0.5) * 340,
      })
    }
  }

  pushBurst('xp', xpCount, xpTarget, 0)
  pushBurst('coins', coinCount, coinTarget, xpCount > 0 ? 0.05 : 0)

  return icons
}

const FLY_DURATION_MS = 950
const LAND_OUT_MS = 160

function FlyingIconSprite({
  icon,
  onLanded,
}: {
  icon: FlyingIcon
  onLanded: (icon: FlyingIcon) => void
}) {
  const [landed, setLanded] = useState(false)
  const reported = useRef(false)
  const half = icon.size / 2

  return (
    <motion.div
      className={cn(
        'pointer-events-none fixed z-[101] flex items-center justify-center rounded-full shadow-md',
        icon.kind === 'coins'
          ? 'bg-amber-400 text-amber-950'
          : 'bg-emerald-400 text-emerald-950',
      )}
      style={{ left: 0, top: 0, width: icon.size, height: icon.size }}
      initial={{
        x: icon.startX - half,
        y: icon.startY - half,
        scale: 0.6,
        opacity: 1,
        rotate: 0,
      }}
      animate={
        landed
          ? {
              x: icon.endX - half,
              y: icon.endY - half,
              scale: 0.2,
              opacity: 0,
              rotate: icon.rotate * 0.2,
            }
          : {
              x: [icon.startX - half, icon.midX - half, icon.endX - half],
              y: [icon.startY - half, icon.midY - half, icon.endY - half],
              scale: [0.6, 1.15, 0.95],
              opacity: 1,
              rotate: [0, icon.rotate * 0.5, icon.rotate],
            }
      }
      transition={
        landed
          ? { duration: LAND_OUT_MS / 1000, ease: 'easeIn' }
          : {
              duration: FLY_DURATION_MS / 1000,
              delay: icon.delay,
              ease: [0.18, 0.85, 0.25, 1],
              times: [0, 0.4, 1],
            }
      }
      onAnimationComplete={() => {
        if (!landed) {
          setLanded(true)
          if (!reported.current) {
            reported.current = true
            onLanded(icon)
          }
        }
      }}
    >
      {icon.kind === 'coins' ? (
        <Coins style={{ width: icon.size * 0.55, height: icon.size * 0.55 }} />
      ) : (
        <Sparkles style={{ width: icon.size * 0.55, height: icon.size * 0.55 }} />
      )}
    </motion.div>
  )
}

export function FlyingRewardIcons({
  origin,
  xpGain,
  coinGain,
  onAllComplete,
}: {
  origin: { x: number; y: number }
  xpGain: number
  coinGain: number
  onAllComplete: () => void
}) {
  const icons = useMemo(
    () => buildIcons(origin, xpGain, coinGain),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const finishedRef = useRef(false)
  const pulsedKinds = useRef(new Set<FlyingKind>())
  const onCompleteRef = useRef(onAllComplete)
  onCompleteRef.current = onAllComplete

  useEffect(() => {
    if (icons.length === 0) {
      onCompleteRef.current()
      return
    }

    const maxDelay = Math.max(...icons.map((i) => i.delay))
    const timer = window.setTimeout(
      () => {
        if (finishedRef.current) return
        finishedRef.current = true
        onCompleteRef.current()
      },
      (maxDelay + FLY_DURATION_MS / 1000) * 1000 + LAND_OUT_MS + 100,
    )

    return () => window.clearTimeout(timer)
  }, [icons])

  const markLanded = (icon: FlyingIcon) => {
    soundEngine.play('coin-collect')
    if (!pulsedKinds.current.has(icon.kind)) {
      pulsedKinds.current.add(icon.kind)
      headerRewardTargets.pulse(icon.kind)
    }
  }

  return (
    <>
      {icons.map((icon) => (
        <FlyingIconSprite key={icon.id} icon={icon} onLanded={markLanded} />
      ))}
    </>
  )
}
