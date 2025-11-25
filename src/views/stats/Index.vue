<script setup lang="ts">
import { useDataStore } from '@/stores/useDataStore'
import { useStatsStore } from '@/stores/useStatsStore'
import StatCard from '@/components/stats/StatCard.vue'
import EvolutionChart from '@/components/stats/EvolutionChart.vue'
import BadgesGrid from '@/components/stats/BadgesGrid.vue'
import type { Badge } from '@/types/models'

const dataStore = useDataStore()
const statsStore = useStatsStore()

function showBadgeDetails(badge: Badge) {
  if (badge.statut === 'verrouille') {
    alert(`🔒 Badge verrouillé : ${badge.nom}\nObjectif : ${badge.description}`)
  } else {
    alert(`🏆 Bravo ! Badge ${badge.nom} obtenu.\n${badge.description}`)
  }
}
</script>

<template>
  <div class="p-4 space-y-6 h-full overflow-y-auto">
    <!-- KPI Cards -->
    <div class="grid grid-cols-2 gap-3">
      <StatCard
        label="Moyenne"
        :value="`${Math.round(statsStore.globalStats.moyenneGlobale)}%`"
        color="primary"
      />
      <StatCard
        label="Meilleur Score"
        :value="`${Math.round(statsStore.globalStats.meilleurScore)}%`"
        color="green"
      />
      <StatCard
        label="Streak Actuel"
        :value="`${statsStore.globalStats.streakActuel}j`"
        icon="ph-fire"
        color="orange"
      />
      <StatCard
        label="Quiz Totaux"
        :value="statsStore.globalStats.totalSessions"
        color="slate"
      />
    </div>

    <!-- Chart -->
    <EvolutionChart :sessions="statsStore.globalStats.historiqueSessions" />

    <!-- Badges -->
    <BadgesGrid
      :badges="dataStore.badges"
      @badge-click="showBadgeDetails"
    />

    <div class="h-4"></div>
  </div>
</template>
