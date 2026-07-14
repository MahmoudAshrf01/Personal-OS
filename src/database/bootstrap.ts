import type { TaskPriority, TaskStatus } from '@/domain/task'
import { db, initDatabase } from '@/database/db'
import { taskRepository } from '@/repositories/task-repository'
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
  if (count > 0) return

  // Migrate from legacy localStorage if present
  const legacyRaw = localStorage.getItem(STORAGE_KEY)
  if (legacyRaw) {
    try {
      const parsed = JSON.parse(legacyRaw) as { state?: { todos?: LegacyTodo[] } }
      const legacyTodos = parsed.state?.todos ?? []
      if (legacyTodos.length > 0) {
        for (const todo of legacyTodos) {
          await taskRepository.create({
            title: todo.title,
            description: todo.description,
            status: todo.status as TaskStatus,
            priority: todo.priority as TaskPriority,
            dueDate: todo.dueDate,
            tags: todo.tags,
          })
        }
        return
      }
    } catch {
      // fall through to seed
    }
  }

  // Seed sample tasks
  for (const sample of SAMPLE_TODOS) {
    await taskRepository.create(sample)
  }
}
