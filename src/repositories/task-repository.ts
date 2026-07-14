import { nanoid } from 'nanoid'

import { db } from '@/database/db'
import type { Task, TaskDraft, TaskUpdate } from '@/domain/task'
import type { Repository } from '@/repositories/base-repository'

export class TaskRepository implements Repository<Task, TaskDraft, TaskUpdate> {
  async getAll(): Promise<Task[]> {
    return db.tasks.orderBy('createdAt').reverse().toArray()
  }

  async getById(id: string): Promise<Task | undefined> {
    return db.tasks.get(id)
  }

  async getByStatus(status: Task['status']): Promise<Task[]> {
    return db.tasks.where('status').equals(status).toArray()
  }

  async create(draft: TaskDraft): Promise<Task> {
    const now = new Date().toISOString()
    const task: Task = {
      id: nanoid(),
      title: draft.title.trim(),
      description: draft.description?.trim() ?? '',
      status: draft.status ?? 'planned',
      priority: draft.priority ?? 'medium',
      dueDate: draft.dueDate ?? null,
      tags: draft.tags ?? [],
      groupId: draft.groupId ?? null,
      goalId: draft.goalId ?? null,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    }
    await db.tasks.add(task)
    return task
  }

  async update(id: string, patch: TaskUpdate): Promise<Task> {
    const existing = await db.tasks.get(id)
    if (!existing) throw new Error(`Task ${id} not found`)

    const updated: Task = {
      ...existing,
      ...patch,
      title: patch.title?.trim() ?? existing.title,
      updatedAt: new Date().toISOString(),
    }
    await db.tasks.put(updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    await db.tasks.delete(id)
  }
}

export const taskRepository = new TaskRepository()
