<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'
import ProgressBar from '@/components/quiz/ProgressBar.vue'
import QuestionCard from '@/components/quiz/QuestionCard.vue'

const router = useRouter()
const quizStore = useQuizStore()

function handleAnswer(answerIndex: number) {
  quizStore.submitAnswer(answerIndex)
}

function handleSkip() {
  quizStore.skipQuestion()
}

async function handleNext() {
  await quizStore.nextQuestion()
  if (!quizStore.activeSession) {
    router.push('/quiz/summary')
  }
}
</script>

<template>
  <div v-if="!quizStore.activeSession" class="flex items-center justify-center h-full">
    <p>Quiz non trouvé. Retourner à l'accueil.</p>
  </div>

  <div v-else class="h-full flex flex-col p-4">
    <!-- Progress Bar -->
    <ProgressBar :percent="quizStore.progressPercent" />

    <!-- Question Card -->
    <QuestionCard
      v-if="quizStore.currentQuestion"
      :question="quizStore.currentQuestion"
      :question-number="quizStore.currentQuestionIndex + 1"
      :total-questions="quizStore.activeSession.nbQuestions"
      :selected-answer-index="quizStore.selectedAnswerIndex"
      :has-answered="quizStore.hasAnswered"
      @answer-selected="handleAnswer"
    />

    <!-- Actions -->
    <div class="mt-auto pt-6">
      <button
        v-if="!quizStore.hasAnswered"
        @click="handleSkip"
        class="w-full py-3 text-slate-500 hover:text-slate-800 font-medium transition"
      >
        Passer cette question
      </button>
      <button
        v-else
        @click="handleNext"
        class="w-full bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition active:scale-95"
      >
        {{ quizStore.isLastQuestion ? 'Terminer le Quiz' : 'Suivant' }}
      </button>
    </div>
  </div>
</template>
