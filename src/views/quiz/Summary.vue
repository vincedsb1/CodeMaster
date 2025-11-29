<script setup lang="ts">
import { computed, onMounted, unref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'
import { useStatsStore } from '@/stores/useStatsStore'

const router = useRouter()
const quizStore = useQuizStore()
const statsStore = useStatsStore()
const displayScore = ref(0)

// Computed values
const session = computed(() => quizStore.activeSession)
const score = computed(() => Math.round(session.value?.notePourcentage || 0))
const correctAnswers = computed(() => {
  if (!session.value) return 0
  return session.value.questions.filter(q => q.estCorrecte).length
})
const totalQuestions = computed(() => session.value?.nbQuestions || 0)
const averageScore = computed(() => Math.round(unref(statsStore.globalStats)?.moyenneGlobale || 0))
const currentStreak = computed(() => unref(statsStore.globalStats)?.streakActuel || 0)

// Score vs Moyenne
const isAboveAverage = computed(() => score.value > averageScore.value)
const scoreDifference = computed(() => Math.abs(score.value - averageScore.value))
const comparisonSymbol = computed(() => (isAboveAverage.value ? '▲' : (score.value === averageScore.value ? '=' : '▼')))

// Couleurs basées sur score
const scoreColorClass = computed(() => {
  if (displayScore.value >= 80) return 'text-green-600'
  if (displayScore.value >= 50) return 'text-amber-600'
  return 'text-red-600'
})

const scoreColor = computed(() => {
  if (displayScore.value >= 80) return '#10b981'
  if (displayScore.value >= 50) return '#f59e0b'
  return '#ef4444'
})

// SVG Circle calculation
const circleCircumference = computed(() => 2 * Math.PI * 100)
const circleDashOffset = computed(() => {
  return circleCircumference.value - (circleCircumference.value * displayScore.value) / 100
})

// Messages personnalisés
const congratulationsMessage = computed(() => {
  if (score.value >= 90) return 'Excellent ! Vous êtes une superstar ! 🚀'
  if (score.value >= 80) return 'Très bien ! Continuez comme ça ! 👏'
  if (score.value >= 60) return 'Pas mal ! Il y a du potentiel. 💪'
  if (score.value >= 40) return 'Continuez à pratiquer ! 📚'
  return 'Ne lâchez rien, essayez encore ! 🎯'
})

const comparisonMessage = computed(() => {
  if (isAboveAverage.value) {
    return `Vous êtes ${scoreDifference.value}% au-dessus de la moyenne ! 📈`
  } else if (score.value === averageScore.value) {
    return 'Vous êtes à la moyenne ! 📊'
  } else {
    return `Vous êtes ${scoreDifference.value}% en dessous de la moyenne. Continuez ! 📖`
  }
})

const comparisonClass = computed(() => {
  if (isAboveAverage.value) return 'bg-green-50'
  return 'bg-blue-50'
})

const comparisonTextColor = computed(() => {
  if (isAboveAverage.value) return 'text-green-700'
  return 'text-blue-700'
})

// Badges
const newBadges = computed(() => statsStore.newlyUnlockedBadges || [])

// Streak
const isPrimaryQuizOfDay = computed(() => {
  if (!session.value) return false
  const today = new Date().toISOString().split('T')[0]
  return session.value.dateJour === today && currentStreak.value > 0
})

// Confetti
const shouldShowConfetti = computed(() => isAboveAverage.value)

// Lifecycle
onMounted(async () => {
  await statsStore.loadStats()

  // Animate score counter
  const startScore = 0
  const targetScore = score.value
  const duration = 2000
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    displayScore.value = Math.round(startScore + (targetScore - startScore) * progress)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      displayScore.value = targetScore
    }
  }

  animate()

  // Déclencher confetti après 500ms
  setTimeout(() => {
    createConfetti()
  }, 500)
})

// Methods
function createConfetti() {
  if (!shouldShowConfetti.value) return

  const container = document.getElementById('confetti-container')
  if (!container) return

  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
  const pieces = 50

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('div')
    piece.className = 'confetti-piece'
    piece.style.left = `${Math.random() * 100}%`
    piece.style.top = `${Math.random() * 50}%`
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]!
    piece.style.animationDelay = `${Math.random() * 0.5}s`
    piece.style.animationDuration = `${Math.random() * 2 + 2}s`
    container.appendChild(piece)

    // Cleanup
    setTimeout(() => piece.remove(), 5000)
  }
}

