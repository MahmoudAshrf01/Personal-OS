# State Management

## Split

| Concern | Tool | Examples |
|---------|------|----------|
| **Persistent data** | Dexie via repositories | tasks, goals, notes, profile |
| **UI state** | Zustand | sidebar, theme, search, filters |
| **Business logic** | Engines | XP awards, analytics aggregation |

## Stores

- `useUiStore` — sidebar open/closed, theme preference (persisted)
- `useTaskStore` — tasks loaded from Dexie, search/filter UI, delegates to `TaskEngine`

## Rules

1. Never persist business data in Zustand — use Dexie.
2. Load tasks with `loadTasks()` after DB bootstrap.
3. Engines are called from stores or feature actions, not from components directly (except read-only analytics).
