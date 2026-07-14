# Database Design

**IndexedDB via Dexie**, with a **repository pattern** for backend-ready data access.

## Tables (Dexie stores)

| Store | Key | Indexes |
|-------|-----|---------|
| `tasks` | `id` | `status`, `groupId`, `dueDate`, `createdAt` |
| `goals` | `id` | `status`, `groupId`, `createdAt` |
| `groups` | `id` | `parentId`, `type` |
| `notes` | `id` | `updatedAt`, `archived` |
| `journalEntries` | `id` | `date`, `createdAt` |
| `reviews` | `id` | `period`, `createdAt` |
| `achievements` | `id` | `unlockedAt` |
| `rewards` | `id` | `claimedAt` |
| `snapshots` | `id` | `createdAt` |
| `events` | `id` | `type`, `createdAt` |
| `pomodoroSessions` | `id` | `startedAt` |
| `timeEntries` | `id` | `taskId`, `startedAt` |
| `profile` | `id` | — (single-row: XP, level, coins) |

## Repository Pattern

```typescript
interface Repository<T, CreateDTO, UpdateDTO> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | undefined>
  create(data: CreateDTO): Promise<T>
  update(id: string, data: UpdateDTO): Promise<T>
  delete(id: string): Promise<void>
}
```

Implementations today use Dexie; future `ApiTaskRepository` implements the same interface.

## Migrations

Dexie version bumps in `database/db.ts`. Each version adds stores or indexes.
