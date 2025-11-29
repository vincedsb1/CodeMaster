<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Category } from '@/types/models'
import { useDataStore } from '@/stores/useDataStore'

const router = useRouter()
const route = useRoute()
const dataStore = useDataStore()

const normalizeIconName = (iconName: string): string => {
  if (iconName.startsWith('ph-')) return iconName

  // Mapping from stored format to Phosphor icon names
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

  return `ph-${iconMap[iconName] || iconName.toLowerCase()}`
}

const categoryId = route.query.id as string | undefined
const isEditMode = !!categoryId
const editingCategory = ref<Category | null>(null)

if (isEditMode && categoryId) {
  const cat = dataStore.allCategories.find((c) => c.id === categoryId)
  if (cat) {
    editingCategory.value = { ...cat }
  }
}

const form = ref<{ label: string; icon: string; color: string }>({
  label: editingCategory.value?.label || '',
  icon: editingCategory.value ? normalizeIconName(editingCategory.value.icon) : 'ph-code',
  color: editingCategory.value?.color || 'blue',
})

const errors = ref<Record<string, string>>({})

const availableIcons = [
  'ph-code', 'ph-rocket', 'ph-cpu', 'ph-palette', 'ph-database', 'ph-chat-circle',
  'ph-calculator', 'ph-flask', 'ph-globe', 'ph-lightning', 'ph-book', 'ph-moon',
  'ph-bug', 'ph-wine', 'ph-sparkle', 'ph-lightbulb', 'ph-gear', 'ph-wrench',
  'ph-hammer', 'ph-square', 'ph-star', 'ph-heart', 'ph-flag', 'ph-target'
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

const availableColors = Object.keys(colorMap)

const getColorBg = (color: string) => colorMap[color] || 'bg-slate-500'

const validate = (): boolean => {
  errors.value = {}

  if (!form.value.label.trim()) {
    errors.value.label = 'Le nom de la catégorie est requis.'
  } else if (form.value.label.length < 2) {
    errors.value.label = 'Le nom doit contenir au moins 2 caractères.'
  }

  const isDuplicate = dataStore.allCategories.some(
    (c) => c.label === form.value.label && c.id !== editingCategory.value?.id
  )

  if (isDuplicate) {
    errors.value.label = `Une catégorie avec ce nom existe déjà.`
  }

  if (!form.value.icon) {
    errors.value.icon = 'L\'icône est requise'
  }

  if (!form.value.color) {
    errors.value.color = 'La couleur est requise'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    const category: Category = {
      id: editingCategory.value?.id || `cat_${Date.now()}`,
      label: form.value.label,
      icon: form.value.icon,
      color: form.value.color as any,
    }

    if (isEditMode && editingCategory.value?.id) {
      await dataStore.updateCategory(category)
    } else {
      await dataStore.addCategory(category)
    }

    router.push({ name: 'categories' })
  } catch (err) {
    console.error('Erreur lors de la sauvegarde de la catégorie:', err)
  }
}

const handleCancel = () => {
  router.push({ name: 'categories' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative">

    <!-- Scrollable Form Content -->
    <main class="flex-grow pt-6 pb-28 px-6 max-w-2xl mx-auto w-full space-y-6 opacity-0 animate-page-enter">

      <!-- Header -->
      <header class="space-y-1 pt-2">
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">
          {{ isEditMode ? 'Modifier la catégorie' : 'Créer une catégorie' }}
        </h1>
        <p class="text-[15px] text-slate-600 leading-relaxed font-medium">
          {{ isEditMode ? 'Modifiez les détails de la catégorie.' : 'Configurez votre nouvelle catégorie.' }}
        </p>
      </header>

      <!-- Form Card -->
      <form @submit.prevent="handleSubmit"
            class="rounded-[24px] bg-white/50 backdrop-blur-sm border border-gray-200/50 p-6 space-y-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">

        <!-- Label Input -->
        <div class="space-y-2">
          <label for="label" class="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
            Nom
          </label>
          <div class="relative">
            <input
              id="label"
              v-model="form.label"
              type="text"
              placeholder="Ex: TypeScript, React, Node.js"
              class="w-full px-4 py-3.5 rounded-2xl border bg-white/80 placeholder:text-slate-400 text-slate-900 font-medium border-gray-200/80 shadow-sm transition-all"
              :class="errors.label ? 'border-red-300 ring-2 ring-red-100 animate-shake' : 'focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100'"
            />
          </div>
          <p v-if="errors.label" class="text-xs text-red-600 font-semibold ml-1 flex items-center gap-1">
            <i class="ph-fill ph-warning-circle"></i>
            {{ errors.label }}
          </p>
        </div>

        <!-- Icon Picker -->
        <div class="space-y-2">
          <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
            Icône
          </label>
          <div class="grid grid-cols-6 gap-2 sm:gap-3">
            <button
              v-for="icon in availableIcons"
              :key="icon"
              type="button"
              @click="form.icon = icon"
              class="aspect-square rounded-2xl border-2 flex items-center justify-center smooth-transition"
              :class="form.icon === icon
                ? 'border-blue-400 bg-blue-50 shadow-[0_4px_12px_rgba(59,130,246,0.1)] text-blue-600 scale-[1.02]'
                : 'border-gray-100/50 bg-white/60 hover:border-gray-200 text-slate-500'">
              <i :class="['ph-fill', icon, 'text-xl']"></i>
            </button>
          </div>
        </div>

        <!-- Color Picker -->
        <div class="space-y-2">
          <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
            Couleur
          </label>
          <div class="grid grid-cols-7 gap-2 sm:gap-3">
            <button
              v-for="color in availableColors"
              :key="color"
              type="button"
              @click="form.color = color"
              class="aspect-square rounded-2xl border-2 smooth-transition relative overflow-hidden"
              :class="[
                getColorBg(color),
                form.color === color
                  ? 'border-slate-900 shadow-md scale-105 ring-2 ring-offset-2 ring-slate-900/10'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
              ]">
              <div v-if="form.color === color" class="absolute inset-0 flex items-center justify-center">
                <i class="ph-bold ph-check text-white text-sm drop-shadow-md"></i>
              </div>
            </button>
          </div>
        </div>

      </form>

    </main>

    <!-- Action Buttons (Fixed Bottom) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-md border-t border-white/20 px-6 py-4 z-50"
         style="padding-bottom: max(1rem, env(safe-area-inset-bottom))">
      <div class="max-w-2xl mx-auto flex gap-3">

        <!-- Cancel -->
        <button
          type="button"
          @click="handleCancel"
          class="flex-1 rounded-full px-6 py-3.5 font-semibold text-[15px] text-slate-700
                 bg-slate-100 hover:bg-slate-200 active:scale-95
                 transition-all duration-200 border border-slate-200/50">
          <i class="ph-bold ph-x mr-2 inline-block align-middle"></i>
          Annuler
        </button>

        <!-- Submit -->
        <button
          type="button"
          @click="handleSubmit"
          class="flex-1 rounded-full px-6 py-3.5 font-semibold text-[15px] text-white
                 bg-blue-600 hover:bg-blue-700 active:scale-95
                 transition-all duration-200 shadow-[0_4px_12px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2">
          <i :class="isEditMode ? 'ph-check' : 'ph-plus'" class="ph-bold text-lg"></i>
          {{ isEditMode ? 'Mettre à jour' : 'Créer' }}
        </button>
      </div>
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

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.animate-page-enter {
  animation: pageEnter 0.5s ease-out forwards;
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

.smooth-transition {
  transition: all 0.2s ease-out;
}
</style>
