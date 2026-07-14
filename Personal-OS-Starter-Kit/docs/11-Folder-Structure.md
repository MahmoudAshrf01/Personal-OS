# Folder Structure

Feature-based React project with clear separation of concerns.

```
src/
├── app/                        # Application shell
│   ├── layout.tsx              # Root layout (sidebar, header)
│   ├── router.tsx              # Route definitions
│   └── providers.tsx           # DB init, theme, etc.
│
├── components/                 # Shared UI
│   ├── ui/                     # shadcn/ui primitives
│   ├── kibo-ui/                # Kibo UI composites
│   └── theme-toggle.tsx
│
├── domain/                     # Domain types & enums (no I/O)
│   ├── task.ts
│   ├── goal.ts
│   ├── group.ts
│   ├── note.ts
│   ├── journal.ts
│   ├── review.ts
│   ├── gamification.ts
│   ├── snapshot.ts
│   └── event.ts
│
├── database/                   # Dexie schema & migrations
│   └── db.ts
│
├── repositories/               # Data access (backend-ready)
│   ├── base-repository.ts
│   ├── task-repository.ts
│   ├── goal-repository.ts
│   ├── group-repository.ts
│   ├── note-repository.ts
│   ├── journal-repository.ts
│   ├── review-repository.ts
│   ├── gamification-repository.ts
│   ├── snapshot-repository.ts
│   └── event-repository.ts
│
├── engines/                    # Business logic orchestration
│   ├── task-engine.ts
│   ├── analytics-engine.ts
│   ├── game-engine.ts
│   ├── review-engine.ts
│   ├── snapshot-engine.ts
│   └── notification-engine.ts
│
├── store/                      # Zustand UI stores
│   ├── ui-store.ts
│   └── todo-store.ts           # Legacy bridge during migration
│
├── features/                   # Feature modules (UI + hooks)
│   ├── tasks/
│   ├── goals/
│   ├── calendar/
│   ├── notes/
│   ├── journal/
│   ├── pomodoro/
│   ├── analytics/
│   ├── gamification/
│   └── dashboard/
│
├── hooks/                      # Shared React hooks
│   └── use-keyboard-shortcuts.ts
│
└── lib/                        # Utilities
    └── utils.ts
```

## Conventions

- **Features** own their components, constants, and feature-specific hooks.
- **Domain** holds pure TypeScript types — no React, no Dexie imports.
- **Repositories** implement CRUD against IndexedDB; swap for REST later.
- **Engines** coordinate repositories and emit side effects (XP, snapshots, events).
- **Motion** animations live in feature components, not in engines or repositories.
