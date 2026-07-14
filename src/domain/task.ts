export type TaskStatus = 'planned' | 'in_progress' | 'done' | 'archived'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  tags: string[]
  groupId: string | null
  goalId: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export type TaskDraft = Pick<Task, 'title'> &
  Partial<
    Pick<
      Task,
      'description' | 'status' | 'priority' | 'dueDate' | 'tags' | 'groupId' | 'goalId'
    >
  >

export type TaskUpdate = Partial<Omit<Task, 'id' | 'createdAt'>>
