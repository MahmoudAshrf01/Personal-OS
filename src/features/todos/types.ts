import type { Task, TaskPriority, TaskStatus } from '@/domain/task'

export type TodoStatus = TaskStatus
export type TodoPriority = TaskPriority
export type TodoFilter = 'all' | TodoStatus
export type Todo = Task

export interface TodoStatusMeta {
  id: TodoStatus
  name: string
  color: string
}

export interface TodoDraft {
  title: string
  description?: string
  priority?: TodoPriority
  dueDate?: string | null
  tags?: string[]
  status?: TodoStatus
}

export interface TodoStats {
  total: number
  planned: number
  inProgress: number
  done: number
  overdue: number
  highPriority: number
}
