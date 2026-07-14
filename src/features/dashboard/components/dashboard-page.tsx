import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Flame, Sparkles, Zap } from 'lucide-react'
import { motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analyticsEngine, type AnalyticsSummary } from '@/engines/analytics-engine'
import { gameEngine } from '@/engines/game-engine'

export function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)

  useEffect(() => {
    analyticsEngine.getSummary().then(setSummary)
  }, [])

  const xpProgress = summary ? gameEngine.getXpProgress(summary.xp) : null

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <Sparkles className="mr-1 size-3.5" />
          Dashboard
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Your Personal OS at a glance — tasks, streaks, and progress.
        </p>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Tasks', value: summary?.totalTasks ?? '—' },
          { label: 'Completed', value: summary?.completedTasks ?? '—' },
          { label: 'Streak', value: summary ? `${summary.streak} days` : '—', icon: Flame },
          { label: 'Level', value: summary?.level ?? '—', icon: Zap },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-2xl font-semibold">
                {stat.icon ? <stat.icon className="size-5 text-primary" /> : null}
                {stat.value}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {xpProgress && summary ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">XP Progress — Level {summary.level}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.percent}%` }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {xpProgress.current} / {xpProgress.max} XP to next level
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          to="/tasks"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Open Tasks <ArrowRight className="size-4" />
        </Link>
        <Link
          to="/analytics"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted"
        >
          View Analytics
        </Link>
      </div>
    </div>
  )
}
