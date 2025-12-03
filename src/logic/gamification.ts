import type { Difficulty, SessionQuestion, QuizSession, Badge } from '@/types/models'

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

/**
 * Checks for new badges based on session results and history.
 * Returns an array of newly unlocked badges.
 */
export function checkNewBadges(
  session: QuizSession,
  history: QuizSession[],
  currentStreak: number,
  existingBadges: Badge[]
): Badge[] {
  const newBadges: Badge[] = []
  const completedSessions = history.filter(s => s.dateFin !== null)
  
  // Helper to unlock
  const unlock = (id: string) => {
    const badge = existingBadges.find((b) => b.id === id)
    if (badge && badge.statut === 'verrouille') {
      badge.statut = 'debloque'
      badge.dateDebloque = new Date().toISOString()
      newBadges.push(badge)
    }
  }

  // 1. Débutant (1er quiz)
  if (completedSessions.length >= 1) unlock('first_quiz')

  // 2. Perfection (100% score)
  if (session.notePourcentage === 100) unlock('perfect_score')

  // 3. Série 3 jours
  if (currentStreak >= 3) unlock('streak_3')

  // 4. Série 7 jours
  if (currentStreak >= 7) unlock('streak_7')

  // 5. Série 14 jours
  if (currentStreak >= 14) unlock('streak_14')

  // 6. Série 30 jours
  if (currentStreak >= 30) unlock('streak_30')

  // 7. Volume 10 quiz
  if (completedSessions.length >= 10) unlock('volume_10')

  // 8. Volume 50 quiz
  if (completedSessions.length >= 50) unlock('volume_50')

  // 9. Volume 100 quiz (Marathonien renamed/mapped)
  if (completedSessions.length >= 100) unlock('marathon')

  // 10. Score cumulé 1000 XP
  // Note: We need total XP. Assuming it's calculated elsewhere or passed.
  // For simplicity, let's approximate from scorePondere if XP not available in session?
  // Actually, we need total XP from store. Let's use a heuristic or pass it.
  // Better: The store handles this. But logic should be here.
  // We'll skip XP badges here and rely on store? No, logic should be pure.
  // Let's assume we calculate XP from history.
  const totalXp = completedSessions.reduce((sum, s) => sum + calculateSessionXp(s.questions), 0)
  if (totalXp >= 1000) unlock('score_1000')

  // 11. Score cumulé 5000 XP
  if (totalXp >= 5000) unlock('score_5000')

  // 12. Difficulté (Quiz Difficile sans faute)
  if (session.difficulteChoisie === 'difficile' && session.notePourcentage === 100) {
    unlock('hard_perfect')
  }

  // 13. Persévérance (Finir avec < 50%)
  if (session.notePourcentage < 50) unlock('persistance')

  // 14. Vitesse (Speedster: >10 questions, >80% score, < 2 min)
  const durationMs = new Date(session.dateFin!).getTime() - new Date(session.dateDebut).getTime()
  if (session.nbQuestions >= 10 && session.notePourcentage >= 80 && durationMs < 120000) {
    unlock('speedster')
  }

  // 15. Explorateur (Joué Facile, Moyen, Difficile)
  const difficulties = new Set(completedSessions.map(s => s.difficulteChoisie))
  if (difficulties.has('facile') && difficulties.has('moyen') && difficulties.has('difficile')) {
    unlock('explorer')
  }

  // 16. Insomniaque (Jouer entre 2h et 5h du matin)
  const hour = new Date(session.dateFin!).getHours()
  if (hour >= 2 && hour < 5) unlock('night_owl')

  // 17. Lève-tôt (Jouer entre 5h et 8h du matin)
  if (hour >= 5 && hour < 8) unlock('early_bird')

  // 18. Polyglotte (Jouer 3 catégories différentes)
  const categoriesPlayed = new Set(completedSessions.flatMap(s => s.categories))
  if (categoriesPlayed.size >= 3) unlock('polyglot')

  // 19. Focus (5 quiz de suite même catégorie)
  // Check last 5 sessions
  if (completedSessions.length >= 5) {
    const last5 = completedSessions.slice(-5)
    const firstCat = last5[0]?.categories[0]
    if (firstCat && last5.every(s => s.categories.length === 1 && s.categories[0] === firstCat)) {
      unlock('focus')
    }
  }

  // 20. Weekend Warrior (Jouer Samedi et Dimanche)
  const hasSat = completedSessions.some(s => new Date(s.dateFin!).getDay() === 6)
  const hasSun = completedSessions.some(s => new Date(s.dateFin!).getDay() === 0)
  if (hasSat && hasSun) unlock('weekend_warrior')

  // 21. Daily Challenge (Jouer un défi quotidien)
  if (session.isDailyChallenge) unlock('daily_challenger')

  return newBadges
}