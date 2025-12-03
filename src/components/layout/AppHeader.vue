<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStatsStore } from '@/stores/useStatsStore'

const router = useRouter()
const route = useRoute()
const statsStore = useStatsStore()
const isScrolled = ref(false)

const showStatsBadge = computed(() => statsStore.badgesNonLus)

// Determine if we need a back button (for settings pages)
const isSettingsPage = computed(() => {
  return route.path.startsWith('/settings')
})

function goHome() {
  router.push('/home')
}

function goBack() {
  router.back()
}

function goToStats() {
  statsStore.loadStats()
  router.push('/stats')
}

function goToSettings() {
  router.push('/settings/categories')
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full transition-all duration-300 bg-white/85 backdrop-blur-md border-b border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
  >
    <div class="px-6 transition-all duration-300 ease-out mx-auto max-w-2xl w-full"
         :class="isScrolled ? 'py-3' : 'pt-6 pb-4'">

      <div class="flex items-center justify-between">
        <!-- Left: Logo + Title (or Back Button on settings pages) -->
        <div v-if="isSettingsPage" class="flex items-center gap-3 overflow-hidden">
          <!-- Back Button -->
          <button @click="goBack"
                  class="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-slate-100/50 active:scale-90 transition-all text-slate-900">
            <i class="ph ph-caret-left text-xl"></i>
          </button>
        </div>

        <div v-else class="flex items-center gap-3 overflow-hidden">
          <!-- Logo Icon -->
          <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm cursor-pointer"
               @click="goHome">
            <span class="text-white font-bold text-lg leading-none pt-0">C</span>
          </div>

          <!-- Title -->
          <h1 class="font-bold tracking-tight text-xl whitespace-nowrap">
            CodeMaster
          </h1>
        </div>

        <!-- Right: Actions Icons -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <!-- Settings -->
          <button @click="goToSettings"
                  class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-slate-200/50 active:scale-90 text-slate-600">
            <i class="ph ph-gear text-xl"></i>
          </button>

          <!-- Stats -->
          <button @click="goToStats"
                  class="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-slate-200/50 active:scale-90 text-slate-600">
            <i class="ph ph-chart-bar text-xl"></i>
            <!-- Badge Notification -->
            <span v-if="showStatsBadge"
                  class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white/80"></span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

