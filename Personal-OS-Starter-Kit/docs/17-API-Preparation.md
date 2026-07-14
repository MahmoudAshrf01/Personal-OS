# API Preparation

Repositories abstract data access so a future backend swap requires no UI changes.

## Pattern

```typescript
// Today
const tasks = await taskRepository.getAll()

// Tomorrow
const tasks = await apiTaskRepository.getAll()
// same interface, HTTP under the hood
```

## Migration path

1. Define REST endpoints matching repository methods
2. Create `ApiTaskRepository implements Repository<Task, …>`
3. Inject via factory: `const repo = useRemote ? apiRepo : dexieRepo`
4. Add sync layer for offline queue (future)

## Snapshot export

`snapshotEngine.capture()` serializes all tables to JSON — useful for backup before migration.
