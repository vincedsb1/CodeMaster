<script setup lang="ts">
import type { Badge } from '@/types/models'

interface Props {
  badges: Badge[]
}

defineProps<Props>()

const emits = defineEmits<{
  'badge-click': [badge: Badge]
}>()

function showBadgeDetails(badge: Badge) {
  emits('badge-click', badge)
}
</script>

<template>
  <div>
    <h3 class="font-bold text-lg mb-3">Badges</h3>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="badge in badges"
        :key="badge.id"
        @click="showBadgeDetails(badge)"
        class="aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-center border transition"
        :class="
          badge.statut === 'debloque'
            ? 'bg-white border-yellow-300 shadow-sm cursor-pointer hover:shadow-md'
            : 'bg-slate-100 border-slate-200 opacity-60 grayscale'
        "
      >
        <div class="text-2xl mb-1">{{ badge.icon || '🏅' }}</div>
        <div class="text-[10px] font-bold leading-tight line-clamp-2">
          {{ badge.nom }}
        </div>
      </button>
    </div>
  </div>
</template>
