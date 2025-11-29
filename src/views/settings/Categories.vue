<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import type { Category } from '@/types/models'

const router = useRouter()
const dataStore = useDataStore()

const showDeleteModal = ref(false)
const categoryToDelete = ref<string | null>(null)
const categories = computed(() => {
  // Calculate question count for each category
  return dataStore.allCategories.map(cat => ({
    ...cat,
    questionCount: dataStore.questions.filter(q => q.categorie === cat.label || q.categorie === cat.id).length
  }))
})

// Swipe state
const swipeState = ref<Record<string, { isDragging: boolean; dragX: number }>>({})
const categoryItemRefs = ref<Record<string, HTMLElement>>({})

function initSwipeState(categoryId: string) {
  if (!swipeState.value[categoryId]) {
    swipeState.value[categoryId] = { isDragging: false, dragX: 0 }
  }
}

function handleTouchStart(categoryId: string, e: TouchEvent) {
  initSwipeState(categoryId)
  const state = swipeState.value[categoryId]
  if (state) {
    // @ts-ignore - state is checked for existence above
    state.isDragging = true
    // @ts-ignore - state is checked for existence above
    state.dragX = e.touches[0].clientX
  }
}

function handleTouchMove(categoryId: string, e: TouchEvent) {
  // @ts-ignore - state nullability handled by conditional check
  const state = swipeState.value[categoryId]
  if (!state?.isDragging) return

  const foregroundEl = categoryItemRefs.value[categoryId]
  if (!foregroundEl) return

  // @ts-ignore - state is not null due to return above
  const currentX = e.touches[0].clientX
  const diff = (state as any).dragX - currentX
  const maxSwipe = 90 // Maximum pixels to reveal delete button

  let offset = diff

  // Rubber band effect when swiping left
  if (offset > maxSwipe) {
    offset = maxSwipe + (offset - maxSwipe) * 0.2
  }
  // Allow swiping right to close (but don't go past 0)
  if (offset < 0) {
    offset = 0
  }

  foregroundEl.style.transform = `translateX(-${offset}px)`
}

function handleTouchEnd(categoryId: string) {
  const state = swipeState.value[categoryId]
  if (!state) return

  const foregroundEl = categoryItemRefs.value[categoryId]
  if (!foregroundEl) {
    state.isDragging = false
    return
  }

  const transform = foregroundEl.style.transform || ''
  const match = transform.match(/-?(\d+(?:\.\d+)?)px/)
  const offset = match && match[1] ? Math.abs(parseFloat(match[1])) : 0
  const deleteThreshold = 60

  if (offset > deleteThreshold) {
    // Reveal delete button fully
    foregroundEl.style.transform = 'translateX(-90px)'
    foregroundEl.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
  } else {
    // Hide delete button
    foregroundEl.style.transform = 'translateX(0)'
    foregroundEl.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
  }

  state.isDragging = false
}

function resetSwipe(foregroundEl: HTMLElement) {
  foregroundEl.style.transform = 'translateX(0)'
}

const getTheme = (color: string): { bg: string; border: string; text: string } => {
  const themes: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600' },
    green: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-600' },
    red: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-600' },
    pink: { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-600' },
    slate: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600' },
  }
  return (themes[color] || themes.blue)!
}

const getPhosphorIcon = (iconName: string): string => {
  const iconMap: Record<string, string> = {
    'Code': 'code',
    'Rocket': 'rocket',
    'Cpu': 'cpu',
    'Palette': 'palette',
    'Database': 'database',
    'Chat': 'chat-circle',
    'Calculator': 'calculator',
    'Flask': 'flask',
    'Globe': 'globe',
    'Lightning': 'lightning',
    'Book': 'book',
    'Moon': 'moon',
    'Bug': 'bug',
    'Wine': 'wine',
    'Sparkle': 'sparkle',
    'Lightbulb': 'lightbulb',
    'Gear': 'gear',
    'Wrench': 'wrench',
    'Hammer': 'hammer',
    'Square': 'square',
    'Star': 'star',
    'Heart': 'heart',
    'Flag': 'flag',
    'Target': 'target',
  }
  return iconMap[iconName] || 'code'
}

const handleCreateCategory = () => {
  router.push({ name: 'category-edit' })
}

const handleCategoryClick = (categoryId: string) => {
  router.push({ name: 'category-edit', query: { id: categoryId } })
}

const deleteCategory = (categoryId: string | undefined) => {
  if (!categoryId) return
  categoryToDelete.value = categoryId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (categoryToDelete.value) {
    try {
      await dataStore.deleteCategory(categoryToDelete.value)
      showDeleteModal.value = false
      categoryToDelete.value = null
    } catch (err) {
      console.error('Erreur lors de la suppression de la catégorie:', err)
    }
  }
}
</script>

