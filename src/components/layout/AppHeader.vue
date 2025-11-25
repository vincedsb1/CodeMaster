<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStatsStore } from '@/stores/useStatsStore'

const router = useRouter()
const statsStore = useStatsStore()

const showStatsBadge = computed(() => statsStore.badgesNonLus)

function goHome() {
  router.push('/home')
}

function goToStats() {
  statsStore.loadStats()
  router.push('/stats')
}
</script>

<template>
  <header
    class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white z-20"
  >
    <div class="flex items-center gap-2 cursor-pointer" @click="goHome">
      <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
        Q
      </div>
      <h1 class="font-bold text-lg tracking-tight">QuizMaster</h1>
    </div>

    <button @click="goToStats" class="p-2 rounded-full hover:bg-slate-100 transition relative">
      <i class="ph ph-chart-bar text-2xl text-slate-600"></i>
      <span
        v-if="showStatsBadge"
        class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
      ></span>
    </button>
  </header>
</template>
