<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import { useQuizStore } from '@/stores/useQuizStore'
import { computed } from 'vue'

const router = useRouter()
const dataStore = useDataStore()
const quizStore = useQuizStore()

const categoriesDisponibles = computed(() => {
  return [...new Set(dataStore.questions.map((q) => q.categorie))].sort()
})

const canValidate = computed(() => quizStore.randomCategoriesSelection.length > 0)

function validateRandomSelection() {
  quizStore.validateRandomSelection()
  router.push('/quiz/difficulty')
}
</script>

<template>
  <div class="p-4 flex flex-col h-full">
    <h2 class="text-xl font-bold mb-4">Quelles catégories ?</h2>

    <div class="flex-1 overflow-y-auto space-y-2">
      <label
        v-for="cat in categoriesDisponibles"
        :key="cat"
        class="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-300"
      >
        <input
          type="checkbox"
          :value="cat"
          v-model="quizStore.randomCategoriesSelection"
          class="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <span class="font-medium">{{ cat }}</span>
      </label>
    </div>

    <div class="mt-4 pt-4 border-t">
      <button
        @click="validateRandomSelection"
        :disabled="!canValidate"
        class="w-full bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Valider la sélection
      </button>
    </div>
  </div>
</template>
