import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import type { AppEvent } from '@/domain/event'
import type { Task } from '@/domain/task'
import { eventRepository } from '@/repositories/event-repository'
import { taskRepository } from '@/repositories/task-repository'

dayjs.extend(isSameOrAfter)

export interface DayActivity {
  date: string
  completed: number
  created: number
  workload: number
  rate: number
  pomodoros: number
}

function countEventsOnDate(events: AppEvent[], type: AppEvent['type'], date: string) {
  return events.filter(
    (event) => event.type === type && event.createdAt.slice(0, 10) === date,
  ).length
}

function computeDayActivity(
  tasks: Task[],
  events: AppEvent[],
  date: string,
): DayActivity {
  const dayStart = dayjs(date).startOf('day')

  const completed = countEventsOnDate(events, 'task_completed', date)
  const created = countEventsOnDate(events, 'task_created', date)
  const pomodoros = countEventsOnDate(events, 'pomodoro_finished', date)

  const openAtStart = tasks.filter((task) => {
    if (dayjs(task.createdAt).isAfter(dayStart)) return false
    if (!task.completedAt) return true
    return dayjs(task.completedAt).isSame(dayStart, 'day') || dayjs(task.completedAt).isAfter(dayStart)
  }).length

  const createdToday = tasks.filter((task) =>
    dayjs(task.createdAt).isSame(dayStart, 'day'),
  ).length

  const workload = openAtStart + createdToday
  const rate =
    workload > 0
      ? Math.min(100, (completed / workload) * 100)
      : completed > 0
        ? 100
        : 0

  return { date, completed, created, workload, rate, pomodoros }
}

function eachDayInRange(start: string, end: string): string[] {
  const days: string[] = []
  let cursor = dayjs(start).startOf('day')
  const last = dayjs(end).startOf('day')

  while (cursor.isSame(last, 'day') || cursor.isBefore(last, 'day')) {
    days.push(cursor.format('YYYY-MM-DD'))
    cursor = cursor.add(1, 'day')
  }

  return days
}

export class CalendarEngine {
  async getActivityForRange(start: string, end: string): Promise<Map<string, DayActivity>> {
    const [tasks, events] = await Promise.all([
      taskRepository.getAll(),
      eventRepository.getAll(),
    ])

    const activity = new Map<string, DayActivity>()
    for (const date of eachDayInRange(start, end)) {
      activity.set(date, computeDayActivity(tasks, events, date))
    }

    return activity
  }

  async getMonthActivity(year: number, month: number): Promise<Map<string, DayActivity>> {
    const start = dayjs().year(year).month(month).startOf('month').format('YYYY-MM-DD')
    const end = dayjs().year(year).month(month).endOf('month').format('YYYY-MM-DD')
    return this.getActivityForRange(start, end)
  }

  async getWeekActivity(weekStart: string): Promise<DayActivity[]> {
    const start = dayjs(weekStart).startOf('day').format('YYYY-MM-DD')
    const end = dayjs(weekStart).add(6, 'day').format('YYYY-MM-DD')
    const activity = await this.getActivityForRange(start, end)
    return eachDayInRange(start, end).map((date) => activity.get(date)!)
  }
}

export const calendarEngine = new CalendarEngine()

export function getActivityTone(rate: number, hasActivity: boolean) {
  if (!hasActivity) return 'empty' as const
  if (rate >= 100) return 'complete' as const
  if (rate >= 50) return 'partial' as const
  return 'low' as const
}
