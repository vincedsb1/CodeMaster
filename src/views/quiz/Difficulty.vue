<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'
import { DIFFICULTY_COLORS } from '@/types/constants'

const router = useRouter()
const quizStore = useQuizStore()

function selectDifficulty(difficulty: 'facile' | 'moyen' | 'difficile' | 'random') {
  quizStore.selectDifficulty(difficulty)
  router.push('/quiz/count')
}
</script>

<template>
  <div class="p-4 space-y-6 h-full flex flex-col">
    <div class="text-center space-y-1">
      <h2 class="text-xl font-bold">Difficulté</h2>
      <p class="text-slate-500 text-sm">Niveau du challenge</p>
    </div>

    <div class="space-y-3 flex-1">
      <button
        @click="selectDifficulty('facile')"
        class="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition text-left active:scale-95"
        :class="[DIFFICULTY_COLORS.facile.bg, DIFFICULTY_COLORS.facile.border, DIFFICULTY_COLORS.facile.text]"
      >
        <i class="ph ph-bicycle text-2xl"></i>
        <div>
          <span class="font-bold">Facile</span>
          <div class="text-xs opacity-75">1 point / question</div>
        </div>
      </button>

      <button
        @click="selectDifficulty('moyen')"
        class="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition text-left active:scale-95"
        :class="[DIFFICULTY_COLORS.moyen.bg, DIFFICULTY_COLORS.moyen.border, DIFFICULTY_COLORS.moyen.text]"
      >
        <i class="ph ph-car text-2xl"></i>
        <div>
          <span class="font-bold">Moyen</span>
          <div class="text-xs opacity-75">2 points / question</div>
        </div>
      </button>

      <button
        @click="selectDifficulty('difficile')"
        class="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition text-left active:scale-95"
        :class="[DIFFICULTY_COLORS.difficile.bg, DIFFICULTY_COLORS.difficile.border, DIFFICULTY_COLORS.difficile.text]"
      >
        <i class="ph ph-rocket-launch text-2xl"></i>
        <div>
          <span class="font-bold">Difficile</span>
          <div class="text-xs opacity-75">3 points / question</div>
        </div>
      </button>

      <button
        @click="selectDifficulty('random')"
        class="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition text-left active:scale-95 bg-indigo-50 border-indigo-200 text-indigo-800"
      >
        <i class="ph ph-dice-five text-2xl"></i>
        <div>
          <span class="font-bold">Aléatoire</span>
          <div class="text-xs opacity-75">Difficultés mixtes</div>
        </div>
      </button>
    </div>
  </div>
</template>
