import type { DragEndEvent } from '@dnd-kit/core'

import type { Task, TaskDraft, TaskStatus, TaskUpdate } from '@/domain/task'
import { eventRepository } from '@/repositories/event-repository'
import { taskRepository } from '@/repositories/task-repository'
import { gameEngine } from '@/engines/game-engine'

const BOARD_STATUSES: TaskStatus[] = ['planned', 'in_progress', 'done']

export class TaskEngine {
  async getAll(): Promise<Task[]> {
    return taskRepository.getAll()
  }

  async create(draft: TaskDraft): Promise<Task> {
    const task = await taskRepository.create(draft)
    await eventRepository.create({ type: 'task_created', payload: { taskId: task.id } })
    await gameEngine.onTaskCreated()
    return task
  }

  async update(id: string, patch: TaskUpdate): Promise<Task> {
    const existing = await taskRepository.getById(id)
    if (!existing) throw new Error(`Task ${id} not found`)

    const wasDone = existing.status === 'done'
    const updated = await taskRepository.update(id, patch)

    if (!wasDone && updated.status === 'done') {
      const completed = await taskRepository.update(id, {
        ...patch,
        completedAt: new Date().toISOString(),
      })
      await eventRepository.create({
        type: 'task_completed',
        payload: { taskId: id, priority: completed.priority },
      })
      await gameEngine.onTaskCompleted()
      return completed
    }

    return updated
  }

  async delete(id: string): Promise<void> {
    await taskRepository.delete(id)
    await eventRepository.create({ type: 'task_deleted', payload: { taskId: id } })
  }

  async move(id: string, status: TaskStatus, _index?: number): Promise<Task[]> {
    const all = await taskRepository.getAll()
    const current = all.find((t) => t.id === id)
    if (!current) return all

    if (current.status !== status) {
      await this.update(id, { status })
    }

    return taskRepository.getAll()
  }

  async handleDragEnd(event: DragEndEvent): Promise<void> {
    const { active, over } = event
    if (!over) return

    const taskId = String(active.id)
    const overId = String(over.id)
    const all = await taskRepository.getAll()
    const task = all.find((t) => t.id === taskId)
    if (!task) return

    const targetStatus = BOARD_STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : all.find((t) => t.id === overId)?.status

    if (!targetStatus || targetStatus === task.status) return
    await this.update(taskId, { status: targetStatus })
  }

  async clearCompleted(): Promise<void> {
    const done = await taskRepository.getByStatus('done')
    await Promise.all(done.map((t) => taskRepository.delete(t.id)))
  }
}

export const taskEngine = new TaskEngine()
