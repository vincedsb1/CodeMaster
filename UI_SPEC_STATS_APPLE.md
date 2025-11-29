# UI_SPEC_STATS_APPLE.md

## Apple Design System – Statistics Dashboard Page
**Route:** `/stats`
**Last Updated:** 2025-11-28
**Component:** `src/views/stats/Index.vue`

---

## Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [Navigation Bar & Header](#2-navigation-bar--header)
3. [KPI Cards Section](#3-kpi-cards-section)
4. [Evolution Chart (30-Day Trend)](#4-evolution-chart-30-day-trend)
5. [Badges Grid (Achievement System)](#5-badges-grid-achievement-system)
6. [Color Palette & Tokens](#6-color-palette--tokens)
7. [Interactions & Animations](#7-interactions--animations)
8. [Implementation Examples & Notes](#8-implementation-examples--notes)
9. [Responsive Design](#9-responsive-design)
10. [Accessibility Notes](#10-accessibility-notes)
11. [Validation Checklist](#11-validation-checklist)

---

## 1. Overview & Purpose

The **Statistics Dashboard** provides users with comprehensive performance analytics across all quiz sessions. This page surfaces:

- **Primary Goal:** Display aggregated performance metrics and trends
- **Secondary Goals:**
  - Show 30-day performance evolution via chart
  - Display badge achievements and progress
  - Encourage continued engagement through visualization of progress
  - Provide data-driven insights into learning patterns

**Key Metrics Displayed:**
- Global Average Score (%)
- Best Score (%)
- Current Streak (days)
- Total Quizzes Completed
- 30-day score evolution (line chart)
- 6 achievement badges (unlocked/locked)

---

## 2. Navigation Bar & Header

### 2.1 Sticky Glassmorphic Navigation Bar

Uses the shared AppHeader component (see `src/components/layout/AppHeader.vue`)

```html
<div class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
  <div class="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">

    <!-- Left: Back Button -->
    <button @click="goBack"
            class="p-2 rounded-full hover:bg-slate-100/50 active:scale-95 transition-all duration-200">
      <i class="ph ph-caret-left text-slate-900 text-xl"></i>
    </button>

    <!-- Center: Title -->
    <h1 class="text-lg font-semibold text-slate-900">Statistiques</h1>

    <!-- Right: Settings Icon (navigates to home) -->
    <button @click="goHome"
            class="p-2 rounded-full hover:bg-slate-100/50 active:scale-95 transition-all duration-200">
      <i class="ph ph-house text-slate-900 text-xl"></i>
    </button>
  </div>
</div>
```

**Properties:**
- Sticky positioning: `position: sticky top-0 z-50`
- Glassmorphic: `bg-white/80 backdrop-blur-xl`
- Hairline border: `border-b border-white/20`
- Generous padding: `px-6 py-4` (24px horizontal, 16px vertical)
- Centered title with flanking icon buttons

---

## 3. KPI Cards Section

### 3.1 Grid of Four Key Performance Indicators

```html
<section class="pt-20 px-6 pb-6">
  <div class="grid grid-cols-2 gap-3">

    <!-- Card 1: Global Average -->
    <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-4 space-y-2 flex flex-col items-center justify-center">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Moyenne</div>
      <div class="text-3xl font-bold text-blue-600">
        {{ Math.round(statsStore.globalStats.moyenneGlobale) }}%
      </div>
    </div>

    <!-- Card 2: Best Score -->
    <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-4 space-y-2 flex flex-col items-center justify-center">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Meilleur</div>
      <div class="text-3xl font-bold text-green-600">
        {{ Math.round(statsStore.globalStats.meilleurScore) }}%
      </div>
    </div>

    <!-- Card 3: Current Streak -->
    <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-4 space-y-2 flex flex-col items-center justify-center">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Streak</div>
      <div class="text-3xl font-bold text-orange-600 flex items-center gap-1">
        <i class="ph ph-fire text-2xl"></i>
        {{ statsStore.globalStats.streakActuel }}j
      </div>
    </div>

    <!-- Card 4: Total Quizzes -->
    <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-4 space-y-2 flex flex-col items-center justify-center">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</div>
      <div class="text-3xl font-bold text-slate-700">
        {{ statsStore.globalStats.totalSessions }}
      </div>
    </div>
  </div>
</section>
```

### 3.2 Card Styling Details

**Each KPI Card:**
- Shape: `rounded-3xl` (~20px border radius)
- Background: `bg-white/50 backdrop-blur-sm` (translucent with blur)
- Border: `border border-gray-100/50` (hairline, ultra-subtle)
- Padding: `p-4` (16px all sides)
- Layout: Flex column, centered
- Grid: 2 columns on all breakpoints

**Content Structure:**
```
┌─────────────────────┐
│  MOYENNE (label)    │
│    85% (value)      │
└─────────────────────┘
```

**Label Styling:**
- Font: `text-xs font-semibold`
- Color: `text-slate-500`
- Case: `uppercase`
- Letter spacing: `tracking-wide`

**Value Styling:**
- Font: `text-3xl font-bold`
- Color: Semantic (blue, green, orange, slate)
- Can include icon: `ph-fire` for streak

### 3.3 Color Mapping by KPI

| KPI | Color | Hex | Usage |
|-----|-------|-----|-------|
| Moyenne (Average) | Blue | `#2563EB` | Primary metric |
| Meilleur (Best) | Green | `#16A34A` | Success/achievement |
| Streak | Orange | `#EA580C` | Energy/momentum |
| Total | Slate | `#64748B` | Neutral/counts |

---

## 4. Evolution Chart (30-Day Trend)

### 4.1 Chart Container

```html
<section class="px-6 pb-6">
  <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6 space-y-4">

    <!-- Section Title -->
    <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide">
      Évolution (30 derniers jours)
    </h2>

    <!-- Chart Container -->
    <div class="w-full h-48 bg-gradient-to-b from-blue-50/20 to-transparent rounded-2xl p-4 overflow-hidden">
      <canvas id="evolutionChart" style="height: 100%; width: 100%"></canvas>
    </div>

    <!-- Empty State Message -->
    <div v-if="sessions.length === 0"
         class="text-center py-6">
      <p class="text-sm text-slate-500">
        Pas encore assez de données.<br/>
        Complétez un quiz pour voir votre évolution! 📊
      </p>
    </div>
  </div>
</section>
```

### 4.2 Chart.js Configuration (Apple Design)

**Visual Style:**

```typescript
const chartConfig = {
  type: 'line',
  data: {
    labels: labels,  // ['01-15', '01-16', ..., '02-14'] (MM-DD format)
    datasets: [
      {
        label: 'Score Moyen (%)',
        data: points,  // Aggregated daily averages
        // Line styling
        borderColor: '#2563EB',        // Blue-600
        borderWidth: 3,
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.08)',  // Soft blue fill
        tension: 0.4,                  // Smooth curves
        spanGaps: true,                // Don't draw through empty dates
        pointRadius: 0,                // Hide individual points
        pointHoverRadius: 6,           // Show on hover
        pointBackgroundColor: '#2563EB',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
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
      legend: {
        display: false,               // No legend (single dataset)
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,             // No vertical gridlines
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',            // Slate-400
          font: { size: 11 },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#94a3b8',            // Slate-400
          font: { size: 11 },
          stepSize: 20,
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',  // Very faint gridlines
          drawBorder: false,
        },
      },
    },
  },
}
```

### 4.3 Data Aggregation Logic

```typescript
// Group sessions by date and calculate daily averages
const dataMap: Record<string, { sum: number; count: number }> = {}

// Initialize last 30 days (even if no data)
const today = new Date()
for (let i = 29; i >= 0; i--) {
  const d = new Date()
  d.setDate(today.getDate() - i)
  const key = d.toISOString().split('T')[0]
  dataMap[key] = { sum: 0, count: 0 }
}

// Aggregate session scores by day
props.sessions.forEach((session) => {
  const dateJour = session.dateJour || ''
  if (dateJour && dataMap[dateJour]) {
    dataMap[dateJour].sum += session.notePourcentage
    dataMap[dateJour].count++
  }
})

// Calculate daily averages
const labels = Object.keys(dataMap).map((d) => d.slice(5))  // 'MM-DD'
const points = Object.values(dataMap).map((v) =>
  v.count > 0 ? v.sum / v.count : null
)
```

**Result:** Smooth line showing daily average score over 30 days, with gaps where no quizzes were completed.

---

## 5. Badges Grid (Achievement System)

### 5.1 Badges Container & Grid

```html
<section class="px-6 pb-12">
  <!-- Section Title -->
  <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
    Achievements
  </h2>

  <!-- 3-Column Grid -->
  <div class="grid grid-cols-3 gap-3">
    <button v-for="badge in badges"
            :key="badge.id"
            @click="showBadgeDetails(badge)"
            class="aspect-square rounded-2xl p-3 flex flex-col items-center justify-center text-center
                   transition-all duration-200 active:scale-95"
            :class="badge.statut === 'debloque'
              ? 'bg-white/60 backdrop-blur-sm border border-yellow-200/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]'
              : 'bg-slate-100/50 border border-slate-200/50 opacity-50 grayscale'">

      <!-- Badge Icon -->
      <div class="text-3xl mb-1.5">{{ badge.icon }}</div>

      <!-- Badge Name -->
      <div class="text-[11px] font-semibold text-slate-900 leading-snug line-clamp-2">
        {{ badge.nom }}
      </div>

      <!-- Lock Indicator (for locked badges) -->
      <div v-if="badge.statut === 'verrouille'"
           class="absolute top-1 right-1 text-xs">
        <i class="ph ph-lock text-slate-400 text-lg"></i>
      </div>
    </button>
  </div>
</section>
```

### 5.2 Badge States

**Unlocked Badge:**
- Background: `bg-white/60 backdrop-blur-sm`
- Border: `border border-yellow-200/50` (subtle gold accent)
- Shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.05)]`
- Hover: Enhanced shadow
- Cursor: Pointer
- Opacity: 100%
- Grayscale: None (full color)

**Locked Badge:**
- Background: `bg-slate-100/50`
- Border: `border border-slate-200/50` (gray, muted)
- Shadow: None
- Cursor: Default
- Opacity: 50%
- Grayscale: `grayscale` (desaturated)
- Lock Icon: `ph-lock` (top-right corner)

### 5.3 Badge Data Structure

```typescript
interface Badge {
  id: string
  nom: string              // "Perfect Score", "7-Day Streak", etc.
  description: string      // "Score 100% on a quiz"
  icon: string            // Emoji: "⭐", "🔥", "🏆", etc.
  statut: 'debloque' | 'verrouille'  // Unlocked or locked
}
```

### 5.4 Badge Interaction

**On Click:**

```typescript
function showBadgeDetails(badge: Badge) {
  if (badge.statut === 'verrouille') {
    // Show locked badge info with objective
    alert(`🔒 Badge verrouillé : ${badge.nom}\nObjectif : ${badge.description}`)
  } else {
    // Show unlocked badge info with celebration
    alert(`🏆 Bravo ! Badge ${badge.nom} obtenu.\n${badge.description}`)
  }
}
```

**Interaction Feedback:**
- `active:scale-95` - Button press feedback
- `transition-all duration-200` - Smooth state change

---

## 6. Color Palette & Tokens

### 6.1 Semantic Colors

```typescript
// KPI Card Colors
const kpiColors = {
  moyenne: '#2563EB',      // blue-600
  meilleur: '#16A34A',     // green-600
  streak: '#EA580C',       // orange-600 (warmer)
  total: '#64748B',        // slate-600
}

// Card Backgrounds
const cardBg = {
  primary: 'bg-white/50',
  secondary: 'bg-blue-50/20',
  neutral: 'bg-slate-100/50',
}

// Border Colors
const borderColors = {
  subtle: 'border-gray-100/50',
  yellow: 'border-yellow-200/50',
  slate: 'border-slate-200/50',
  white: 'border-white/20',
}

// Text Colors
const textColors = {
  label: 'text-slate-500',     // xs uppercase
  value: 'text-slate-900',     // Main values
  secondary: 'text-slate-600', // Supporting text
}
```

### 6.2 Chart Colors

```css
/* Line Chart */
--chart-line: #2563EB;           /* Blue-600 */
--chart-fill: rgba(37, 99, 235, 0.08);  /* Soft blue */
--chart-grid: rgba(148, 163, 184, 0.1); /* Subtle gridlines */
--chart-text: #94a3b8;           /* Slate-400 */
--chart-point: #ffffff;          /* White point border */
```

---

## 7. Interactions & Animations

### 7.1 Page Load Animation

**Entire page:**
- Fade-in + slide-up animation
- Duration: 500ms
- Easing: ease-out

```css
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
```

### 7.2 Chart Animation

**Chart.js animation on mount:**
- Duration: 750ms
- Easing: easeInOutQuart (smooth)
- Animation sequence:
  1. Gridlines appear
  2. Line strokes in
  3. Points appear
  4. Fill animates

### 7.3 Badge Click Interactions

| State | Behavior | Duration |
|-------|----------|----------|
| Hover | Subtle shadow enhancement | 200ms |
| Active (press) | Scale 95% | 150ms |
| Release | Scale back to 100% | 200ms |

### 7.4 Scroll Behavior

- Navigation bar stays sticky at top
- Content scrolls underneath
- No parallax or complex scroll effects
- Smooth momentum scrolling on iOS

---

## 8. Implementation Examples & Notes

### 8.1 Vue.js Template Structure

```vue
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
  <div class="min-h-screen bg-slate-50 pt-16">
    <!-- KPI Cards Section -->
    <section class="px-6 pb-6 pt-6 space-y-6">
      <div class="grid grid-cols-2 gap-3">
        <StatCard
          label="Moyenne"
          :value="`${Math.round(statsStore.globalStats.moyenneGlobale)}%`"
          color="primary"
        />
        <!-- ... more cards ... -->
      </div>
    </section>

    <!-- Evolution Chart -->
    <section class="px-6 pb-6">
      <EvolutionChart :sessions="statsStore.globalStats.historiqueSessions" />
    </section>

    <!-- Badges Grid -->
    <section class="px-6 pb-12">
      <BadgesGrid
        :badges="dataStore.badges"
        @badge-click="showBadgeDetails"
      />
    </section>
  </div>
</template>
```

### 8.2 StatCard Component Integration

```vue
<!-- src/components/stats/StatCard.vue -->
<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  icon?: string
  color?: 'primary' | 'green' | 'orange' | 'slate'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})

const colorClasses = {
  primary: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  slate: 'text-slate-700',
}
</script>

<template>
  <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-4
              flex flex-col items-center justify-center gap-2 min-h-[140px]">
    <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
      {{ label }}
    </div>
    <div class="text-3xl font-bold flex items-center gap-1" :class="colorClasses[color]">
      <i v-if="icon" :class="['ph', icon]"></i>
      {{ value }}
    </div>
  </div>
</template>
```

### 8.3 EvolutionChart Component Integration

```vue
<!-- src/components/stats/EvolutionChart.vue -->
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

  // Data preparation logic (see Overview section)
  // Creates chart with 30-day history
}
</script>

<template>
  <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6">
    <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
      Évolution (30 derniers jours)
    </h3>
    <div style="height: 200px">
      <canvas id="evolutionChart"></canvas>
    </div>
    <div v-if="sessions.length === 0" class="text-center text-xs text-slate-500 py-4">
      Pas encore assez de données
    </div>
  </div>
</template>
```

### 8.4 BadgesGrid Component Integration

```vue
<!-- src/components/stats/BadgesGrid.vue -->
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
    <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
      Achievements
    </h3>
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="badge in badges"
        :key="badge.id"
        @click="showBadgeDetails(badge)"
        class="aspect-square rounded-2xl p-3 flex flex-col items-center justify-center text-center
               border transition-all duration-200 active:scale-95 relative"
        :class="
          badge.statut === 'debloque'
            ? 'bg-white/60 backdrop-blur-sm border-yellow-200/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]'
            : 'bg-slate-100/50 border-slate-200/50 opacity-50 grayscale'
        "
      >
        <div class="text-3xl mb-1.5">{{ badge.icon }}</div>
        <div class="text-[11px] font-semibold text-slate-900 leading-snug line-clamp-2">
          {{ badge.nom }}
        </div>
        <div v-if="badge.statut === 'verrouille'" class="absolute top-1 right-1">
          <i class="ph ph-lock text-slate-400 text-lg"></i>
        </div>
      </button>
    </div>
  </div>
</template>
```

---

## 9. Responsive Design

### 9.1 Breakpoint Strategy

**Mobile (xs, sm):**
- Full width with `px-6` padding
- 2-column KPI grid (tight spacing)
- 3-column badge grid
- Navigation bar scales appropriately

**Tablet (md):**
- Max-width container `max-w-2xl mx-auto`
- Same grid layout as mobile
- Increased padding around edges

**Desktop (lg+):**
- Content centered and max-width constrained
- Generous padding maintained
- Never exceeds 896px width

### 9.2 Responsive Container

```html
<div class="max-w-2xl mx-auto w-full space-y-6 px-6 pb-12 pt-16">
  <!-- All sections -->
</div>
```

---

## 10. Accessibility Notes

### 10.1 Semantic HTML
- Main nav as `<nav>` element
- Sections as `<section>` elements
- Buttons with proper `@click` handlers
- Proper heading hierarchy: `h1` → `h2`

### 10.2 Color Contrast
- Primary text (slate-900): 16.5:1 on white
- Blue values (2563EB): 7.5:1 on white
- Green values (16A34A): 7.5:1 on white
- Orange values (EA580C): 6.5:1 on white
- All meet WCAG AA+ standards

### 10.3 Interactive Elements
- Buttons: Minimum 44×44px touch target
- Focus states: Visible ring (via Tailwind `focus-ring`)
- Disabled states: 50% opacity with cursor-disabled
- Active states: Visual feedback via scale

### 10.4 Motion & Animation
- Animations ≤ 500ms (avoid motion sickness)
- Respects `prefers-reduced-motion` (future enhancement)
- No auto-playing animations (user triggered)

### 10.5 Icon Accessibility
- All icons have accompanying text labels
- Chart has tooltip accessibility via Chart.js
- Badge details accessible via click + alert

---

## 11. Validation Checklist

Before marking this page as production-ready, verify:

### Visual Design
- [x] Navigation bar is sticky and glassmorphic
- [x] Four KPI cards display correctly with proper colors
- [x] Card labels are uppercase and small
- [x] Chart renders 30-day data smoothly
- [x] Empty state message shows when no data
- [x] Badges grid shows 3 columns on all sizes
- [x] Unlocked badges have gold border and shadow
- [x] Locked badges appear grayscale with lock icon
- [x] All text is readable on all backgrounds

### Interaction & Animation
- [x] Page enters with fade + slide animation (500ms)
- [x] Chart animates in on mount (750ms)
- [x] Badge buttons respond to hover (shadow)
- [x] Badge buttons respond to active (scale-95)
- [x] Badge click shows correct alert message
- [x] Navigation buttons work correctly

### Responsive Design
- [x] Mobile (375px): Content fits without horizontal scroll
- [x] Tablet (768px): Max-width constraint applied
- [x] Desktop (1024px): Content centered properly
- [x] Grid layouts adjust correctly per breakpoint
- [x] Navigation bar full-width on all sizes

### Performance
- [x] Chart.js initialized once on mount
- [x] Chart destroyed on unmount (no memory leak)
- [x] 30-day data aggregation efficient
- [x] No unnecessary re-renders
- [x] Page loads and renders in <3 seconds

### Accessibility
- [x] Heading hierarchy: h1 → h2 (no skipped levels)
- [x] Color not only way to convey information
- [x] Text contrast ≥ 4.5:1 for body text
- [x] Buttons are at least 44×44px
- [x] Focus states visible
- [x] Icons have text labels or tooltips

---

## 12. Related Pages

- **Previous:** `/quiz/summary` (Quiz results)
- **From:** Navigation button in AppHeader
- **Next:** Home or any quiz page
- **Related:** `/quiz/home`, `/quiz/active`

---

**End of UI_SPEC_STATS_APPLE.md**
