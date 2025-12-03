import { describe, it, expect } from 'vitest'
import { calculateSessionScore, selectQuestionsForSession, shuffleAnswers } from './quizEngine'
import type { SessionQuestion, Question } from '@/types/models'

describe('Quiz Engine', () => {
  describe('shuffleAnswers', () => {
    it('should return an array of 4 indices', () => {
      const indices = shuffleAnswers()
      expect(indices).toHaveLength(4)
      expect(indices).toEqual(expect.arrayContaining([0, 1, 2, 3]))
    })
  })

  describe('selectQuestionsForSession', () => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        intitule: 'Q1',
        reponses: [],
        indexBonneReponse: 0,
        explication: '',
        categorie: 'React',
        difficulte: 'facile',
        countApparition: 0,
        countBonneReponse: 0,
      },
      {
        id: '2',
        intitule: 'Q2',
        reponses: [],
        indexBonneReponse: 0,
        explication: '',
        categorie: 'Vue',
        difficulte: 'moyen',
        countApparition: 10,
        countBonneReponse: 0,
      },
      {
        id: '3',
        intitule: 'Q3',
        reponses: [],
        indexBonneReponse: 0,
        explication: '',
        categorie: 'React',
        difficulte: 'difficile',
        countApparition: 5,
        countBonneReponse: 0,
      },
    ]

    it('should filter by category', () => {
      const result = selectQuestionsForSession(mockQuestions, ['React'], 'random', 10)
      expect(result).toHaveLength(2)
      expect(result.every((q) => q.categorie === 'React')).toBe(true)
    })

    it('should filter by difficulty', () => {
      const result = selectQuestionsForSession(mockQuestions, ['Vue'], 'moyen', 10)
      expect(result).toHaveLength(1)
      expect(result[0]?.difficulte).toBe('moyen')
    })

    it('should limit count', () => {
      const result = selectQuestionsForSession(mockQuestions, ['React', 'Vue'], 'random', 1)
      expect(result).toHaveLength(1)
    })

    it('should sort by least appeared first', () => {
      // Q1 (0 app) should be before Q3 (5 app)
      const result = selectQuestionsForSession(mockQuestions, ['React'], 'random', 2)
      expect(result[0]?.id).toBe('1')
      expect(result[1]?.id).toBe('3')
    })
  })

  describe('calculateSessionScore', () => {
    it('should calculate correct score for mixed difficulties', () => {
      const sessionQuestions: SessionQuestion[] = [
        {
          difficulte: 'facile', // 1 pt
          estCorrecte: true,
          id: '1',
          intitule: '',
          reponses: [],
          indexBonneReponse: 0,
          explication: '',
          categorie: '',
          countApparition: 0,
          countBonneReponse: 0,
          ordreReponses: [],
          estSkippe: false,
        },
        {
          difficulte: 'moyen', // 2 pts
          estCorrecte: false,
          id: '2',
          intitule: '',
          reponses: [],
          indexBonneReponse: 0,
          explication: '',
          categorie: '',
          countApparition: 0,
          countBonneReponse: 0,
          ordreReponses: [],
          estSkippe: false,
        },
        {
          difficulte: 'difficile', // 3 pts
          estCorrecte: true,
          id: '3',
          intitule: '',
          reponses: [],
          indexBonneReponse: 0,
          explication: '',
          categorie: '',
          countApparition: 0,
          countBonneReponse: 0,
          ordreReponses: [],
          estSkippe: false,
        },
      ]

      const result = calculateSessionScore(sessionQuestions)

      // Max: 1 + 2 + 3 = 6
      // Actual: 1 + 0 + 3 = 4
      // Percentage: 2/3 correct = 66.66%

      expect(result.scorePondereMax).toBe(6)
      expect(result.scorePondere).toBe(4)
      expect(result.correctCount).toBe(2)
      expect(result.notePourcentage).toBeCloseTo(66.66, 1)
    })

    it('should handle empty session', () => {
      const result = calculateSessionScore([])
      expect(result.scorePondere).toBe(0)
      expect(result.notePourcentage).toBe(0)
    })
  })
})
