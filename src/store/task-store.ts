import { create } from 'zustand'

import type { TodoFilter, TodoStats } from '@/features/todos/types'
import type { Task, TaskDraft, TaskStatus } from '@/domain/task'
import { taskEngine } from '@/engines/task-engine'
import { parseISO, startOfDay } from 'date-fns'
import type { DragEndEvent } from '@dnd-kit/core'
import { PRIORITY_META } from '@/features/todos/constants'

interface TaskStore {
  tasks: Task[]
  loaded: boolean
  search: string
  filter: TodoFilter
  loadTasks: () => Promise<void>
  addTask: (draft: TaskDraft) => Promise<void>
  addTodo: (draft: TaskDraft) => Promise<void>
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>
  updateTodo: (id: string, patch: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  moveTask: (id: string, status: TaskStatus) => Promise<void>
  handleDragEnd: (event: DragEndEvent) => Promise<void>
  setSearch: (search: string) => void
  setFilter: (filter: TodoFilter) => void
  clearCompleted: () => Promise<void>
  getStats: () => TodoStats
  getVisibleTasks: () => Task[]
  getTasksByStatus: (status: TaskStatus) => Task[]
}

const sortTasks = (items: Task[]) =>
  [...items].sort((a, b) => {
    const priorityDiff =
      PRIORITY_META[b.priority].weight - PRIORITY_META[a.priority].weight
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

export function selectVisibleTasks(state: TaskStore): Task[] {
  const { tasks, search, filter } = state
  const query = search.trim().toLowerCase()
  return sortTasks(
    tasks.filter((task) => {
      const matchesFilter = filter === 'all' ? true : task.status === filter
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.toLowerCase().includes(query))
      return matchesFilter && matchesSearch
    }),
  )
}

export function selectStats(state: TaskStore): TodoStats {
  const { tasks } = state
  const today = startOfDay(new Date())
  return {
    total: tasks.length,
    planned: tasks.filter((t) => t.status === 'planned').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
    overdue: tasks.filter(
      (t) =>
        t.status !== 'done' &&
        t.dueDate &&
        startOfDay(parseISO(t.dueDate)) < today,
    ).length,
    highPriority: tasks.filter(
      (t) => t.priority === 'high' && t.status !== 'done',
    ).length,
  }
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loaded: false,
  search: '',
  filter: 'all',

  loadTasks: async () => {
    const tasks = await taskEngine.getAll()
    set({ tasks, loaded: true })
  },

  addTask: async (draft) => {
    if (!draft.title.trim()) return
    await taskEngine.create(draft)
    await get().loadTasks()
  },

  addTodo: async (draft) => get().addTask(draft),

  updateTask: async (id, patch) => {
    await taskEngine.update(id, patch)
    await get().loadTasks()
  },

  updateTodo: async (id, patch) => get().updateTask(id, patch),

  deleteTask: async (id) => {
    await taskEngine.delete(id)
    await get().loadTasks()
  },

  deleteTodo: async (id) => get().deleteTask(id),

  moveTask: async (id, status) => {
    await taskEngine.move(id, status)
    await get().loadTasks()
  },

  handleDragEnd: async (event) => {
    await taskEngine.handleDragEnd(event)
    await get().loadTasks()
  },

  setSearch: (search) => set({ search }),
  setFilter: (filter) => set({ filter }),

  clearCompleted: async () => {
    await taskEngine.clearCompleted()
    await get().loadTasks()
  },

  getStats: () => selectStats(get()),

  getVisibleTasks: () => selectVisibleTasks(get()),

  getTasksByStatus: (status) => {
    return sortTasks(selectVisibleTasks(get()).filter((t) => t.status === status))
  },
}))

// Backward-compatible alias
export const useTodoStore = useTaskStore
