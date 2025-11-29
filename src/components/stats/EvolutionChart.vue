<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import type { QuizSession } from '@/types/models'
import Chart from 'chart.js/auto'

interface Props {
  sessions: QuizSession[]
}

const props = defineProps<Props>()

let chartInstance: Chart | null = null

onMounted(async () => {
  await nextTick()
  renderChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

function renderChart() {
  const canvas = document.getElementById('evolutionChart') as HTMLCanvasElement
  if (!canvas) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  // Prepare data: Group by day
  const dataMap: Record<string, { sum: number; count: number }> = {}

  // Initialize last 30 days
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0] as string
    dataMap[key] = { sum: 0, count: 0 }
  }

  // Aggregate
  props.sessions.forEach((s) => {
    const dateJour = s.dateJour || ''
    if (dateJour && dataMap[dateJour]) {
      dataMap[dateJour].sum += s.notePourcentage
      dataMap[dateJour].count++
    }
  })

  const labels = Object.keys(dataMap).map((d) => d.slice(5)) // MM-DD
  const points = Object.values(dataMap).map((v) => (v.count > 0 ? v.sum / v.count : null))

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Score Moyen (%)',
          data: points,
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.3,
          fill: true,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  })
}
</script>

<template>
  <div v-if="sessions.length === 0" class="w-full h-56 bg-gradient-to-b from-blue-50/30 to-transparent rounded-[20px] p-4 overflow-hidden border border-blue-100/20 flex items-center justify-center">
    <div class="text-center">
      <p class="text-sm text-slate-500">Pas encore assez de données. Complétez un quiz ! 📊</p>
    </div>
  </div>
  <div v-else class="w-full">
    <canvas id="evolutionChart" style="height: 14rem;"></canvas>
  </div>
</template>
