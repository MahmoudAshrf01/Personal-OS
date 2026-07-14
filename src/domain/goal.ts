export type GoalStatus = 'active' | 'completed' | 'archived'

export interface Goal {
  id: string
  title: string
  description: string
  status: GoalStatus
  targetDate: string | null
  groupId: string | null
  progress: number
  createdAt: string
  updatedAt: string
}

export type GoalDraft = Pick<Goal, 'title'> &
  Partial<Pick<Goal, 'description' | 'status' | 'targetDate' | 'groupId' | 'progress'>>
