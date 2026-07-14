import type { Goal } from '@/domain/goal'
import { gameEngine } from '@/engines/game-engine'
import { eventRepository } from '@/repositories/event-repository'
import { goalRepository } from '@/repositories/goal-repository'

export class GoalEngine {
  async getAll(): Promise<Goal[]> {
    return goalRepository.getAll()
  }

  async create(title: string): Promise<Goal> {
    return goalRepository.create({ title })
  }

  async complete(id: string): Promise<Goal> {
    const existing = await goalRepository.getById(id)
    if (!existing) throw new Error(`Goal ${id} not found`)
    if (existing.status === 'completed') return existing

    const updated = await goalRepository.update(id, {
      status: 'completed',
      progress: 100,
    })

    await eventRepository.create({
      type: 'goal_completed',
      payload: { goalId: id },
    })
    await gameEngine.onGoalCompleted()

    return updated
  }
}

export const goalEngine = new GoalEngine()
