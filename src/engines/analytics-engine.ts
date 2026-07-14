import dayjs from 'dayjs'

import { eventRepository } from '@/repositories/event-repository'
import { taskRepository } from '@/repositories/task-repository'
import { gamificationRepository } from '@/repositories/gamification-repository'

export interface AnalyticsSummary {
  totalTasks: number
  completedTasks: number
  completionRate: number
  overdueTasks: number
  highPriorityOpen: number
  xp: number
  level: number
  streak: number
  eventsThisWeek: number
  completionsByDay: { date: string; count: number }[]
}

export class AnalyticsEngine {
  async getSummary(): Promise<AnalyticsSummary> {
    const tasks = await taskRepository.getAll()
    const profile = await gamificationRepository.getProfile()
    const events = await eventRepository.getAll()

    const today = dayjs().startOf('day')
    const completed = tasks.filter((t) => t.status === 'done')
    const overdue = tasks.filter(
      (t) =>
        t.status !== 'done' &&
        t.dueDate &&
        dayjs(t.dueDate).isBefore(today, 'day'),
    )

    const weekAgo = dayjs().subtract(7, 'day')
    const eventsThisWeek = events.filter((e) =>
      dayjs(e.createdAt).isAfter(weekAgo),
    ).length

    const completionsByDay: { date: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
      const count = events.filter(
        (e) =>
          e.type === 'task_completed' &&
          e.createdAt.slice(0, 10) === date,
      ).length
      completionsByDay.push({ date, count })
    }

    return {
      totalTasks: tasks.length,
      completedTasks: completed.length,
      completionRate: tasks.length ? (completed.length / tasks.length) * 100 : 0,
      overdueTasks: overdue.length,
      highPriorityOpen: tasks.filter(
        (t) => t.priority === 'high' && t.status !== 'done',
      ).length,
      xp: profile.xp,
      level: profile.level,
      streak: profile.streak,
      eventsThisWeek,
      completionsByDay,
    }
  }
}

export const analyticsEngine = new AnalyticsEngine()
