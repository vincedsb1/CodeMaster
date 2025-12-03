import type { Question, Difficulty } from '@/types/models'

/**
 * Type guard to check if an object is a valid Question array
 */
export function isValidQuestionArray(data: unknown): data is Question[] {
  return Array.isArray(data) && data.every(isValidQuestion)
}

/**
 * Type guard to check if an object is a valid Question
 */
export function isValidQuestion(data: unknown): data is Question {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const q = data as Record<string, unknown>

  // Required fields
  if (
    typeof q.intitule !== 'string' ||
    !Array.isArray(q.reponses) ||
    typeof q.indexBonneReponse !== 'number' ||
    typeof q.difficulte !== 'string'
  ) {
    return false
  }

  // Validate reponses content
  if (!q.reponses.every((r) => typeof r === 'string')) {
    return false
  }

  // Validate difficulty
  const validDifficulties: Difficulty[] = ['facile', 'moyen', 'difficile']
  if (!validDifficulties.includes(q.difficulte as Difficulty)) {
    return false
  }

  // Validate indexBonneReponse range
  if (q.indexBonneReponse < 0 || q.indexBonneReponse >= q.reponses.length) {
    return false
  }

  return true
}
