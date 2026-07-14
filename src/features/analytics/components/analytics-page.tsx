import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { BarChart3 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analyticsEngine, type AnalyticsSummary } from '@/engines/analytics-engine'

export function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)

  useEffect(() => {
    analyticsEngine.getSummary().then(setSummary)
  }, [])

  if (!summary) return null

  const maxCount = Math.max(...summary.completionsByDay.map((d) => d.count), 1)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <BarChart3 className="mr-1 size-3.5" />
          Analytics
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold">Productivity metrics</h1>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Completion rate</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {summary.completionRate.toFixed(0)}%
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Events this week</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{summary.eventsThisWeek}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Completions (7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-end gap-2">
            {summary.completionsByDay.map((day, i) => (
              <motion.div
                key={day.date}
                initial={{ height: 0 }}
                animate={{ height: `${(day.count / maxCount) * 100}%` }}
                transition={{ delay: i * 0.05 }}
                className="flex-1 rounded-t bg-primary/80 min-h-[4px]"
                title={`${day.date}: ${day.count}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            {summary.completionsByDay.map((d) => (
              <span key={d.date}>{d.date.slice(5)}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
