# Gamification

## Core Mechanics

| Mechanic | Details |
|----------|---------|
| **XP** | Earned on task create (+5) and complete (+25) |
| **Levels** | 100 XP per level (`level = floor(xp / 100) + 1`) |
| **Coins** | +10 per task completed; spend on rewards (future) |
| **Streaks** | Daily activity tracked; resets if a day is missed |
| **Achievements** | Unlock milestones for bonus XP & coins |

## Achievements (seed data)

1. **First Step** — create first task
2. **Getting Momentum** — complete 10 tasks
3. **Week Warrior** — 7-day streak

## Flow

```
Task completed → GameEngine.onTaskCompleted()
  → add XP & coins
  → update streak
  → check level up → emit event
  → check achievement thresholds → unlock & reward
```

## UI

Gamification page at `/gamification` shows level, coins, streak, XP bar, and achievement list with Motion reveal animations.
