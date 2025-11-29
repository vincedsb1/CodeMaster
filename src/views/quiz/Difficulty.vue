<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'
import { DIFFICULTY_COLORS } from '@/types/constants'

const router = useRouter()
const quizStore = useQuizStore()
const isLoading = ref(false)
const toast = ref<string | null>(null)

const difficulties = [
  {
    id: 'facile',
    label: 'Facile',
    points: 1,
    icon: 'ph-smiley',
    description: 'Parfait pour débuter. Consolidez les bases.',
    colors: { bg: 'bg-green-100', text: 'text-green-600' }
  },
  {
    id: 'moyen',
    label: 'Moyen',
    points: 2,
    icon: 'ph-lightning',
    description: 'Pour progresser. Teste tes connaissances.',
    colors: { bg: 'bg-amber-100', text: 'text-amber-600' }
  },
  {
    id: 'difficile',
    label: 'Difficile',
    points: 3,
    icon: 'ph-fire',
    description: 'Ultime défi. Maîtrise complète requise.',
    colors: { bg: 'bg-red-100', text: 'text-red-600' }
  },
  {
    id: 'random',
    label: 'Aléatoire',
    points: 0,
    icon: 'ph-shuffle',
    description: 'Mélange tous les niveaux. Variété garantie.',
    colors: { bg: 'bg-purple-100', text: 'text-purple-600' }
  }
]

function selectDifficulty(difficulty: 'facile' | 'moyen' | 'difficile' | 'random') {
  quizStore.selectDifficulty(difficulty)
  router.push('/quiz/count')
}

function goBack() {
  router.push('/home')
}

function closeFlow() {
  router.push('/home')
}

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => {
    toast.value = null
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <!-- Navigation Bar (Sticky + Glassmorphism) -->
    <nav class="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/85 backdrop-blur-md transition-all duration-300">
      <div class="px-6 py-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <!-- Back Button -->
        <button @click="goBack"
                class="flex items-center text-blue-600 hover:text-blue-700 active:opacity-60 transition-colors">
          <i class="ph ph-caret-left text-xl mr-1"></i>
          <span class="text-[17px] font-medium hidden sm:inline">Retour</span>
        </button>

        <!-- Title -->
        <h1 class="text-[17px] font-semibold text-slate-900">Difficulté</h1>

        <!-- Close Button -->
        <button @click="closeFlow"
                class="flex items-center text-slate-400 hover:text-slate-600 active:opacity-60 transition-colors bg-gray-100/50 rounded-full p-1">
          <i class="ph ph-x text-lg"></i>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow px-6 py-8 pb-12 max-w-2xl mx-auto w-full flex flex-col">

      <!-- Header -->
      <div class="text-center space-y-1 mb-8 animate-fade-in">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">Quel niveau ?</h2>
        <p class="text-[15px] text-slate-500 font-medium">Choisis une difficulté pour commencer</p>
      </div>

      <!-- Difficulty Cards -->
      <div class="space-y-4">
        <button v-for="diff in difficulties"
                :key="diff.id"
                @click="selectDifficulty(diff.id as any)"
                class="group w-full rounded-[24px] bg-white p-5 border border-gray-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:bg-gray-50/50 active:scale-[0.98] transition-all duration-200 flex flex-col items-start gap-3 text-left relative overflow-hidden">

          <!-- Row 1: Icon + Title -->
          <div class="flex items-center gap-3 w-full relative z-10">
            <!-- Badge -->
            <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                 :class="diff.colors.bg">
              <i :class="['ph', diff.icon, 'text-2xl', diff.colors.text]"></i>
            </div>

            <!-- Text Info -->
            <div class="flex flex-col">
              <h3 class="text-[17px] font-semibold text-slate-900 capitalize leading-snug">
                {{ diff.label }}
              </h3>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {{ diff.points }}{{ diff.points !== 0 ? ' point' + (diff.points > 1 ? 's' : '') : '?' }} / question
              </span>
            </div>
          </div>

          <!-- Row 2: Description -->
          <p class="text-[15px] text-slate-500 leading-relaxed font-medium pl-1">
            {{ diff.description }}
          </p>

          <!-- Hover Highlight -->
          <div class="absolute inset-0 bg-current opacity-0 group-hover:opacity-[0.02] pointer-events-none transition-opacity duration-300 text-blue-500"></div>
        </button>
      </div>

    </main>

    <!-- Toast Notification -->
    <div v-if="toast"
         class="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-fade-in">
      <i class="ph ph-check-circle text-green-400 text-xl"></i>
      <span class="font-medium text-sm">{{ toast }}</span>
    </div>

  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}
</style>
