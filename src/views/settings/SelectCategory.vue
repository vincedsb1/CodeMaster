<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import type { Category } from '@/types/models'

const router = useRouter()
const dataStore = useDataStore()
const categories = dataStore.allCategories

const selectedCategory = ref<string>('')
const isImporting = ref(false)
const importSuccess = ref(false)

// Retrieve pending JSON from sessionStorage
const pendingJsonStr = sessionStorage.getItem('pendingImportJson')
const pendingJson = pendingJsonStr ? JSON.parse(pendingJsonStr) : null

const availableIcons = [
  'ph-code', 'ph-rocket', 'ph-cpu', 'ph-palette', 'ph-database', 'ph-chat-circle',
  'ph-globe', 'ph-lightning', 'ph-book', 'ph-moon', 'ph-bug', 'ph-gear',
  'ph-calculator', 'ph-flask', 'ph-trophy', 'ph-target', 'ph-lightbulb', 'ph-heart'
]

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

const textColors: Record<string, string> = {
  yellow: 'text-yellow-600', blue: 'text-blue-600', green: 'text-green-600',
  red: 'text-red-600', purple: 'text-purple-600', orange: 'text-orange-600',
}

const availableColors = Object.keys(colorMap)

const newCategory = ref({
  label: '',
  icon: 'ph-code',
  color: 'blue',
})

const getColorBg = (color: string) => colorMap[color] || 'bg-slate-500'
const getColorClass = (color: string) => textColors[color] || 'text-slate-600'

const createAndSelect = () => {
  if (!newCategory.value.label.trim()) return
  selectedCategory.value = newCategory.value.label
  newCategory.value = { label: '', icon: 'ph-code', color: 'blue' }
}

const handleSelect = async () => {
  if (!selectedCategory.value) return

  console.log('[SelectCategory] Category selected:', selectedCategory.value)
  isImporting.value = true
  importSuccess.value = false

  try {
    // Create category if it doesn't exist
    const existingCategory = dataStore.getCategoryByLabel(selectedCategory.value)
    if (!existingCategory) {
      console.log('[SelectCategory] Creating new category...')
      // Auto-create category with default values
      await dataStore.addCategory({
        id: `cat_${Date.now()}`,
        label: selectedCategory.value,
        icon: 'ph-code',
        color: 'blue',
      })
      console.log('[SelectCategory] Category created')
    }

    console.log('[SelectCategory] PendingJson:', pendingJson?.length, 'questions')

    if (pendingJson) {
      console.log('[SelectCategory] Starting import...')

      const importPromise = dataStore.importQuestions(pendingJson, selectedCategory.value)

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Import timeout après 30 secondes')), 30000)
      )

      const result = await Promise.race([importPromise, timeoutPromise])
      console.log('[SelectCategory] Import result:', result)
      console.log('[SelectCategory] Import successful! Count:', (result as any).count)
    }

    importSuccess.value = true
    console.log('[SelectCategory] Import success state set to true')

    sessionStorage.removeItem('pendingImportJson')
    console.log('[SelectCategory] Import complete, navigating to home')

    setTimeout(() => {
      router.push({ name: 'home' })
    }, 2000)
  } catch (err) {
    isImporting.value = false
    console.error('[SelectCategory] Error:', err)
    alert(err instanceof Error ? err.message : 'Erreur lors de l\'import')
  }
}

