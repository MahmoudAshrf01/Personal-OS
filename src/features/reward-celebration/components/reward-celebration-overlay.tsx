import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { FlyingRewardIcons } from '@/features/reward-celebration/components/flying-reward-icons'
import { RewardBanner } from '@/features/reward-celebration/components/reward-banner'
import {
  RewardParticleCanvas,
  type ParticleBurstApi,
} from '@/features/reward-celebration/components/reward-particle-canvas'
import { useRewardCelebration } from '@/features/reward-celebration/hooks/use-reward-celebration'
import { headerRewardTargets } from '@/features/reward-celebration/lib/header-reward-targets'
import type { RewardCelebration } from '@/engines/reward-celebration-engine'
import { appearSoundForKind, soundEngine } from '@/lib/sounds/sound-engine'

type Phase = 'idle' | 'enter' | 'hold' | 'exit' | 'fly'

export function RewardCelebrationOverlay() {
  const { current, complete } = useRewardCelebration()
  const [active, setActive] = useState<RewardCelebration | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [flyRewards, setFlyRewards] = useState({ xp: 0, coins: 0 })
  const [origin, setOrigin] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.3 : 0,
  })

  const particlesRef = useRef<ParticleBurstApi>(null)
  const timersRef = useRef<number[]>([])
  const playingIdRef = useRef<string | null>(null)
  const latestRef = useRef<RewardCelebration | null>(null)
  const completeRef = useRef(complete)
  completeRef.current = complete
  latestRef.current = current

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
  }

  const finish = (id: string) => {
    if (playingIdRef.current !== id) return
    clearTimers()
    playingIdRef.current = null
    setPhase('idle')
    setActive(null)
    completeRef.current(id)
  }

  useEffect(() => {
    soundEngine.preload()
  }, [])

  // Keep banner in sync when same-kind events merge into the active celebration
  useEffect(() => {
    if (!current) return
    if (playingIdRef.current === current.id) {
      setActive(current)
    }
  }, [current])

  useEffect(() => {
    if (!current) {
      clearTimers()
      playingIdRef.current = null
      setActive(null)
      setPhase('idle')
      return
    }

    // Same id = merge update only — don't restart timeline
    if (playingIdRef.current === current.id) {
      return
    }

    const celebrationId = current.id

    clearTimers()
    playingIdRef.current = celebrationId
    setActive(current)
    setPhase('enter')

    const ox = window.innerWidth / 2
    const oy = window.innerHeight * 0.3
    setOrigin({ x: ox, y: oy })

    soundEngine.play(appearSoundForKind(current.kind))

    schedule(() => {
      if (playingIdRef.current !== celebrationId) return
      setPhase('hold')
    }, 500)

    schedule(() => {
      if (playingIdRef.current !== celebrationId) return
      setPhase('exit')
      soundEngine.play('popup-dismiss')
    }, 1700)

    schedule(() => {
      if (playingIdRef.current !== celebrationId) return

      // Read latest merged totals at fly time
      const latest = latestRef.current
      if (!latest || latest.id !== celebrationId) return

      const burstX = window.innerWidth / 2
      const burstY = window.innerHeight * 0.3
      setOrigin({ x: burstX, y: burstY })
      setActive(latest)
      setFlyRewards({ xp: latest.xpGain, coins: latest.coinGain })

      if (latest.xpGain > 0 || latest.coinGain > 0) {
        soundEngine.play('coin-pop')
      }
      const intensity =
        latest.kind === 'level_up' || latest.kind === 'achievement' ? 1.4 : 1
      particlesRef.current?.burst(burstX, burstY, intensity)

      const hasFly = latest.xpGain > 0 || latest.coinGain > 0
      if (hasFly) {
        setPhase('fly')
        schedule(() => finish(celebrationId), 2200)
      } else {
        if (latest.kind === 'level_up') {
          headerRewardTargets.pulse('level')
        }
        schedule(() => finish(celebrationId), 500)
      }
    }, 2200)

    return () => {
      // Only tear down if still on this celebration (Strict Mode remount)
      if (playingIdRef.current === celebrationId) {
        clearTimers()
        playingIdRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <RewardParticleCanvas ref={particlesRef} />
      {active && (phase === 'enter' || phase === 'hold' || phase === 'exit') ? (
        <RewardBanner celebration={active} phase={phase === 'exit' ? 'exit' : 'enter'} />
      ) : null}
      {active && phase === 'fly' ? (
        <FlyingRewardIcons
          key={active.id}
          origin={origin}
          xpGain={flyRewards.xp}
          coinGain={flyRewards.coins}
          onAllComplete={() => finish(active.id)}
        />
      ) : null}
    </>,
    document.body,
  )
}
