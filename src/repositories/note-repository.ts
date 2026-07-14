import { nanoid } from 'nanoid'

import { db } from '@/database/db'
import type { Note, NoteDraft } from '@/domain/note'
import type { Repository } from '@/repositories/base-repository'

export class NoteRepository implements Repository<Note, NoteDraft, Partial<Note>> {
  async getAll(): Promise<Note[]> {
    return db.notes.orderBy('updatedAt').reverse().toArray()
  }

  async getById(id: string): Promise<Note | undefined> {
    return db.notes.get(id)
  }

  async create(draft: NoteDraft): Promise<Note> {
    const now = new Date().toISOString()
    const note: Note = {
      id: nanoid(),
      title: draft.title.trim(),
      content: draft.content ?? '',
      archived: draft.archived ?? false,
      createdAt: now,
      updatedAt: now,
    }
    await db.notes.add(note)
    return note
  }

  async update(id: string, patch: Partial<Note>): Promise<Note> {
    const existing = await db.notes.get(id)
    if (!existing) throw new Error(`Note ${id} not found`)
    const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() }
    await db.notes.put(updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    await db.notes.delete(id)
  }
}

export const noteRepository = new NoteRepository()
