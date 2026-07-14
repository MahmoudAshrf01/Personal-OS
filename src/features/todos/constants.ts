import type { TodoPriority, TodoStatusMeta } from '@/features/todos/types'

export const TODO_STATUSES: TodoStatusMeta[] = [
  { id: 'planned', name: 'Planned', color: '#6366f1' },
  { id: 'in_progress', name: 'In Progress', color: '#f59e0b' },
  { id: 'done', name: 'Done', color: '#10b981' },
]

export const PRIORITY_META: Record<
  TodoPriority,
  { label: string; color: string; weight: number }
> = {
  low: { label: 'Low', color: '#64748b', weight: 1 },
  medium: { label: 'Medium', color: '#3b82f6', weight: 2 },
  high: { label: 'High', color: '#ef4444', weight: 3 },
}

export const STORAGE_KEY = 'flow-todo:v1'

export const SAMPLE_TODOS = [
  {
    title: 'Design task board layout',
    description: 'Sketch a clean grouped list with drag-and-drop between statuses.',
    status: 'planned' as const,
    priority: 'high' as const,
    dueDate: null,
    tags: ['design', 'ui'],
  },
  {
    title: 'Wire up local persistence',
    description: 'Save todos to localStorage with Zustand middleware.',
    status: 'in_progress' as const,
    priority: 'medium' as const,
    dueDate: null,
    tags: ['state'],
  },
  {
    title: 'Polish micro-interactions',
    description: 'Add subtle Motion animations for add, remove, and toggle.',
    status: 'done' as const,
    priority: 'low' as const,
    dueDate: null,
    tags: ['motion'],
  },
]
