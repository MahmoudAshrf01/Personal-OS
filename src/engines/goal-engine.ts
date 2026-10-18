import { nanoid } from 'nanoid'

import type { Goal, GoalStep } from '@/domain/goal'
import { gameEngine } from '@/engines/game-engine'
import { eventRepository } from '@/repositories/event-repository'
import { goalRepository } from '@/repositories/goal-repository'

export class GoalEngine {
  async getAll(): Promise<Goal[]> {
    return goalRepository.getAll()
  }

  async create(title: string, steps: string[] = []): Promise<Goal> {
    const uniqueSteps = [...new Set(steps.map((step) => step.trim()).filter(Boolean))]
    return goalRepository.create({ title, steps: uniqueSteps })
  }

  async addStep(goalId: string, title: string): Promise<Goal> {
    const existing = await this.getActiveGoal(goalId)
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return existing

    const step: GoalStep = {
      id: nanoid(),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    const steps = [...existing.steps, step]

    return goalRepository.update(goalId, {
      steps,
      progress: this.calculateProgress(steps),
    })
  }

  async toggleStep(goalId: string, stepId: string): Promise<Goal> {
    const existing = await this.getActiveGoal(goalId)
    const steps = existing.steps.map((step) =>
      step.id === stepId ? { ...step, completed: !step.completed } : step,
    )

    return goalRepository.update(goalId, {
      steps,
      progress: this.calculateProgress(steps),
    })
  }

  async removeStep(goalId: string, stepId: string): Promise<Goal> {
    const existing = await this.getActiveGoal(goalId)
    const steps = existing.steps.filter((step) => step.id !== stepId)
    return goalRepository.update(goalId, {
      steps,
      progress: this.calculateProgress(steps),
    })
  }

  async complete(id: string): Promise<Goal> {
    const existing = await goalRepository.getById(id)
    if (!existing) throw new Error(`Goal ${id} not found`)
    if (existing.status === 'completed') return existing

    const updated = await goalRepository.update(id, {
      status: 'completed',
      progress: 100,
      steps: existing.steps.map((step) => ({ ...step, completed: true })),
    })

    await eventRepository.create({
      type: 'goal_completed',
      payload: { goalId: id },
    })
    await gameEngine.onGoalCompleted()

    return updated
  }

  async delete(id: string): Promise<void> {
    await goalRepository.delete(id)
  }

  private async getActiveGoal(id: string): Promise<Goal> {
    const goal = await goalRepository.getById(id)
    if (!goal) throw new Error(`Goal ${id} not found`)
    if (goal.status === 'completed') throw new Error('Completed goals cannot be changed')
    return goal
  }

  private calculateProgress(steps: GoalStep[]): number {
    if (steps.length === 0) return 0
    return Math.round((steps.filter((step) => step.completed).length / steps.length) * 100)
  }
}

export const goalEngine = new GoalEngine()
