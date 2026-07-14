import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Plus, Target } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Goal } from '@/domain/goal'
import { goalRepository } from '@/repositories/goal-repository'

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [title, setTitle] = useState('')

  const load = () => goalRepository.getAll().then(setGoals)
  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!title.trim()) return
    await goalRepository.create({ title })
    setTitle('')
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{goal.title}</CardTitle>
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
