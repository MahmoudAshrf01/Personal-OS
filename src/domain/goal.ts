export type GoalStatus = 'active' | 'completed' | 'archived'

export interface GoalStep {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  status: GoalStatus
  targetDate: string | null
  groupId: string | null
  progress: number
  steps: GoalStep[]
  createdAt: string
  updatedAt: string
}

export type GoalDraft = Pick<Goal, 'title'> &
  Partial<Pick<Goal, 'description' | 'status' | 'targetDate' | 'groupId' | 'progress'>> & {
    steps?: string[]
  }
