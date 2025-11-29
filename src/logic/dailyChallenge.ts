import type { Question, SessionQuestion } from '@/types/models'
import { shuffleAnswers } from './quizEngine'

/**
 * Simple Pseudo-Random Number Generator (PRNG)
 * Linear Congruential Generator (LCG)
 * Used to generate deterministic daily quizzes based on date seed.
 */
class SeededRNG {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  /**
   * Returns a pseudo-random number between 0 (inclusive) and 1 (exclusive).
   */
  next(): number {
    // LCG constants (same as glibc)
    const a = 1103515245
    const c = 12345
    const m = 2147483648

    this.seed = (a * this.seed + c) % m
    return this.seed / m
  }
}

/**
 * Generates a numeric seed from a date string (YYYY-MM-DD).
 */
export function getSeedFromDate(dateStr: string): number {
  // Simple hash function for the date string
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Selects questions for the Daily Challenge deterministically.
 * Uses the date as a seed to ensure all users get the same quiz on the same day.
 */
export function generateDailyChallengeQuestions(
  allQuestions: Question[],
  dateStr: string,
  count: number = 10
): SessionQuestion[] {
  if (!allQuestions || allQuestions.length === 0) {
    return []
  }

  const seed = getSeedFromDate(dateStr)
  const rng = new SeededRNG(seed)

  // Create a shallow copy to not mutate original
  const pool = [...allQuestions]

  // Fisher-Yates shuffle using seeded RNG
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
    const temp = pool[i]!
    pool[i] = pool[j]!
    pool[j] = temp
  }

  // Take top N
  return pool.slice(0, count).map((q) => ({
    ...q,
    // We still shuffle answers randomly (non-deterministic) to avoid cheating easily?
    // Or deterministic for consistency? Let's keep it random for now or consistent.
    // Let's make answers consistent too for "true" daily challenge parity.
    ordreReponses: shuffleAnswersWithRng(rng), 
    estSkippe: false,
    estCorrecte: null,
  }))
}

function shuffleAnswersWithRng(rng: SeededRNG): number[] {
  const indices = [0, 1, 2, 3]
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
    const temp = indices[i]!
    indices[i] = indices[j]!
    indices[j] = temp
  }
  return indices
}
