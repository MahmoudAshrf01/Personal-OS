import { nanoid } from 'nanoid'

import { db } from '@/database/db'
import type { Goal, GoalDraft } from '@/domain/goal'
import type { Repository } from '@/repositories/base-repository'

export class GoalRepository implements Repository<Goal, GoalDraft, Partial<Goal>> {
  async getAll(): Promise<Goal[]> {
    return db.goals.orderBy('createdAt').reverse().toArray()
  }

  async getById(id: string): Promise<Goal | undefined> {
    return db.goals.get(id)
  }

  async create(draft: GoalDraft): Promise<Goal> {
    const now = new Date().toISOString()
    const goal: Goal = {
      id: nanoid(),
      title: draft.title.trim(),
      description: draft.description?.trim() ?? '',
      status: draft.status ?? 'active',
      targetDate: draft.targetDate ?? null,
      groupId: draft.groupId ?? null,
      progress: draft.progress ?? 0,
      createdAt: now,
      updatedAt: now,
    }
    await db.goals.add(goal)
    return goal
  }

  async update(id: string, patch: Partial<Goal>): Promise<Goal> {
    const existing = await db.goals.get(id)
    if (!existing) throw new Error(`Goal ${id} not found`)
    const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() }
    await db.goals.put(updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    await db.goals.delete(id)
  }
}

export const goalRepository = new GoalRepository()
