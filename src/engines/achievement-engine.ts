import dayjs from 'dayjs'

import type {
  Achievement,
  AchievementMetric,
  AchievementProgress,
} from '@/domain/gamification'
import { calendarEngine } from '@/engines/calendar-engine'
import { notificationEngine } from '@/engines/notification-engine'
import { rewardCelebrationEngine } from '@/engines/reward-celebration-engine'
import { eventRepository } from '@/repositories/event-repository'
import { gamificationRepository } from '@/repositories/gamification-repository'
import { goalRepository } from '@/repositories/goal-repository'

export class AchievementEngine {
  async getMetrics(): Promise<Record<AchievementMetric, number>> {
    const [events, profile, goals] = await Promise.all([
      eventRepository.getAll(),
      gamificationRepository.getProfile(),
      goalRepository.getAll(),
    ])

    const tasksCreated = events.filter((e) => e.type === 'task_created').length
    const tasksCompleted = events.filter((e) => e.type === 'task_completed').length
    const pomodoroSessions = events.filter((e) => e.type === 'pomodoro_finished').length
    const goalsCompleted = goals.filter((g) => g.status === 'completed').length

    const oldest =
      events.length > 0
        ? events.reduce(
            (min, e) => (e.createdAt < min ? e.createdAt : min),
            events[0].createdAt,
          )
        : dayjs().format('YYYY-MM-DD')

    const start = dayjs(oldest).startOf('day').format('YYYY-MM-DD')
    const end = dayjs().format('YYYY-MM-DD')
    const activity = await calendarEngine.getActivityForRange(start, end)
    let perfectDays = 0
    for (const day of activity.values()) {
      const hasActivity =
        day.completed > 0 || day.created > 0 || day.pomodoros > 0
      if (hasActivity && day.rate >= 100) perfectDays += 1
    }

    return {
      tasks_created: tasksCreated,
      tasks_completed: tasksCompleted,
      streak_days: profile.streak,
      pomodoro_sessions: pomodoroSessions,
      goals_completed: goalsCompleted,
      perfect_days: perfectDays,
      level_reached: profile.level,
    }
  }

  async getProgress(): Promise<AchievementProgress[]> {
    const [achievements, metrics] = await Promise.all([
      gamificationRepository.getAchievements(),
      this.getMetrics(),
    ])

    return achievements.map((achievement) => {
      const current = metrics[achievement.metric] ?? 0
      const percent = achievement.threshold
        ? Math.min(100, (current / achievement.threshold) * 100)
        : 0
      return { achievement, current, percent }
    })
  }

  async evaluateAll(): Promise<Achievement[]> {
    const metrics = await this.getMetrics()
    return this.unlockMatching(metrics)
  }

  async evaluateForMetric(metric: AchievementMetric): Promise<Achievement[]> {
    const metrics = await this.getMetrics()
    return this.unlockMatching(metrics, metric)
  }

  private async unlockMatching(
    metrics: Record<AchievementMetric, number>,
    onlyMetric?: AchievementMetric,
  ): Promise<Achievement[]> {
    const achievements = await gamificationRepository.getAchievements()
    const newlyUnlocked: Achievement[] = []

    for (const achievement of achievements) {
      if (achievement.unlockedAt) continue
      if (onlyMetric && achievement.metric !== onlyMetric) continue

      const current = metrics[achievement.metric] ?? 0
      if (current < achievement.threshold) continue

      const unlocked = await gamificationRepository.unlockAchievement(achievement.id)
      if (!unlocked) continue

      await gamificationRepository.addXp(unlocked.xpReward)
      await gamificationRepository.addCoins(unlocked.coinReward)
      await eventRepository.create({
        type: 'achievement_unlocked',
        payload: { achievementId: unlocked.id, title: unlocked.title },
      })
      notificationEngine.push(
        'achievement',
        'Achievement unlocked',
        `${unlocked.title} — +${unlocked.xpReward} XP, +${unlocked.coinReward} coins`,
      )

      rewardCelebrationEngine.enqueue({
        kind: 'achievement',
        title: unlocked.title,
        subtitle: unlocked.description,
        icon: unlocked.icon,
        xpGain: unlocked.xpReward,
        coinGain: unlocked.coinReward,
      })

      newlyUnlocked.push(unlocked)

      // Level may have changed from reward XP — re-read for subsequent checks
      if (achievement.metric !== 'level_reached') {
        const profile = await gamificationRepository.getProfile()
        metrics.level_reached = profile.level
      }
    }

    return newlyUnlocked
  }
}

export const achievementEngine = new AchievementEngine()
