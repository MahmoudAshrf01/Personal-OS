# System Architecture

Feature-based architecture with dedicated **engines** that orchestrate business logic.

```
┌─────────────────────────────────────────────────────────┐
│                     UI (React + Motion)                  │
│  features/tasks · goals · notes · analytics · …         │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Zustand (UI state)                     │
│  filters · modals · theme · sidebar                      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                      Engines                             │
│  Task · Analytics · Game · Review · Snapshot · Notify   │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Repositories                           │
│  CRUD abstraction (IndexedDB today, API tomorrow)        │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              Dexie / IndexedDB                           │
└─────────────────────────────────────────────────────────┘
```

## Engines

| Engine | Responsibility |
|--------|----------------|
| **Task** | Task CRUD, status transitions, group nesting |
| **Game** | XP awards, level-ups, coins, achievements |
| **Analytics** | Aggregate events into metrics |
| **Review** | Generate weekly/monthly summaries |
| **Snapshot** | Capture & restore full app state |
| **Notification** | In-app toasts & reminders |

## Module Boundaries

- Features **never** import Dexie directly — always go through repositories or engines.
- Engines **never** import React — pure TypeScript.
- Motion animations stay in the **UI layer** only.
