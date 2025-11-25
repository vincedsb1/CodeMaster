<script setup lang="ts">
import type { SessionQuestion } from '@/types/models'
import { DIFFICULTY_COLORS } from '@/types/constants'
import AnswerOption from './AnswerOption.vue'

interface Props {
  question: SessionQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswerIndex: number | null
  hasAnswered: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'answer-selected': [answerIndex: number]
}>()

const difficultyColor = DIFFICULTY_COLORS[props.question.difficulte] || DIFFICULTY_COLORS.moyen
</script>

<template>
  <div class="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
    <!-- Question info -->
    <div class="mb-2 flex justify-between items-center text-sm text-slate-500 font-medium">
      <span>Question {{ questionNumber }}/{{ totalQuestions }}</span>
      <span
        class="px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider bg-yellow-100 text-yellow-700"
      >
        {{ question.difficulte }}
      </span>
    </div>

    <!-- Question text -->
    <h3 class="text-xl font-bold text-slate-900 mb-6 leading-tight">
      {{ question.intitule }}
    </h3>

    <!-- Answers -->
    <div class="space-y-3 mb-6">
      <AnswerOption
        v-for="(answerIndex, idx) in question.ordreReponses"
        :key="idx"
        :text="(question.reponses[answerIndex] || '')"
        :is-correct="answerIndex === question.indexBonneReponse"
        :is-selected="selectedAnswerIndex === answerIndex"
        :has-answered="hasAnswered"
        :disabled="hasAnswered"
        @click="emits('answer-selected', answerIndex)"
      />
    </div>

    <!-- Explanation -->
    <div
      v-if="hasAnswered && !question.estSkippe"
      class="p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-100 text-sm animate-fade-in"
    >
      <div class="font-bold mb-1 flex items-center gap-2">
        <i class="ph ph-info"></i> Explication
      </div>
      {{ question.explication }}
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
