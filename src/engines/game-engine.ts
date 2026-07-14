import {
  COINS_TASK_COMPLETE,
  XP_PER_LEVEL,
  XP_TASK_COMPLETE,
  XP_TASK_CREATE,
} from '@/domain/gamification'
import { eventRepository } from '@/repositories/event-repository'
import { gamificationRepository } from '@/repositories/gamification-repository'
import { taskRepository } from '@/repositories/task-repository'

export class GameEngine {
  async onTaskCreated(): Promise<void> {
    await gamificationRepository.addXp(XP_TASK_CREATE)
    await gamificationRepository.updateStreak()

    const tasks = await taskRepository.getAll()
    if (tasks.length === 1) {
      await this.tryUnlock('first-task')
    }
  }

  async onTaskCompleted(): Promise<void> {
    const profileBefore = await gamificationRepository.getProfile()
    await gamificationRepository.addXp(XP_TASK_COMPLETE)
    await gamificationRepository.addCoins(COINS_TASK_COMPLETE)
    await gamificationRepository.updateStreak()

    const profileAfter = await gamificationRepository.getProfile()
    if (profileAfter.level > profileBefore.level) {
      await eventRepository.create({
        type: 'level_up',
        payload: { level: profileAfter.level },
      })
    }

    const completed = (await taskRepository.getByStatus('done')).length
    if (completed >= 10) await this.tryUnlock('ten-tasks')

    const profile = await gamificationRepository.getProfile()
    if (profile.streak >= 7) await this.tryUnlock('streak-7')
  }

  private async tryUnlock(achievementId: string): Promise<void> {
    const unlocked = await gamificationRepository.unlockAchievement(achievementId)
    if (unlocked?.unlockedAt) {
      await gamificationRepository.addXp(unlocked.xpReward)
      await gamificationRepository.addCoins(unlocked.coinReward)
      await eventRepository.create({
        type: 'achievement_unlocked',
        payload: { achievementId, title: unlocked.title },
      })
    }
  }

  async getProfile() {
    return gamificationRepository.getProfile()
  }

  async getAchievements() {
    return gamificationRepository.getAchievements()
  }

  getXpProgress(xp: number) {
    return {
      current: xp % XP_PER_LEVEL,
      max: XP_PER_LEVEL,
      percent: ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100,
    }
  }
}

export const gameEngine = new GameEngine()
