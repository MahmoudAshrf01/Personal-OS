# Product Vision

Build a **Personal Operating System** — a single offline-first workspace for daily productivity:

- **Tasks & Goals** with nested groups and drag-and-drop boards
- **Notes & Journal** with rich text (TipTap)
- **Calendar & Pomodoro** for time awareness
- **Gamification** (XP, levels, coins, achievements) to sustain motivation
- **Analytics & Reviews** for weekly reflection
- **Snapshot Engine** for point-in-time backups

## Principles

1. **Offline first** — IndexedDB via Dexie; no network required.
2. **Backend ready** — repository pattern allows swapping to REST/GraphQL later.
3. **Feature-based** — each module is self-contained under `src/features/`.
4. **Delightful UX** — Motion animations, AMOLED dark mode, keyboard shortcuts.
