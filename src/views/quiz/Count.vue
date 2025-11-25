<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'

const router = useRouter()
const quizStore = useQuizStore()

async function startQuiz(count: number) {
  try {
    await quizStore.createQuizSession(
      quizStore.selectedCategories,
      quizStore.selectedDifficulty!,
      count,
    )
    router.push('/quiz/active')
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Erreur lors du démarrage du quiz')
  }
}
</script>

<template>
  <div class="p-4 space-y-6 flex flex-col h-full justify-center">
    <h2 class="text-2xl font-bold text-center mb-6">Combien de questions ?</h2>

    <div class="grid grid-cols-1 gap-4">
      <button
        @click="startQuiz(5)"
        class="p-6 bg-white border-2 border-slate-100 rounded-2xl font-bold text-xl hover:border-indigo-600 hover:text-indigo-600 transition shadow-sm"
      >
        5 Questions
      </button>
      <button
        @click="startQuiz(10)"
        class="p-6 bg-white border-2 border-slate-100 rounded-2xl font-bold text-xl hover:border-indigo-600 hover:text-indigo-600 transition shadow-sm"
      >
        10 Questions
      </button>
      <button
        @click="startQuiz(20)"
        class="p-6 bg-white border-2 border-slate-100 rounded-2xl font-bold text-xl hover:border-indigo-600 hover:text-indigo-600 transition shadow-sm"
      >
        20 Questions
      </button>
    </div>
  </div>
</template>
