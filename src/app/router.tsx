import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/app/layout'
import { AppProviders } from '@/app/providers'
import { AnalyticsPage } from '@/features/analytics/components/analytics-page'
import { CalendarPage } from '@/features/calendar/components/calendar-page'
import { DashboardPage } from '@/features/dashboard/components/dashboard-page'
import { GamificationPage } from '@/features/gamification/components/gamification-page'
import { GoalsPage } from '@/features/goals/components/goals-page'
import { JournalPage } from '@/features/journal/components/journal-page'
import { NotesPage } from '@/features/notes/components/notes-page'
import { PomodoroPage } from '@/features/pomodoro/components/pomodoro-page'
import { TodoApp } from '@/features/todos/components/todo-app'

export const router = createBrowserRouter([
  {
    element: (
      <AppProviders>
        <AppLayout />
      </AppProviders>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tasks', element: <TodoApp /> },
      { path: 'goals', element: <GoalsPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'notes', element: <NotesPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'pomodoro', element: <PomodoroPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'gamification', element: <GamificationPage /> },
    ],
  },
])
