export type HeaderRewardTarget = 'xp' | 'coins' | 'level'

type PulseListener = (target: HeaderRewardTarget) => void

class HeaderRewardTargetRegistry {
  private elements = new Map<HeaderRewardTarget, Set<HTMLElement>>()
  private pulseListeners = new Set<PulseListener>()

  register(target: HeaderRewardTarget, el: HTMLElement | null) {
    if (!el) return
    let set = this.elements.get(target)
    if (!set) {
      set = new Set()
      this.elements.set(target, set)
    }
    set.add(el)
  }

  unregister(target: HeaderRewardTarget, el: HTMLElement | null) {
    if (!el) return
    this.elements.get(target)?.delete(el)
  }

  getVisibleCenter(target: HeaderRewardTarget): { x: number; y: number } | null {
    const set = this.elements.get(target)
    if (set) {
      for (const el of set) {
        const rect = el.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          }
        }
      }
    }

    const nodes = document.querySelectorAll<HTMLElement>(`[data-reward-target="${target}"]`)
    for (const node of nodes) {
      const rect = node.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
      }
    }
    return null
  }

  onPulse(listener: PulseListener): () => void {
    this.pulseListeners.add(listener)
    return () => this.pulseListeners.delete(listener)
  }

  pulse(target: HeaderRewardTarget) {
    for (const listener of this.pulseListeners) {
      listener(target)
    }
  }
}

export const headerRewardTargets = new HeaderRewardTargetRegistry()
