import { motion } from 'motion/react'
import { AlertCircle, CheckCircle2, CircleDot, Layers3, Sparkles } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import type { TodoStats } from '@/features/todos/types'

const statItems = [
  { key: 'total', label: 'Total', icon: Layers3, tone: 'text-foreground' },
  { key: 'planned', label: 'Planned', icon: CircleDot, tone: 'text-indigo-500' },
  { key: 'inProgress', label: 'Active', icon: Sparkles, tone: 'text-amber-500' },
  { key: 'done', label: 'Done', icon: CheckCircle2, tone: 'text-emerald-500' },
  { key: 'overdue', label: 'Overdue', icon: AlertCircle, tone: 'text-rose-500' },
] as const

export function TodoStatsPanel({ stats }: { stats: TodoStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {statItems.map((item, index) => {
        const Icon = item.icon
        const value = stats[item.key]

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
          >
            <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  <motion.p
                    key={value}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-2xl font-semibold tabular-nums"
                  >
                    {value}
                  </motion.p>
                </div>
                <div className={`rounded-full bg-muted p-2 ${item.tone}`}>
                  <Icon className="size-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