const handleCancel = () => {
  console.log('[SelectCategory] Import cancelled')
  sessionStorage.removeItem('pendingImportJson')
  router.back()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative">
    <!-- Main Content (Scrollable) -->
    <main class="flex-grow pt-6 pb-28 px-6 max-w-2xl mx-auto w-full space-y-6 opacity-0 animate-page-enter">

      <!-- Header (Large Title) -->
      <section class="space-y-2 pt-2">
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">Sélectionner une catégorie</h1>
        <p class="text-[15px] text-slate-600 leading-relaxed font-medium">
          Choisissez la catégorie pour les questions importées ou créez-en une nouvelle.
        </p>
      </section>

      <!-- Existing Categories -->
      <section class="rounded-[24px] bg-white/50 backdrop-blur-sm border border-gray-200/50 p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <i class="ph-fill ph-folder-open text-blue-600"></i>
          Catégories existantes
        </h3>

        <div class="space-y-2">
          <button v-for="cat in categories"
                  :key="cat.id"
                  @click="selectedCategory = cat.label"
                  type="button"
                  class="w-full text-left px-4 py-3.5 rounded-2xl border-2 smooth-transition flex items-center gap-3 group relative overflow-hidden"
                  :class="selectedCategory === cat.label
                    ? 'border-blue-400 bg-blue-50 shadow-[0_4px_12px_rgba(59,130,246,0.1)]'
                    : 'border-gray-100/50 bg-white/60 hover:border-gray-200 shadow-sm'">

            <!-- Icon Badge -->
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-colors"
                 :class="selectedCategory === cat.label ? 'bg-blue-100 border-blue-200' : 'bg-white border-gray-100'">
              <i :class="['ph-fill', cat.icon, 'text-lg', getColorClass(cat.color)]"></i>
            </div>

            <!-- Label -->
            <span class="font-semibold text-slate-900 flex-1 text-[15px]">{{ cat.label }}</span>

            <!-- Check Indicator -->
            <div class="flex-shrink-0 transition-transform duration-200"
                 :class="selectedCategory === cat.label ? 'scale-100 opacity-100' : 'scale-0 opacity-0'">
              <div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <i class="ph-bold ph-check text-white text-xs"></i>
              </div>
            </div>
          </button>
        </div>
      </section>

      <!-- Divider -->
      <div class="border-t border-gray-200/60 mx-4"></div>

      <!-- Create New Category -->
      <section class="rounded-[24px] bg-white/50 backdrop-blur-sm border border-gray-200/50 p-6 space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <i class="ph-fill ph-plus-circle text-blue-600"></i>
          Créer une nouvelle catégorie
        </h3>

        <!-- Label Input -->
        <div class="space-y-2">
          <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nom</label>
          <div class="relative">
            <input v-model="newCategory.label"
                   type="text"
                   placeholder="Ex: Python, Data Science..."
                   class="w-full px-4 py-3.5 rounded-2xl border bg-white/80 placeholder:text-slate-400 text-slate-900 font-medium
                          focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200
                          border-gray-200/80 shadow-sm" />
          </div>
        </div>

        <!-- Icon Picker -->
        <div class="space-y-2">
          <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Icône</label>
          <div class="grid grid-cols-6 gap-2">
            <button v-for="icon in availableIcons"
                    :key="icon"
                    type="button"
                    @click="newCategory.icon = icon"
                    class="aspect-square rounded-2xl border-2 flex items-center justify-center smooth-transition hover:scale-105"
                    :class="newCategory.icon === icon
                      ? 'border-blue-400 bg-blue-50 shadow-[0_4px_12px_rgba(59,130,246,0.1)] text-blue-600'
                      : 'border-gray-100/50 bg-white/60 hover:border-gray-200 text-slate-500'">
              <i :class="['ph-fill', icon, 'text-xl']"></i>
            </button>
          </div>
        </div>

        <!-- Color Picker -->
        <div class="space-y-2">
          <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Couleur</label>
          <div class="grid grid-cols-7 gap-2">
            <button v-for="color in availableColors"
                    :key="color"
                    type="button"
                    @click="newCategory.color = color"
                    class="aspect-square rounded-2xl border-2 smooth-transition hover:scale-105 relative overflow-hidden"
                    :class="[
                      getColorBg(color),
                      newCategory.color === color
                        ? 'border-slate-900 shadow-md scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-black/10'
                    ]">
              <div v-if="newCategory.color === color" class="absolute inset-0 flex items-center justify-center">
                <i class="ph-bold ph-check text-white text-sm drop-shadow-md"></i>
              </div>
            </button>
          </div>
        </div>

        <!-- Create Button -->
        <button type="button"
                @click="createAndSelect"
                :disabled="!newCategory.label.trim()"
                class="w-full rounded-full px-6 py-3.5 font-semibold text-white text-[15px]
                       bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-[0_4px_12px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 mt-2">
          <i class="ph-bold ph-plus text-lg"></i>
          Créer et sélectionner
        </button>
      </section>

    </main>

    <!-- Fixed Action Buttons -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-md border-t border-white/20 px-6 py-4 z-50"
         style="padding-bottom: max(1rem, env(safe-area-inset-bottom))">
      <div class="max-w-2xl mx-auto flex gap-3">

        <!-- Cancel -->
        <button @click="handleCancel"
                :disabled="isImporting"
                class="flex-1 rounded-full px-6 py-3.5 font-semibold text-[15px] text-slate-700
                       bg-slate-100 hover:bg-slate-200 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200">
          Annuler
        </button>

        <!-- Import -->
        <button @click="handleSelect"
                :disabled="!selectedCategory || isImporting"
                class="flex-1 rounded-full px-6 py-3.5 font-semibold text-[15px] text-white
                       bg-blue-600 hover:bg-blue-700 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-[0_4px_12px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2">
          <span v-if="isImporting" class="flex items-center gap-2">
            <i class="ph-bold ph-spinner animate-spin text-lg"></i>
            Import...
          </span>
          <span v-else class="flex items-center gap-2">
            <i class="ph-bold ph-download-simple text-lg"></i>
            Importer
          </span>
        </button>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="importSuccess"
         class="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-[60] flex items-center gap-3 animate-fade-in whitespace-nowrap">
      <i class="ph-fill ph-check-circle text-xl"></i>
      <span class="font-semibold text-sm">Import réussi !</span>
    </div>

  </div>
</template>

<style scoped>
@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-page-enter {
  animation: pageEnter 0.5s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.smooth-transition {
  transition: all 0.2s ease-out;
}
</style>
