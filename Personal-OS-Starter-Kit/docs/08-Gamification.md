# Gamification

## Core Mechanics

| Mechanic | Details |
|----------|---------|
| **XP** | Earned on task create (+5) and complete (+25); bonus XP from achievements |
| **Levels** | 100 XP per level (`level = floor(xp / 100) + 1`) |
| **Coins** | +10 per task completed; bonus coins from achievements; spend on rewards (future) |
| **Streaks** | Daily activity tracked; resets if a day is missed |
| **Achievements** | Data-driven milestones across tasks, focus, consistency, and milestones |

## Achievement Schema

| Field | Purpose |
|-------|---------|
| `id` | Stable DB primary key |
| `key` | Machine-readable slug |
| `category` | `tasks` \| `focus` \| `consistency` \| `milestones` |
| `metric` | What to measure (see below) |
| `threshold` | Numeric target |
| `title`, `description`, `icon` | Display |
| `xpReward`, `coinReward` | Unlock bonus |
| `unlockedAt` | `null` until earned |

Definitions live in `src/domain/achievement-definitions.ts` and are upserted into IndexedDB on init (new rows only; never overwrite `unlockedAt`).

## Supported Metrics

| Metric | Source |
|--------|--------|
| `tasks_created` | `task_created` events |
| `tasks_completed` | `task_completed` events |
| `streak_days` | `profile.streak` |
| `pomodoro_sessions` | `pomodoro_finished` events |
| `goals_completed` | goals with `status === 'completed'` |
| `perfect_days` | calendar days with 100% daily completion rate |
| `level_reached` | `profile.level` |

## Achievement Catalog

**~100 achievements** across 4 categories. Canonical list: `src/domain/achievement-definitions.ts` (upserted on init).

| Category | Metric ladders |
|----------|----------------|
| **Tasks** | `tasks_created` (1→500), `tasks_completed` (1→1000) |
| **Focus** | `pomodoro_sessions` (1→365) |
| **Consistency** | `streak_days` (2→365), `perfect_days` (1→200) |
| **Milestones** | `level_reached` (2→100), `goals_completed` (1→50) |

Original core IDs are preserved. Seeded sample tasks **do** count toward metrics.

### Filters & sort (UI)

- **Status:** All · Completed · Locked
- **Category:** All · Tasks · Focus · Consistency · Milestones
- **Sort:** Completed first (default) · By progress · By category

### Completed state (UI)

Unlocked achievements show a **Completed** badge, emerald card styling, green 100% progress bar, checkmark on the icon, and unlock date. Locked ones show **Locked** with live `current / threshold` progress.

## Evaluation Flow

```
UserAction / BootstrapComplete
  → Engine hook (GameEngine / GoalEngine / bootstrap)
    → AchievementEngine.evaluateForMetric / evaluateAll
      → load metrics + locked achievements
      → unlock when current >= threshold
        → XP & coin rewards
        → emit achievement_unlocked event
        → NotificationEngine toast
```

`AchievementEngine` is the single evaluation path. Engines never hardcode achievement IDs or thresholds.

Triggers:

| Trigger | Evaluation |
|---------|------------|
| Task created | `tasks_created` |
| Task completed | `tasks_completed`, `streak_days`, `level_reached`, `perfect_days` |
| Pomodoro finished | `pomodoro_sessions` |
| Goal completed | `goals_completed` |
| Bootstrap done | `evaluateAll()` (retroactive sync) |

## Progress (computed)

```typescript
interface AchievementProgress {
  achievement: Achievement
  current: number
  percent: number // 0–100, capped
}
```

## UI

Gamification page at `/gamification` shows:

- Level, coins, streak, XP bar, and **completed / total** summary
- Filters: status (All / Completed / Locked), category, sort (**Completed first** by default)
- Completed: emerald styling, **Completed** badge, 100% bar, check overlay, unlock date
- Locked: progress bar + `current / threshold`
- XP/coin rewards on each card
- Motion reveal animations
