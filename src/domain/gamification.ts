export interface UserProfile {
  id: 'default'
  xp: number
  level: number
  coins: number
  streak: number
  lastActiveDate: string | null
}

export interface Achievement {
  id: string
  key: string
  title: string
  description: string
  icon: string
  xpReward: number
  coinReward: number
  unlockedAt: string | null
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  claimedAt: string | null
}

export const XP_PER_LEVEL = 100
export const XP_TASK_COMPLETE = 25
export const XP_TASK_CREATE = 5
export const COINS_TASK_COMPLETE = 10

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpProgressInLevel(xp: number): number {
  return xp % XP_PER_LEVEL
}
