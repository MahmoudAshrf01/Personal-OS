# Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | engines, repositories (mock Dexie) |
| Integration | Vitest + fake-indexeddb | full CRUD flows |
| E2E | Playwright | task board DnD, navigation, dark mode |

## Priority test cases

1. TaskEngine awards XP on completion
2. Gamification streak increments daily
3. Analytics summary calculates completion rate
4. Bootstrap seeds DB on first load
5. Legacy localStorage migration

## Motion testing

Visual/regression only — assert elements render; avoid testing animation frames.
