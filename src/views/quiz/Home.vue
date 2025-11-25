<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import { useQuizStore } from '@/stores/useQuizStore'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const dataStore = useDataStore()
const quizStore = useQuizStore()

const categoriesDisponibles = computed(() => {
  return [...new Set(dataStore.questions.map((q) => q.categorie))].sort()
})

function selectCategory(category: string) {
  quizStore.selectCategory(category)
  router.push('/quiz/difficulty')
}

function openRandomConfig() {
  quizStore.openRandomConfig(categoriesDisponibles.value)
  router.push('/quiz/randomconfig')
}

function goToImport() {
  router.push('/settings/import')
}
</script>

<template>
  <div v-if="dataStore.isLoading" class="flex items-center justify-center h-full">
    <LoadingSpinner />
  </div>

  <div v-else class="p-4 space-y-6 h-full flex flex-col">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold text-slate-800">Bonjour ! 👋</h2>
      <p class="text-slate-500">Prêt pour un entraînement ? Choisis une catégorie.</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="cat in categoriesDisponibles"
        :key="cat"
        @click="selectCategory(cat)"
        class="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:border-indigo-600 hover:shadow-md transition active:scale-95"
      >
        <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <i class="ph ph-books text-xl"></i>
        </div>
        <span class="font-medium text-sm text-center">{{ cat }}</span>
      </button>
    </div>

    <!-- Random Selection -->
    <button
      @click="openRandomConfig"
      class="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md text-white flex items-center justify-between group active:scale-95 transition"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <i class="ph ph-shuffle text-xl"></i>
        </div>
        <div class="text-left">
          <div class="font-bold">Mode Aléatoire</div>
          <div class="text-xs opacity-90">Mélange les catégories</div>
        </div>
      </div>
      <i class="ph ph-caret-right text-xl group-hover:translate-x-1 transition"></i>
    </button>

    <div class="flex-1"></div>

    <div class="pt-8 border-t border-slate-200">
      <button
        @click="goToImport"
        class="text-sm text-slate-500 flex items-center gap-2 hover:text-indigo-600"
      >
        <i class="ph ph-download-simple"></i> Gestion des données / Import
      </button>
    </div>
  </div>
</template>
