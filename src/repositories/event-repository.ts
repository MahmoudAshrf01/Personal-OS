import { nanoid } from 'nanoid'

import { db } from '@/database/db'
import type { AppEvent, EventType } from '@/domain/event'
import type { Repository } from '@/repositories/base-repository'

export class EventRepository
  implements Repository<AppEvent, { type: EventType; payload?: Record<string, unknown> }>
{
  async getAll(): Promise<AppEvent[]> {
    return db.events.orderBy('createdAt').reverse().toArray()
  }

  async getById(id: string): Promise<AppEvent | undefined> {
    return db.events.get(id)
  }

  async getByType(type: EventType): Promise<AppEvent[]> {
    return db.events.where('type').equals(type).toArray()
  }

  async create(data: {
    type: EventType
    payload?: Record<string, unknown>
  }): Promise<AppEvent> {
    const event: AppEvent = {
      id: nanoid(),
      type: data.type,
      payload: data.payload ?? {},
      createdAt: new Date().toISOString(),
    }
    await db.events.add(event)
    return event
  }

  async update(): Promise<AppEvent> {
    throw new Error('Events are immutable')
  }

  async delete(id: string): Promise<void> {
    await db.events.delete(id)
  }
}

export const eventRepository = new EventRepository()
