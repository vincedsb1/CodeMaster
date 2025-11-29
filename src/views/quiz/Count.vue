<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'
import { AppRoutes } from '@/router/routes'

const router = useRouter()
const quizStore = useQuizStore()
const isLoading = ref(false)
const toast = ref<string | null>(null)

const questionOptions = [
  { count: 5, time: '2-3 min', icon: 'ph-lightning' },
  { count: 10, time: '5-7 min', icon: 'ph-books' },
  { count: 20, time: '10-15 min', icon: 'ph-target' }
]

async function startQuiz(count: number) {
  isLoading.value = true
  try {
    await quizStore.createQuizSession(
      quizStore.selectedCategories,
      quizStore.selectedDifficulty!,
      count
    )
    router.push({ name: AppRoutes.Quiz.Active })
  } catch (error) {
    console.error('[Count] Error starting quiz:', error)
    showToast(error instanceof Error ? error.message : 'Erreur lors du démarrage')
    isLoading.value = false
  }
}

function goBack() {
  router.push({ name: AppRoutes.Quiz.Difficulty })
}

function closeFlow() {
  router.push({ name: AppRoutes.Home })
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
        <h1 class="text-[17px] font-semibold text-slate-900">Nombre de questions</h1>

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
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">Combien de questions ?</h2>
        <p class="text-[15px] text-slate-500 font-medium">Peux pas modifier après avoir commencé</p>
      </div>

      <!-- Count Cards -->
      <div class="space-y-4">
        <button v-for="opt in questionOptions"
                :key="opt.count"
                @click="startQuiz(opt.count)"
                :disabled="isLoading"
                class="group w-full rounded-[24px] bg-white p-5 border border-gray-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:bg-blue-50/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-between gap-4 disabled:opacity-50 disabled:cursor-not-allowed">

          <!-- Left: Icon + Info -->
          <div class="flex items-center gap-4 flex-1">
            <!-- Badge -->
            <div class="w-14 h-14 rounded-full flex items-center justify-center bg-blue-50/80 flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-200">
              <i :class="['ph', opt.icon, 'text-[28px] text-blue-600']"></i>
            </div>

            <!-- Text -->
            <div class="text-left flex flex-col">
              <h3 class="text-xl font-bold text-slate-900 leading-tight">
                {{ opt.count }} questions
              </h3>
              <span class="text-[15px] text-slate-500 font-medium">
                ~{{ opt.time }}
              </span>
            </div>
          </div>

          <!-- Right: Chevron -->
          <i class="ph ph-caret-right text-slate-300 text-xl group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200"></i>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading"
           class="fixed inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm">
        <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p class="text-slate-600 font-medium animate-pulse">Création du quiz...</p>
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
