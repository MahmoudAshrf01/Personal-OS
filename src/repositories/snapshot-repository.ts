import { nanoid } from 'nanoid'

import { db } from '@/database/db'
import type { Snapshot } from '@/domain/snapshot'

export class SnapshotRepository {
  async getAll(): Promise<Snapshot[]> {
    return db.snapshots.orderBy('createdAt').reverse().toArray()
  }

  async create(label: string): Promise<Snapshot> {
    const tables = [
      'tasks',
      'goals',
      'groups',
      'notes',
      'journalEntries',
      'profile',
      'achievements',
    ] as const

    const data: Record<string, unknown> = {}
    for (const table of tables) {
      data[table] = await db.table(table).toArray()
    }

    const snapshot: Snapshot = {
      id: nanoid(),
      label,
      data: JSON.stringify(data),
      createdAt: new Date().toISOString(),
    }
    await db.snapshots.add(snapshot)
    return snapshot
  }

  async delete(id: string): Promise<void> {
    await db.snapshots.delete(id)
  }
}

export const snapshotRepository = new SnapshotRepository()
