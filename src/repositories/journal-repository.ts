import { nanoid } from 'nanoid'

import { db } from '@/database/db'
import type { JournalDraft, JournalEntry } from '@/domain/journal'
import type { Repository } from '@/repositories/base-repository'

export class JournalRepository
  implements Repository<JournalEntry, JournalDraft, Partial<JournalEntry>>
{
  async getAll(): Promise<JournalEntry[]> {
    return db.journalEntries.orderBy('date').reverse().toArray()
  }

  async getById(id: string): Promise<JournalEntry | undefined> {
    return db.journalEntries.get(id)
  }

  async create(draft: JournalDraft): Promise<JournalEntry> {
    const now = new Date().toISOString()
    const entry: JournalEntry = {
      id: nanoid(),
      date: draft.date,
      content: draft.content,
      mood: draft.mood ?? null,
      createdAt: now,
      updatedAt: now,
    }
    await db.journalEntries.add(entry)
    return entry
  }

  async update(id: string, patch: Partial<JournalEntry>): Promise<JournalEntry> {
    const existing = await db.journalEntries.get(id)
    if (!existing) throw new Error(`Journal entry ${id} not found`)
    const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() }
    await db.journalEntries.put(updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    await db.journalEntries.delete(id)
  }
}

export const journalRepository = new JournalRepository()
