# Analytics

## Metrics

| Metric | Source |
|--------|--------|
| Completion rate | done / total tasks |
| Overdue count | tasks with past due date |
| High-priority open | high priority, not done |
| XP & level | gamification profile |
| Streak | profile streak counter |
| Events this week | event log last 7 days |
| Completions by day | task_completed events, 7-day bar chart |

## Dashboard Integration

Dashboard (`/`) and Analytics (`/analytics`) both consume `AnalyticsEngine.getSummary()`.

## Future

- Heatmap calendar (GitHub-style)
- Focus time from pomodoro sessions
- XP growth line chart
