<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import { useStatsStore } from '@/stores/useStatsStore'
import { ref, computed, onMounted } from 'vue'
import type { Badge } from '@/types/models'
import EvolutionChart from '@/components/stats/EvolutionChart.vue'

const router = useRouter()
const dataStore = useDataStore()
const statsStore = useStatsStore()
const activeBadge = ref<Badge | null>(null)

// Computed global stats
const globalStats = computed(() => statsStore.globalStats)
const badges = computed(() => dataStore.badges)
const sessions = computed(() => statsStore.globalStats?.historiqueSessions || [])

// Initialize chart on mount
onMounted(async () => {
  await statsStore.loadStats()
  // Chart initialization would happen here if using Chart.js component
})

// Methods
async function goBack() {
  await router.back()
}

async function goHome() {
  await router.push({ name: 'home' })
}

function showBadgeDetails(badge: Badge) {
  activeBadge.value = badge
}

function closeBadgeModal() {
  activeBadge.value = null
}

// Helper to check if badge is unlocked
function isBadgeUnlocked(badge: Badge): boolean {
  return badge.statut === 'debloque'
}
</script>

<template>
  <div class="flex flex-col bg-slate-50 text-slate-900 h-full">
    <!-- Navigation Bar (Fixed) -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200/50">
      <div class="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between h-14">
        <!-- Back Button -->
        <button @click="goBack"
                class="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-slate-100/50 active:scale-90 transition-all text-slate-900">
          <i class="ph ph-caret-left text-xl"></i>
        </button>

        <!-- Title -->
        <h1 class="text-[17px] font-semibold text-slate-900">Statistiques</h1>

        <!-- Home Button -->
        <button @click="goHome"
                class="w-10 h-10 flex items-center justify-center -mr-2 rounded-full hover:bg-slate-100/50 active:scale-90 transition-all text-slate-900">
          <i class="ph ph-house text-xl"></i>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow pt-20 pb-12 px-6 max-w-2xl mx-auto w-full space-y-8">

      <!-- KPI Cards Section -->
      <section class="grid grid-cols-2 gap-3">
        <!-- Moyenne -->
        <div class="rounded-[24px] bg-white/60 backdrop-blur-md border border-blue-100/50 p-5 flex flex-col items-center justify-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all active:scale-95">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Moyenne</div>
          <div class="text-3xl font-bold text-blue-600">{{ Math.round(globalStats?.moyenneGlobale || 0) }}%</div>
        </div>

        <!-- Meilleur -->
        <div class="rounded-[24px] bg-white/60 backdrop-blur-md border border-green-100/50 p-5 flex flex-col items-center justify-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all active:scale-95">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Meilleur</div>
          <div class="text-3xl font-bold text-green-600">{{ Math.round(globalStats?.meilleurScore || 0) }}%</div>
        </div>

        <!-- Streak -->
        <div class="rounded-[24px] bg-white/60 backdrop-blur-md border border-orange-100/50 p-5 flex flex-col items-center justify-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all active:scale-95">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Série</div>
          <div class="text-3xl font-bold text-orange-600 flex items-center gap-1">
            <i class="ph-fill ph-fire text-2xl"></i>
            {{ globalStats?.streakActuel || 0 }}j
          </div>
        </div>

        <!-- Total -->
        <div class="rounded-[24px] bg-white/60 backdrop-blur-md border border-gray-100/50 p-5 flex flex-col items-center justify-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all active:scale-95">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</div>
          <div class="text-3xl font-bold text-slate-700">{{ globalStats?.totalSessions || 0 }}</div>
        </div>
      </section>

      <!-- Evolution Chart Section -->
      <section class="rounded-[32px] bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <h2 class="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
          Évolution (30 derniers jours)
        </h2>

        <!-- Chart Component -->
        <div class="relative w-full">
          <EvolutionChart :sessions="sessions" />
        </div>
      </section>

      <!-- Badges Grid Section -->
      <section class="space-y-4">
        <h2 class="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
          Achievements
        </h2>

        <div class="grid grid-cols-3 gap-3">
          <button v-for="badge in badges"
                  :key="badge.id"
                  @click="showBadgeDetails(badge)"
                  class="aspect-square rounded-[18px] p-3 flex flex-col items-center justify-center text-center transition-all duration-200 active:scale-95 relative group"
                  :class="isBadgeUnlocked(badge)
                    ? 'bg-white/70 border border-yellow-200/60 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md'
                    : 'bg-slate-100/50 border border-slate-200/50 opacity-60 grayscale'">

            <!-- Icon -->
            <div class="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110 select-none">
              {{ badge.icon }}
            </div>

            <!-- Name -->
            <div class="text-[11px] font-semibold text-slate-900 leading-tight line-clamp-2">
              {{ badge.nom }}
            </div>

            <!-- Lock Icon -->
            <div v-if="!isBadgeUnlocked(badge)" class="absolute top-1.5 right-1.5">
              <i class="ph-fill ph-lock text-slate-400 text-xs"></i>
            </div>
          </button>
        </div>
      </section>

    </main>

    <!-- Modal pour Détails Badge -->
    <Transition name="fade">
      <div v-if="activeBadge" class="fixed inset-0 z-[60] flex items-center justify-center p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" @click="closeBadgeModal"></div>

        <!-- Modal Content -->
        <div class="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl relative z-10 animate-scale-in text-center space-y-4">
          <!-- Large Icon -->
          <div class="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-5xl mb-2 shadow-sm"
               :class="isBadgeUnlocked(activeBadge) ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-100 text-slate-400 grayscale'">
            {{ activeBadge.icon }}
          </div>

          <!-- Text Info -->
          <div class="space-y-2">
            <h3 class="text-2xl font-bold text-slate-900">{{ activeBadge.nom }}</h3>
            <p class="text-slate-500 font-medium leading-relaxed">
              {{ activeBadge.description }}
            </p>
            <p v-if="!isBadgeUnlocked(activeBadge)" class="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
              Verrouillé
            </p>
          </div>

          <!-- Action Button -->
          <div class="pt-4">
            <button @click="closeBadgeModal"
                    class="w-full py-3.5 rounded-full font-semibold text-[15px] transition-transform active:scale-95 shadow-sm"
                    :class="isBadgeUnlocked(activeBadge) ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'">
              {{ isBadgeUnlocked(activeBadge) ? 'Génial !' : 'Fermer' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
