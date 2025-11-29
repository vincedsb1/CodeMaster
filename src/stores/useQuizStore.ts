/**
 * Quiz Store - Manages active quiz session and quiz logic
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QuizSession, Difficulty } from '@/types/models'
import { sessionRepository, questionRepository } from '@/db/repositories'
import { useDataStore } from './useDataStore'
import { useStatsStore } from './useStatsStore'
import { logger } from '@/utils/logger'
import { selectQuestionsForSession, calculateSessionScore } from '@/logic/quizEngine'
import { generateDailyChallengeQuestions } from '@/logic/dailyChallenge'

export const useQuizStore = defineStore('quiz', () => {
  // State
  const activeSession = ref<QuizSession | null>(null)
  const selectedAnswerIndex = ref<number | null>(null)
  const hasAnswered = ref(false)
  const showResumeModal = ref(false)

  // Temp selection state
  const selectedCategories = ref<string[]>([])
  const randomCategoriesSelection = ref<string[]>([])
  const selectedDifficulty = ref<Difficulty | null>(null)

  // Computed
  const currentQuestion = computed(() => {
    if (!activeSession.value) return null
    return activeSession.value.questions[activeSession.value.indexQuestionCourante]
  })

  const currentQuestionIndex = computed(() => activeSession.value?.indexQuestionCourante || 0)

  const progressPercent = computed(() => {
    if (!activeSession.value) return 0
    return (activeSession.value.indexQuestionCourante / activeSession.value.nbQuestions) * 100
  })

  const isLastQuestion = computed(() => {
    if (!activeSession.value) return false
    return (
      activeSession.value.indexQuestionCourante === activeSession.value.questions.length - 1
    )
  })

  const isQuizFinished = computed(() =>
    activeSession.value?.dateFin !== null && activeSession.value !== null
  )

  // Actions
  async function checkResumableSession() {
    try {
      const pending = await sessionRepository.getPendingSession()
      if (pending) {
        activeSession.value = pending
        showResumeModal.value = true
      }
    } catch (err) {
      logger.error('Error checking resumable session:', err)
    }
  }

  async function resumePreviousSession() {
    showResumeModal.value = false
    // Navigation will be handled by router
  }

  async function abandonSession() {
    if (activeSession.value) {
      await sessionRepository.delete(activeSession.value.sessionId)
      activeSession.value = null
      showResumeModal.value = false
    }
  }

  function clearActiveSession() {
    activeSession.value = null
  }

  async function startDailyChallenge() {
    logger.log('[QuizStore] startDailyChallenge called')
    const dataStore = useDataStore()
    
    // Ensure data is loaded (if starting directly from home)
    if (dataStore.questions.length === 0) {
        await dataStore.initData()
    }

    const today = new Date().toISOString().split('T')[0] as string
    const questions = generateDailyChallengeQuestions(dataStore.questions, today, 10)

    if (questions.length === 0) {
        throw new Error('Pas assez de questions pour le challenge quotidien')
    }

    const session: QuizSession = {
      sessionId: crypto.randomUUID(),
      dateDebut: new Date().toISOString(),
      dateFin: null,
      questions: questions,
      indexQuestionCourante: 0,
      nbQuestions: questions.length,
      scorePondere: 0,
      scorePondereMax: 0,
      notePourcentage: 0,
      difficulteChoisie: 'random', // Mixed difficulty
      categories: ['Daily Challenge'],
      dateJour: today,
      isDailyChallenge: true
    }

    activeSession.value = session
    resetQuestionState()

    await sessionRepository.save(session)
    logger.log('[QuizStore] Daily Challenge session created')
  }

  async function createQuizSession(
    categories: string[],
    difficulty: Difficulty,
    count: number,
  ) {
    // Convert Proxy array to plain array
    const cleanCategories = Array.isArray(categories) ? [...categories] : []
    logger.log('[QuizStore] createQuizSession called with:', { categories: cleanCategories, difficulty, count })

    const dataStore = useDataStore()
    logger.log('[QuizStore] Total questions in store:', dataStore.questions.length)

    // Use category labels directly for filtering (questions now store labels, not IDs)
    logger.log('[QuizStore] Category labels for filtering:', cleanCategories)

    // Logic moved to quizEngine
    try {
      const questionsToPlay = selectQuestionsForSession(
        dataStore.questions,
        cleanCategories,
        difficulty,
        count
      )

      logger.log('[QuizStore] Questions selected for quiz:', questionsToPlay.length)

      if (questionsToPlay.length === 0) {
        throw new Error('Pas assez de questions disponibles pour cette sélection')
      }

      // Create session
      const session: QuizSession = {
        sessionId: crypto.randomUUID(),
        dateDebut: new Date().toISOString(),
        dateFin: null,
        questions: questionsToPlay,
        indexQuestionCourante: 0,
        nbQuestions: questionsToPlay.length,
        scorePondere: 0,
        scorePondereMax: 0,
        notePourcentage: 0,
        difficulteChoisie: difficulty,
        categories: cleanCategories,
      }

      logger.log('[QuizStore] Quiz session created:', { sessionId: session.sessionId, nbQuestions: session.nbQuestions })

      activeSession.value = session
      resetQuestionState()

      logger.log('[QuizStore] Saving session to DB...')
      // Save to DB
      await sessionRepository.save(session)
      logger.log('[QuizStore] Session saved to DB')
    } catch (error) {
      logger.error('[QuizStore] Error creating session:', error)
      throw error
    }
  }

  function resetQuestionState() {
    selectedAnswerIndex.value = null
    hasAnswered.value = false
  }

  async function submitAnswer(answerIndex: number) {
    if (hasAnswered.value || !activeSession.value) return

    hasAnswered.value = true
    selectedAnswerIndex.value = answerIndex

    const question = currentQuestion.value
    if (!question) return

    const isCorrect = answerIndex === question.indexBonneReponse
    question.estCorrecte = isCorrect

    // Update question metadata in DB
    const originalQuestion = await questionRepository.getById(question.id)
    if (originalQuestion) {
      originalQuestion.countApparition++
      if (isCorrect) {
        originalQuestion.countBonneReponse++
      }
      await questionRepository.save(originalQuestion)
    }

    // Save current session
    await saveCurrentSession()
  }

  function skipQuestion() {
    if (!activeSession.value) return

    const question = currentQuestion.value
    if (!question) return

    question.estSkippe = true
    question.estCorrecte = false
    hasAnswered.value = true

    // Update question aparition count
    questionRepository.incrementApparition(question.id).catch((err) => {
      logger.error('Error updating question metadata:', err)
    })

    saveCurrentSession().catch((err) => {
      logger.error('Error saving session:', err)
    })

    // Immediately go to next
    nextQuestion()
  }

  async function nextQuestion() {
    if (!activeSession.value) return

    if (isLastQuestion.value) {
      logger.log('[QuizStore] Last question - finishing quiz')
      await finishQuiz()
    } else {
      activeSession.value.indexQuestionCourante++
      resetQuestionState()
      await saveCurrentSession()
    }
  }

  async function saveCurrentSession() {
    if (activeSession.value) {
      await sessionRepository.save(activeSession.value)
    }
  }

  async function finishQuiz() {
    if (!activeSession.value) return

    const statsStore = useStatsStore()

    // Logic moved to quizEngine
    const result = calculateSessionScore(activeSession.value.questions)

    activeSession.value.scorePondere = result.scorePondere
    activeSession.value.scorePondereMax = result.scorePondereMax
    activeSession.value.notePourcentage = result.notePourcentage
    activeSession.value.dateFin = new Date().toISOString()
    activeSession.value.dateJour = new Date().toISOString().split('T')[0]

    // Save session
    await saveCurrentSession()

    // Update stats and check badges
    await statsStore.updateStatsAndBadges(activeSession.value)

    // Reload stats for display
    await statsStore.loadStats()

    // Keep session for Summary page to display results
    logger.log('[QuizStore] Quiz finished - score:', activeSession.value.notePourcentage.toFixed(1) + '%')
  }

  // Category selection helpers
  function selectCategory(category: string) {
    selectedCategories.value = [category]
  }

  function openRandomConfig(availableCategories: string[]) {
    randomCategoriesSelection.value = [...availableCategories]
  }

  function validateRandomSelection() {
    selectedCategories.value = [...randomCategoriesSelection.value]
  }

  function selectDifficulty(difficulty: Difficulty) {
    selectedDifficulty.value = difficulty
  }

  function getReplayParams() {
    if (!activeSession.value) return null
    return {
      categories: [...activeSession.value.categories],
      difficulty: activeSession.value.difficulteChoisie,
      count: activeSession.value.nbQuestions
    }
  }

  return {
    // State
    activeSession,
    selectedAnswerIndex,
    hasAnswered,
    showResumeModal,
    selectedCategories,
    randomCategoriesSelection,
    selectedDifficulty,

    // Computed
    currentQuestion,
    currentQuestionIndex,
    progressPercent,
    isLastQuestion,
    isQuizFinished,

    // Actions
    checkResumableSession,
    resumePreviousSession,
    abandonSession,
    clearActiveSession,
    createQuizSession,
    submitAnswer,
    skipQuestion,
    nextQuestion,
    selectCategory,
    openRandomConfig,
    validateRandomSelection,
    selectDifficulty,
    getReplayParams,
    startDailyChallenge,
  }
})
