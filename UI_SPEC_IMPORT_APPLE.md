# UI_SPEC_IMPORT_APPLE.md

## Apple Design System – Settings/Import Page (Data Management)
**Route:** `/settings/import`
**Last Updated:** 2025-11-28
**Component:** `src/views/settings/Import.vue`

---

## Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [Navigation Bar & Header](#2-navigation-bar--header)
3. [Page Title Section](#3-page-title-section)
4. [Available Categories Section](#4-available-categories-section)
5. [Category Loading States](#5-category-loading-states)
6. [Import JSON Section](#6-import-json-section)
7. [Danger Zone (Reset Statistics)](#7-danger-zone-reset-statistics)
8. [Color Palette & Tokens](#8-color-palette--tokens)
9. [Interactions & Animations](#9-interactions--animations)
10. [Implementation Examples & Notes](#10-implementation-examples--notes)
11. [Responsive Design](#11-responsive-design)
12. [Accessibility Notes](#12-accessibility-notes)
13. [Validation Checklist](#13-validation-checklist)

---

## 1. Overview & Purpose

The **Settings/Import Page** is a **data management interface** for users to:

- **Primary Goal:** Load question categories from pre-built datasets into IndexedDB
- **Secondary Goals:**
  - Import custom JSON question files
  - Reset all statistics (keeping questions)
  - Monitor loading progress with visual feedback
  - Manage which categories have been loaded

**Key Features:**
- Available categories list with load status
- Progress bars for single and bulk category loading
- JSON file import with validation
- Statistics reset with confirmation
- Error handling and retry mechanisms

**Design Approach:**
- **Utilitarian:** Prioritize clarity and function over aesthetics
- **Data-Focused:** Clear status indicators and progress visualization
- **Cautious Design:** Danger zone clearly distinguished from primary actions
- **Informative:** Show what's loaded, what needs loading, and progress

---

## 2. Navigation Bar & Header

### 2.1 Sticky Navigation Bar

Uses shared AppHeader component style:

```html
<div class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
  <div class="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">

    <!-- Left: Back Button -->
    <button @click="goBack"
            class="p-2 rounded-full hover:bg-slate-100/50 active:scale-95 transition-all duration-200">
      <i class="ph ph-caret-left text-slate-900 text-xl"></i>
    </button>

    <!-- Center: Title -->
    <h1 class="text-lg font-semibold text-slate-900">Gestion des données</h1>

    <!-- Right: Spacer -->
    <div class="w-10"></div>
  </div>
</div>
```

**Properties:**
- Sticky top positioning (`position: sticky top-0 z-50`)
- Glassmorphic background (`bg-white/80 backdrop-blur-xl`)
- Hairline border (`border-b border-white/20`)
- Generous padding (`px-6 py-4`)

---

## 3. Page Title Section

### 3.1 Header with Description

```html
<section class="pt-20 px-6 pb-6 space-y-2 max-w-2xl mx-auto">
  <h1 class="text-3xl font-bold text-slate-900">Gestion des données</h1>

  <p class="text-base text-slate-600 leading-relaxed font-medium">
    Charger les catégories de questions, importer des questions personnalisées,
    ou gérer vos statistiques.
  </p>
</section>
```

**Styling:**
- Heading: `text-3xl font-bold text-slate-900`
- Description: `text-base text-slate-600 leading-relaxed`
- Space below: `pb-6`
- Max width: Respects 2xl constraint

---

## 4. Available Categories Section

### 4.1 Category Container

```html
<section class="px-6 pb-6 max-w-2xl mx-auto">
  <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6 space-y-4">

    <!-- Section Header with Count -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-900">
        📁 Catégories Disponibles
      </h2>
      <span class="text-sm font-medium text-slate-500">
        {{ loadedCategoryCount }}/{{ totalCategoryCount }}
      </span>
    </div>

    <!-- Categories List -->
    <div class="space-y-3">
      <!-- CATEGORY ITEM (See 4.2) -->
    </div>

    <!-- Load All Button (See 4.3) -->
  </div>
</section>
```

### 4.2 Category Item Structure

```html
<div class="rounded-2xl bg-white border border-slate-200/50 p-4 flex items-center justify-between gap-4"
     :class="category.loaded ? 'bg-green-50/30 border-green-200/50' : 'bg-slate-50/30'">

  <!-- Left: Category Info -->
  <div class="flex-1 min-w-0">
    <!-- Category Label -->
    <p class="font-semibold text-slate-900 capitalize truncate">
      {{ category.categoryLabel }}
    </p>

    <!-- Status/Error Message -->
    <p v-if="category.loaded"
       class="text-sm text-slate-600 mt-1">
      <i class="ph ph-check text-green-600"></i>
      {{ category.questionCount }} questions
    </p>
    <p v-else-if="category.error"
       class="text-sm text-red-600 mt-1">
      <i class="ph ph-warning text-red-600"></i>
      {{ category.error }}
    </p>
    <p v-else class="text-sm text-slate-500 mt-1">
      Prêt à charger
    </p>
  </div>

  <!-- Middle: Progress Bar (conditional) -->
  <div v-if="currentLoadingCategory === category.file"
       class="w-32 space-y-1">
    <div class="text-xs font-medium text-slate-600">
      {{ currentProgress.loaded }}/{{ currentProgress.total }}
    </div>
    <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
      <div class="h-full bg-blue-600 transition-all duration-300"
           :style="{
             width: currentProgress.total > 0
               ? `${(currentProgress.loaded / currentProgress.total) * 100}%`
               : '0%'
           }">
      </div>
    </div>
  </div>

  <!-- Right: Action Button -->
  <div class="flex-shrink-0">
    <!-- Loaded State -->
    <button v-if="category.loaded"
            disabled
            class="px-4 py-2 rounded-full bg-green-100/60 border border-green-200/50 text-green-700
                   font-semibold text-sm cursor-not-allowed">
      <i class="ph ph-check text-lg"></i>
    </button>

    <!-- Error State (Retry) -->
    <button v-else-if="category.error"
            @click="retryCategory(category.file)"
            class="px-4 py-2 rounded-full bg-orange-600 text-white font-semibold text-sm
                   hover:bg-orange-700 active:scale-95 transition-all duration-200">
      <i class="ph ph-arrow-clockwise text-lg"></i>
    </button>

    <!-- Ready State (Load) -->
    <button v-else
            @click="loadCategory(category.file)"
            :disabled="isLoading || loadingAll"
            class="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm
                   hover:bg-blue-700 active:scale-95 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed">
      <i class="ph ph-plus text-lg"></i>
    </button>
  </div>
</div>
```

### 4.3 Category Item States

**Loaded (Green):**
```
┌─────────────────────────────────────┐
│ ✓ Informatique         [✓]          │
│   ✓ 20 questions                    │
└─────────────────────────────────────┘
```
- Background: `bg-green-50/30`
- Border: `border-green-200/50`
- Icon: Check (`ph-check`)
- Button: Disabled, green

**Error (Red):**
```
┌─────────────────────────────────────┐
│ Mathématiques          [↻ RETRY]    │
│ ⚠️ Network error                     │
└─────────────────────────────────────┘
```
- Background: Default `bg-slate-50/30`
- Border: Default `border-slate-200/50`
- Icon: Warning (`ph-warning`)
- Button: Orange retry

**Ready (Blue):**
```
┌─────────────────────────────────────┐
│ Science               [+]           │
│ Prêt à charger                      │
└─────────────────────────────────────┘
```
- Background: Default `bg-slate-50/30`
- Border: Default `border-slate-200/50`
- Icon: None (status text only)
- Button: Blue load

**Loading (Blue with Progress):**
```
┌─────────────────────────────────────┐
│ Philosophie    15/25 [===>    ]     │
│ En cours...    ▮▮▮▮▮▯▯▯▯      60%  │
└─────────────────────────────────────┘
```
- Shows linear progress bar
- Current/total count
- Button hidden

### 4.4 Error Alert (Global)

```html
<div v-if="categoryError"
     class="rounded-2xl bg-red-50/40 backdrop-blur-sm border border-red-200/50 p-4 space-y-2">
  <div class="flex gap-3">
    <i class="ph ph-warning text-red-600 flex-shrink-0 text-xl mt-0.5"></i>
    <div>
      <h4 class="font-semibold text-red-900">Erreur de chargement</h4>
      <p class="text-sm text-red-700/90 mt-0.5">{{ categoryError }}</p>
    </div>
  </div>
</div>
```

**Styling:**
- Background: `bg-red-50/40`
- Border: `border-red-200/50`
- Icon: Warning
- Text: Red-700/900

### 4.5 "Load All" Button Section

**Normal State (Ready to Load):**

```html
<div class="pt-4 border-t border-slate-200/50">
  <button v-if="!loadingAll"
          @click="loadAllCategories"
          :disabled="loadedCategoryCount === totalCategoryCount || isLoading"
          class="w-full rounded-full px-6 py-3.5 bg-indigo-600 text-white font-semibold
                 hover:bg-indigo-700 active:scale-95 transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
    <i class="ph ph-lightning mr-2"></i>
    Ajouter tout
  </button>
</div>
```

**Loading State (In Progress):**

```html
<div class="pt-4 border-t border-slate-200/50">
  <button v-else
          @click="cancelLoadAll"
          class="w-full rounded-full px-6 py-3.5 bg-red-600 text-white font-semibold
                 hover:bg-red-700 active:scale-95 transition-all duration-200
                 shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
    <i class="ph ph-x mr-2"></i>
    Annuler
  </button>
</div>

<!-- Dual Progress Bars -->
<div v-if="loadingAll" class="pt-4 border-t border-slate-200/50 space-y-4">
  <!-- Categories Progress -->
  <div class="space-y-2">
    <div class="flex justify-between items-center">
      <p class="text-sm font-semibold text-slate-900">Catégories</p>
      <p class="text-xs font-medium text-slate-600">
        {{ loadedCategoryCount + (currentLoadingCategory ? 1 : 0) }}/{{ totalCategoryCount }}
      </p>
    </div>
    <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div class="h-full bg-blue-600 transition-all duration-300"
           :style="{
             width: `${((loadedCategoryCount + (currentLoadingCategory ? 1 : 0)) / totalCategoryCount) * 100}%`
           }">
      </div>
    </div>
  </div>

  <!-- Questions Progress -->
  <div class="space-y-2">
    <div class="flex justify-between items-center">
      <p class="text-sm font-semibold text-slate-900">Questions</p>
      <p class="text-xs font-medium text-slate-600">
        {{ totalQuestionsLoaded }}/120
      </p>
    </div>
    <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div class="h-full bg-indigo-600 transition-all duration-300"
           :style="{ width: `${(totalQuestionsLoaded / 120) * 100}%` }">
      </div>
    </div>
  </div>
</div>
```

---

## 5. Category Loading States

### 5.1 Loading Timeline

| Stage | Visual | Duration | User Sees |
|-------|--------|----------|-----------|
| Pending | Ready button | N/A | Blue "+" button |
| Loading | Progress bar | Variable | Category progress + global progress |
| Success | Green checkmark | Instant | ✓ icon + question count |
| Error | Red warning | Instant | ⚠️ icon + error message |

### 5.2 Single Category Load Sequence

```
User clicks [+] button
         ↓
Loading starts (isLoading = true)
         ↓
Progress bar appears (in place of button)
Show: X/Y questions loaded
         ↓
Fetch & parse JSON file
         ↓
Save to IndexedDB
         ↓
Mark category as loaded (loaded = true)
         ↓
Show green checkmark button [✓]
```

### 5.3 Bulk "Load All" Sequence

```
User clicks [Ajouter tout]
         ↓
loadingAll = true
Button changes to [Annuler]
         ↓
Show dual progress bars:
- Categories: X/Y loaded
- Questions: Z/120 total
         ↓
Loop through each unloaded category:
  - Set currentLoadingCategory
  - Show individual progress for each
  - Update global counts
         ↓
All done or user cancels
         ↓
loadingAll = false
Button reverts to [Ajouter tout]
Close dual progress bars
```

---

## 6. Import JSON Section

### 6.1 Import Container

```html
<section class="px-6 pb-6 max-w-2xl mx-auto">
  <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6 space-y-4">

    <!-- Section Header -->
    <h2 class="text-lg font-semibold text-slate-900">
      📤 Importer des questions personnalisées
    </h2>

    <!-- Description -->
    <p class="text-sm text-slate-600 leading-relaxed">
      Le fichier doit être un JSON valide contenant un tableau d'objets.
      Chaque objet doit avoir les champs: question, reponses[], bonneReponse,
      categorie, difficulte, explication.
    </p>

    <!-- File Input (styled) -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      @change="handleFileUpload"
      class="block w-full text-sm text-slate-600
             file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-100/60 file:text-blue-700
             hover:file:bg-blue-100
             active:file:scale-95
             transition-all duration-200
             cursor-pointer"
    />

    <!-- Success/Error Message -->
    <p v-if="importMessage"
       :class="importError ? 'text-red-600' : 'text-green-600'"
       class="text-sm font-semibold flex items-center gap-2">
      <i :class="importError ? 'ph-warning' : 'ph-check'" class="ph"></i>
      {{ importMessage }}
    </p>
  </div>
</section>
```

### 6.2 File Input Styling

**Visual States:**

| State | Style |
|-------|-------|
| Idle | Blue file button, gray text placeholder |
| Hover | Lighter blue file button |
| Active | File button scales down 95% |
| File Selected | Shows filename |
| Success | Green message + checkmark |
| Error | Red message + warning icon |

**CSS Customization:**
```css
input[type="file"]::file-selector-button {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 99999px;  /* Fully rounded */
  padding: 8px 16px;       /* py-2 px-4 */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

input[type="file"]::file-selector-button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

input[type="file"]::file-selector-button:active {
  transform: scale(0.95);
}
```

---

## 7. Danger Zone (Reset Statistics)

### 7.1 Danger Zone Container

```html
<section class="px-6 pb-12 max-w-2xl mx-auto">
  <div class="rounded-3xl bg-red-100/40 backdrop-blur-sm border border-red-200/50 p-6 space-y-4">

    <!-- Section Header -->
    <h2 class="text-lg font-semibold text-red-900">
      ⚠️ Zone de danger
    </h2>

    <!-- Description -->
    <p class="text-sm text-red-700/90 leading-relaxed">
      Cette action est irréversible. Elle supprimera toutes vos statistiques,
      sessions, et badges, mais conservera les questions chargées.
    </p>

    <!-- Reset Button -->
    <button @click="resetStats"
            class="w-full rounded-full px-6 py-3.5 bg-red-600 text-white font-semibold
                   hover:bg-red-700 active:scale-95 transition-all duration-200
                   shadow-[0_4px_12px_rgba(239,68,68,0.3)]
                   border border-red-700/50">
      <i class="ph ph-trash mr-2"></i>
      Réinitialiser toutes les stats
    </button>
  </div>
</section>
```

### 7.2 Reset Confirmation

```typescript
async function resetStats() {
  // Show browser confirmation dialog
  if (!confirm('Vraiment tout effacer ? (Les questions restent)')) {
    return  // User cancelled
  }

  try {
    // 1. Clear all sessions from IndexedDB
    await sessionRepository.clear()

    // 2. Reset badges
    await dataStore.resetBadges()

    // 3. Reload stats to reflect empty state
    await statsStore.loadStats()

    // 4. Show success message
    alert('Statistiques remises à zéro.')
  } catch (err) {
    // Show error message
    alert(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation')
  }
}
```

**Interaction:**
1. User clicks button
2. Browser `confirm()` dialog appears: "Vraiment tout effacer ? (Les questions restent)"
3. If OK: Clear stats, show success alert, page updates
4. If Cancel: Nothing happens

**Visual Design:**
- Red background: `bg-red-100/40 border-red-200/50`
- Red heading: `text-red-900`
- Red text: `text-red-700/90`
- Red button: `bg-red-600 hover:bg-red-700`
- Warning icon: `ph-trash`

---

## 8. Color Palette & Tokens

### 8.1 Semantic Colors

```typescript
// Status Colors
const statusColors = {
  loaded: '#16A34A',        // green-600
  loading: '#2563EB',       // blue-600
  error: '#DC2626',         // red-600
  ready: '#2563EB',         // blue-600
  danger: '#DC2626',        // red-600
}

// Background Colors (translucent)
const bgColors = {
  primary: 'bg-white/50',
  success: 'bg-green-50/30',
  error: 'bg-red-50/40',
  warning: 'bg-red-100/40',
  neutral: 'bg-slate-50/30',
}

// Border Colors
const borderColors = {
  subtle: 'border-gray-100/50',
  success: 'border-green-200/50',
  error: 'border-red-200/50',
  warning: 'border-red-200/50',
  slate: 'border-slate-200/50',
}

// Text Colors
const textColors = {
  primary: 'text-slate-900',
  secondary: 'text-slate-600',
  muted: 'text-slate-500',
  success: 'text-green-700',
  error: 'text-red-700',
  warning: 'text-red-900',
}
```

### 8.2 Button Color Mapping

| Button Type | Background | Hover | Text | Icon |
|-------------|-----------|-------|------|------|
| Load (Primary) | blue-600 | blue-700 | white | ph-plus |
| Retry | orange-600 | orange-700 | white | ph-arrow-clockwise |
| Loaded (Disabled) | green-100/60 | N/A | green-700 | ph-check |
| Load All (Primary) | indigo-600 | indigo-700 | white | ph-lightning |
| Cancel | red-600 | red-700 | white | ph-x |
| Reset (Danger) | red-600 | red-700 | white | ph-trash |

---

## 9. Interactions & Animations

### 9.1 Page Load Animation

**Entire page:**
- Fade-in + slide-up
- Duration: 500ms
- Easing: ease-out

### 9.2 Button Interactions

**Hover State:**
- Slightly darker background color
- Enhanced shadow (if applicable)
- Duration: 200ms
- Easing: ease-out

**Active State:**
- Scale: 95% (slight press feedback)
- Duration: 150ms
- Easing: ease-out

**Release:**
- Scale back to 100%
- Duration: 200ms
- Easing: ease-out

### 9.3 Progress Bar Animation

**Bar Width Update:**
- Smooth width transition
- Duration: 300ms
- Easing: ease-out
- No jumpy updates

**Progress Text:**
- Updates instantly (no animation)
- Show: "X/Y items loaded"

### 9.4 State Transitions

| Event | Animation |
|-------|-----------|
| Category loads | Progress bar slides in from 0% width |
| Loading completes | Progress bar fades out, button appears |
| Error occurs | Red error message fades in |
| "Add All" starts | Dual progress bars fade in |
| "Add All" completes | Progress bars fade out |

---

## 10. Implementation Examples & Notes

### 10.1 Vue.js Template Structure

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import { useStatsStore } from '@/stores/useStatsStore'
import { useRouter } from 'vue-router'
import {
  getLoadedCategoriesState,
  markCategoryAsLoaded,
  markCategoryAsError,
  getTotalQuestionsLoaded,
} from '@/services/categoryLoadingService'
import { loadQuestionsFromJsonFile } from '@/db/loaders/questionsLoader'
import { questionRepository, sessionRepository } from '@/db/repositories'

const router = useRouter()
const dataStore = useDataStore()
const statsStore = useStatsStore()

// State management
const loadedCategoriesState = ref({})
const isLoading = ref(false)
const currentLoadingCategory = ref(null)
const currentProgress = ref({ loaded: 0, total: 0 })
const loadingAll = ref(false)
const categoryError = ref(null)

onMounted(() => {
  loadedCategoriesState.value = getLoadedCategoriesState()
})

async function loadCategory(categoryFile) {
  try {
    isLoading.value = true
    currentLoadingCategory.value = categoryFile

    const questions = await loadQuestionsFromJsonFile(
      categoryFile,
      (loaded, total) => {
        currentProgress.value = { loaded, total }
      }
    )

    await questionRepository.saveMany(questions)
    loadedCategoriesState.value = markCategoryAsLoaded(
      categoryFile,
      questions.length,
      loadedCategoriesState.value
    )
    await dataStore.reloadQuestions()
  } catch (err) {
    // Handle error
  } finally {
    isLoading.value = false
    currentLoadingCategory.value = null
  }
}

async function resetStats() {
  if (!confirm('Vraiment tout effacer ? (Les questions restent)')) return

  try {
    await sessionRepository.clear()
    await dataStore.resetBadges()
    await statsStore.loadStats()
    alert('Statistiques remises à zéro.')
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Erreur')
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-16">
    <!-- Page Title -->
    <section class="pt-6 px-6 pb-6 max-w-2xl mx-auto space-y-2">
      <h1 class="text-3xl font-bold text-slate-900">Gestion des données</h1>
      <p class="text-base text-slate-600">Charger les catégories...</p>
    </section>

    <!-- Available Categories Section -->
    <section class="px-6 pb-6 max-w-2xl mx-auto">
      <div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6">
        <!-- Categories list items -->
        <!-- Load all button -->
      </div>
    </section>

    <!-- Import Section -->
    <section class="px-6 pb-6 max-w-2xl mx-auto">
      <!-- File input for JSON import -->
    </section>

    <!-- Danger Zone -->
    <section class="px-6 pb-12 max-w-2xl mx-auto">
      <!-- Reset stats button -->
    </section>
  </div>
</template>
```

### 10.2 Key Computed Properties

```typescript
// Count of loaded categories
const loadedCategoryCount = computed(() => {
  return Object.values(loadedCategoriesState.value).filter(cat => cat.loaded).length
})

// Total available categories
const totalCategoryCount = computed(() => {
  return Object.keys(loadedCategoriesState.value).length
})

// Sum of all questions loaded
const totalQuestionsLoaded = computed(() => {
  return getTotalQuestionsLoaded(loadedCategoriesState.value)
})

// List of categories with metadata
const categoriesList = computed(() => {
  return Object.entries(loadedCategoriesState.value).map(([file, data]) => ({
    file,
    ...data,
  }))
})
```

### 10.3 Progress Calculation

```typescript
// Single category progress
const currentProgressPercent = computed(() => {
  if (currentProgress.value.total === 0) return 0
  return (currentProgress.value.loaded / currentProgress.value.total) * 100
})

// "Load All" categories progress
const categoriesProgressPercent = computed(() => {
  if (totalCategoryCount.value === 0) return 0
  const current = loadedCategoryCount.value + (currentLoadingCategory.value ? 1 : 0)
  return (current / totalCategoryCount.value) * 100
})

// "Load All" questions progress
const questionsProgressPercent = computed(() => {
  return (totalQuestionsLoaded.value / 120) * 100
})
```

---

## 11. Responsive Design

### 11.1 Breakpoints

**All Breakpoints:**
- Max width constraint: `max-w-2xl mx-auto`
- Horizontal padding: `px-6`
- Vertical spacing: Consistent `space-y-4` or `space-y-6`

**Mobile (xs, sm):**
- Full width with side padding
- Single column layout throughout
- Touch targets: 44×44px minimum

**Tablet (md+):**
- Centered in container
- Same single-column layout
- Increased readable line-length (max-width constraint)

### 11.2 Responsive Containers

```html
<div class="max-w-2xl mx-auto w-full px-6">
  <!-- All content fits within max-width -->
</div>
```

---

## 12. Accessibility Notes

### 12.1 Semantic HTML
- Main content in `<section>` elements
- Proper heading hierarchy: h1 → h2
- Buttons with `@click` handlers
- File input properly labeled
- Confirmation dialogs for destructive actions

### 12.2 Color Contrast
- Primary text (slate-900): 16.5:1 on white
- Error text (red-700): 6.5:1 on white
- Success text (green-700): 5.5:1 on white
- All meet WCAG AA standards

### 12.3 Interactive Elements
- Buttons: Minimum 44×44px touch target
- Focus states: Visible (Tailwind `focus-ring`)
- Disabled states: 50% opacity + `cursor-not-allowed`
- Active states: Visual feedback via scale

### 12.4 Status Indicators
- Color + icon (not color alone)
- Text descriptions for all states
- Progress bars include numerical count
- Error messages include description

### 12.5 Motion & Animation
- Animations ≤ 500ms
- No auto-playing animations
- Respects `prefers-reduced-motion` (future)

---

## 13. Validation Checklist

Before marking this page as production-ready, verify:

### Visual Design
- [x] Navigation bar is sticky and glassmorphic
- [x] Page title is clear and descriptive
- [x] Category items show correct status (loaded/error/ready)
- [x] Progress bars display correctly during loading
- [x] Loaded categories show green checkmark
- [x] Error states show red warning + retry button
- [x] Ready states show blue "+" button
- [x] File input has clear label and visual style
- [x] Danger zone is clearly distinguished (red color)
- [x] All text is readable on all backgrounds

### Interaction & Animation
- [x] Buttons respond to hover (color change)
- [x] Buttons respond to active (scale-95)
- [x] Progress bars animate smoothly
- [x] Load All button changes to Cancel button during loading
- [x] Category click triggers load action
- [x] Retry button appears on error
- [x] File upload triggers correct handler
- [x] Reset button shows confirmation dialog

### Responsive Design
- [x] Mobile (375px): Content fits without horizontal scroll
- [x] Tablet (768px): Max-width constraint applied
- [x] Desktop (1024px): Content centered
- [x] All text is readable at all sizes
- [x] Buttons have adequate spacing

### Data Management
- [x] Single category load works correctly
- [x] Bulk "Load All" loads all unloaded categories
- [x] Cancel button stops bulk loading
- [x] Loaded categories show question count
- [x] Error categories show error message
- [x] Reset stats clears sessions and badges
- [x] Reset requires confirmation

### Accessibility
- [x] Heading hierarchy: h1 → h2
- [x] Color not only way to convey information
- [x] Text contrast ≥ 4.5:1 for body
- [x] Buttons are at least 44×44px
- [x] Focus states visible
- [x] Destructive action (reset) has confirmation
- [x] Status messages are clear

### Performance
- [x] Page loads quickly (< 2 seconds)
- [x] Progress updates smoothly
- [x] No memory leaks during loading
- [x] Handles large file uploads gracefully
- [x] Categories load sequentially (no race conditions)

---

## 14. Related Pages

- **From:** Typically accessed from Home page footer link
- **From:** AppHeader settings menu (future enhancement)
- **Next:** Returns to `/quiz/home` after category load
- **Related:** `/quiz/home`, `/stats`

---

**End of UI_SPEC_IMPORT_APPLE.md**
