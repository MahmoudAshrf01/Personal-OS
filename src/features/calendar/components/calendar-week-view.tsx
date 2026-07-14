import dayjs from 'dayjs'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { DayActivity } from '@/engines/calendar-engine'
import { cn } from '@/lib/utils'

import { CalendarDayCell } from './calendar-day-cell'

type CalendarWeekViewProps = {
  weekStart: string
  days: DayActivity[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
  onPreviousWeek: () => void
  onNextWeek: () => void
}

export function CalendarWeekView({
  weekStart,
  days,
  selectedDate,
  onSelectDate,
  onPreviousWeek,
  onNextWeek,
}: CalendarWeekViewProps) {
  const weekEnd = dayjs(weekStart).add(6, 'day')
  const today = dayjs().format('YYYY-MM-DD')

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <Button onClick={onPreviousWeek} size="icon" variant="ghost">
          <ChevronLeftIcon size={16} />
        </Button>
        <p className="text-sm font-medium">
          {dayjs(weekStart).format('MMM D')} – {weekEnd.format('MMM D, YYYY')}
        </p>
        <Button onClick={onNextWeek} size="icon" variant="ghost">
          <ChevronRightIcon size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-7 border-t">
        {days.map((activity, index) => {
          const date = activity.date
          const day = dayjs(date).date()
          const weekday = dayjs(date).format('ddd')

          return (
            <div
              className={cn(
                'flex min-h-36 flex-col border-r border-b',
                index % 7 === 6 && 'border-r-0',
              )}
              key={date}
            >
              <div className="border-b px-2 py-1.5 text-center text-xs text-muted-foreground">
                {weekday}
              </div>
              <CalendarDayCell
                activity={activity}
                compact
                date={date}
                day={day}
                isCurrentMonth
                isSelected={selectedDate === date}
                isToday={date === today}
                onSelect={onSelectDate}
              />
              <div className="mt-auto space-y-0.5 px-2 pb-2 text-[10px] text-muted-foreground">
                <p>{activity.completed} done</p>
                <p>{activity.pomodoros} focus</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
