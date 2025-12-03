<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import { useQuizStore } from '@/stores/useQuizStore'

const router = useRouter()
const dataStore = useDataStore()
const quizStore = useQuizStore()

const categoriesDisponibles = computed(() => {
  const questionsCategories = new Set(dataStore.questions.map((q) => q.categorie))
  // Match by label since questions store category label, or by id if mismatch
  return dataStore.allCategories.filter((cat) =>
    questionsCategories.has(cat.label) || questionsCategories.has(cat.id)
  )
})

const canValidate = computed(() => quizStore.randomCategoriesSelection.length > 0)

// Auto-select all categories when available if empty
watch(
  categoriesDisponibles,
  (cats) => {
    if (cats.length > 0 && quizStore.randomCategoriesSelection.length === 0) {
      console.log('[RandomConfig] Auto-selecting categories:', cats.map(c => c.label))
      quizStore.randomCategoriesSelection = cats.map((c) => c.label)
    }
  },
  { immediate: true }
)

const colorMap: Record<string, { bg: string; text: string }> = {
  slate: { bg: 'bg-slate-100', text: 'text-slate-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  lime: { bg: 'bg-lime-100', text: 'text-lime-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
}

function getColorClasses(color: string | undefined): { bg: string; text: string } {
  // @ts-ignore - conditional logic ensures return type is always valid
  return (color && (color in colorMap) ? colorMap[color as keyof typeof colorMap] : null) || colorMap.indigo
}

function getIconClass(icon: string): string {
  // Map known icons or normalize
  const map: Record<string, string> = {
    'Code': 'ph-code',
    'Rocket': 'ph-rocket',
    'Cpu': 'ph-cpu',
    'Palette': 'ph-palette',
    'Chat': 'ph-chat-circle',
    'Lightning': 'ph-lightning',
    'Server': 'ph-hard-drives' // Node.js icon fallback
  }
  
  if (map[icon]) return map[icon]
  
  // Fallback: ensure it starts with ph- and is lowercase
  if (icon.startsWith('ph-')) return icon.toLowerCase()
  return `ph-${icon.toLowerCase()}`
}

function toggleCategory(label: string) {
  console.log('[RandomConfig] Toggle:', label)
  const index = quizStore.randomCategoriesSelection.indexOf(label)
  if (index === -1) {
    quizStore.randomCategoriesSelection.push(label)
  } else {
    quizStore.randomCategoriesSelection.splice(index, 1)
  }
}

function validateRandomSelection() {
  quizStore.validateRandomSelection()
  router.push('/quiz/difficulty')
}

function goBack() {
  router.push('/home')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <!-- Navigation Bar (Sticky) -->
    <nav class="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/85 backdrop-blur-md">
      <div class="px-6 py-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button @click="goBack"
                class="p-2 -ml-2 rounded-full hover:bg-slate-100/50 transition-colors">
          <i class="ph ph-caret-left text-xl text-slate-900"></i>
        </button>
        <h1 class="text-[17px] font-semibold text-slate-900">Quelles catégories ?</h1>
        <div class="w-10"></div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow px-6 py-8 pb-12 max-w-2xl mx-auto w-full flex flex-col">


      <!-- Checkboxes Grid -->
      <div class="flex-1 grid grid-cols-2 gap-3 pt-2">
        <div v-for="cat in categoriesDisponibles"
               :key="cat.id"
               @click="toggleCategory(cat.label)"
               class="flex items-center gap-3 p-4 rounded-[18px] border shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all select-none"
               :class="quizStore.randomCategoriesSelection.includes(cat.label)
                 ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                 : 'bg-white border-gray-100/50'">
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
               :class="getColorClasses(cat.color).bg">
            <i :class="['ph-fill', getIconClass(cat.icon), 'text-lg', getColorClasses(cat.color).text]"></i>
          </div>
          <span class="font-medium text-sm line-clamp-1 select-none">{{ cat.label }}</span>
        </div>
      </div>

      <!-- Validate Button -->
      <button @click="validateRandomSelection"
              :disabled="!canValidate"
              class="mt-8 w-full bg-blue-600 text-white font-semibold py-3.5 px-6 rounded-full shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        Valider la sélection
      </button>
    </main>
  </div>
</template>
