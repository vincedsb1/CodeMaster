<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'
import { marked } from 'marked'
import { getCategoryLabel } from '@/types/constants'
import { AppRoutes } from '@/router/routes'
import { useQuizStyles } from '@/composables/useQuizStyles'
import { haptics } from '@/utils/haptics'

const router = useRouter()
const quizStore = useQuizStore()
const showAbandonModal = ref(false)
const { getDifficultyColorClass, getAnswerClasses, getBadgeClasses } = useQuizStyles()

// Computed values
const currentQuestion = computed(() => quizStore.currentQuestion)
const hasAnswered = computed(() => quizStore.hasAnswered)
const selectedAnswerIndex = computed(() => quizStore.selectedAnswerIndex)
const currentQuestionIndex = computed(() => quizStore.currentQuestionIndex)
const totalQuestions = computed(() => quizStore.activeSession?.nbQuestions || 0)
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)
const progressPercent = computed(() => ((currentQuestionIndex.value + (hasAnswered.value ? 1 : 0)) / totalQuestions.value) * 100)

// Difficulty badge colors
const difficultyBadgeClass = computed(() => {
  if (!currentQuestion.value) return ''
  return getDifficultyColorClass(currentQuestion.value.difficulte)
})

// Render Markdown
function renderMarkdown(text: string): string {
  return marked.parseInline(text || '') as string
}

// Actions
function handleAnswer(answerIndex: number, event?: MouseEvent) {
  // If answered, let the event bubble to handleGlobalClick (which triggers next)
  if (hasAnswered.value) return

  // If not answered, stop propagation to prevent triggering next immediately
  if (event) {
    event.stopPropagation()
  }

  haptics.light()
  quizStore.submitAnswer(answerIndex)

  if (currentQuestion.value) {
    const isCorrect = answerIndex === currentQuestion.value.indexBonneReponse
    if (isCorrect) {
      haptics.success()
    } else {
      haptics.error()
    }
  }
}

function handleSkip() {
  haptics.medium()
  quizStore.skipQuestion()
}

async function handleNext() {
  haptics.light()
  const result = await quizStore.nextQuestion()
  if (quizStore.isQuizFinished) {
    haptics.celebrate()
    await router.push({ name: AppRoutes.Quiz.Summary })
  }
}

function confirmAbandon() {
  haptics.medium()
  showAbandonModal.value = true
}

async function quitQuiz() {
  haptics.medium()
  showAbandonModal.value = false
  quizStore.clearActiveSession()
  await router.push({ name: AppRoutes.Home })
}

function handleGlobalClick(event: MouseEvent) {
  // If not answered, do nothing
  if (!hasAnswered.value) return

  // Check if the target is a link (e.g. in markdown explanation)
  const target = event.target as HTMLElement
  if (target.closest('a')) return

  handleNext()
}
</script>

