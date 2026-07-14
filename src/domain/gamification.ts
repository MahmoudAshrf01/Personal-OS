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
