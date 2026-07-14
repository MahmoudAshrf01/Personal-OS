import { getDay, getDaysInMonth } from 'date-fns'
import dayjs from 'dayjs'
import { useMemo, type ReactNode } from 'react'

import { useCalendarMonth, useCalendarYear } from '@/components/kibo-ui/calendar'
import type { DayActivity } from '@/engines/calendar-engine'
import { cn } from '@/lib/utils'

import { CalendarDayCell } from './calendar-day-cell'

export function ActivityCalendarBody({
  activityByDate,
  selectedDate,
  onSelectDate,
  startDay = 0,
}: {
  activityByDate: Map<string, DayActivity>
  selectedDate: string | null
  onSelectDate: (date: string) => void
  startDay?: number
}) {
  const [month] = useCalendarMonth()
  const [year] = useCalendarYear()

  const currentMonthDate = useMemo(() => new Date(year, month, 1), [year, month])
  const daysInMonth = useMemo(() => getDaysInMonth(currentMonthDate), [currentMonthDate])
  const firstDay = useMemo(
    () => (getDay(currentMonthDate) - startDay + 7) % 7,
    [currentMonthDate, startDay],
  )

  const prevMonthData = useMemo(() => {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1))
    const prevMonthDaysArray = Array.from({ length: prevMonthDays }, (_, i) => i + 1)
    return { prevMonthDays, prevMonthDaysArray, prevMonth, prevMonthYear }
  }, [month, year])

  const nextMonthData = useMemo(() => {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextMonthYear = month === 11 ? year + 1 : year
    const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1))
    const nextMonthDaysArray = Array.from({ length: nextMonthDays }, (_, i) => i + 1)
    return { nextMonthDaysArray, nextMonth, nextMonthYear }
  }, [month, year])

  const today = dayjs().format('YYYY-MM-DD')
  const cells: ReactNode[] = []

  for (let i = 0; i < firstDay; i++) {
    const day =
      prevMonthData.prevMonthDaysArray[prevMonthData.prevMonthDays - firstDay + i]
    const date = dayjs()
      .year(prevMonthData.prevMonthYear)
      .month(prevMonthData.prevMonth)
      .date(day)
      .format('YYYY-MM-DD')

    cells.push(
      <div
        className={cn(
          'relative aspect-square overflow-hidden border-t border-r',
          (i + 1) % 7 === 0 && 'border-r-0',
        )}
        key={`prev-${i}`}
      >
        <CalendarDayCell
          activity={activityByDate.get(date)}
          date={date}
          day={day}
          isCurrentMonth={false}
          isSelected={selectedDate === date}
          isToday={date === today}
          onSelect={onSelectDate}
        />
      </div>,
    )
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = dayjs().year(year).month(month).date(day).format('YYYY-MM-DD')
    const index = firstDay + day - 1

    cells.push(
      <div
        className={cn(
          'relative aspect-square overflow-hidden border-t border-r',
          (index + 1) % 7 === 0 && 'border-r-0',
        )}
        key={date}
      >
        <CalendarDayCell
          activity={activityByDate.get(date)}
          date={date}
          day={day}
          isCurrentMonth
          isSelected={selectedDate === date}
          isToday={date === today}
          onSelect={onSelectDate}
        />
      </div>,
    )
  }

  const remainingDays = 7 - ((firstDay + daysInMonth) % 7)
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      const day = nextMonthData.nextMonthDaysArray[i]
      const date = dayjs()
        .year(nextMonthData.nextMonthYear)
        .month(nextMonthData.nextMonth)
        .date(day)
        .format('YYYY-MM-DD')
      const index = firstDay + daysInMonth + i

      cells.push(
        <div
          className={cn(
            'relative aspect-square overflow-hidden border-t border-r',
            (index + 1) % 7 === 0 && 'border-r-0',
          )}
          key={`next-${i}`}
        >
          <CalendarDayCell
            activity={activityByDate.get(date)}
            date={date}
            day={day}
            isCurrentMonth={false}
            isSelected={selectedDate === date}
            isToday={date === today}
            onSelect={onSelectDate}
          />
        </div>,
      )
    }
  }

  return <div className="grid flex-grow grid-cols-7">{cells}</div>
}
