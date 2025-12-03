<template>
  <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
    <h2 class="text-lg font-semibold mb-6">
      {{ categorie ? 'Modifier la catégorie' : 'Ajouter une catégorie' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Label -->
      <div>
        <label for="label" class="block text-sm font-medium text-slate-700 mb-1">
          Label
        </label>
        <input
          id="label"
          v-model="form.label"
          type="text"
          placeholder="Ex: TypeScript, React, Node.js"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p v-if="errors.label" class="mt-1 text-sm text-red-600">{{ errors.label }}</p>
      </div>

      <!-- Icon Selection -->
      <div>
        <label for="icon" class="block text-sm font-medium text-slate-700 mb-2">
          Icône
        </label>
        <div class="grid grid-cols-6 gap-2">
          <button
            v-for="icon in availableIcons"
            :key="icon"
            type="button"
            @click="form.icon = icon"
            :class="[
              'p-2 border-2 rounded-lg transition flex items-center justify-center',
              form.icon === icon
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300',
            ]"
            :title="icon"
          >
            <PhosphorIcon :size="20">{{ icon }}</PhosphorIcon>
          </button>
        </div>
        <p v-if="errors.icon" class="mt-1 text-sm text-red-600">{{ errors.icon }}</p>
      </div>

      <!-- Color Selection -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Couleur
        </label>
        <div class="grid grid-cols-7 gap-2">
          <button
            v-for="color in availableColors"
            :key="color"
            type="button"
            @click="form.color = color"
            :class="[
              'w-10 h-10 rounded-lg border-2 transition',
              form.color === color ? 'border-slate-800' : 'border-slate-300',
              colorMap[color],
            ]"
            :title="color"
          ></button>
        </div>
        <p v-if="errors.color" class="mt-1 text-sm text-red-600">{{ errors.color }}</p>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 pt-4">
        <button
          type="submit"
          class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          {{ categorie ? 'Mettre à jour' : 'Ajouter' }}
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          class="flex-1 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition font-medium"
        >
          Annuler
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, toRaw } from 'vue'
import type { Category } from '@/types/models'

interface Props {
  categorie: Category | null
  allCategories: Category[]
}

interface FormData {
  label: string
  icon: string
  color: string
}

const props = withDefaults(defineProps<Props>(), {
  categorie: null,
})

const emit = defineEmits<{
  submit: [category: Category]
  cancel: []
}>()

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

const form = ref<FormData>({
  label: '',
  icon: 'Code',
  color: 'blue',
})

const errors = ref<Record<string, string>>({})

watch(
  () => props.categorie,
  (newCat) => {
    if (newCat) {
      // Use toRaw to unwrap Vue reactivity
      const raw = toRaw(newCat)
      form.value = {
        label: raw.label,
        icon: raw.icon,
        color: raw.color,
      }
    } else {
      form.value = {
        label: '',
        icon: 'Code',
        color: 'blue',
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

const validate = (): boolean => {
  errors.value = {}

  if (!form.value.label.trim()) {
    errors.value.label = 'Le label est requis'
  }

  // Check label uniqueness (excluding current category if editing)
  const isDuplicate = props.allCategories.some(
    (c) => c.label === form.value.label && c.id !== props.categorie?.id
  )

  if (isDuplicate) {
    errors.value.label = `Une catégorie avec le label "${form.value.label}" existe déjà`
  }

  if (!form.value.icon) {
    errors.value.icon = 'L\'icône est requise'
  }

  if (!form.value.color) {
    errors.value.color = 'La couleur est requise'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validate()) return

  const rawForm = toRaw(form.value)
  const category: Category = {
    id: props.categorie?.id || `cat_${Date.now()}`,
    label: rawForm.label,
    icon: rawForm.icon,
    color: rawForm.color as any,
  }

  emit('submit', category)
}
</script>