<template>
  <div v-if="!quizStore.activeSession" class="flex items-center justify-center h-full">
    <p>Quiz non trouvé.</p>
  </div>

  <div v-else class="flex flex-col bg-slate-50 text-slate-900 h-full relative" @click="handleGlobalClick">
    <!-- Progress Bar (Fixed Top) -->
    <div class="fixed top-0 left-0 h-1.5 bg-blue-600 transition-all duration-500 ease-out z-50"
         :style="{ width: progressPercent + '%' }"></div>

    <!-- Navigation Bar (Sticky) -->
    <nav class="sticky top-0 z-40 h-14 bg-white/85 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-6 transition-all duration-300">
      <button @click.stop="confirmAbandon"
              class="flex items-center text-blue-600 hover:text-blue-700 active:opacity-60 transition-colors w-10">
        <i class="ph ph-caret-left text-xl"></i>
      </button>

      <h1 class="text-[17px] font-semibold text-slate-900 flex-1 text-center">
        Quiz
      </h1>

      <button @click.stop="confirmAbandon"
              class="flex items-center justify-end text-slate-400 hover:text-slate-600 active:opacity-60 transition-colors w-10">
        <i class="ph ph-x text-lg"></i>
      </button>
    </nav>

    <!-- Main Content (Scrollable) -->
    <main class="flex-grow px-6 py-6 pb-32 max-w-2xl mx-auto w-full flex flex-col space-y-6 overflow-y-auto">

      <transition name="fade" mode="out-in">
        <div v-if="currentQuestion" :key="currentQuestion.id" class="space-y-6 animate-slide-in">

          <!-- Question Info (Badges) -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100/60 text-blue-700 text-xs font-medium backdrop-blur-sm">
              <i class="ph ph-code"></i>
              {{ getCategoryLabel(currentQuestion.categorie) }}
            </span>

            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
                  :class="difficultyBadgeClass">
              {{ currentQuestion.difficulte }}
            </span>
          </div>

          <!-- Question Text -->
          <div class="markdown-body">
            <h2 class="text-xl font-bold text-slate-900 leading-snug" v-html="renderMarkdown(currentQuestion.intitule)"></h2>
          </div>

          <!-- Answer Options -->
          <div class="space-y-3">
            <button v-for="(answer, index) in currentQuestion.reponses"
                    :key="index"
                    @click="handleAnswer(index, $event)"
                    :disabled="false"
                    class="group w-full rounded-[24px] p-4 border transition-all duration-200 flex items-start gap-4 text-left relative overflow-hidden cursor-pointer"
                    :class="[
                      getAnswerClasses(index, selectedAnswerIndex, currentQuestion.indexBonneReponse, hasAnswered),
                      hasAnswered ? 'cursor-pointer' : ''
                    ]">

              <!-- Letter Badge -->
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-200"
                   :class="getBadgeClasses(index, selectedAnswerIndex, currentQuestion.indexBonneReponse, hasAnswered)">
                {{ String.fromCharCode(65 + index) }}
              </div>

              <!-- Text -->
              <div class="flex-1 pt-0.5">
                <p class="text-[16px] font-medium leading-normal"
                   :class="hasAnswered && index !== selectedAnswerIndex && index !== currentQuestion.indexBonneReponse ? 'opacity-50' : ''">
                  {{ answer }}
                </p>
              </div>

              <!-- Feedback Icon -->
              <div v-if="hasAnswered" class="flex-shrink-0 flex items-center justify-center animate-pop">
                <i v-if="index === currentQuestion.indexBonneReponse" class="ph-fill ph-check-circle text-green-600 text-2xl"></i>
                <i v-else-if="index === selectedAnswerIndex" class="ph-fill ph-x-circle text-red-600 text-2xl"></i>
              </div>
            </button>
          </div>

          <!-- Explanation Panel -->
          <div v-if="hasAnswered && selectedAnswerIndex !== null"
               class="rounded-[24px] bg-blue-50/60 border border-blue-200/50 p-5 space-y-2 animate-fade-in backdrop-blur-sm">

            <div class="flex items-center gap-2 mb-1">
              <i class="ph ph-info text-blue-600 text-lg"></i>
              <h4 class="font-semibold text-blue-900 text-sm uppercase tracking-wide">Explication</h4>
            </div>

            <div class="text-[15px] text-blue-900/80 leading-relaxed markdown-body"
                 v-html="renderMarkdown(currentQuestion.explication)">
            </div>
          </div>

        </div>
      </transition>

    </main>

    <!-- Action Buttons (Sticky Bottom) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-[20px] border-t border-white/30 px-6 py-4 flex gap-3 z-50">

      <button @click.stop="handleSkip"
              :disabled="hasAnswered"
              class="flex-1 rounded-full px-4 py-3.5 font-semibold text-[17px] bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        Passer
      </button>

      <button @click.stop="handleNext"
              :disabled="!hasAnswered"
              class="flex-1 rounded-full px-4 py-3.5 font-semibold text-[17px] bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all duration-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed">
        {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
      </button>
    </div>

    <!-- Abandon Modal -->
    <div v-if="showAbandonModal" class="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-in" @click.stop>
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showAbandonModal = false"></div>

      <!-- Content -->
      <div class="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative z-10 animate-pop">
        <div class="text-center space-y-2 mb-6">
          <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ph ph-warning text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Abandonner le quiz ?</h3>
          <p class="text-slate-500 text-sm leading-relaxed">
            Votre progression actuelle sera perdue. Êtes-vous sûr de vouloir quitter ?
          </p>
        </div>

        <div class="space-y-3">
          <button @click="quitQuiz"
                  class="w-full bg-red-600 text-white font-semibold py-3.5 rounded-full active:scale-95 transition-transform shadow-[0_4px_12px_rgba(239,68,68,0.15)]">
            Oui, abandonner
          </button>
          <button @click="showAbandonModal = false"
                  class="w-full bg-gray-100 text-slate-700 font-semibold py-3.5 rounded-full active:scale-95 transition-transform hover:bg-gray-200">
            Continuer le quiz
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.markdown-body p {
  margin-bottom: 0.5rem;
}

.markdown-body code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.9em;
  color: #e11d48;
}

.markdown-body strong {
  font-weight: 600;
  color: #0f172a;
}
</style>
