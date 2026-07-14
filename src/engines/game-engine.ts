import {
  COINS_TASK_COMPLETE,
  XP_PER_LEVEL,
  XP_TASK_COMPLETE,
  XP_TASK_CREATE,
} from '@/domain/gamification'
import { achievementEngine } from '@/engines/achievement-engine'
import { eventRepository } from '@/repositories/event-repository'
import { gamificationRepository } from '@/repositories/gamification-repository'

export class GameEngine {
  async onTaskCreated(): Promise<void> {
    await gamificationRepository.addXp(XP_TASK_CREATE)
    await gamificationRepository.updateStreak()
    await achievementEngine.evaluateForMetric('tasks_created')
    await achievementEngine.evaluateForMetric('streak_days')
    await achievementEngine.evaluateForMetric('level_reached')
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

    await achievementEngine.evaluateForMetric('tasks_completed')
    await achievementEngine.evaluateForMetric('streak_days')
    await achievementEngine.evaluateForMetric('perfect_days')
    await achievementEngine.evaluateForMetric('level_reached')
  }

  async onPomodoroFinished(): Promise<void> {
    await gamificationRepository.updateStreak()
    await achievementEngine.evaluateForMetric('pomodoro_sessions')
    await achievementEngine.evaluateForMetric('streak_days')
  }

  async onGoalCompleted(): Promise<void> {
    await gamificationRepository.updateStreak()
    await achievementEngine.evaluateForMetric('goals_completed')
    await achievementEngine.evaluateForMetric('streak_days')
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
