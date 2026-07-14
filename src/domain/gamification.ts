export interface UserProfile {
  id: 'default'
  xp: number
  level: number
  coins: number
  streak: number
  lastActiveDate: string | null
}

export type AchievementCategory = 'tasks' | 'focus' | 'consistency' | 'milestones'

export type AchievementMetric =
  | 'tasks_created'
  | 'tasks_completed'
  | 'streak_days'
  | 'pomodoro_sessions'
  | 'goals_completed'
  | 'perfect_days'
  | 'level_reached'

export interface Achievement {
  id: string
  key: string
  category: AchievementCategory
  metric: AchievementMetric
  threshold: number
  title: string
  description: string
  icon: string
  xpReward: number
  coinReward: number
  unlockedAt: string | null
}

/** Computed view for UI — not stored in Dexie */
export interface AchievementProgress {
  achievement: Achievement
  current: number
  percent: number
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  claimedAt: string | null
}

/** Base for level-scaled XP: cost to leave level L is `XP_LEVEL_BASE * L` */
export const XP_LEVEL_BASE = 150
export const XP_TASK_COMPLETE = 25
export const XP_TASK_CREATE = 5
export const COINS_TASK_COMPLETE = 10

/** Cumulative XP required to *be* at `level` (level 1 = 0). */
export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0
  return (XP_LEVEL_BASE * (level - 1) * level) / 2
}

/** XP needed while at `level` to reach the next level. */
export function xpRequiredForNextLevel(level: number): number {
  return XP_LEVEL_BASE * Math.max(1, level)
}

/**
 * Inverse of the triangular curve:
 * totalXpForLevel(N) = XP_LEVEL_BASE * (N-1)*N/2
 */
export function levelFromXp(xp: number): number {
  if (xp <= 0) return 1
  const approx = (1 + Math.sqrt(1 + (4 * xp) / (XP_LEVEL_BASE / 2))) / 2
  let level = Math.floor(approx)
  while (totalXpForLevel(level + 1) <= xp) level += 1
  while (level > 1 && totalXpForLevel(level) > xp) level -= 1
  return Math.max(1, level)
}

export function xpProgressInLevel(xp: number): { current: number; max: number } {
  const level = levelFromXp(xp)
  const floor = totalXpForLevel(level)
  const max = xpRequiredForNextLevel(level)
  return { current: xp - floor, max }
}
