import type { Difficulty, SessionQuestion } from '@/types/models'

export const XP_TABLE = {
  EASY: 10,
  MEDIUM: 20,
  HARD: 30,
  COMBO_MULTIPLIER: 1.5, // x1.5 si combo > 3
}

/**
 * Calculates the current level based on total XP.
 * Formula: XP = Level^2 * 100
 * Level = sqrt(XP / 100)
 */
export function calculateLevel(totalXp: number): number {
  if (totalXp < 0) return 1
  return Math.floor(Math.sqrt(totalXp / 100)) + 1
}

/**
 * Calculates the XP required to reach the next level.
 */
export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100
}

/**
 * Returns a title based on the current level.
 */
export function getTitleForLevel(level: number): string {
  if (level < 5) return 'Script Kiddie'
  if (level < 10) return 'Hello Worlder'
  if (level < 20) return 'Développeur Junior'
  if (level < 30) return 'Développeur Confirmé'
  if (level < 40) return 'Tech Lead'
  if (level < 50) return 'Architecte Logiciel'
  if (level < 60) return 'Principal Engineer'
  if (level < 70) return 'CTO'
  if (level < 80) return 'Fellow'
  if (level < 90) return 'Légende du Code'
  return 'Dieu du Code'
}

/**
 * Calculates the base XP for a single question based on its difficulty.
 */
export function getBaseXpForQuestion(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'facile':
      return XP_TABLE.EASY
    case 'moyen':
      return XP_TABLE.MEDIUM
    case 'difficile':
      return XP_TABLE.HARD
    default:
      return XP_TABLE.EASY
  }
}

/**
 * Calculates the total XP gained from a completed quiz session.
 * Includes combo bonuses.
 */
export function calculateSessionXp(questions: SessionQuestion[]): number {
  let totalXp = 0
  let currentCombo = 0

  questions.forEach((q) => {
    if (q.estCorrecte) {
      currentCombo++
      let xp = getBaseXpForQuestion(q.difficulte)

      // Apply combo bonus if streak > 3
      if (currentCombo > 3) {
        xp = Math.floor(xp * XP_TABLE.COMBO_MULTIPLIER)
      }

      totalXp += xp
    } else {
      currentCombo = 0
    }
  })

  return totalXp
}
