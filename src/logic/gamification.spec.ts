import { describe, it, expect } from 'vitest'
import {
  calculateLevel,
  getTitleForLevel,
  getBaseXpForQuestion,
  calculateSessionXp,
  xpForNextLevel,
  XP_TABLE
} from './gamification'
import type { SessionQuestion } from '@/types/models'

describe('Gamification Logic', () => {
  describe('calculateLevel', () => {
    it('should start at level 1 with 0 XP', () => {
      expect(calculateLevel(0)).toBe(1)
    })

    it('should reach level 2 at 100 XP', () => {
      expect(calculateLevel(100)).toBe(2)
    })

    it('should reach level 10 at 8100 XP', () => {
      expect(calculateLevel(8100)).toBe(10)
    })

    it('should handle negative XP gracefully', () => {
      expect(calculateLevel(-100)).toBe(1)
    })
  })

  describe('xpForNextLevel', () => {
    it('should return 100 XP for level 1 to reach level 2', () => {
      expect(xpForNextLevel(1)).toBe(100)
    })
    
    it('should return 400 XP for level 2 to reach level 3', () => {
      expect(xpForNextLevel(2)).toBe(400)
    })
  })

  describe('getTitleForLevel', () => {
    it('should return correct titles for levels', () => {
      expect(getTitleForLevel(1)).toBe('Script Kiddie')
      expect(getTitleForLevel(5)).toBe('Hello Worlder')
      expect(getTitleForLevel(15)).toBe('Développeur Junior')
      expect(getTitleForLevel(100)).toBe('Dieu du Code')
    })
  })

  describe('getBaseXpForQuestion', () => {
    it('should return correct base XP for difficulties', () => {
      expect(getBaseXpForQuestion('facile')).toBe(XP_TABLE.EASY)
      expect(getBaseXpForQuestion('moyen')).toBe(XP_TABLE.MEDIUM)
      expect(getBaseXpForQuestion('difficile')).toBe(XP_TABLE.HARD)
    })
  })

  describe('calculateSessionXp', () => {
    it('should calculate basic XP without combo', () => {
      const questions = [
        { estCorrecte: true, difficulte: 'facile' },
        { estCorrecte: false, difficulte: 'moyen' },
        { estCorrecte: true, difficulte: 'difficile' },
      ] as SessionQuestion[]

      // 10 (easy) + 0 (wrong) + 30 (hard) = 40
      expect(calculateSessionXp(questions)).toBe(40)
    })

    it('should apply combo multiplier for streak > 3', () => {
      const questions = [
        { estCorrecte: true, difficulte: 'facile' }, // Combo 1: 10
        { estCorrecte: true, difficulte: 'facile' }, // Combo 2: 10
        { estCorrecte: true, difficulte: 'facile' }, // Combo 3: 10
        { estCorrecte: true, difficulte: 'facile' }, // Combo 4: 10 * 1.5 = 15
        { estCorrecte: true, difficulte: 'facile' }, // Combo 5: 10 * 1.5 = 15
      ] as SessionQuestion[]

      // 10 + 10 + 10 + 15 + 15 = 60
      expect(calculateSessionXp(questions)).toBe(60)
    })

    it('should reset combo on wrong answer', () => {
      const questions = [
        { estCorrecte: true, difficulte: 'facile' }, // Combo 1: 10
        { estCorrecte: true, difficulte: 'facile' }, // Combo 2: 10
        { estCorrecte: true, difficulte: 'facile' }, // Combo 3: 10
        { estCorrecte: true, difficulte: 'facile' }, // Combo 4: 10 * 1.5 = 15
        { estCorrecte: false, difficulte: 'facile' }, // Wrong: 0, Combo reset
        { estCorrecte: true, difficulte: 'facile' }, // Combo 1: 10
      ] as SessionQuestion[]

      // 10 + 10 + 10 + 15 + 0 + 10 = 55
      expect(calculateSessionXp(questions)).toBe(55)
    })
  })
})
