import type { SessionQuestion, Difficulty, Question } from '@/types/models'
import { DIFFICULTY_POINTS } from '@/types/constants'

export interface QuizScoreResult {
  scorePondere: number
  scorePondereMax: number
  notePourcentage: number
  correctCount: number
}

/**
 * Pure function to shuffle answers for a question.
 * Returns an array of indices representing the new order.
 */
export function shuffleAnswers(): number[] {
  return [0, 1, 2, 3].sort(() => Math.random() - 0.5)
}

/**
 * Pure function to select questions for a quiz session.
 * Filters by category and difficulty, then sorts by appearance count (ascending) + random.
 */
export function selectQuestionsForSession(
  allQuestions: Question[],
  categories: string[],
  difficulty: Difficulty,
  count: number
): SessionQuestion[] {
  let pool = allQuestions.filter((q) => categories.includes(q.categorie))

  if (difficulty !== 'random') {
    pool = pool.filter((q) => q.difficulte === difficulty)
  }

  // Sort by appearance count (least seen first), then random
  pool.sort((a, b) => {
    if (a.countApparition === b.countApparition) {
      return Math.random() - 0.5
    }
    return a.countApparition - b.countApparition
  })

  // Take requested amount and transform to SessionQuestion
  return pool.slice(0, count).map((q) => ({
    ...q,
    ordreReponses: shuffleAnswers(),
    estSkippe: false,
    estCorrecte: null,
  }))
}

/**
 * Pure function to calculate the score of a completed session.
 */
export function calculateSessionScore(questions: SessionQuestion[]): QuizScoreResult {
  let scorePondere = 0
  let scorePondereMax = 0
  let correctCount = 0

  questions.forEach((q) => {
    const points = DIFFICULTY_POINTS[q.difficulte] || 1
    scorePondereMax += points

    if (q.estCorrecte === true) {
      scorePondere += points
      correctCount++
    }
  })

  const notePourcentage =
    questions.length > 0 ? (correctCount / questions.length) * 100 : 0

  return {
    scorePondere,
    scorePondereMax,
    notePourcentage,
    correctCount,
  }
}
