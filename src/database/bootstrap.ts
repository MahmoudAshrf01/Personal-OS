import type { TaskPriority, TaskStatus } from '@/domain/task'
import { db, initDatabase } from '@/database/db'
import { achievementEngine } from '@/engines/achievement-engine'
import { taskEngine } from '@/engines/task-engine'
import { SAMPLE_TODOS, STORAGE_KEY } from '@/features/todos/constants'

interface LegacyTodo {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string | null
  tags: string[]
  createdAt: string
}

export async function bootstrapDatabase(): Promise<void> {
  await initDatabase()

  const count = await db.tasks.count()
  if (count === 0) {
    const legacyRaw = localStorage.getItem(STORAGE_KEY)
    let seeded = false

    if (legacyRaw) {
      try {
        const parsed = JSON.parse(legacyRaw) as { state?: { todos?: LegacyTodo[] } }
        const legacyTodos = parsed.state?.todos ?? []
        if (legacyTodos.length > 0) {
          for (const todo of legacyTodos) {
            const task = await taskEngine.create({
              title: todo.title,
              description: todo.description,
              status: 'planned',
              priority: todo.priority as TaskPriority,
              dueDate: todo.dueDate,
              tags: todo.tags,
            })
            if (todo.status === 'done') {
              await taskEngine.update(task.id, { status: 'done' })
            } else if (todo.status !== 'planned') {
              await taskEngine.update(task.id, { status: todo.status as TaskStatus })
            }
          }
          seeded = true
        }
      } catch {
        // fall through to sample seed
      }
    }

    if (!seeded) {
      for (const sample of SAMPLE_TODOS) {
        const task = await taskEngine.create({
          title: sample.title,
          description: sample.description,
          status: 'planned',
          priority: sample.priority,
          dueDate: sample.dueDate,
          tags: sample.tags,
        })
        if (sample.status === 'done') {
          await taskEngine.update(task.id, { status: 'done' })
        } else if (sample.status !== 'planned') {
          await taskEngine.update(task.id, { status: sample.status })
        }
      }
    }
  }

  await achievementEngine.evaluateAll()
}
