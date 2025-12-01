import type { QuizSession, Badge } from '@/types/models'
import { sessionRepository, metaRepository } from '@/db/repositories'
import { DEFAULT_BADGES } from '@/types/constants'
import { calculateSessionXp } from '@/logic/gamification'

/**
 * Generates demo data for screenshots/marketing.
 * Target: Level 5, ~3050 XP, ~7 badges, rich history.
 */
export async function generateDemoData() {
  console.log('[Demo] Starting data generation...')

  // 1. Clear existing sessions (optional, but cleaner)
  await sessionRepository.clear()

  // 2. Generate History (30 days)
  const sessions: QuizSession[] = []
  const today = new Date()
  const categories = ['TypeScript', 'React', 'Vue', 'Node.js', 'CSS']
  
  // We need ~3050 XP.
  // Avg XP per quiz (10 questions mixed) ~ 150-200 XP?
  // Let's say 20 sessions.
  
  for (let i = 0; i < 25; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - Math.floor(Math.random() * 30))
    
    const isPerfect = Math.random() > 0.8
    const score = isPerfect ? 100 : 60 + Math.floor(Math.random() * 35)
    const questionCount = 10
    
    // Mock questions for XP calc (only difficulty matters for calculation)
    const questionsMock = Array.from({ length: questionCount }, () => ({
      estCorrecte: Math.random() < (score / 100),
      difficulte: Math.random() > 0.5 ? 'moyen' : 'facile',
    })) as any

    const session: QuizSession = {
      sessionId: `demo-${Date.now()}-${i}`,
      dateDebut: date.toISOString(),
      dateFin: new Date(date.getTime() + 1000 * 60 * 2).toISOString(), // 2 mins later
      questions: questionsMock,
      indexQuestionCourante: questionCount - 1,
      nbQuestions: questionCount,
      scorePondere: 0, // Recalculated by logic usually
      scorePondereMax: 0,
      notePourcentage: score,
      difficulteChoisie: 'random',
      categories: [categories[Math.floor(Math.random() * categories.length)]!],
      dateJour: date.toISOString().split('T')[0],
      isDailyChallenge: i % 5 === 0 // Every 5th is a daily
    }
    
    sessions.push(session)
    await sessionRepository.save(session)
  }

  // 3. Unlock Badges (1/3 = 7 badges)
  const targetBadges = [
    'first_quiz', 
    'streak_3', 
    'streak_7', 
    'volume_10', 
    'score_1000', 
    'explorer', 
    'speedster'
  ]
  
  const allBadges = JSON.parse(JSON.stringify(DEFAULT_BADGES)) as Badge[]
  const updatedBadges = allBadges.map(b => {
    if (targetBadges.includes(b.id)) {
      return { ...b, statut: 'debloque', dateDebloque: new Date().toISOString() }
    }
    return b
  }) as Badge[]

  await metaRepository.saveBadges(updatedBadges)

  console.log('[Demo] Data generation complete.')
  return { sessionsCount: sessions.length, badgesCount: targetBadges.length }
}