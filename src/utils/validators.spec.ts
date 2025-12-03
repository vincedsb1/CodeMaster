import { describe, it, expect } from 'vitest'
import { isValidQuestion, isValidQuestionArray } from './validators'

describe('Validators', () => {
  describe('isValidQuestion', () => {
    it('should return true for a valid question', () => {
      const validQuestion = {
        id: '1',
        intitule: 'Test question',
        reponses: ['A', 'B', 'C', 'D'],
        indexBonneReponse: 0,
        explication: 'Explanation',
        categorie: 'Test',
        difficulte: 'facile',
        countApparition: 0,
        countBonneReponse: 0,
      }
      expect(isValidQuestion(validQuestion)).toBe(true)
    })

    it('should return false if intitule is missing', () => {
      const invalid = {
        reponses: ['A'],
        indexBonneReponse: 0,
        difficulte: 'facile',
      }
      expect(isValidQuestion(invalid)).toBe(false)
    })

    it('should return false if reponses is not an array', () => {
      const invalid = {
        intitule: 'Q',
        reponses: 'Not array',
        indexBonneReponse: 0,
        difficulte: 'facile',
      }
      expect(isValidQuestion(invalid)).toBe(false)
    })

    it('should return false if difficulte is invalid', () => {
      const invalid = {
        intitule: 'Q',
        reponses: ['A'],
        indexBonneReponse: 0,
        difficulte: 'extreme',
      }
      expect(isValidQuestion(invalid)).toBe(false)
    })

    it('should return false if indexBonneReponse is out of bounds', () => {
      const invalid = {
        intitule: 'Q',
        reponses: ['A', 'B'],
        indexBonneReponse: 5,
        difficulte: 'facile',
      }
      expect(isValidQuestion(invalid)).toBe(false)
    })
  })

  describe('isValidQuestionArray', () => {
    it('should return true for an array of valid questions', () => {
      const validArray = [
        {
          intitule: 'Q1',
          reponses: ['A'],
          indexBonneReponse: 0,
          difficulte: 'facile',
        },
      ]
      expect(isValidQuestionArray(validArray)).toBe(true)
    })

    it('should return false if any question is invalid', () => {
      const invalidArray = [
        {
          intitule: 'Q1',
          reponses: ['A'],
          indexBonneReponse: 0,
          difficulte: 'facile',
        },
        {
          intitule: 'Q2',
          // missing fields
        },
      ]
      expect(isValidQuestionArray(invalidArray)).toBe(false)
    })

    it('should return false for non-array input', () => {
      expect(isValidQuestionArray({})).toBe(false)
    })
  })
})
