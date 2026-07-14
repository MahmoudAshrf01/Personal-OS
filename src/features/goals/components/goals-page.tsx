import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Check, Plus, Target } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Goal } from '@/domain/goal'
import { goalEngine } from '@/engines/goal-engine'

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [title, setTitle] = useState('')

  const load = () => goalEngine.getAll().then(setGoals)
  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!title.trim()) return
    await goalEngine.create(title)
    setTitle('')
    load()
  }

  const handleComplete = async (id: string) => {
    await goalEngine.complete(id)
    load()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <Target className="mr-1 size-3.5" />
          Goals
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold">Long-term objectives</h1>
      </motion.header>

      <div className="flex gap-2">
        <Input
          placeholder="New goal…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      <div className="grid gap-3">
        {goals.map((goal, i) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={goal.status === 'completed' ? 'border-primary/30' : undefined}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{goal.title}</CardTitle>
                  {goal.status === 'completed' && (
                    <Badge className="mt-2" variant="secondary">
                      Completed
                    </Badge>
                  )}
                </div>
                {goal.status !== 'completed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleComplete(goal.id)}
                  >
                    <Check className="size-4" />
                    Complete
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{goal.progress}% complete</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
