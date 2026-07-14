import {
  COINS_TASK_COMPLETE,
  XP_TASK_COMPLETE,
  XP_TASK_CREATE,
  levelFromXp,
  totalXpForLevel,
  xpRequiredForNextLevel,
} from '@/domain/gamification'
import { achievementEngine } from '@/engines/achievement-engine'
import { rewardCelebrationEngine } from '@/engines/reward-celebration-engine'
import { eventRepository } from '@/repositories/event-repository'
import { gamificationRepository } from '@/repositories/gamification-repository'

export class GameEngine {
  async onTaskCreated(): Promise<void> {
    const profileBefore = await gamificationRepository.getProfile()
    await gamificationRepository.addXp(XP_TASK_CREATE)
    await gamificationRepository.updateStreak()

    rewardCelebrationEngine.enqueue({
      kind: 'task_created',
      title: 'Task Created!',
      subtitle: `+${XP_TASK_CREATE} XP`,
      icon: 'sparkles',
      xpGain: XP_TASK_CREATE,
      coinGain: 0,
    })

    await achievementEngine.evaluateForMetric('tasks_created')
    await achievementEngine.evaluateForMetric('streak_days')
    await achievementEngine.evaluateForMetric('level_reached')
    await this.celebrateLevelUps(profileBefore.level)
  }

  async onTaskCompleted(): Promise<void> {
    const profileBefore = await gamificationRepository.getProfile()
    await gamificationRepository.addXp(XP_TASK_COMPLETE)
    await gamificationRepository.addCoins(COINS_TASK_COMPLETE)
    await gamificationRepository.updateStreak()

    rewardCelebrationEngine.enqueue({
      kind: 'task_completed',
      title: 'Task Completed!',
      subtitle: `+${XP_TASK_COMPLETE} XP · +${COINS_TASK_COMPLETE} coins`,
      icon: 'check',
      xpGain: XP_TASK_COMPLETE,
      coinGain: COINS_TASK_COMPLETE,
    })

    await achievementEngine.evaluateForMetric('tasks_completed')
    await achievementEngine.evaluateForMetric('streak_days')
    await achievementEngine.evaluateForMetric('perfect_days')
    await achievementEngine.evaluateForMetric('level_reached')
    await this.celebrateLevelUps(profileBefore.level)
  }

  async onPomodoroFinished(): Promise<void> {
    const profileBefore = await gamificationRepository.getProfile()
    await gamificationRepository.updateStreak()
    await achievementEngine.evaluateForMetric('pomodoro_sessions')
    await achievementEngine.evaluateForMetric('streak_days')
    await achievementEngine.evaluateForMetric('level_reached')
    await this.celebrateLevelUps(profileBefore.level)
  }

  async onGoalCompleted(): Promise<void> {
    const profileBefore = await gamificationRepository.getProfile()
    await gamificationRepository.updateStreak()
    await achievementEngine.evaluateForMetric('goals_completed')
    await achievementEngine.evaluateForMetric('streak_days')
    await achievementEngine.evaluateForMetric('level_reached')
    await this.celebrateLevelUps(profileBefore.level)
  }

  private async celebrateLevelUps(previousLevel: number) {
    const profile = await gamificationRepository.getProfile()
    if (profile.level <= previousLevel) return

    for (let level = previousLevel + 1; level <= profile.level; level++) {
      await eventRepository.create({
        type: 'level_up',
        payload: { level },
      })
    }

    // Single celebration for the final level — engine also coalesces duplicates
    rewardCelebrationEngine.enqueue({
      kind: 'level_up',
      title: `Level ${profile.level}!`,
      subtitle:
        profile.level - previousLevel > 1
          ? `Jumped ${profile.level - previousLevel} levels`
          : 'You leveled up — keep crushing it',
      icon: 'crown',
      xpGain: 0,
      coinGain: 0,
    })
  }

  async getProfile() {
    return gamificationRepository.getProfile()
  }

  async getAchievements() {
    return gamificationRepository.getAchievements()
  }

  getXpProgress(xp: number) {
    const level = levelFromXp(xp)
    const floor = totalXpForLevel(level)
    const max = xpRequiredForNextLevel(level)
    const current = xp - floor
    return {
      current,
      max,
      percent: max > 0 ? (current / max) * 100 : 0,
    }
  }
}

export const gameEngine = new GameEngine()
