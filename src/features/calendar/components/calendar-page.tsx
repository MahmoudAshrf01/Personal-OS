import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task } from '@/domain/task'
import { taskRepository } from '@/repositories/task-repository'

export function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    taskRepository.getAll().then(setTasks)
  }, [])

  const withDue = tasks.filter((t) => t.dueDate).sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <Calendar className="mr-1 size-3.5" />
          Calendar
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold">Due dates</h1>
      </motion.header>

      <div className="space-y-3">
        {withDue.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks with due dates yet.</p>
        ) : (
          withDue.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Due {dayjs(task.dueDate).format('MMM D, YYYY')} · {task.status.replace('_', ' ')}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
