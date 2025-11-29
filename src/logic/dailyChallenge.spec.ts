import { describe, it, expect } from 'vitest'
import { getSeedFromDate, generateDailyChallengeQuestions } from './dailyChallenge'
import type { Question } from '@/types/models'

describe('Daily Challenge Logic', () => {
  describe('getSeedFromDate', () => {
    it('should return deterministic seed for same date', () => {
      const date = '2023-10-27'
      const seed1 = getSeedFromDate(date)
      const seed2 = getSeedFromDate(date)
      expect(seed1).toBe(seed2)
    })

    it('should return different seeds for different dates', () => {
      const seed1 = getSeedFromDate('2023-10-27')
      const seed2 = getSeedFromDate('2023-10-28')
      expect(seed1).not.toBe(seed2)
    })
  })

  describe('generateDailyChallengeQuestions', () => {
    const mockQuestions: Question[] = Array.from({ length: 20 }, (_, i) => ({
      id: `${i}`,
      intitule: `Q${i}`,
      reponses: ['A', 'B', 'C', 'D'],
      indexBonneReponse: 0,
      explication: '',
      categorie: 'Test',
      difficulte: 'facile',
      countApparition: 0,
      countBonneReponse: 0,
    }))

    it('should select deterministic questions based on date', () => {
      const date = '2023-10-27'
      const quiz1 = generateDailyChallengeQuestions(mockQuestions, date, 5)
      const quiz2 = generateDailyChallengeQuestions(mockQuestions, date, 5)

      expect(quiz1).toHaveLength(5)
      expect(quiz1[0]?.id).toBe(quiz2[0]?.id)
      expect(quiz1[4]?.id).toBe(quiz2[4]?.id)
    })

    it('should select different questions for different dates', () => {
      const quiz1 = generateDailyChallengeQuestions(mockQuestions, '2023-10-27', 5)
      const quiz2 = generateDailyChallengeQuestions(mockQuestions, '2023-10-28', 5)

      // It's statistically extremely unlikely to be exactly same order and selection
      const ids1 = quiz1.map(q => q.id).join(',')
      const ids2 = quiz2.map(q => q.id).join(',')
      expect(ids1).not.toBe(ids2)
    })

    it('should respect requested count', () => {
      const quiz = generateDailyChallengeQuestions(mockQuestions, '2023-10-27', 3)
      expect(quiz).toHaveLength(3)
    })
  })
})
