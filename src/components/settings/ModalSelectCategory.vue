<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200">
        <h2 class="text-lg font-semibold">Sélectionner une catégorie</h2>
        <p class="text-sm text-slate-600">Choisissez la catégorie pour les questions importées</p>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 max-h-96 overflow-y-auto">
        <!-- Existing categories -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-slate-700 mb-2">Catégories existantes</h3>
          <div class="space-y-2">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              @click="selectedCategory = cat.label"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg border-2 transition flex items-center gap-3',
                selectedCategory === cat.label
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300',
              ]"
            >
              <PhosphorIcon :size="20">{{ cat.icon }}</PhosphorIcon>
              <span class="font-medium">{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-slate-200 my-4 pt-4">
          <h3 class="text-sm font-semibold text-slate-700 mb-2">Créer une nouvelle catégorie</h3>
        </div>

        <!-- New category form -->
        <form @submit.prevent class="space-y-3">
          <input
            v-model="newCategory.label"
            type="text"
            placeholder="Label (ex: Python)"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div>
            <label class="text-xs font-medium text-slate-600 mb-1 block">Icône</label>
            <div class="grid grid-cols-6 gap-1">
              <button
                v-for="icon in availableIcons"
                :key="icon"
                type="button"
                @click="newCategory.icon = icon"
                :class="[
                  'p-1 border-2 rounded text-sm transition flex items-center justify-center',
                  newCategory.icon === icon
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300',
                ]"
                :title="icon"
              >
                <PhosphorIcon :size="16">{{ icon }}</PhosphorIcon>
              </button>
            </div>
          </div>

          <div>
            <label class="text-xs font-medium text-slate-600 mb-1 block">Couleur</label>
            <div class="grid grid-cols-7 gap-1">
              <button
                v-for="color in availableColors"
                :key="color"
                type="button"
                @click="newCategory.color = color"
                :class="[
                  'w-6 h-6 rounded border-2 transition',
                  newCategory.color === color ? 'border-slate-800' : 'border-slate-300',
                  colorMap[color],
                ]"
                :title="color"
              ></button>
            </div>
          </div>

          <button
            type="button"
            @click="createAndSelect"
            :disabled="!newCategory.label.trim()"
            class="w-full px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Créer et sélectionner
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-200 flex gap-2">
        <button
          @click="$emit('cancel')"
          class="flex-1 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition font-medium"
        >
          Annuler
        </button>
        <button
          @click="handleSelect"
          :disabled="!selectedCategory"
          class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Importer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '@/types/models'

interface Props {
  isOpen: boolean
  categories: Category[]
}

interface Emits {
  select: [categoryLabel: string]
  cancel: []
}

defineProps<Props>()

const emit = defineEmits<Emits>()

const selectedCategory = ref<string>('')

const availableIcons = [
  'Code',
  'Rocket',
  'Cpu',
  'Palette',
  'Database',
  'Chat',
  'Calculator',
  'Microscope',
  'Globe',
  'Lightning',
  'Book',
  'Moon',
  'Bug',
  'Wine',
  'Sparkle',
  'Lightbulb',
  'Gear',
  'Wrench',
  'Hammer',
  'Square',
  'Star',
  'Heart',
  'Flag',
  'Target',
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

const newCategory = ref({
  label: '',
  icon: 'Code',
  color: 'blue',
})

const createAndSelect = () => {
  if (!newCategory.value.label.trim()) return
  selectedCategory.value = newCategory.value.label
  newCategory.value = { label: '', icon: 'Code', color: 'blue' }
}

const handleSelect = () => {
  if (!selectedCategory.value) return
  emit('select', selectedCategory.value)
}
</script>
