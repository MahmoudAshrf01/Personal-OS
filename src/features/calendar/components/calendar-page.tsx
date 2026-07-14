import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { Calendar } from 'lucide-react'

import {
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  useCalendarMonth,
  useCalendarYear,
} from '@/components/kibo-ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  calendarEngine,
  type DayActivity,
  getActivityTone,
} from '@/engines/calendar-engine'
import { cn } from '@/lib/utils'

import { ActivityCalendarBody } from './activity-calendar-body'
import { CalendarWeekView } from './calendar-week-view'

type CalendarView = 'month' | 'week'

function startOfWeek(date: string) {
  return dayjs(date).startOf('week').format('YYYY-MM-DD')
}

export function CalendarPage() {
  const [view, setView] = useState<CalendarView>('month')
  const [activityByDate, setActivityByDate] = useState<Map<string, DayActivity>>(new Map())
  const [weekDays, setWeekDays] = useState<DayActivity[]>([])
  const [weekStart, setWeekStart] = useState(startOfWeek(dayjs().format('YYYY-MM-DD')))
  const [selectedDate, setSelectedDate] = useState<string | null>(dayjs().format('YYYY-MM-DD'))
  const [month] = useCalendarMonth()
  const [year] = useCalendarYear()

  const loadMonth = useCallback(async (y: number, m: number) => {
    const paddedStart = dayjs().year(y).month(m).startOf('month').subtract(7, 'day').format('YYYY-MM-DD')
    const paddedEnd = dayjs().year(y).month(m).endOf('month').add(7, 'day').format('YYYY-MM-DD')
    const activity = await calendarEngine.getActivityForRange(paddedStart, paddedEnd)
    setActivityByDate(activity)
  }, [])

  const loadWeek = useCallback(async (start: string) => {
    const days = await calendarEngine.getWeekActivity(start)
    setWeekDays(days)
  }, [])

  useEffect(() => {
    loadMonth(year, month)
  }, [year, month, loadMonth])

  useEffect(() => {
    loadWeek(weekStart)
  }, [weekStart, loadWeek])

  const selectedActivity =
    selectedDate != null
      ? view === 'week'
        ? weekDays.find((day) => day.date === selectedDate)
        : activityByDate.get(selectedDate)
      : undefined

  const monthStats = Array.from(activityByDate.values()).filter((day) =>
    dayjs(day.date).month() === month && dayjs(day.date).year() === year,
  )
  const perfectDays = monthStats.filter((day) => getActivityTone(day.rate, day.completed > 0 || day.created > 0) === 'complete').length
  const activeDays = monthStats.filter((day) => day.completed > 0 || day.created > 0 || day.pomodoros > 0).length

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <Calendar className="mr-1 size-3.5" />
          Calendar
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold">Activity history</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily completion from your task and focus history — not due dates.
        </p>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Perfect days</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-emerald-500">{perfectDays}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active days</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{activeDays}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Selected day</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {selectedActivity ? `${selectedActivity.rate.toFixed(0)}%` : '—'}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
          <CardTitle className="text-base">Completion grid</CardTitle>
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as CalendarView)}
          >
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          {view === 'month' ? (
            <CalendarProvider className="border-t" locale="en-US" startDay={0}>
              <CalendarDate>
                <CalendarDatePicker>
                  <CalendarMonthPicker />
                  <CalendarYearPicker end={dayjs().year() + 1} start={2020} />
                </CalendarDatePicker>
                <CalendarDatePagination />
              </CalendarDate>
              <CalendarHeader />
              <ActivityCalendarBody
                activityByDate={activityByDate}
                onSelectDate={setSelectedDate}
                selectedDate={selectedDate}
              />
            </CalendarProvider>
          ) : (
            <CalendarWeekView
              days={weekDays}
              onNextWeek={() =>
                setWeekStart(dayjs(weekStart).add(7, 'day').format('YYYY-MM-DD'))
              }
              onPreviousWeek={() =>
                setWeekStart(dayjs(weekStart).subtract(7, 'day').format('YYYY-MM-DD'))
              }
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
              weekStart={weekStart}
            />
          )}
        </CardContent>
      </Card>

      {selectedActivity && selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {dayjs(selectedDate).format('dddd, MMMM D, YYYY')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-4">
            <Stat label="Completion" value={`${selectedActivity.rate.toFixed(0)}%`} highlight={selectedActivity.rate >= 100} />
            <Stat label="Tasks done" value={String(selectedActivity.completed)} />
            <Stat label="Tasks added" value={String(selectedActivity.created)} />
            <Stat label="Focus sessions" value={String(selectedActivity.pomodoros)} />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <Legend color="bg-emerald-500" label="100% complete" />
        <Legend color="bg-amber-500" label="50–99%" />
        <Legend color="bg-orange-500" label="Below 50%" />
        <Legend color="bg-muted/80" label="No activity" />
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn('text-2xl font-semibold', highlight && 'text-emerald-500')}>{value}</p>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn('size-2.5 rounded-full', color)} />
      {label}
    </span>
  )
}
