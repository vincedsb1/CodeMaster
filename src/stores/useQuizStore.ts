/**
 * Quiz Store - Manages active quiz session and quiz logic
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QuizSession, SessionQuestion, Difficulty } from '@/types/models'
import { DIFFICULTY_POINTS } from '@/types/constants'
import { sessionRepository, questionRepository } from '@/db/repositories'
import { useDataStore } from './useDataStore'
import { useStatsStore } from './useStatsStore'

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

  // Actions
  async function checkResumableSession() {
    try {
      const pending = await sessionRepository.getPendingSession()
      if (pending) {
        activeSession.value = pending
        showResumeModal.value = true
      }
    } catch (err) {
      console.error('Error checking resumable session:', err)
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

  async function createQuizSession(
    categories: string[],
    difficulty: Difficulty,
    count: number,
  ) {
    const dataStore = useDataStore()

    // Filter questions by category and difficulty
    let pool = dataStore.questions.filter((q) => categories.includes(q.categorie))

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

    // Take requested amount
    const questionsToPlay = pool.slice(0, count).map((q) => {
      // Shuffle answer indices
      const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5)
      return {
        ...q,
        ordreReponses: indices,
        estSkippe: false,
        estCorrecte: null,
      } as SessionQuestion
    })

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
      categories,
    }

    activeSession.value = session
    resetQuestionState()

    // Save to DB
    await sessionRepository.save(session)
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
      console.error('Error updating question metadata:', err)
    })

    saveCurrentSession().catch((err) => {
      console.error('Error saving session:', err)
    })

    // Immediately go to next
    nextQuestion()
  }

  async function nextQuestion() {
    if (!activeSession.value) return

    if (isLastQuestion.value) {
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

    // Calculate scores
    let scorePondere = 0
    let scorePondereMax = 0
    let correctCount = 0

    activeSession.value.questions.forEach((q) => {
      const points = DIFFICULTY_POINTS[q.difficulte] || 1
      scorePondereMax += points

      if (q.estCorrecte) {
        scorePondere += points
        correctCount++
      }
    })

    activeSession.value.scorePondere = scorePondere
    activeSession.value.scorePondereMax = scorePondereMax
    activeSession.value.notePourcentage =
      (correctCount / activeSession.value.nbQuestions) * 100
    activeSession.value.dateFin = new Date().toISOString()
    activeSession.value.dateJour = new Date().toISOString().split('T')[0]

    // Save session
    await saveCurrentSession()

    // Update stats and check badges
    await statsStore.updateStatsAndBadges(activeSession.value)

    // Reload stats for display
    await statsStore.loadStats()
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

    // Actions
    checkResumableSession,
    resumePreviousSession,
    abandonSession,
    createQuizSession,
    submitAnswer,
    skipQuestion,
    nextQuestion,
    selectCategory,
    openRandomConfig,
    validateRandomSelection,
    selectDifficulty,
  }
})