<template>
  <div class="flex flex-col bg-slate-50 text-slate-900 h-full relative overflow-hidden">

    <!-- Large Header (Apple Style) -->
    <header class="px-6 pt-6 pb-4 bg-slate-50">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-[34px] font-bold text-slate-900 tracking-tight leading-tight">Catégories</h1>
        <p class="text-[15px] text-slate-600 font-medium mt-1">Bibliothèque de questions</p>
      </div>
    </header>

    <!-- Scrollable Content -->
    <main class="flex-grow px-6 max-w-2xl mx-auto w-full overflow-y-auto flex flex-col">

      <!-- Categories List -->

        <!-- Empty State -->
        <div v-if="categories.length === 0" class="flex-1 flex flex-col items-center justify-center py-24 space-y-6">
          <div class="w-20 h-20 bg-slate-100 rounded-[20px] flex items-center justify-center text-slate-400">
            <i class="ph ph-folder-dashed text-4xl"></i>
          </div>
          <div class="text-center space-y-2">
            <p class="text-slate-900 font-semibold text-lg">Aucune catégorie</p>
            <p class="text-sm text-slate-500 max-w-xs">Vos catégories apparaîtront ici. Appuyez sur + pour commencer.</p>
          </div>
        </div>

        <!-- List Items (Swipeable) -->
        <div v-if="categories.length > 0" class="space-y-3 pb-6">
          <div v-for="category in categories" :key="category.id" class="category-item relative overflow-hidden select-none h-[80px]">

            <!-- Background Layer (Delete Action) -->
            <div class="category-layer absolute inset-0 bg-red-500 flex items-center justify-end z-0">
              <!-- @ts-ignore - category.id is checked with v-if and deleteCategory accepts undefined -->
              <button v-if="category.id" class="flex flex-col items-center justify-center w-[90px] h-full text-white"
                      @click.stop="deleteCategory(category.id as string)">
                <i class="ph ph-trash-simple text-2xl mb-1"></i>
                <span class="text-[11px] font-semibold tracking-wide">Supprimer</span>
              </button>
            </div>

            <!-- Foreground Layer (Content) - Swipeable -->
            <div :ref="el => { if (el) categoryItemRefs[category.id] = el as HTMLElement }"
                 :data-category-id="category.id"
                 class="category-layer absolute inset-0 w-full bg-white flex items-center gap-4 px-4 cursor-pointer z-10 transition-colors duration-200"
                 :class="{ 'active:bg-slate-50': !swipeState[category.id]?.isDragging }"
                 @click="handleCategoryClick(category.id)"
                 @touchstart="handleTouchStart(category.id, $event)"
                 @touchmove="handleTouchMove(category.id, $event)"
                 @touchend="handleTouchEnd(category.id)">

              <!-- Icon Badge (Apple Squircle) -->
              <!-- @ts-ignore - category properties are initialized by store -->
              <div class="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center flex-shrink-0 transition-transform duration-200"
                   :class="getTheme((((category as any).color || 'blue') as string)).bg">
                <!-- @ts-ignore - category properties are initialized by store -->
                <i :class="['ph', 'ph-fill', `ph-${getPhosphorIcon((((category as any).icon || 'Code') as string))}`, 'text-2xl', getTheme((((category as any).color || 'blue') as string)).text]"></i>
              </div>

              <!-- Text Info -->
              <div class="flex-1 min-w-0 flex flex-col justify-center h-full py-2">
                <p class="font-semibold text-slate-900 text-[17px] truncate tracking-tight">{{ category.label }}</p>
                <p class="text-[14px] text-slate-500 font-normal">
                  {{ category.questionCount || 0 }} question{{ (category.questionCount || 0) !== 1 ? 's' : '' }}
                </p>
              </div>

              <!-- Chevron -->
              <div class="flex-shrink-0 text-slate-300 pl-1">
                <i class="ph ph-caret-right text-lg font-bold"></i>
              </div>
            </div>
          </div>
        </div>

    </main>

    <!-- Floating Action Button (FAB) -->
    <button @click="handleCreateCategory"
            class="fixed bottom-8 right-6 z-50 w-[56px] h-[56px] rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90">
      <i class="ph ph-plus text-[28px] font-bold"></i>
    </button>

    <!-- Delete Confirmation Modal (Apple Style) -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-in">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" @click="showDeleteModal = false"></div>

      <!-- Modal Content -->
      <div class="relative bg-white/90 backdrop-blur-xl rounded-[20px] w-full max-w-[270px] pt-6 shadow-2xl text-center overflow-hidden">
        <h3 class="text-[17px] font-semibold text-slate-900 mb-1 px-4">Supprimer la catégorie ?</h3>
        <p class="text-[13px] text-slate-500 mb-6 px-4 leading-relaxed">
          Cette action supprimera également toutes les questions associées.
        </p>
        <div class="flex border-t border-slate-300/50">
          <button @click="showDeleteModal = false"
                  class="flex-1 py-3 text-[17px] text-blue-600 font-normal hover:bg-slate-50 transition-colors active:bg-slate-200">
            Annuler
          </button>
          <div class="w-[0.5px] bg-slate-300/50"></div>
          <button @click="confirmDelete"
                  class="flex-1 py-3 text-[17px] text-red-600 font-semibold hover:bg-slate-50 transition-colors active:bg-slate-200">
            Supprimer
          </button>
        </div>
      </div>
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Category Item - Apple Style */
.category-item {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02);
}

/* Both absolute layers need rounded corners */
.category-layer {
  border-radius: 16px;
}
</style>
