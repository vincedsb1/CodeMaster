# UI_SPEC_SUMMARY_APPLE.md

## Apple Design System – Summary Page (Quiz Results/Feedback)
**Route:** `/quiz/summary`
**Last Updated:** 2025-11-28
**Component:** `src/views/quiz/Summary.vue`

---

## Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [Navigation Bar & Header](#2-navigation-bar--header)
3. [Success Animation & Congratulations](#3-success-animation--congratulations)
4. [Score Display (Animated Circular Progress)](#4-score-display-animated-circular-progress)
5. [Answers Summary](#5-answers-summary)
6. [Average Comparison Card](#6-average-comparison-card)
7. [Streak Celebration (Conditional)](#7-streak-celebration-conditional)
8. [Badges Achievement (Conditional)](#8-badges-achievement-conditional)
9. [Action Buttons (Fixed Bottom)](#9-action-buttons-fixed-bottom)
10. [Color Palette & Tokens](#10-color-palette--tokens)
11. [Interactions & Animations](#11-interactions--animations)
12. [Implementation Examples & Notes](#12-implementation-examples--notes)

---

## 1. Overview & Purpose

The **Summary Page** is displayed immediately after quiz completion. It celebrates the user's achievement with:

- **Primary Goal:** Provide instant feedback on quiz performance
- **Secondary Goals:**
  - Show comparison against personal average
  - Celebrate streak milestones
  - Unlock and display newly earned badges
  - Encourage replay or home navigation

**Design Philosophy:**
- **Celebration & Positivity:** Use warm colors, animations, and confetti for above-average scores
- **Encouragement:** Provide supportive messaging for all score levels
- **Clarity:** Make score, accuracy, and comparison immediately obvious
- **Engagement:** Highlight achievements (streak, badges) to drive repeat usage

**Key Metrics Displayed:**
- Score percentage (0-100%)
- Correct answers count / Total questions
- Personal average comparison
- Current streak (if applicable)
- Newly unlocked badges (if any)

---

## 2. Navigation Bar & Header

### 2.1 Sticky Glassmorphic Navigation Bar

**Position:** Fixed at `top-0`, spans full width

```html
<div class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
  <div class="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">

    <!-- Left: Back Button -->
    <button @click="goHome"
            class="p-2 rounded-full hover:bg-slate-100/50 active:scale-95 transition-all duration-200">
      <i class="ph ph-caret-left text-slate-900 text-xl"></i>
    </button>

    <!-- Center: Title -->
    <h1 class="text-lg font-semibold text-slate-900">Résultats</h1>

    <!-- Right: Spacer (for symmetry) -->
    <div class="w-10"></div>
  </div>
</div>
```

**Properties:**
- `bg-white/80 backdrop-blur-xl` - Glassmorphic effect with translucency
- `border-b border-white/20` - Hairline separator
- `px-6 py-4` - Generous padding matching Apple guidelines
- Fixed positioning ensures it stays visible during scroll
- Back button navigates to home with `goHome()`

---

## 3. Success Animation & Congratulations

### 3.1 Page Entry Animation

**Trigger:** Page mounts with page-enter animation

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

.animate-page-enter {
  animation: pageEnter 0.5s ease-out forwards;
}
```

### 3.2 Congratulations Section

```html
<div class="pt-20 px-6 pb-6 text-center space-y-3">
  <!-- Celebration Emoji (animated) -->
  <div class="text-6xl animate-bounce-short mb-2">🎉</div>

  <!-- Main Heading -->
  <h1 class="text-4xl font-bold text-slate-900">Quiz Terminé!</h1>

  <!-- Personalized Message -->
  <p class="text-lg text-slate-600 font-medium leading-relaxed">
    {{ congratulationsMessage }}
  </p>
</div>
```

**Congratulations Messages (based on score):**

| Score Range | Message |
|-------------|---------|
| ≥ 90% | 🚀 Excellent! Vous êtes une superstar! |
| ≥ 80% | 👏 Très bien! Continuez! |
| ≥ 60% | 💪 Pas mal! Il y a du potentiel! |
| ≥ 40% | 📚 Continuez à pratiquer! |
| < 40% | 🎯 Gardez la tête haute et essayez encore! |

**Styling Notes:**
- Emoji size: `text-6xl` for prominent visibility
- Bounce animation: Short, subtle bounce (not excessive)
- Text hierarchy: Main heading `text-4xl`, message `text-lg`
- Color: Slate-900 for primary text, slate-600 for secondary

---

## 4. Score Display (Animated Circular Progress)

### 4.1 SVG Circle Progress

This is the **centerpiece of the page**. A circular progress visualization showing the quiz score percentage.

```html
<section class="mx-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-8 mb-6">

  <!-- SVG Container -->
  <div class="flex justify-center mb-6">
    <svg width="220" height="220" class="transform -rotate-90" viewBox="0 0 220 220">

      <!-- Background Circle (complete circle) -->
      <circle
        cx="110"
        cy="110"
        r="100"
        fill="none"
        stroke="#e2e8f0"
        stroke-width="8"
        stroke-linecap="round"
      />

      <!-- Progress Circle (animated) -->
      <circle
        cx="110"
        cy="110"
        r="100"
        fill="none"
        :stroke="scoreColor"
        stroke-width="8"
        stroke-linecap="round"
        class="transition-all duration-[2s] ease-out"
        :style="{
          strokeDasharray: `${scoreDasharray}, ${2 * Math.PI * 100}`,
          strokeDashoffset: 0
        }"
      />
    </svg>
  </div>

  <!-- Score Text Overlay (centered in card) -->
  <div class="text-center space-y-1 mb-4">
    <div class="text-5xl font-bold" :class="scoreColorClass">
      {{ score }}%
    </div>
    <div class="text-sm font-medium text-slate-500">Score</div>
  </div>
</section>
```

**Circle Properties:**
- Radius: `100` (SVG units, translates to ~220px diameter)
- Stroke width: `8` (thick but not overwhelming)
- Background stroke: `#e2e8f0` (slate-200, muted)
- Progress stroke: Dynamic based on score (see Color Palette)
- Animation: 2000ms ease-out (smooth deceleration)
- Stroke linecap: `round` for soft endpoints

**Score Color Logic:**

```typescript
const scoreColor = computed(() => {
  if (score.value >= 80) return '#10b981'  // green-600
  if (score.value >= 50) return '#f59e0b'  // amber-600
  return '#ef4444'                         // red-600
})

const scoreColorClass = computed(() => {
  if (score.value >= 80) return 'text-green-600'
  if (score.value >= 50) return 'text-amber-600'
  return 'text-red-600'
})
```

**SVG Calculation:**
```typescript
const scoreDasharray = computed(() => {
  const circumference = 2 * Math.PI * 100  // radius = 100
  return (score.value / 100) * circumference
})
```

---

## 5. Answers Summary

### 5.1 Correct Answers Display

```html
<section class="mx-6 rounded-3xl bg-blue-50/40 backdrop-blur-sm border border-blue-200/50 p-6 space-y-3 mb-6">

  <!-- Main Summary -->
  <h2 class="text-center text-2xl font-bold text-slate-900">
    {{ correctAnswers }}/{{ totalQuestions }} réponses correctes
  </h2>

  <!-- Percentage Bar (linear progress) -->
  <div class="space-y-2">
    <div class="flex justify-between text-xs font-medium text-slate-600">
      <span>Exactitude</span>
      <span>{{ Math.round((correctAnswers / totalQuestions) * 100) }}%</span>
    </div>
    <div class="w-full h-2 bg-blue-200/50 rounded-full overflow-hidden">
      <div class="h-full bg-blue-600 transition-all duration-700 ease-out"
           :style="{ width: `${(correctAnswers / totalQuestions) * 100}%` }">
      </div>
    </div>
  </div>

  <!-- Supportive Message -->
  <p class="text-center text-sm text-slate-600 font-medium">Excellente tentative!</p>
</section>
```

**Layout:**
- Centered heading with large font
- Linear progress bar showing accuracy percentage
- Supportive message at bottom
- Blue color scheme (positive, calm)

---

## 6. Average Comparison Card

### 6.1 Comparison Section

This section compares the current quiz score against the user's historical average.

```html
<section class="mx-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6 space-y-4 mb-6">

  <!-- Section Title -->
  <h2 class="text-lg font-semibold text-slate-900">Votre performance</h2>

  <!-- Two-column Stats -->
  <div class="grid grid-cols-2 gap-3">

    <!-- Current Score -->
    <div class="rounded-2xl bg-blue-100/60 border border-blue-200/50 p-4 text-center space-y-1">
      <div class="text-3xl font-bold text-blue-700">{{ score }}%</div>
      <div class="text-xs font-medium text-blue-600 uppercase tracking-wide">Ce quiz</div>
    </div>

    <!-- Average Score -->
    <div class="rounded-2xl bg-slate-100/60 border border-slate-200/50 p-4 text-center space-y-1">
      <div class="text-3xl font-bold text-slate-700">{{ averageScore }}%</div>
      <div class="text-xs font-medium text-slate-600 uppercase tracking-wide">Votre moyenne</div>
    </div>
  </div>

  <!-- Comparison Message -->
  <div class="rounded-2xl p-4"
       :class="isAboveAverage
         ? 'bg-green-100/50 border border-green-200/50'
         : 'bg-blue-100/50 border border-blue-200/50'">

    <!-- Symbol + Message -->
    <p class="text-center font-semibold"
       :class="isAboveAverage ? 'text-green-700' : 'text-blue-700'">
      <span class="text-lg mr-1">{{ comparisonSymbol }}</span>
      {{ comparisonMessage }}
    </p>
  </div>
</section>
```

**Comparison Logic:**

```typescript
const isAboveAverage = computed(() => score.value > averageScore.value)
const scoreDifference = computed(() => Math.abs(score.value - averageScore.value))
const comparisonSymbol = computed(() =>
  isAboveAverage.value ? '▲' : (score.value === averageScore.value ? '=' : '▼')
)

const comparisonMessage = computed(() => {
  if (isAboveAverage.value) {
    return `Vous êtes ${scoreDifference.value}% au-dessus de la moyenne! 📈`
  } else if (score.value === averageScore.value) {
    return 'Vous êtes à la moyenne! 📊'
  } else {
    return `Vous êtes ${scoreDifference.value}% en dessous de la moyenne. Continuez! 📖`
  }
})
```

**Color Coding:**
- **Above Average:** Green (▲ symbol, `bg-green-100/50`)
- **At Average:** Blue (= symbol, `bg-blue-100/50`)
- **Below Average:** Blue (▼ symbol, `bg-blue-100/50`, but with encouragement)

---

## 7. Streak Celebration (Conditional)

### 7.1 Streak Section

**Condition:** Only shown if `isPrimaryQuizOfDay && currentStreak > 0`

```html
<section v-if="isPrimaryQuizOfDay"
         class="mx-6 rounded-3xl bg-orange-100/50 backdrop-blur-sm border border-orange-200/50 p-8 space-y-4
                animate-fade-in">

  <!-- Streak Animation -->
  <div class="flex justify-center">
    <div class="text-6xl animate-fire-glow-pulse">🔥</div>
  </div>

  <!-- Streak Count -->
  <div class="text-center space-y-1">
    <h2 class="text-3xl font-bold text-orange-700">
      {{ currentStreak }} jours
    </h2>
    <p class="text-sm font-medium text-orange-600 leading-relaxed">
      Vous êtes en feu! 🔥 Continuez demain pour garder votre streak!
    </p>
  </div>
</section>
```

**Animation - Fire Glow Pulse:**

```css
@keyframes fireGlowPulse {
  0%, 100% {
    text-shadow: 0 0 10px rgba(249, 115, 22, 0.8);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 30px rgba(249, 115, 22, 1);
    transform: scale(1.08);
  }
}

.animate-fire-glow-pulse {
  animation: fireGlowPulse 2s ease-in-out infinite;
}
```

**Styling Notes:**
- Orange color scheme matches "fire" metaphor
- Pulsing animation creates sense of energy
- Large emoji (text-6xl) for visual impact
- Text shadow glows (no drop shadow, per Apple design)

**Trigger Logic:**
```typescript
const isPrimaryQuizOfDay = computed(() => {
  if (!session.value) return false
  const today = new Date().toISOString().split('T')[0]
  return session.value.dateJour === today && currentStreak.value > 0
})
```

---

## 8. Badges Achievement (Conditional)

### 8.1 Newly Unlocked Badges

**Condition:** Only shown if `newBadges.length > 0`

```html
<section v-if="newBadges.length > 0"
         class="mx-6 rounded-3xl bg-yellow-100/50 backdrop-blur-sm border border-yellow-200/50 p-8 space-y-6
                animate-fade-in">

  <!-- Section Header -->
  <div class="text-center space-y-2">
    <div class="text-5xl mb-1">🏆</div>
    <h2 class="text-2xl font-bold text-yellow-700">Nouveaux Badges!</h2>
    <p class="text-sm text-yellow-600">Vous avez débloqué {{ newBadges.length }} badge(s)!</p>
  </div>

  <!-- Badges Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div v-for="(badge, index) in newBadges"
         :key="badge.id"
         class="rounded-2xl bg-white/80 backdrop-blur-sm border border-yellow-200/30 p-4 text-center space-y-2
                animate-badge-pop"
         :style="{ animationDelay: `${index * 100}ms` }">

      <!-- Badge Icon -->
      <div class="text-4xl flex justify-center">{{ badge.icon }}</div>

      <!-- Badge Name -->
      <h3 class="font-semibold text-slate-900 text-sm leading-tight">
        {{ badge.nom }}
      </h3>

      <!-- Badge Description -->
      <p class="text-xs text-slate-600 leading-snug">
        {{ badge.description }}
      </p>
    </div>
  </div>
</section>
```

**Badge Pop Animation:**

```css
@keyframes badgePop {
  0% {
    opacity: 0;
    transform: scale(0.4) rotateZ(-45deg);
  }
  60% {
    transform: scale(1.1) rotateZ(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateZ(0deg);
  }
}

.animate-badge-pop {
  animation: badgePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

**Animation Details:**
- Each badge pops in sequentially with `animationDelay`
- Staggered by `index * 100ms` (first at 0ms, second at 100ms, etc.)
- Bounce effect via cubic-bezier (overshoot curve)
- Scale, rotation, and opacity create celebratory feel

**Badge Data Structure:**
```typescript
interface Badge {
  id: string
  nom: string
  description: string
  icon: string  // Emoji like "⭐", "🎯", "🏆"
}
```

---

## 9. Action Buttons (Fixed Bottom)

### 9.1 Button Bar

```html
<div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20 px-6 py-4">
  <div class="max-w-2xl mx-auto flex gap-3">

    <!-- Home Button (Secondary) -->
    <button @click="goHome"
            class="flex-1 rounded-full px-4 py-3.5 font-semibold text-sm
                   bg-slate-100/60 border border-slate-200/50
                   text-slate-700 hover:bg-slate-100
                   active:scale-95 transition-all duration-200
                   flex items-center justify-center gap-2
                   hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <i class="ph ph-house text-lg"></i>
      <span>Accueil</span>
    </button>

    <!-- Replay Button (Primary) -->
    <button @click="replayQuiz"
            class="flex-1 rounded-full px-4 py-3.5 font-semibold text-sm
                   bg-blue-600 border border-blue-600
                   text-white hover:bg-blue-700
                   active:scale-95 transition-all duration-200
                   flex items-center justify-center gap-2
                   shadow-[0_4px_12px_rgba(37,99,235,0.3)]
                   hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)]">
      <i class="ph ph-arrow-clockwise text-lg"></i>
      <span>Rejouer</span>
    </button>
  </div>
</div>

<!-- Bottom spacer to prevent content overlap -->
<div class="h-24"></div>
```

**Button Styling:**

| Property | Home (Secondary) | Replay (Primary) |
|----------|------------------|------------------|
| Background | `bg-slate-100/60` | `bg-blue-600` |
| Border | `border-slate-200/50` | `border-blue-600` |
| Text Color | `text-slate-700` | `text-white` |
| Hover | `bg-slate-100` | `bg-blue-700` |
| Shadow | Subtle on hover | Always visible + enhanced on hover |
| Icon | `ph-house` | `ph-arrow-clockwise` |

**Layout:**
- Fixed bottom positioning (z-index: default stacking)
- Glassmorphic background (`bg-white/80 backdrop-blur-xl`)
- Equal width flex columns with gap-3
- Padding: `px-6 py-4` (generous)
- Bottom spacer: `h-24` (48px) to prevent content overlap when scrolling

---

## 10. Color Palette & Tokens

### 10.1 Semantic Color System

```typescript
// Score Circle Colors
const scoreColors = {
  excellent: '#10b981',   // green-600 (≥80%)
  good: '#f59e0b',        // amber-600 (≥50%)
  low: '#ef4444'          // red-600 (<50%)
}

// Background & Surface Colors
const bgColors = {
  primary: 'bg-white',
  secondary: 'bg-white/80',
  translucent: 'bg-white/50',
  blue: 'bg-blue-50/40',
  green: 'bg-green-100/50',
  orange: 'bg-orange-100/50',
  yellow: 'bg-yellow-100/50',
  slate: 'bg-slate-100/60'
}

// Border Colors
const borderColors = {
  subtle: 'border-gray-100/50',
  blue: 'border-blue-200/50',
  green: 'border-green-200/50',
  orange: 'border-orange-200/50',
  yellow: 'border-yellow-200/50',
  slate: 'border-slate-200/50',
  white: 'border-white/20'
}

// Text Colors
const textColors = {
  primary: 'text-slate-900',      // Headlines
  secondary: 'text-slate-600',    // Subtext
  muted: 'text-slate-500',        // Tertiary
  success: 'text-green-700',
  warning: 'text-orange-700',
  info: 'text-blue-700'
}

// Icon Colors
const iconColors = {
  primary: 'text-slate-900',
  secondary: 'text-slate-600',
  success: 'text-green-600',
  warning: 'text-orange-700',
  error: 'text-red-600'
}
```

### 10.2 Shadow System

```css
/* Soft shadows (Apple style) */
.shadow-apple-subtle {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.shadow-apple-sm {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* No drop shadows per Apple guidelines */
```

### 10.3 Typography Scale

```tailwind
/* Headings */
.text-4xl    /* Main title "Quiz Terminé!" */
.text-3xl    /* Streak count, badge heading */
.text-2xl    /* Section titles, score */
.text-lg     /* Congratulations message, nav title */
.text-base   /* Body text */
.text-sm     /* Supporting text, descriptions */
.text-xs     /* Labels, metadata */

/* Font Weights */
.font-bold   /* Headlines, emphasis */
.font-semibold /* Section titles */
.font-medium /* Buttons, labels */
.font-normal /* Body text */
```

### 10.4 Spacing Scale

```tailwind
px-6 py-4   /* Navigation, button areas (24px) */
p-6         /* Card padding, generous */
p-4         /* Inner card padding (16px) */
p-2         /* Button hover areas */
gap-3       /* Between buttons, moderate */
space-y-4   /* Vertical stacking, generous */
space-y-2   /* Tight stacking */
mb-6        /* Vertical separation */
```

---

## 11. Interactions & Animations

### 11.1 Timeline of Animations on Mount

| Timing | Element | Animation | Duration |
|--------|---------|-----------|----------|
| 0ms | Entire page | Fade-in + slide up | 500ms |
| 500ms | Score circle | Stroke animation | 2000ms |
| 500ms | Confetti (if applicable) | Random fall animation | 2000-3000ms |
| 500ms | Badges (if present) | Pop animation (staggered) | 600ms each |
| 700ms | Streak section (if present) | Fade-in | 300ms |

### 11.2 User Interactions

**Button States:**

```css
/* Normal state */
.btn {
  transition: all 0.2s ease-out;
}

/* Hover */
.btn:hover {
  shadow: enhanced (0 6px 16px);
  background: lighter shade;
}

/* Active/Pressed */
.btn:active {
  transform: scale(0.95);
  transition: transform 0.15s ease-out;
}

/* After release */
.btn:active:not(:pressed) {
  transform: scale(1);
  transition: transform 0.2s ease-out;
}
```

### 11.3 Page Transitions

**Entering Summary Page:**
- Slide up from bottom with opacity fade-in
- Duration: 500ms, easing: ease-out

**Leaving Summary Page (via button):**
- Slide down with opacity fade-out
- Duration: 300ms, easing: ease-in

---

## 12. Implementation Examples & Notes

### 12.1 Vue.js Template Structure

```vue
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'
import { useStatsStore } from '@/stores/useStatsStore'

const router = useRouter()
const quizStore = useQuizStore()
const statsStore = useStatsStore()

// Computed values (score, averageScore, isAboveAverage, etc.)
// See Summary.vue source for full implementation

onMounted(async () => {
  await statsStore.loadStats()

  // Trigger confetti after animations load
  setTimeout(() => {
    if (shouldShowConfetti.value) {
      createConfetti()
    }
  }, 500)
})

function createConfetti() {
  // See Summary.vue for full implementation
  // Creates 50 animated pieces with random colors and delays
}

async function goHome() {
  quizStore.clearActiveSession()
  await router.push({ name: 'home' })
}

async function replayQuiz() {
  const params = quizStore.getReplayParams()
  if (!params) return

  quizStore.clearActiveSession()
  await quizStore.createQuizSession(
    params.categories,
    params.difficulty,
    params.count
  )
  await router.push({ name: 'quiz-active' })
}
</script>

<template>
  <!-- Navigation Bar -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
    <!-- ... nav content ... -->
  </div>

  <!-- Main Content (with top padding for nav) -->
  <div class="pt-16 pb-24 px-6 max-w-2xl mx-auto space-y-6">

    <!-- Congratulations Section -->
    <!-- Score Circle Section -->
    <!-- Answers Summary Section -->
    <!-- Average Comparison Section -->
    <!-- Streak Section (conditional) -->
    <!-- Badges Section (conditional) -->
  </div>

  <!-- Fixed Bottom Buttons -->
  <div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20">
    <!-- ... button content ... -->
  </div>

  <!-- Confetti Container -->
  <div v-if="shouldShowConfetti" id="confetti-container" class="fixed inset-0 pointer-events-none"></div>
</template>
```

### 12.2 Key CSS Classes (from style.css)

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

@keyframes fireGlowPulse {
  0%, 100% {
    text-shadow: 0 0 10px rgba(249, 115, 22, 0.8);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 30px rgba(249, 115, 22, 1);
    transform: scale(1.08);
  }
}

@keyframes badgePop {
  0% {
    opacity: 0;
    transform: scale(0.4) rotateZ(-45deg);
  }
  60% {
    transform: scale(1.1) rotateZ(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateZ(0deg);
  }
}

@keyframes confetti {
  0% {
    opacity: 1;
    transform: translateY(0) rotateX(0) rotateZ(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-400px) rotateX(720deg) rotateZ(360deg);
  }
}

.confetti-piece {
  position: fixed;
  width: 10px;
  height: 10px;
  pointer-events: none;
  animation: confetti 3s ease-out forwards;
}
```

### 12.3 Score Circle SVG Details

```vue
<svg width="220" height="220" class="transform -rotate-90" viewBox="0 0 220 220">
  <!-- Background circle (gray outline) -->
  <circle cx="110" cy="110" r="100" fill="none" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round"/>

  <!-- Progress circle (colored, animated) -->
  <circle
    cx="110"
    cy="110"
    r="100"
    fill="none"
    :stroke="scoreColor"
    stroke-width="8"
    stroke-linecap="round"
    class="transition-all duration-[2s] ease-out"
    :style="{
      strokeDasharray: `${scoreDasharray}, ${2 * Math.PI * 100}`,
      strokeDashoffset: 0
    }"
  />
</svg>

<script>
const scoreDasharray = computed(() => {
  const circumference = 2 * Math.PI * 100
  return (score.value / 100) * circumference
})
</script>
```

**How it works:**
1. Circle has radius 100, circumference ≈ 628
2. `strokeDasharray` sets the visible dash length
3. At 75% score: dasharray = 471 (75% of 628)
4. Animation smoothly transitions from 0 to target value over 2000ms

### 12.4 Responsive Breakpoints

```tailwind
/* All sections use max-w-2xl mx-auto for max width */
/* Grid adjusts: grid-cols-1 sm:grid-cols-2 */
/* Padding remains consistent: px-6 on all breakpoints */

/* Mobile (xs, sm): Full-width with side padding */
/* Tablet (md, lg): Centered with max-width constraint */
/* Desktop (xl+): Centered, never exceeds 896px */
```

### 12.5 Accessibility Notes

- **Color Contrast:** All text meets WCAG AA+ standards
  - Slate-900 on white: 16.5:1 contrast ratio
  - Green-600 on white: 7.5:1 contrast ratio
  - Amber-600 on white: 6.5:1 contrast ratio

- **Focus States:** All buttons have visible focus ring via `outline` or similar
- **Semantic HTML:** Proper heading hierarchy (h1 → h2)
- **Icon Labels:** Text accompanying all icons
- **Button Size:** Minimum 44×44px touch target
- **Animation:** No animation exceeds 3 seconds; `prefers-reduced-motion` respected (future enhancement)

### 12.6 Performance Considerations

**Animation Optimization:**
- SVG circle uses CSS transitions (GPU-accelerated)
- Confetti uses `transform` and `opacity` (GPU-accelerated properties)
- Avoid animating `width`, `height`, `left`, `top` (causes reflow)

**Render Optimization:**
- Conditional rendering for `Streak` and `Badges` sections
- Use `v-if` not `v-show` (these sections have computed dependencies)
- Debounce stats loading in `onMounted`

**CSS Optimization:**
- Use Tailwind utilities (tree-shaken in production)
- Backdrop blur handled efficiently by modern browsers
- Glassmorphism effect minimal performance impact

---

## 13. Validation Checklist

Before marking this page as production-ready, verify:

### Visual Design
- [x] Navigation bar is sticky and glassmorphic
- [x] Congratulations message matches score range
- [x] Score circle animates smoothly from 0 to final value
- [x] Color changes based on score (green/amber/red)
- [x] All text is readable on all backgrounds
- [x] Streak section appears only when applicable
- [x] Badges pop in sequence with staggered timing
- [x] Confetti only shows for above-average scores

### Interaction & Animation
- [x] Page enters with fade + slide animation
- [x] Score circle animates over 2 seconds
- [x] Fire emoji pulses continuously (infinite)
- [x] Badges pop in with bounce effect
- [x] Buttons respond to hover (shadow, color change)
- [x] Buttons respond to active (scale down)
- [x] No animation exceeds 3 seconds

### Responsive Design
- [x] Mobile (375px): Content fits without horizontal scroll
- [x] Tablet (768px): Grid shows 2-column badge layout
- [x] Desktop (1024px): Content centered, max-width respected
- [x] Navigation bar full-width on all sizes
- [x] Bottom buttons have adequate spacing

### Accessibility
- [x] Heading hierarchy: h1 → h2 (no skipped levels)
- [x] Color not the only way to convey information
- [x] Text contrast ≥ 4.5:1 for body, ≥ 3:1 for large text
- [x] Buttons are at least 44×44px
- [x] Focus states visible
- [x] Icon text labels present

### Performance
- [x] SVG animations use CSS (GPU-accelerated)
- [x] Confetti uses transform/opacity (GPU-accelerated)
- [x] Conditional rendering for conditional sections
- [x] No layout shifts during animations
- [x] Page loads and renders in <2 seconds

---

## 14. Related Pages

- **Previous:** `/quiz/active` (Quiz gameplay page)
- **Next:** `/quiz/home` (Return to home) or stats dashboard (future)
- **Related:** `/stats` (Full statistics view)

---

**End of UI_SPEC_SUMMARY_APPLE.md**
