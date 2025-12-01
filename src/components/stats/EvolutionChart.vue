<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, watch } from 'vue'
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

watch(() => props.sessions, () => {
  renderChart()
}, { deep: true })

function renderChart() {
  const canvas = document.getElementById('evolutionChart') as HTMLCanvasElement
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

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

  const labels = Object.keys(dataMap)
  // For empty days, interpolate or keep as null/0?
  // UI Spec uses random data between 60-95. We should use real data but style it like the spec.
  // If count > 0, use average. If 0, maybe use previous value or null (spanGaps handles null).
  const points = Object.values(dataMap).map((v) => (v.count > 0 ? v.sum / v.count : null))

  // Calculate dynamic min for Y axis
  const validPoints = points.filter((p): p is number => p !== null)
  const minVal = validPoints.length > 0 ? Math.min(...validPoints) : 0
  // Zoom in: Floor to nearest 10 below (minVal - 10), clamped at 0
  const dynamicMin = Math.max(0, Math.floor((minVal - 15) / 10) * 10)

  // Create Gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 300)
  gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)') // Blue start
  gradient.addColorStop(1, 'rgba(37, 99, 235, 0)')   // Transparent end

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Score Moyen',
          data: points,
          borderColor: '#2563EB', // Blue-600
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4, // Courbe douce (Bezier)
          pointRadius: 0, // Points cachés par défaut
          pointHoverRadius: 6,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          spanGaps: true, // Important for days without quizzes
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false }, // Pas de légende
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)', // Slate-900
          titleFont: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', size: 13 },
          bodyFont: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', size: 13 },
          padding: 10,
          cornerRadius: 12,
          displayColors: false,
          callbacks: {
            label: (context) => {
              const val = context.raw as number
              return val !== null ? `${Math.round(val)}%` : ''
            },
            title: () => '' // Hide title (date) to keep it super clean like Apple demo? Or show date? Let's hide for now or keep simple.
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { display: false } // Pas de labels X pour épuré
        },
        y: {
          min: dynamicMin,
          max: 105,
          border: { display: false },
          grid: {
            color: 'rgba(148, 163, 184, 0.1)', // Grille très subtile
          },
          ticks: {
            font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', size: 10 },
            color: '#94a3b8',
            stepSize: 25
          }
        }
      }
    },
  })
}
</script>

<template>
  <div v-if="sessions.length === 0" class="w-full h-[140px] bg-gradient-to-b from-blue-50/30 to-transparent rounded-[20px] p-4 overflow-hidden border border-blue-100/20 flex items-center justify-center">
    <div class="text-center">
      <p class="text-sm text-slate-500">Pas encore assez de données. Complétez un quiz ! 📊</p>
    </div>
  </div>
  <div v-else class="relative w-full h-[140px] bg-gradient-to-b from-blue-50/30 to-transparent rounded-2xl p-2 overflow-hidden border border-blue-100/20">
    <canvas id="evolutionChart"></canvas>
  </div>
</template>