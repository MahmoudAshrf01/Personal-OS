# Data Flow

```
User action (UI)
  → Zustand store action (optional)
    → Engine method
      → Repository CRUD (Dexie)
      → Side effects (events, XP, notifications)
        → UI re-fetch / reactive update
          → Motion animation on render
```

## Example: Complete a task

1. User drags task to "Done" column
2. `TaskStore.handleDragEnd` → `TaskEngine.handleDragEnd`
3. `TaskEngine.update` sets status + completedAt
4. `EventRepository.create('task_completed')`
5. `GameEngine.onTaskCompleted` → XP, coins, streak, level-up event
6. `AchievementEngine.evaluateForMetric` → unlock thresholds, bonus XP/coins, toast
7. `TaskStore.loadTasks` refreshes UI
8. Motion `layout` animates card into Done column

## Example: Finish a pomodoro

1. Timer reaches zero on Pomodoro page
2. `EventRepository.create('pomodoro_finished')`
3. `GameEngine.onPomodoroFinished` → `AchievementEngine.evaluateForMetric('pomodoro_sessions')`

## Example: Complete a goal

1. User marks goal complete on Goals page
2. `GoalEngine.complete` → status `completed`, progress 100
3. `EventRepository.create('goal_completed')`
4. `GameEngine.onGoalCompleted` → `AchievementEngine.evaluateForMetric('goals_completed')`

## Example: Bootstrap / first launch

1. `bootstrapDatabase` → `initDatabase` (profile + upsert achievements)
2. Seed or migrate sample tasks (creates `task_created` / done tasks as seeded)
3. `AchievementEngine.evaluateAll()` — retroactive unlocks for existing progress
