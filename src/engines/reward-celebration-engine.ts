export type RewardKind = 'task_created' | 'task_completed' | 'achievement' | 'level_up'

export interface RewardCelebration {
  id: string
  kind: RewardKind
  title: string
  subtitle?: string
  icon: string
  xpGain: number
  coinGain: number
  /** How many same-kind events were combined into this celebration */
  mergeCount: number
}

type Listener = (current: RewardCelebration | null) => void

const MERGEABLE = new Set<RewardKind>(['task_created', 'task_completed', 'level_up'])

function canMerge(a: RewardKind, b: RewardKind): boolean {
  return a === b && MERGEABLE.has(a)
}

function mergeCelebration(target: RewardCelebration, incoming: Omit<RewardCelebration, 'id'>) {
  target.mergeCount += incoming.mergeCount
  target.xpGain += incoming.xpGain
  target.coinGain += incoming.coinGain

  if (target.kind === 'level_up') {
    // Keep the latest (highest) level title/subtitle
    target.title = incoming.title
    target.subtitle = incoming.subtitle
    target.icon = incoming.icon
  } else if (target.kind === 'task_completed') {
    target.title =
      target.mergeCount > 1
        ? `${target.mergeCount} Tasks Completed!`
        : 'Task Completed!'
    target.subtitle = `+${target.xpGain} XP · +${target.coinGain} coins`
  } else if (target.kind === 'task_created') {
    target.title =
      target.mergeCount > 1 ? `${target.mergeCount} Tasks Created!` : 'Task Created!'
    target.subtitle = `+${target.xpGain} XP`
  }
}

export class RewardCelebrationEngine {
  private queue: RewardCelebration[] = []
  private current: RewardCelebration | null = null
  private listeners = new Set<Listener>()
  private suppressed = false

  /** Drop enqueues while true (used during DB bootstrap / seed). */
  setSuppressed(suppressed: boolean) {
    this.suppressed = suppressed
    if (suppressed) {
      this.queue = []
      this.current = null
      this.emit()
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.current)
    return () => this.listeners.delete(listener)
  }

  private emit() {
    for (const listener of this.listeners) {
      // Clone so React sees a new reference when merged fields change
      listener(this.current ? { ...this.current } : null)
    }
  }

  private promote() {
    if (this.current || this.suppressed) return
    const next = this.queue.shift()
    if (!next) {
      this.emit()
      return
    }
    this.current = next
    this.emit()
  }

  enqueue(input: Omit<RewardCelebration, 'id' | 'mergeCount'> & { mergeCount?: number }): string | null {
    if (this.suppressed) return null

    const incoming: Omit<RewardCelebration, 'id'> = {
      ...input,
      mergeCount: input.mergeCount ?? 1,
    }

    // Merge into the currently playing celebration of the same kind
    if (this.current && canMerge(this.current.kind, incoming.kind)) {
      mergeCelebration(this.current, incoming)
      this.emit()
      return this.current.id
    }

    // Merge into the last queued celebration of the same kind
    for (let i = this.queue.length - 1; i >= 0; i--) {
      const item = this.queue[i]
      if (canMerge(item.kind, incoming.kind)) {
        mergeCelebration(item, incoming)
        return item.id
      }
    }

    const celebration: RewardCelebration = {
      ...incoming,
      id: crypto.randomUUID(),
    }
    this.queue.push(celebration)
    this.promote()
    return celebration.id
  }

  /** Call when the overlay finishes animating the active celebration. */
  onComplete(id: string) {
    if (!this.current || this.current.id !== id) return
    this.current = null
    this.promote()
  }

  getCurrent(): RewardCelebration | null {
    return this.current
  }

  getQueueLength(): number {
    return this.queue.length + (this.current ? 1 : 0)
  }
}

export const rewardCelebrationEngine = new RewardCelebrationEngine()
