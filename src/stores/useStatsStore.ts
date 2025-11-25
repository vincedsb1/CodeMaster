/**
 * Stats Store - Manages statistics calculation and badge unlocking logic
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GlobalStats, QuizSession, Badge, ComparisonStats } from '@/types/models'
import { sessionRepository } from '@/db/repositories'
import { useDataStore } from './useDataStore'

export const useStatsStore = defineStore('stats', () => {
  // State
  const globalStats = ref<GlobalStats>({
    moyenneGlobale: 0,
    meilleurScore: 0,
    streakActuel: 0,
    totalSessions: 0,
    historiqueSessions: [],
  })

  const previousStats = ref<ComparisonStats>({ average: 0 })
  const newlyUnlockedBadges = ref<Badge[]>([])

  // Computed
  const badgesNonLus = computed(() => newlyUnlockedBadges.value.length > 0)

  // Actions
  async function loadStats() {
    try {
      const allSessions = await sessionRepository.getAll()
      const completedSessions = allSessions.filter((s) => s.dateFin !== null)

      if (completedSessions.length === 0) {
        globalStats.value = {
          moyenneGlobale: 0,
          meilleurScore: 0,
          streakActuel: 0,
          totalSessions: 0,
          historiqueSessions: [],
        }
        return
      }

      // Calculate average
      const sum = completedSessions.reduce((acc, s) => acc + s.notePourcentage, 0)
      const avg = sum / completedSessions.length

      // Calculate best score
      const max = Math.max(...completedSessions.map((s) => s.notePourcentage))

      // Calculate current streak
      const currentStreak = calculateCurrentStreak(completedSessions)

      globalStats.value = {
        moyenneGlobale: avg,
        meilleurScore: max,
        streakActuel: currentStreak,
        totalSessions: completedSessions.length,
        historiqueSessions: completedSessions,
      }
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  async function updateStatsAndBadges(session: QuizSession) {
    newlyUnlockedBadges.value = []
    const dataStore = useDataStore()

    try {
      const allSessions = await sessionRepository.getAll()
      const completedSessions = allSessions.filter((s) => s.dateFin !== null)

      // Calculate streak after this session
      const currentStreak = calculateCurrentStreak([...completedSessions, session])

      // Check and unlock badges
      const badges = dataStore.badges
      checkAndUnlockBadges(session, completedSessions, currentStreak, badges)

      // Update badges in store
      await dataStore.updateBadges(badges)
    } catch (err) {
      console.error('Error updating stats and badges:', err)
    }
  }

  function checkAndUnlockBadges(
    session: QuizSession,
    completedSessions: QuizSession[],
    currentStreak: number,
    badges: Badge[],
  ) {
    const unlock = (id: string) => {
      const badge = badges.find((x) => x.id === id)
      if (badge && badge.statut === 'verrouille') {
        badge.statut = 'debloque'
        badge.dateDebloque = new Date().toISOString()
        newlyUnlockedBadges.value.push(badge)
      }
    }

    // First Quiz
    if (completedSessions.length >= 1) {
      unlock('first_quiz')
    }

    // Perfect Score
    if (session.notePourcentage === 100) {
      unlock('perfect_score')
    }

    // Streak Badges
    if (currentStreak >= 3) {
      unlock('streak_3')
    }
    if (currentStreak >= 7) {
      unlock('streak_7')
    }

    // Marathon (20 total quizzes)
    if (completedSessions.length >= 20) {
      unlock('marathon')
    }

    // Math Expert (5 math quizzes)
    if (session.categories.length === 1 && session.categories[0] === 'Maths') {
      const mathCount = completedSessions.filter(
        (s) => s.categories.length === 1 && s.categories[0] === 'Maths',
      ).length
      if (mathCount >= 5) {
        unlock('math_expert')
      }
    }
  }

  function calculateCurrentStreak(sessions: QuizSession[]): number {
    if (sessions.length === 0) return 0

    const completedSessions = sessions.filter((s) => s.dateFin !== null)
    const days = [
      ...new Set(completedSessions.map((s) => s.dateJour || '').filter((d) => d)),
    ].sort()

    if (days.length === 0) return 0

    // Calculate streak from history
    let currentStreak = 1
    for (let i = 0; i < days.length - 1; i++) {
      const d1 = new Date(days[i] || '')
      const d2 = new Date(days[i + 1] || '')
      const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24))

      if (diffDays === 1) {
        currentStreak++
      } else {
        currentStreak = 1
      }
    }

    // Check if streak is still active (last quiz is today or yesterday)
    const lastDay = days[days.length - 1]
    if (!lastDay) return 0
    const today = new Date().toISOString().split('T')[0] as string
    const dLast = new Date(lastDay)
    const dToday = new Date(today)
    const diffToNow = Math.floor(
      (dToday.getTime() - dLast.getTime()) / (1000 * 3600 * 24),
    )

    if (diffToNow <= 1) {
      return currentStreak
    } else {
      return 0
    }
  }

  function calculateDailyAverages(
    sessions: QuizSession[],
  ): Record<string, { sum: number; count: number }> {
    const dataMap: Record<string, { sum: number; count: number }> = {}

    // Initialize last 30 days
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const key = d.toISOString().split('T')[0] as string
      dataMap[key] = { sum: 0, count: 0 }
    }

    // Aggregate
    sessions.forEach((s) => {
      const dateJour = s.dateJour || ''
      if (dateJour && dataMap[dateJour]) {
        dataMap[dateJour].sum += s.notePourcentage
        dataMap[dateJour].count++
      }
    })

    return dataMap
  }

  return {
    // State
    globalStats,
    previousStats,
    newlyUnlockedBadges,

    // Computed
    badgesNonLus,

    // Actions
    loadStats,
    updateStatsAndBadges,
    calculateDailyAverages,
  }
})
