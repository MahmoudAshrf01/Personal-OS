export type EventType =
  | 'task_created'
  | 'task_completed'
  | 'task_deleted'
  | 'goal_completed'
  | 'pomodoro_finished'
  | 'level_up'
  | 'achievement_unlocked'

export interface AppEvent {
  id: string
  type: EventType
  payload: Record<string, unknown>
  createdAt: string
}
