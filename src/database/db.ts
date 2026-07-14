import Dexie, { type EntityTable } from 'dexie'

import type {
  Achievement,
  AppEvent,
  Goal,
  Group,
  JournalEntry,
  Note,
  PomodoroSession,
  Review,
  Reward,
  Snapshot,
  Task,
  TimeEntry,
  UserProfile,
} from '@/domain'

export class PersonalOSDatabase extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  goals!: EntityTable<Goal, 'id'>
  groups!: EntityTable<Group, 'id'>
  notes!: EntityTable<Note, 'id'>
  journalEntries!: EntityTable<JournalEntry, 'id'>
  reviews!: EntityTable<Review, 'id'>
  achievements!: EntityTable<Achievement, 'id'>
  rewards!: EntityTable<Reward, 'id'>
  snapshots!: EntityTable<Snapshot, 'id'>
  events!: EntityTable<AppEvent, 'id'>
  pomodoroSessions!: EntityTable<PomodoroSession, 'id'>
  timeEntries!: EntityTable<TimeEntry, 'id'>
  profile!: EntityTable<UserProfile, 'id'>

  constructor() {
    super('personal-os')

    this.version(1).stores({
      tasks: 'id, status, groupId, goalId, dueDate, createdAt, updatedAt',
      goals: 'id, status, groupId, createdAt, updatedAt',
      groups: 'id, parentId, type, createdAt',
      notes: 'id, archived, updatedAt, createdAt',
      journalEntries: 'id, date, createdAt',
      reviews: 'id, period, createdAt',
      achievements: 'id, key, unlockedAt',
      rewards: 'id, claimedAt',
      snapshots: 'id, createdAt',
      events: 'id, type, createdAt',
      pomodoroSessions: 'id, taskId, startedAt, completedAt',
      timeEntries: 'id, taskId, startedAt',
      profile: 'id',
    })
  }
}

export const db = new PersonalOSDatabase()

export async function initDatabase(): Promise<void> {
  const profile = await db.profile.get('default')
  if (!profile) {
    await db.profile.add({
      id: 'default',
      xp: 0,
      level: 1,
      coins: 0,
      streak: 0,
      lastActiveDate: null,
    })
  }

  const achievementCount = await db.achievements.count()
  if (achievementCount === 0) {
    await db.achievements.bulkAdd([
      {
        id: 'first-task',
        key: 'first_task',
        title: 'First Step',
        description: 'Create your first task',
        icon: 'sparkles',
        xpReward: 10,
        coinReward: 5,
        unlockedAt: null,
      },
      {
        id: 'ten-tasks',
        key: 'ten_tasks',
        title: 'Getting Momentum',
        description: 'Complete 10 tasks',
        icon: 'zap',
        xpReward: 50,
        coinReward: 25,
        unlockedAt: null,
      },
      {
        id: 'streak-7',
        key: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'flame',
        xpReward: 100,
        coinReward: 50,
        unlockedAt: null,
      },
    ])
  }
}
