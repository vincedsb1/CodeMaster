/**
 * Stats Store - Manages statistics calculation and badge unlocking logic
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GlobalStats, QuizSession, Badge, ComparisonStats } from '@/types/models'
import { sessionRepository, metaRepository } from '@/db/repositories'
import { useDataStore } from './useDataStore'
import { calculateSessionXp, calculateLevel, xpForNextLevel, checkNewBadges } from '@/logic/gamification'

export const useStatsStore = defineStore('stats', () => {
  // State
  const globalStats = ref<GlobalStats>({
    moyenneGlobale: 0,
    meilleurScore: 0,
    streakActuel: 0,
    totalSessions: 0,
    historiqueSessions: [],
    xp: 0,
    level: 1,
    avatar: '🧑‍💻',
  })

  const previousStats = ref<ComparisonStats>({ average: 0 })
  const newlyUnlockedBadges = ref<Badge[]>([])
  const xpGainedLastSession = ref(0)

  // Computed
  const badgesNonLus = computed(() => newlyUnlockedBadges.value.length > 0)
  
  const levelProgress = computed(() => {
    const currentXp = globalStats.value.xp
    const currentLevel = globalStats.value.level
    
    // XP required for current level (start of bar)
    const xpStart = Math.pow(currentLevel - 1, 2) * 100
    
    // XP required for next level (end of bar)
    const xpEnd = Math.pow(currentLevel, 2) * 100
    
    // Progress within the level
    const progress = currentXp - xpStart
    const range = xpEnd - xpStart
    
    // Avoid division by zero for level 1 (0-100)s
    const totalRange = range > 0 ? range : 100
    
    return Math.min(100, Math.max(0, (progress / totalRange) * 100))
  })

  const xpToNextLevel = computed(() => {
    const currentLevel = globalStats.value.level
    const xpEnd = Math.pow(currentLevel, 2) * 100
    return Math.max(0, xpEnd - globalStats.value.xp)
  })

  const isDailyChallengeCompleted = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return globalStats.value.historiqueSessions.some(
      (s) => s.isDailyChallenge && s.dateJour === today
    )
  })

  // Actions
  async function loadStats() {
    try {
      const allSessions = await sessionRepository.getAll()
      const completedSessions = allSessions.filter((s) => s.dateFin !== null)
      
      // Load avatar from meta
      const profileMeta = await metaRepository.get('profile')
      const avatar = profileMeta?.avatar || '🧑‍💻'

      if (completedSessions.length === 0) {
        globalStats.value = {
          moyenneGlobale: 0,
          meilleurScore: 0,
          streakActuel: 0,
          totalSessions: 0,
          historiqueSessions: [],
          xp: 0,
          level: 1,
          avatar,
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

      // Calculate Total XP
      const totalXp = completedSessions.reduce((acc, s) => {
        // Check if legacy session without isDailyChallenge (treat as false)
        let xp = calculateSessionXp(s.questions)
        if (s.isDailyChallenge) xp *= 2
        return acc + xp
      }, 0)
      
      const level = calculateLevel(totalXp)

      globalStats.value = {
        moyenneGlobale: avg,
        meilleurScore: max,
        streakActuel: currentStreak,
        totalSessions: completedSessions.length,
        historiqueSessions: completedSessions,
        xp: totalXp,
        level: level,
        avatar,
      }
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  async function updateAvatar(avatar: string) {
    globalStats.value.avatar = avatar
    await metaRepository.save('profile', { avatar })
  }

  async function updateStatsAndBadges(session: QuizSession) {
    newlyUnlockedBadges.value = []
    const dataStore = useDataStore()

    try {
      // Calculate XP gain for this session
      let sessionXp = calculateSessionXp(session.questions)
      
      // Double XP for Daily Challenge
      if (session.isDailyChallenge) {
        sessionXp *= 2
      }
      
      xpGainedLastSession.value = sessionXp

      const allSessions = await sessionRepository.getAll()
      const completedSessions = allSessions.filter((s) => s.dateFin !== null)

      // Calculate streak after this session
      const currentStreak = calculateCurrentStreak([...completedSessions, session])

      // Check and unlock badges using pure logic
      const badges = dataStore.badges
      
      // Use pure logic from gamification.ts
      const newBadges = checkNewBadges(
        session,
        [...completedSessions, session], // Include current session in history for logic
        currentStreak,
        badges
      )
      
      newlyUnlockedBadges.value = newBadges

      // Update badges in store (modify objects in place or replace array?)
      // Store expects Badge[] to save.
      // newBadges are references to objects inside `badges` array if find() returns refs?
      // checkNewBadges modifies nothing, just returns list.
      // We need to update the status in the main badges array before saving.
      
      // Actually checkNewBadges in gamification.ts MODIFIES the badge object?
      // No, it finds it and returns it. But if we modify it in `unlock` helper inside checkNewBadges...
      // Wait, `checkNewBadges` in `gamification.ts` modifies the badge object: `badge.statut = 'debloque'`.
      // Since objects are passed by reference from `dataStore.badges`, this mutation is effective.
      
      await dataStore.updateBadges(badges)
      
      // Note: loadStats() will be called by the consumer to refresh the global stats object
    } catch (err) {
      console.error('Error updating stats and badges:', err)
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
    xpGainedLastSession,

    // Computed
    badgesNonLus,
    levelProgress,
    xpToNextLevel,
    isDailyChallengeCompleted,

    // Actions
    loadStats,
    updateStatsAndBadges,
    calculateDailyAverages,
    updateAvatar,
  }
})