import { describe, expect, it } from 'vitest'

import {
  XP_LEVEL_BASE,
  levelFromXp,
  totalXpForLevel,
  xpProgressInLevel,
  xpRequiredForNextLevel,
} from '@/domain/gamification'

describe('level XP curve', () => {
  it('starts at level 1 with 0 XP', () => {
    expect(levelFromXp(0)).toBe(1)
    expect(totalXpForLevel(1)).toBe(0)
    expect(xpRequiredForNextLevel(1)).toBe(XP_LEVEL_BASE)
  })

  it('requires 150 XP to reach level 2', () => {
    expect(totalXpForLevel(2)).toBe(150)
    expect(levelFromXp(149)).toBe(1)
    expect(levelFromXp(150)).toBe(2)
  })

  it('uses cumulative triangular XP for higher levels', () => {
    expect(totalXpForLevel(5)).toBe(1500)
    expect(totalXpForLevel(10)).toBe(6750)
    expect(totalXpForLevel(20)).toBe(28500)
    expect(totalXpForLevel(50)).toBe(183750)

    expect(levelFromXp(1500)).toBe(5)
    expect(levelFromXp(6750)).toBe(10)
    expect(levelFromXp(28500)).toBe(20)
    expect(levelFromXp(183750)).toBe(50)
  })

  it('scales XP required per level by level number', () => {
    expect(xpRequiredForNextLevel(1)).toBe(150)
    expect(xpRequiredForNextLevel(5)).toBe(750)
    expect(xpRequiredForNextLevel(10)).toBe(1500)
    expect(xpRequiredForNextLevel(50)).toBe(7500)
  })

  it('reports progress within the current level', () => {
    // At exactly level 5 (1500 XP), progress toward level 6 starts at 0 / 750
    expect(xpProgressInLevel(1500)).toEqual({ current: 0, max: 750 })
    expect(xpProgressInLevel(1500 + 375)).toEqual({ current: 375, max: 750 })

    // Just below level 2
    expect(xpProgressInLevel(100)).toEqual({ current: 100, max: 150 })
  })

  it('round-trips level boundaries', () => {
    for (const level of [1, 2, 3, 5, 10, 25, 50, 100]) {
      const xp = totalXpForLevel(level)
      expect(levelFromXp(xp)).toBe(level)
      if (level > 1) {
        expect(levelFromXp(xp - 1)).toBe(level - 1)
      }
    }
  })
})
