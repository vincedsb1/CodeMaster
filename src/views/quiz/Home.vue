<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import { useQuizStore } from '@/stores/useQuizStore'
import { useStatsStore } from '@/stores/useStatsStore'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const dataStore = useDataStore()
const quizStore = useQuizStore()
const statsStore = useStatsStore()

// Get categories that have questions
const categoriesDisponibles = computed(() => {
  if (!dataStore.questions || !dataStore.allCategories) return []
  const questionsCategories = new Set(dataStore.questions.map((q) => q.categorie))
  return dataStore.allCategories.filter((cat) => questionsCategories.has(cat.id))
})

// Show stats badge if there are new badges
const showStatsBadge = computed(() => {
  return dataStore.badges && dataStore.badges.some((badge) => badge.statut === 'debloque')
})

// Manual reload function
async function reloadQuestionsManual() {
  try {
    await dataStore.reloadQuestions()
  } catch (err) {
    console.error('[Home] Error reloading questions:', err)
  }
}

onMounted(async () => {
  // Ensure questions are loaded (in case they were imported while away)
  if (!dataStore.questions || dataStore.questions.length === 0) {
    try {
      await dataStore.reloadQuestions()
    } catch (err) {
      console.error('[Home] Error reloading questions:', err)
    }
  }
})

// Get category labels for random config
const categoryLabels = computed(() => {
  if (!categoriesDisponibles.value) return []
  return categoriesDisponibles.value.map((cat) => cat.label)
})

// Apple Design Color Map for categories
type ColorClass = { bg: string; text: string; icon: string }
const defaultColor: ColorClass = { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'ph-code' }
const appleColorMap: Record<string, ColorClass> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'ph-code' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', icon: 'ph-globe' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-600', icon: 'ph-rocket' },
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: 'ph-database' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'ph-paint-brush' },
  yellow: { bg: 'bg-amber-100', text: 'text-amber-600', icon: 'ph-code' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', icon: 'ph-chat' },
}

function getAppleColorClasses(color: string): ColorClass {
  return appleColorMap[color] || defaultColor
}

function selectCategory(category: string) {
  quizStore.selectCategory(category)
  router.push('/quiz/difficulty')
}

function openRandomConfig() {
  quizStore.openRandomConfig(categoryLabels.value)
  router.push('/quiz/randomconfig')
}

function goToImport() {
  router.push('/settings/import')
}

function goToSettings() {
  router.push('/settings/categories')
}

function goToStats() {
  router.push('/stats')
}
</script>

<template>
  <div v-if="dataStore.isLoading" class="flex items-center justify-center h-full">
    <LoadingSpinner />
  </div>

  <div v-else class="flex flex-col bg-slate-50 text-slate-900 h-full">
    <!-- Main Content -->
    <main class="px-6 pb-12 space-y-6 pt-6 mx-auto max-w-2xl w-full flex-grow">

      <!-- A. Welcome Card -->
      <section class="rounded-[2rem] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out">
        <h2 class="text-xl font-bold text-slate-900 mb-2">👋 Bonjour !</h2>
        <p class="text-base text-slate-500 leading-relaxed font-medium">
          Prêt pour un entraînement ?<br>
          Choisis une catégorie pour commencer.
        </p>
      </section>

      <!-- B. Content State: EMPTY (Alert) -->
      <section v-if="categoriesDisponibles.length === 0"
               class="rounded-[2rem] bg-red-50/80 backdrop-blur-sm p-6 space-y-4 border border-red-200/50">

        <div class="flex gap-4">
          <i class="ph ph-warning text-2xl text-red-600 mt-0.5 flex-shrink-0"></i>
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-red-900">Aucune catégorie disponible</h3>
            <p class="text-sm text-red-700/90 leading-relaxed">
              Vous devez d'abord charger les questions depuis les fichiers JSON pour pouvoir jouer.
            </p>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="reloadQuestionsManual"
                  class="flex-1 px-4 py-3 rounded-full bg-white/60 text-slate-600 font-semibold text-sm hover:bg-white active:scale-95 transition-all duration-200 shadow-sm border border-transparent hover:border-slate-200 flex items-center justify-center gap-2">
            <i class="ph ph-arrow-clockwise"></i> Recharger
          </button>
          <button @click="goToImport"
                  class="flex-1 px-4 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-[0_6px_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2">
            <i class="ph ph-download-simple"></i> Import
          </button>
        </div>
      </section>

      <!-- C. Content State: DATA LOADED -->
      <template v-else>
        <!-- Categories Grid -->
        <section class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button v-for="cat in categoriesDisponibles"
                  :key="cat.id"
                  @click="selectCategory(cat.label)"
                  class="group relative rounded-[2rem] bg-white p-6 flex flex-col items-center gap-4 border border-slate-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-slate-50/50 active:scale-95 transition-all duration-200 ease-out cursor-pointer text-center">

            <!-- Icon Badge -->
            <div class="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                 :class="getAppleColorClasses(cat.color).bg">
              <i :class="['ph', getAppleColorClasses(cat.color).icon, 'text-2xl', getAppleColorClasses(cat.color).text]"></i>
            </div>

            <!-- Label -->
            <span class="text-lg font-semibold text-slate-900 line-clamp-2 leading-tight">
              {{ cat.label }}
            </span>
          </button>
        </section>

        <!-- Random Mode Button (Primary Action) -->
        <button @click="openRandomConfig"
                class="w-full group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-1 shadow-[0_6px_20px_rgba(37,99,235,0.3)] hover:shadow-lg active:scale-[0.98] transition-all duration-200 mt-2">

          <div class="px-5 py-4 flex items-center justify-between w-full h-full">
            <div class="flex items-center gap-4">
              <!-- Icon Glass Container -->
              <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <i class="ph ph-shuffle text-white text-2xl"></i>
              </div>

              <div class="text-left">
                <div class="text-lg font-bold text-white">Mode Aléatoire</div>
                <div class="text-sm font-medium text-blue-100/90">Mélange les catégories</div>
              </div>
            </div>

            <i class="ph ph-caret-right text-white/60 text-xl group-hover:text-white group-hover:translate-x-1 transition-all duration-200"></i>
          </div>
        </button>
      </template>

      <!-- 3. Footer Link (Tertiary) -->
      <footer class="pt-8 border-t border-slate-200/60 flex justify-center pb-6 mt-auto">
        <button @click="goToImport"
                class="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 active:scale-95 active:opacity-70 transition-all duration-200 px-4 py-2 rounded-xl hover:bg-blue-50/50">
          <i class="ph ph-download-simple text-lg"></i>
          <span>Gestion des données / Import</span>
        </button>
      </footer>

    </main>
  </div>
</template>
