import dayjs from 'dayjs'

import type { DayActivity } from '@/engines/calendar-engine'
import { getActivityTone } from '@/engines/calendar-engine'
import { cn } from '@/lib/utils'

type CalendarDayCellProps = {
  date: string
  day: number
  activity?: DayActivity
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  onSelect: (date: string) => void
  compact?: boolean
}

export function CalendarDayCell({
  date,
  day,
  activity,
  isCurrentMonth,
  isToday,
  isSelected,
  onSelect,
  compact = false,
}: CalendarDayCellProps) {
  const hasActivity = Boolean(
    activity && (activity.completed > 0 || activity.created > 0 || activity.pomodoros > 0),
  )
  const tone = getActivityTone(activity?.rate ?? 0, hasActivity)
  const rate = activity?.rate ?? 0

  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      title={
        activity
          ? `${dayjs(date).format('MMM D')}: ${rate.toFixed(0)}% · ${activity.completed}/${activity.workload} completed`
          : dayjs(date).format('MMM D')
      }
      className={cn(
        'flex h-full w-full flex-col justify-between p-1.5 text-left transition-colors',
        !isCurrentMonth && 'opacity-50',
        tone === 'complete' && 'bg-emerald-500/15 hover:bg-emerald-500/20',
        tone === 'partial' && 'bg-amber-500/10 hover:bg-amber-500/15',
        tone === 'low' && 'bg-orange-500/10 hover:bg-orange-500/15',
        tone === 'empty' && 'hover:bg-muted/40',
        isToday && 'ring-2 ring-inset ring-primary/50',
        isSelected && 'ring-2 ring-inset ring-foreground/40',
      )}
    >
      <span
        className={cn(
          'self-end font-medium',
          compact ? 'text-xs' : 'text-sm',
          isToday ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {day}
      </span>

      <div className="space-y-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted/80">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              tone === 'complete' && 'bg-emerald-500',
              tone === 'partial' && 'bg-amber-500',
              tone === 'low' && 'bg-orange-500',
              tone === 'empty' && 'bg-transparent',
            )}
            style={{ width: `${hasActivity ? Math.max(rate, 8) : 0}%` }}
          />
        </div>
        {!compact && hasActivity && (
          <span className="block text-[10px] text-muted-foreground">
            {rate.toFixed(0)}%
          </span>
        )}
      </div>
    </button>
  )
}