async function goHome() {
  quizStore.clearActiveSession()
  await router.push({ name: 'home' })
}

async function replayQuiz() {
  const params = quizStore.getReplayParams()
  if (!params) return

  quizStore.clearActiveSession()
  await quizStore.createQuizSession(params.categories, params.difficulty, params.count)
  await router.push({ name: 'quiz-active' })
}
</script>

<template>
  <div v-if="!quizStore.isQuizFinished" class="flex items-center justify-center h-full">
    <p>Quiz non trouvé.</p>
  </div>

  <div v-else class="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative">
    <!-- Navigation Bar (Sticky) -->
    <nav class="sticky top-0 z-40 h-14 bg-white/85 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-6 transition-all duration-300">
      <button @click="goHome"
              class="flex items-center text-blue-600 hover:text-blue-700 active:opacity-60 transition-colors w-10">
        <i class="ph ph-caret-left text-xl"></i>
      </button>

      <h1 class="text-[17px] font-semibold text-slate-900">Résultats</h1>

      <div class="w-10"></div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow pt-20 pb-32 px-6 max-w-2xl mx-auto w-full space-y-6">

      <!-- Congratulations -->
      <div class="text-center space-y-2 pt-2 animate-page-enter">
        <div class="text-6xl animate-bounce-short mb-2 select-none">🎉</div>
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">Quiz Terminé !</h1>
        <p class="text-lg text-slate-600 font-medium leading-relaxed">
          {{ congratulationsMessage }}
        </p>
      </div>

      <!-- Score Circle (Animated SVG) -->
      <section class="rounded-[32px] bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center relative overflow-hidden">
        <!-- Background Glow -->
        <div class="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>

        <div class="relative w-[220px] h-[220px]">
          <svg width="220" height="220" class="transform -rotate-90">
            <!-- Background Track -->
            <circle cx="110" cy="110" r="100" fill="none" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round" />
            <!-- Progress -->
            <circle cx="110" cy="110" r="100" fill="none"
                    :stroke="scoreColor"
                    stroke-width="8"
                    stroke-linecap="round"
                    class="progress-circle"
                    :style="{ strokeDasharray: circleCircumference, strokeDashoffset: circleDashOffset }" />
          </svg>

          <!-- Center Text -->
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-5xl font-bold tracking-tight transition-colors duration-500" :class="scoreColorClass">
              {{ displayScore }}%
            </span>
            <span class="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Score</span>
          </div>
        </div>
      </section>

      <!-- Answers Summary -->
      <section class="rounded-[24px] bg-blue-50/60 border border-blue-100/50 p-6 space-y-3">
        <div class="flex items-baseline justify-between mb-1">
          <h2 class="text-xl font-bold text-slate-900">
            <span class="text-blue-600">{{ correctAnswers }}</span>/{{ totalQuestions }} Correctes
          </h2>
          <span class="text-xs font-semibold text-blue-600/80 uppercase">Exactitude</span>
        </div>

        <div class="h-3 w-full bg-blue-200/40 rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
               :style="{ width: displayScore + '%' }"></div>
        </div>

        <p class="text-center text-sm text-slate-500 font-medium pt-1">
          Excellente tentative ! Continuez comme ça.
        </p>
      </section>

      <!-- Average Comparison -->
      <section class="rounded-[24px] bg-white border border-gray-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 space-y-4">
        <h2 class="text-[15px] font-semibold text-slate-900 ml-1">Votre performance</h2>

        <div class="grid grid-cols-2 gap-3">
          <!-- Current -->
          <div class="rounded-[18px] bg-blue-50/50 border border-blue-100/50 p-4 text-center">
            <div class="text-2xl font-bold text-blue-600">{{ displayScore }}%</div>
            <div class="text-[11px] font-bold text-blue-400 uppercase tracking-wide mt-1">Ce Quiz</div>
          </div>

          <!-- Average -->
          <div class="rounded-[18px] bg-slate-50 border border-slate-100 p-4 text-center">
            <div class="text-2xl font-bold text-slate-600">{{ averageScore }}%</div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-1">Moyenne</div>
          </div>
        </div>

        <div class="rounded-[16px] p-3 flex items-center justify-center gap-2 text-sm font-semibold"
             :class="isAboveAverage ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'">
          <span v-if="isAboveAverage">▲</span>
          <span v-else-if="displayScore === averageScore">=</span>
          <span v-else>▼</span>

          <span>{{ comparisonMessage }}</span>
        </div>
      </section>

      <!-- Streak Celebration (Conditional) -->
      <section v-if="isPrimaryQuizOfDay"
               class="rounded-[24px] bg-orange-50/60 border border-orange-100/50 p-6 text-center space-y-3 relative overflow-hidden animate-page-enter">
        <!-- Decorative BG -->
        <div class="absolute -right-4 -top-4 text-9xl opacity-5 select-none">🔥</div>

        <div class="text-5xl animate-fire-pulse select-none">🔥</div>

        <div>
          <h2 class="text-3xl font-bold text-orange-600">{{ currentStreak }} Jours</h2>
          <p class="text-sm text-orange-600/80 font-medium leading-relaxed px-4">
            Vous êtes en feu ! Revenez demain pour garder votre série.
          </p>
        </div>
      </section>

      <!-- Badges (Conditional) -->
      <section v-if="newBadges.length > 0" class="space-y-4">
        <div class="text-center space-y-1">
          <div class="text-4xl mb-2 select-none">🏆</div>
          <h2 class="text-xl font-bold text-yellow-600">Nouveaux Badges !</h2>
          <p class="text-sm text-yellow-600/70 font-medium">{{ newBadges.length }} badge(s) débloqué(s)</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div v-for="(badge, i) in newBadges"
               :key="badge.id"
               class="rounded-[18px] bg-white border border-yellow-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-4 text-center space-y-2 animate-badge-pop"
               :style="{ animationDelay: (i * 150) + 'ms' }">
            <div class="text-3xl select-none">{{ badge.icon }}</div>
            <h3 class="font-bold text-slate-900 text-sm">{{ badge.nom }}</h3>
            <p class="text-xs text-slate-500 leading-tight">{{ badge.description }}</p>
          </div>
        </div>
      </section>

    </main>

    <!-- Action Buttons (Fixed Bottom) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-[20px] border-t border-white/30 px-6 py-4 flex gap-3 z-50">
      <!-- Home -->
      <button @click="goHome"
              class="flex-1 rounded-full px-4 py-3.5 font-semibold text-[15px] bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
        <i class="ph ph-house text-lg"></i>
        <span>Accueil</span>
      </button>

      <!-- Replay -->
      <button @click="replayQuiz"
              class="flex-1 rounded-full px-4 py-3.5 font-semibold text-[15px] bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all duration-200 flex items-center justify-center gap-2">
        <i class="ph ph-arrow-clockwise text-lg"></i>
        <span>Rejouer</span>
      </button>
    </div>

    <!-- Confetti Container (si score > moyenne) -->
    <div v-if="shouldShowConfetti" id="confetti-container" class="fixed inset-0 pointer-events-none"></div>

  </div>
</template>

<style scoped>
@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceShort {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fireGlowPulse {
  0%, 100% {
    text-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 25px rgba(249, 115, 22, 0.8);
    transform: scale(1.1);
  }
}

@keyframes badgePop {
  0% {
    opacity: 0;
    transform: scale(0.4) rotateZ(-15deg);
  }
  60% {
    transform: scale(1.1) rotateZ(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateZ(0deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-page-enter {
  animation: pageEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-bounce-short {
  animation: bounceShort 1s infinite;
}

.animate-fire-pulse {
  animation: fireGlowPulse 2s ease-in-out infinite;
}

.animate-badge-pop {
  animation: badgePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.progress-circle {
  transition: stroke-dashoffset 1s ease-out;
}

.confetti-piece {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: confettiFall linear forwards;
}

@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotateZ(360deg);
    opacity: 0;
  }
}
</style>
