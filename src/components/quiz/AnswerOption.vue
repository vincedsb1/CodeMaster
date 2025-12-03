<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text: string
  isCorrect: boolean | null
  isSelected: boolean
  hasAnswered: boolean
  disabled: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  click: []
}>()

const ariaLabel = computed(() => {
  if (!props.hasAnswered) return `Réponse : ${props.text}`
  if (props.isCorrect) return `Réponse correcte : ${props.text}`
  if (props.isSelected && !props.isCorrect) return `Réponse incorrecte sélectionnée : ${props.text}`
  return `Réponse : ${props.text}`
})

const classes = computed(() => {
  const baseClasses =
    'w-full p-4 rounded-xl border-2 text-left transition relative overflow-hidden flex items-center justify-between outline-none focus-visible:ring-4 focus-visible:ring-blue-300'

  if (!props.hasAnswered) {
    return baseClasses + ' bg-white border-slate-200 hover:border-indigo-300 active:bg-indigo-50 text-slate-700 cursor-pointer'
  }

  // After answering
  if (props.isCorrect) {
    return baseClasses + ' bg-green-100 border-green-500 text-green-900 font-bold'
  }

  if (props.isSelected && !props.isCorrect) {
    return baseClasses + ' bg-red-100 border-red-500 text-red-900 opacity-60'
  }

  return baseClasses + ' bg-white border-slate-100 opacity-40 grayscale'
})
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="classes"
    :aria-pressed="isSelected"
    :aria-label="ariaLabel"
    @click="emits('click')"
  >
    <span class="relative z-10">{{ text }}</span>
    
    <!-- Feedback Icons -->
    <i v-if="hasAnswered && isCorrect" class="ph-fill ph-check-circle text-xl text-green-700" aria-hidden="true"></i>
    <i v-if="hasAnswered && isSelected && !props.isCorrect" class="ph-fill ph-x-circle text-xl text-red-700" aria-hidden="true"></i>
  </button>
</template>
