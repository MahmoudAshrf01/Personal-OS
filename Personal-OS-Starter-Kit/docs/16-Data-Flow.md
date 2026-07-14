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
5. `GameEngine.onTaskCompleted` → XP, coins, streak, achievements
6. `TaskStore.loadTasks` refreshes UI
7. Motion `layout` animates card into Done column
