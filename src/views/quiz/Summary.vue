<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'
import { useStatsStore } from '@/stores/useStatsStore'

const router = useRouter()
const quizStore = useQuizStore()
const statsStore = useStatsStore()

onMounted(() => {
  // Ensure stats are loaded for comparison
  statsStore.loadStats()
})

const sessionResultClass = computed(() => {
  if (!quizStore.activeSession) return ''
  const score = quizStore.activeSession.notePourcentage
  if (score >= 80) return 'border-green-500 text-green-600 bg-green-50'
  if (score >= 50) return 'border-yellow-500 text-yellow-600 bg-yellow-50'
  return 'border-red-500 text-red-600 bg-red-50'
})

function getComparisonColor(current: number, avg: number): string {
  if (current > avg + 5) return 'text-green-600'
  if (current < avg - 5) return 'text-red-500'
  return 'text-slate-500'
}

function getDiffSymbol(current: number, avg: number): string {
  if (current > avg) return '▲'
  if (current < avg) return '▼'
  return '='
}

function goHome() {
  router.push('/home')
}
</script>

<template>
  <div
    v-if="!quizStore.activeSession"
    class="p-4 flex items-center justify-center h-full"
  >
    <p>Session non trouvée. Retourner à l'accueil.</p>
  </div>

  <div v-else class="p-4 flex flex-col items-center justify-center h-full space-y-6 text-center">
    <!-- Score Display -->
    <div
      class="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg border-4"
      :class="sessionResultClass"
    >
      {{ Math.round(quizStore.activeSession.notePourcentage) }}%
    </div>

    <!-- Quiz Finished -->
    <div>
      <h2 class="text-2xl font-bold mb-1">Quiz terminé !</h2>
      <p class="text-slate-500">
        Score pondéré :
        <span class="font-bold text-slate-800">{{ quizStore.activeSession.scorePondere }}</span> /
        {{ quizStore.activeSession.scorePondereMax }}
      </p>
    </div>

    <!-- Stats Comparison -->
    <div class="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div
        v-if="statsStore.previousStats.average"
        class="flex justify-between items-center border-b pb-2 border-slate-50"
      >
        <span class="text-sm text-slate-500">Moyenne Globale</span>
        <div
          class="flex items-center gap-1 font-bold"
          :class="getComparisonColor(quizStore.activeSession.notePourcentage, statsStore.previousStats.average)"
        >
          <span>{{
            getDiffSymbol(quizStore.activeSession.notePourcentage, statsStore.previousStats.average)
          }}</span>
          {{ Math.abs(Math.round(quizStore.activeSession.notePourcentage - statsStore.previousStats.average)) }}
          pts
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-slate-500">Bonnes réponses</span>
        <span class="font-bold text-slate-800">
          {{ quizStore.activeSession.questions.filter(q => q.estCorrecte).length }} /
          {{ quizStore.activeSession.nbQuestions }}
        </span>
      </div>
    </div>

    <!-- Newly Unlocked Badges -->
    <div v-if="statsStore.newlyUnlockedBadges.length > 0" class="w-full">
      <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
        Badges débloqués !
      </h3>
      <div class="grid grid-cols-1 gap-2">
        <div
          v-for="badge in statsStore.newlyUnlockedBadges"
          :key="badge.id"
          class="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left"
        >
          <div class="text-2xl">{{ badge.icon || '🏆' }}</div>
          <div>
            <div class="font-bold text-yellow-900">{{ badge.nom }}</div>
            <div class="text-xs text-yellow-700">{{ badge.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <button
      @click="goHome"
      class="w-full bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition active:scale-95 mt-4"
    >
      Retour à l'accueil
    </button>
  </div>
</template>
