import dayjs from 'dayjs'

import type { ReviewPeriod } from '@/domain/review'
import { analyticsEngine } from '@/engines/analytics-engine'

export class ReviewEngine {
  async generateDraft(period: ReviewPeriod) {
    const summary = await analyticsEngine.getSummary()
    const end = dayjs()
    const start =
      period === 'weekly' ? end.subtract(7, 'day') : end.subtract(30, 'day')

    return {
      period,
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
      summary: `Completed ${summary.completedTasks} of ${summary.totalTasks} tasks (${summary.completionRate.toFixed(0)}% completion rate). Current streak: ${summary.streak} days. Level ${summary.level} with ${summary.xp} XP.`,
      highlights: [
        `${summary.completedTasks} tasks completed`,
        `${summary.streak}-day streak`,
        `Level ${summary.level} reached`,
      ],
      improvements:
        summary.overdueTasks > 0
          ? [`${summary.overdueTasks} overdue tasks need attention`]
          : ['Keep up the momentum!'],
    }
  }
}

export const reviewEngine = new ReviewEngine()
