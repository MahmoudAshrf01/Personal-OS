import { Howl } from 'howler'

import type { RewardKind } from '@/engines/reward-celebration-engine'

export type SoundName =
  | 'task-created'
  | 'task-completed'
  | 'achievement'
  | 'level-up'
  | 'popup-dismiss'
  | 'coin-pop'
  | 'coin-collect'
  | 'reward-unlock'
  | 'button-click'

type FileSoundName = Exclude<SoundName, 'button-click'>

const MUTE_KEY = 'flow-todo:sound-muted'

const SOURCES: Record<FileSoundName, string> = {
  'task-created': '/sounds/task-created.wav',
  'task-completed': '/sounds/task-completed.wav',
  achievement: '/sounds/achievement.wav',
  'level-up': '/sounds/level-up.wav',
  'popup-dismiss': '/sounds/popup-dismiss.wav',
  'coin-pop': '/sounds/coin-pop.wav',
  'coin-collect': '/sounds/coin-collect.wav',
  'reward-unlock': '/sounds/reward-unlock.wav',
}

const VOLUMES: Record<FileSoundName, number> = {
  'task-created': 0.45,
  'task-completed': 0.55,
  achievement: 0.58,
  'level-up': 0.62,
  'popup-dismiss': 0.4,
  'coin-pop': 0.4,
  'coin-collect': 0.32,
  'reward-unlock': 0.5,
}

const DEBOUNCE_MS: Partial<Record<SoundName, number>> = {
  'coin-collect': 80,
  'button-click': 60,
}

/** Appear sound per celebration kind */
export function appearSoundForKind(kind: RewardKind): SoundName {
  switch (kind) {
    case 'task_created':
      return 'task-created'
    case 'task_completed':
      return 'task-completed'
    case 'achievement':
      return 'achievement'
    case 'level_up':
      return 'level-up'
    default:
      return 'reward-unlock'
  }
}

class SoundEngine {
  private howls = new Map<FileSoundName, Howl>()
  private lastPlayed = new Map<SoundName, number>()
  private listeners = new Set<() => void>()
  private audioContext: AudioContext | null = null
  private muted = false
  private ready = false

  constructor() {
    if (typeof window === 'undefined') return
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      this.muted = false
    }
  }

  preload() {
    if (this.ready || typeof window === 'undefined') return
    for (const [name, src] of Object.entries(SOURCES) as [FileSoundName, string][]) {
      this.howls.set(
        name,
        new Howl({
          src: [src],
          volume: VOLUMES[name],
          preload: true,
        }),
      )
    }
    this.ready = true
  }

  play(name: SoundName) {
    if (this.muted) return

    const debounce = DEBOUNCE_MS[name]
    if (debounce) {
      const last = this.lastPlayed.get(name) ?? 0
      if (Date.now() - last < debounce) return
      this.lastPlayed.set(name, Date.now())
    }

    if (name === 'button-click') {
      this.playButtonClick()
      return
    }

    this.preload()

    const howl = this.howls.get(name)
    if (!howl) return
    howl.play()
  }

  private playButtonClick() {
    if (typeof window === 'undefined') return

    try {
      this.audioContext ??= new AudioContext()
      const ctx = this.audioContext
      if (ctx.state === 'suspended') void ctx.resume()

      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(920, t)
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.035)

      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.linearRampToValueAtTime(0.065, t + 0.004)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.055)
    } catch {
      /* ignore */
    }
  }

  isMuted() {
    return this.muted
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  setMuted(muted: boolean) {
    if (this.muted === muted) return
    this.muted = muted
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
    } catch {
      /* ignore */
    }
    this.listeners.forEach((listener) => listener())
  }

  toggleMuted() {
    this.setMuted(!this.muted)
    return this.muted
  }
}

export const soundEngine = new SoundEngine()
