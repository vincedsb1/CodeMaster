<template>
  <div class="px-4">
    <div v-if="categories.length === 0" class="text-center py-12">
      <p class="text-slate-500">Aucune catégorie créée.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="category in categories"
        :key="category.id"
        class="relative overflow-hidden rounded-xl border border-slate-200"
        @touchstart="handleTouchStart($event, category.id)"
        @touchmove="handleTouchMove($event, category.id)"
        @touchend="handleTouchEnd(category.id)"
      >
        <!-- Swipe delete background -->
        <div class="absolute inset-0 bg-red-500 flex items-center justify-end pr-4 z-0">
          <button
            @click="$emit('delete', category.id)"
            class="text-white"
            title="Supprimer"
          >
            <PhosphorIcon :size="24">Trash</PhosphorIcon>
          </button>
        </div>

        <!-- Main category row (swipeable, fully clickable) -->
        <button
          :style="{ transform: `translateX(${swipeOffsets[category.id] || 0}px)` }"
          @click="$emit('category-click', category.id)"
          class="relative w-full bg-white p-4 flex items-center gap-3 transition-transform cursor-pointer hover:bg-slate-50 active:bg-slate-100"
        >
          <!-- Icon and label -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                colorLightMap[category.color],
              ]"
            >
              <PhosphorIcon :size="20">{{ category.icon }}</PhosphorIcon>
            </div>
            <div class="min-w-0 flex-1 text-left">
              <p class="font-medium text-slate-900 truncate">{{ category.label }}</p>
              <p class="text-xs text-slate-500">
                {{ getQuestionCountForCategory(category.id) }} question<span v-if="getQuestionCountForCategory(category.id) !== 1">s</span>
              </p>
            </div>
          </div>

          <!-- Chevron indicator -->
          <PhosphorIcon :size="20" class="text-slate-400 flex-shrink-0">CaretRight</PhosphorIcon>
        </button>
      </div>

      <!-- Swipe hint for mobile -->
      <p class="text-xs text-slate-500 text-center md:hidden mt-4">
        Swipe à gauche pour supprimer
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Category, Question } from '@/types/models'

interface Props {
  categories: Category[]
  questions: Question[]
}

const props = defineProps<Props>()

defineEmits<{
  'category-click': [categoryId: string]
  delete: [categoryId: string]
}>()

// Swipe state
const swipeOffsets = ref<Record<string, number>>({})
const touchStartX = ref<Record<string, number>>({})
const SWIPE_THRESHOLD = 60 // pixels to swipe before trigger

const handleTouchStart = (event: TouchEvent, categoryId: string) => {
  touchStartX.value[categoryId] = event.touches[0]?.clientX || 0
}

const handleTouchMove = (event: TouchEvent, categoryId: string) => {
  const currentX = event.touches[0]?.clientX || 0
  const startX = touchStartX.value[categoryId] || 0
  const diff = currentX - startX

  // Only allow swiping left (negative values)
  if (diff < 0) {
    swipeOffsets.value[categoryId] = Math.max(diff, -80)
  }
}

const handleTouchEnd = (categoryId: string) => {
  const offset = swipeOffsets.value[categoryId] || 0

  // If swiped more than threshold, snap to open
  if (offset < -SWIPE_THRESHOLD) {
    swipeOffsets.value[categoryId] = -80
  } else {
    // Otherwise snap back to closed
    swipeOffsets.value[categoryId] = 0
  }
}

const colorMap: Record<string, string> = {
  slate: 'bg-slate-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  yellow: 'bg-yellow-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
}

const colorLightMap: Record<string, string> = {
  slate: 'bg-slate-100',
  red: 'bg-red-100',
  orange: 'bg-orange-100',
  amber: 'bg-amber-100',
  yellow: 'bg-yellow-100',
  lime: 'bg-lime-100',
  green: 'bg-green-100',
  emerald: 'bg-emerald-100',
  teal: 'bg-teal-100',
  cyan: 'bg-cyan-100',
  blue: 'bg-blue-100',
  indigo: 'bg-indigo-100',
  purple: 'bg-purple-100',
  pink: 'bg-pink-100',
}

const colorBadgeLightMap: Record<string, string> = {
  slate: 'bg-slate-100',
  red: 'bg-red-100',
  orange: 'bg-orange-100',
  amber: 'bg-amber-100',
  yellow: 'bg-yellow-100',
  lime: 'bg-lime-100',
  green: 'bg-green-100',
  emerald: 'bg-emerald-100',
  teal: 'bg-teal-100',
  cyan: 'bg-cyan-100',
  blue: 'bg-blue-100',
  indigo: 'bg-indigo-100',
  purple: 'bg-purple-100',
  pink: 'bg-pink-100',
}

const colorBadgeTextMap: Record<string, string> = {
  slate: 'text-slate-700',
  red: 'text-red-700',
  orange: 'text-orange-700',
  amber: 'text-amber-700',
  yellow: 'text-yellow-700',
  lime: 'text-lime-700',
  green: 'text-green-700',
  emerald: 'text-emerald-700',
  teal: 'text-teal-700',
  cyan: 'text-cyan-700',
  blue: 'text-blue-700',
  indigo: 'text-indigo-700',
  purple: 'text-purple-700',
  pink: 'text-pink-700',
}

const getQuestionCountForCategory = (categoryId: string): number => {
  return props.questions.filter((q) => q.categorie === categoryId).length
}
</script>
