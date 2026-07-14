export interface PomodoroSession {
  id: string
  taskId: string | null
  durationMinutes: number
  startedAt: string
  completedAt: string | null
}

export interface TimeEntry {
  id: string
  taskId: string | null
  description: string
  startedAt: string
  endedAt: string | null
  durationMinutes: number
}
