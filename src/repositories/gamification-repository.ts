import { db } from '@/database/db'
import type { Achievement, UserProfile } from '@/domain/gamification'
import { levelFromXp } from '@/domain/gamification'

export class GamificationRepository {
  async getProfile(): Promise<UserProfile> {
    const profile = await db.profile.get('default')
    if (!profile) throw new Error('Profile not initialized')
    return profile
  }

  async updateProfile(patch: Partial<Omit<UserProfile, 'id'>>): Promise<UserProfile> {
    const existing = await this.getProfile()
    const updated: UserProfile = { ...existing, ...patch }
    await db.profile.put(updated)
    return updated
  }

  async addXp(amount: number): Promise<UserProfile> {
    const profile = await this.getProfile()
    const newXp = profile.xp + amount
    const newLevel = levelFromXp(newXp)
    const leveledUp = newLevel > profile.level
    const updated = await this.updateProfile({ xp: newXp, level: newLevel })
    return leveledUp ? updated : updated
  }

  async addCoins(amount: number): Promise<UserProfile> {
    const profile = await this.getProfile()
    return this.updateProfile({ coins: profile.coins + amount })
  }

  async getAchievements(): Promise<Achievement[]> {
    return db.achievements.toArray()
  }

  /** Returns the achievement only when newly unlocked; otherwise undefined. */
  async unlockAchievement(id: string): Promise<Achievement | undefined> {
    const achievement = await db.achievements.get(id)
    if (!achievement || achievement.unlockedAt) return undefined
    const updated = { ...achievement, unlockedAt: new Date().toISOString() }
    await db.achievements.put(updated)
    return updated
  }

  async updateStreak(): Promise<UserProfile> {
    const profile = await this.getProfile()
    const today = new Date().toISOString().slice(0, 10)
    if (profile.lastActiveDate === today) return profile

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().slice(0, 10)

    const streak =
      profile.lastActiveDate === yesterdayStr ? profile.streak + 1 : 1

    return this.updateProfile({ streak, lastActiveDate: today })
  }
}

export const gamificationRepository = new GamificationRepository()
