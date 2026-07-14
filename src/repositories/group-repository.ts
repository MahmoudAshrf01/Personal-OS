import { nanoid } from 'nanoid'

import { db } from '@/database/db'
import type { Group, GroupDraft } from '@/domain/group'
import type { Repository } from '@/repositories/base-repository'

export class GroupRepository implements Repository<Group, GroupDraft, Partial<Group>> {
  async getAll(): Promise<Group[]> {
    return db.groups.orderBy('createdAt').toArray()
  }

  async getById(id: string): Promise<Group | undefined> {
    return db.groups.get(id)
  }

  async getByParent(parentId: string | null): Promise<Group[]> {
    return db.groups.where('parentId').equals(parentId ?? '').toArray()
  }

  async create(draft: GroupDraft): Promise<Group> {
    const group: Group = {
      id: nanoid(),
      name: draft.name.trim(),
      parentId: draft.parentId ?? null,
      type: draft.type,
      color: draft.color ?? null,
      createdAt: new Date().toISOString(),
    }
    await db.groups.add(group)
    return group
  }

  async update(id: string, patch: Partial<Group>): Promise<Group> {
    const existing = await db.groups.get(id)
    if (!existing) throw new Error(`Group ${id} not found`)
    const updated = { ...existing, ...patch }
    await db.groups.put(updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    await db.groups.delete(id)
  }
}

export const groupRepository = new GroupRepository()
