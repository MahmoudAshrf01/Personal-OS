# Domain Models

Pure TypeScript types — no framework imports.

## Task

```typescript
type TaskStatus = 'planned' | 'in_progress' | 'done' | 'archived'
type TaskPriority = 'low' | 'medium' | 'high'

interface Task {
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
```

## Goal

```typescript
interface Goal {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'archived'
  targetDate: string | null
  groupId: string | null
  progress: number // 0–100
  createdAt: string
  updatedAt: string
}
```

## Group (nested)

```typescript
interface Group {
  id: string
  name: string
  parentId: string | null
  type: 'task' | 'goal'
  color: string | null
  createdAt: string
}
```

## Note, Journal, Review, Achievement, Reward, Snapshot, Event

See `src/domain/` for full definitions. Each entity has `id`, timestamps, and feature-specific fields.

## Gamification Profile

```typescript
interface UserProfile {
  id: 'default'
  xp: number
  level: number
  coins: number
  streak: number
  lastActiveDate: string | null
}
```
