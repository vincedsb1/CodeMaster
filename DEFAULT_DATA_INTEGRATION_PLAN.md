# Plan: Intégration des Questions JSON (120 Questions) via Settings/Import

**Objectif**: Interface visuelle pour charger progressivement les 7 catégories (120 questions) via `/settings/import` avec progressbar détaillée

**Date**: November 27, 2025
**Status**: Plan Complet avec UI/UX

---

## Vue d'Ensemble

**Approche**: Créer une UI dans `/settings/import` qui liste les 7 catégories avec:
- Bloc "Catégories Disponibles" en première position
- Bouton "+" pour charger chaque catégorie individuellement
- Bouton "Ajouter tout" pour charger toutes les catégories
- Double progressbar (catégories + questions) lors du chargement
- État persisté (se souvenir des catégories déjà chargées)
- Icône de check et bouton grisé une fois chargée
- Gestion d'erreurs avec retry

---

## Architecture Globale

### État des Catégories (Persistence)

```typescript
// Stocké dans localStorage
localStorage['quiz-master-loaded-categories'] = JSON.stringify({
  'react': { loaded: true, questionCount: 18, loadedAt: '2025-11-27T10:30:00Z' },
  'typescript': { loaded: true, questionCount: 20, loadedAt: '2025-11-27T10:31:00Z' },
  'nodejs': { loaded: false },
  'nextjs': { loaded: false },
  'css': { loaded: false },
  'database': { loaded: false },
  'entretien': { loaded: false },
})
```

---

## UI/UX Détaillée

### État 1: Avant Chargement (Vue Initiale)

```
┌─────────────────────────────────────────────────┐
│ 📁 CATÉGORIES DISPONIBLES (0/7 chargées)       │
├─────────────────────────────────────────────────┤
│ TypeScript          [+]                         │
│ React               [+]                         │
│ Node.js             [+]                         │
│ Next.js             [+]                         │
│ CSS                 [+]                         │
│ Database            [+]                         │
│ Entretien           [+]                         │
├─────────────────────────────────────────────────┤
│         [Ajouter tout]                          │
└─────────────────────────────────────────────────┘
```

### État 2: Pendant Chargement d'une Catégorie

```
┌─────────────────────────────────────────────────┐
│ 📁 CATÉGORIES DISPONIBLES (1/7 chargées)       │
├─────────────────────────────────────────────────┤
│ TypeScript          [+]                         │
│ React               [⏳ Chargement...]          │
│   Progression questions: ████████░░ 14/18      │
│ Node.js             [+]                         │
│ Next.js             [+]                         │
│ CSS                 [+]                         │
│ Database            [+]                         │
│ Entretien           [+]                         │
├─────────────────────────────────────────────────┤
│         [Ajouter tout]                          │
└─────────────────────────────────────────────────┘
```

### État 3: Après Chargement d'une Catégorie

```
┌─────────────────────────────────────────────────┐
│ 📁 CATÉGORIES DISPONIBLES (2/7 chargées)       │
├─────────────────────────────────────────────────┤
│ TypeScript          [✓] (20 questions)         │
│ React               [✓] (18 questions)         │
│ Node.js             [+]                         │
│ Next.js             [+]                         │
│ CSS                 [+]                         │
│ Database            [+]                         │
│ Entretien           [+]                         │
├─────────────────────────────────────────────────┤
│         [Ajouter tout]                          │
└─────────────────────────────────────────────────┘
```

### État 4: Pendant "Ajouter tout"

```
┌─────────────────────────────────────────────────┐
│ 📁 CATÉGORIES DISPONIBLES (5/7 chargées)       │
├─────────────────────────────────────────────────┤
│ TypeScript          [✓] (20 questions)         │
│ React               [✓] (18 questions)         │
│ Node.js             [✓] (19 questions)         │
│ Next.js             [⏳ Chargement...]          │
│   Progression questions: ██████░░░░ 12/20      │
│ CSS                 [⏳ En attente]             │
│ Database            [⏳ En attente]             │
│ Entretien           [⏳ En attente]             │
├─────────────────────────────────────────────────┤
│ Progress Global: ███████░░░░░ 67/120 questions│
│ Catégories: 3/7 chargées                       │
│         [Annuler]                              │
└─────────────────────────────────────────────────┘
```

### État 5: Erreur lors du Chargement

```
┌─────────────────────────────────────────────────┐
│ 📁 CATÉGORIES DISPONIBLES (1/7 chargées)       │
├─────────────────────────────────────────────────┤
│ TypeScript          [✓] (20 questions)         │
│ React               [❌ Erreur]                │
│   Impossible de charger. [Retry]               │
│ Node.js             [+]                         │
│ Next.js             [+]                         │
│ CSS                 [+]                         │
│ Database            [+]                         │
│ Entretien           [+]                         │
├─────────────────────────────────────────────────┤
│         [Ajouter tout]                          │
└─────────────────────────────────────────────────┘
```

---

## Implémentation Détaillée

### Étape 1: Créer le Service de Gestion des Catégories

**Créer**: `src/services/categoryLoadingService.ts`

```typescript
/**
 * Service for managing category loading state and persistence
 */

import type { Question } from '@/types/models'
import { loadAllQuestionsFromJsonParallel, loadQuestionsFromJsonFile } from '@/db/loaders/questionsLoader'

export interface LoadedCategory {
  categoryId: string
  categoryLabel: string
  loaded: boolean
  questionCount: number
  loadedAt?: string
  error?: string
}

const LOADED_CATEGORIES_KEY = 'quiz-master-loaded-categories'

/**
 * Get loaded categories state from localStorage
 */
export function getLoadedCategoriesState(): Record<string, LoadedCategory> {
  try {
    const stored = localStorage.getItem(LOADED_CATEGORIES_KEY)
    return stored ? JSON.parse(stored) : getInitialState()
  } catch (err) {
    console.error('[CategoryLoadingService] Error reading loaded categories:', err)
    return getInitialState()
  }
}

/**
 * Get initial state (all categories not loaded)
 */
function getInitialState(): Record<string, LoadedCategory> {
  const CATEGORY_FILE_MAPPING: Record<string, string> = {
    'react': 'cat_react',
    'typescript': 'cat_typescript',
    'nodejs': 'cat_nodejs',
    'nextjs': 'cat_nextjs',
    'css': 'cat_css',
    'database': 'cat_database',
    'entretien': 'cat_entretien',
  }

  return Object.entries(CATEGORY_FILE_MAPPING).reduce(
    (acc, [file, id]) => ({
      ...acc,
      [file]: {
        categoryId: id,
        categoryLabel: file.charAt(0).toUpperCase() + file.slice(1),
        loaded: false,
        questionCount: 0,
      },
    }),
    {}
  )
}

/**
 * Save loaded categories state to localStorage
 */
export function saveLoadedCategoriesState(state: Record<string, LoadedCategory>): void {
  try {
    localStorage.setItem(LOADED_CATEGORIES_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('[CategoryLoadingService] Error saving loaded categories:', err)
  }
}

/**
 * Mark a category as loaded and save state
 */
export function markCategoryAsLoaded(
  categoryFile: string,
  questionCount: number,
  state: Record<string, LoadedCategory>
): Record<string, LoadedCategory> {
  const updated = {
    ...state,
    [categoryFile]: {
      ...state[categoryFile],
      loaded: true,
      questionCount,
      loadedAt: new Date().toISOString(),
      error: undefined,
    },
  }
  saveLoadedCategoriesState(updated)
  return updated
}

/**
 * Mark a category as having an error
 */
export function markCategoryAsError(
  categoryFile: string,
  error: string,
  state: Record<string, LoadedCategory>
): Record<string, LoadedCategory> {
  const updated = {
    ...state,
    [categoryFile]: {
      ...state[categoryFile],
      error,
    },
  }
  saveLoadedCategoriesState(updated)
  return updated
}

/**
 * Get number of loaded categories
 */
export function getLoadedCategoryCount(state: Record<string, LoadedCategory>): number {
  return Object.values(state).filter(cat => cat.loaded).length
}

/**
 * Get total questions loaded
 */
export function getTotalQuestionsLoaded(state: Record<string, LoadedCategory>): number {
  return Object.values(state).reduce((sum, cat) => sum + (cat.questionCount || 0), 0)
}
```

### Étape 2: Modifier le Loader pour Supporter le Progress

**Modifier**: `src/db/loaders/questionsLoader.ts`

```typescript
/**
 * Loader for question JSON files with progress tracking
 */

import type { Question } from '@/types/models'

// ... types et mappings existants ...

type ProgressCallback = (loaded: number, total: number) => void

/**
 * Charger un fichier JSON avec callback de progression
 */
async function loadQuestionsFromJsonFile(
  category: string,
  onProgress?: ProgressCallback
): Promise<Question[]> {
  try {
    const response = await fetch(`/questions/${category}.json`)
    if (!response.ok) {
      console.warn(`[QuestionsLoader] JSON not found for category: ${category}`)
      return []
    }

    const data: RawQuestion[] = await response.json()

    // Normaliser et ajouter les champs manquants
    const normalized: Question[] = data.map((q, index) => {
      // Appeler le callback de progression
      if (onProgress) {
        onProgress(index + 1, data.length)
      }

      return {
        ...q,
        categorie: CATEGORY_FILE_MAPPING[q.categorie] || q.categorie,
        countApparition: 0,
        countBonneReponse: 0,
      }
    })

    console.log(
      `[QuestionsLoader] Loaded ${normalized.length} questions from ${category}.json`
    )
    return normalized
  } catch (err) {
    console.error(`[QuestionsLoader] Error loading ${category}.json:`, err)
    throw err
  }
}

/**
 * Charger tous les fichiers JSON avec progression globale
 */
export async function loadAllQuestionsFromJsonParallel(
  onProgress?: ProgressCallback
): Promise<Question[]> {
  const categories = Object.keys(CATEGORY_FILE_MAPPING)
  const promises = categories.map(category =>
    loadQuestionsFromJsonFile(category, onProgress)
  )

  const results = await Promise.all(promises)
  const allQuestions = results.flat()

  console.log(
    `[QuestionsLoader] Total: ${allQuestions.length} questions loaded from JSON files`
  )
  return allQuestions
}

// Export les deux versions
export { loadQuestionsFromJsonFile, loadAllQuestionsFromJsonParallel }
```

### Étape 3: Créer le Composant Import avec Catégories

**Créer/Modifier**: `src/views/settings/Import.vue`

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import { useRouter } from 'vue-router'
import {
  getLoadedCategoriesState,
  markCategoryAsLoaded,
  markCategoryAsError,
  getLoadedCategoryCount,
  getTotalQuestionsLoaded,
  type LoadedCategory,
} from '@/services/categoryLoadingService'
import { loadQuestionsFromJsonFile } from '@/db/loaders/questionsLoader'
import { questionRepository } from '@/db/repositories'

const router = useRouter()
const dataStore = useDataStore()

// State
const loadedCategoriesState = ref<Record<string, LoadedCategory>>({})
const isLoading = ref(false)
const currentLoadingCategory = ref<string | null>(null)
const currentProgress = ref({ loaded: 0, total: 0 })
const globalProgress = ref({ loaded: 0, total: 0 })
const error = ref<string | null>(null)
const loadingAll = ref(false)
const cancelLoading = ref(false)

// Computed
const categoriesList = computed(() => {
  return Object.entries(loadedCategoriesState.value).map(([file, data]) => ({
    file,
    ...data,
  }))
})

const loadedCategoryCount = computed(() => {
  return Object.values(loadedCategoriesState.value).filter(cat => cat.loaded).length
})

const totalCategoryCount = computed(() => {
  return Object.keys(loadedCategoriesState.value).length
})

const totalQuestionsLoaded = computed(() => {
  return getTotalQuestionsLoaded(loadedCategoriesState.value)
})

// Lifecycle
onMounted(() => {
  loadedCategoriesState.value = getLoadedCategoriesState()
})

// Methods

/**
 * Load a single category
 */
async function loadCategory(categoryFile: string) {
  try {
    isLoading.value = true
    currentLoadingCategory.value = categoryFile
    currentProgress.value = { loaded: 0, total: 0 }
    error.value = null

    const onProgress = (loaded: number, total: number) => {
      currentProgress.value = { loaded, total }
    }

    const questions = await loadQuestionsFromJsonFile(categoryFile, onProgress)

    if (questions.length > 0) {
      // Sauvegarder dans IndexedDB
      await questionRepository.saveMany(questions)

      // Marquer comme chargée
      loadedCategoriesState.value = markCategoryAsLoaded(
        categoryFile,
        questions.length,
        loadedCategoriesState.value
      )

      console.log(`[Import] Category ${categoryFile} loaded with ${questions.length} questions`)
    } else {
      throw new Error(`No questions found in ${categoryFile}.json`)
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[Import] Error loading category ${categoryFile}:`, err)

    loadedCategoriesState.value = markCategoryAsError(
      categoryFile,
      errorMsg,
      loadedCategoriesState.value
    )

    error.value = `Erreur lors du chargement de ${categoryFile}: ${errorMsg}`
  } finally {
    isLoading.value = false
    currentLoadingCategory.value = null
  }
}

/**
 * Retry loading a failed category
 */
async function retryCategory(categoryFile: string) {
  // Réinitialiser l'erreur
  loadedCategoriesState.value = {
    ...loadedCategoriesState.value,
    [categoryFile]: {
      ...loadedCategoriesState.value[categoryFile],
      error: undefined,
    },
  }
  await loadCategory(categoryFile)
}

/**
 * Load all categories sequentially
 */
async function loadAllCategories() {
  try {
    loadingAll.value = true
    cancelLoading.value = false
    error.value = null

    const categories = Object.keys(loadedCategoriesState.value).filter(
      cat => !loadedCategoriesState.value[cat].loaded
    )

    for (let i = 0; i < categories.length; i++) {
      if (cancelLoading.value) break

      const categoryFile = categories[i]
      currentLoadingCategory.value = categoryFile

      try {
        const onProgress = (loaded: number, total: number) => {
          currentProgress.value = { loaded, total }
          // Calculer la progression globale
          const previousLoaded = getTotalQuestionsLoaded(loadedCategoriesState.value)
          globalProgress.value = {
            loaded: previousLoaded + loaded,
            total: 120, // Nombre total estimé
          }
        }

        const questions = await loadQuestionsFromJsonFile(categoryFile, onProgress)

        if (questions.length > 0) {
          await questionRepository.saveMany(questions)
          loadedCategoriesState.value = markCategoryAsLoaded(
            categoryFile,
            questions.length,
            loadedCategoriesState.value
          )
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        loadedCategoriesState.value = markCategoryAsError(
          categoryFile,
          errorMsg,
          loadedCategoriesState.value
        )
        console.error(`[Import] Error loading ${categoryFile}:`, err)
      }
    }
  } finally {
    loadingAll.value = false
    currentLoadingCategory.value = null
  }
}

/**
 * Cancel loading all
 */
function cancelLoadAll() {
  cancelLoading.value = true
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Catégories Disponibles -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-900">
          📁 Catégories Disponibles ({{ loadedCategoryCount }}/{{ totalCategoryCount }})
        </h2>
      </div>

      <!-- Liste des Catégories -->
      <div class="space-y-2">
        <div
          v-for="category in categoriesList"
          :key="category.file"
          class="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
        >
          <div class="flex-1">
            <p class="font-medium text-slate-900 capitalize">{{ category.categoryLabel }}</p>
            <p v-if="category.loaded" class="text-sm text-slate-500">
              ✓ {{ category.questionCount }} questions
            </p>
            <p v-else-if="category.error" class="text-sm text-red-600">
              ❌ {{ category.error }}
            </p>
          </div>

          <!-- Progress Bar lors du chargement -->
          <div v-if="currentLoadingCategory === category.file" class="flex-1 mx-4">
            <div class="text-xs text-slate-600 mb-1">
              {{ currentProgress.loaded }}/{{ currentProgress.total }}
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div
                class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                :style="{
                  width:
                    currentProgress.total > 0
                      ? `${(currentProgress.loaded / currentProgress.total) * 100}%`
                      : '0%',
                }"
              ></div>
            </div>
          </div>

          <!-- Button -->
          <div class="ml-4">
            <button
              v-if="category.loaded"
              disabled
              class="px-4 py-2 bg-slate-300 text-slate-600 rounded-lg font-medium cursor-not-allowed opacity-60"
            >
              ✓
            </button>
            <button
              v-else-if="category.error"
              @click="retryCategory(category.file)"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
            >
              Retry
            </button>
            <button
              v-else
              @click="loadCategory(category.file)"
              :disabled="isLoading || loadingAll"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <!-- Erreur Globale -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Bouton Ajouter Tout -->
      <div class="pt-4 border-t border-slate-200">
        <button
          v-if="!loadingAll"
          @click="loadAllCategories"
          :disabled="loadedCategoryCount === totalCategoryCount || isLoading"
          class="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter tout
        </button>
        <button
          v-else
          @click="cancelLoadAll"
          class="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
        >
          Annuler
        </button>
      </div>

      <!-- Global Progress Bar lors du "Ajouter tout" -->
      <div v-if="loadingAll" class="space-y-3 pt-4 border-t border-slate-200">
        <div>
          <p class="text-sm font-medium text-slate-900 mb-2">
            Catégories: {{ loadedCategoryCount + (currentLoadingCategory ? 1 : 0) }}/{{
              totalCategoryCount
            }}
          </p>
          <div class="w-full bg-slate-200 rounded-full h-3">
            <div
              class="bg-blue-600 h-3 rounded-full transition-all duration-300"
              :style="{
                width: `${((loadedCategoryCount + (currentLoadingCategory ? 1 : 0)) / totalCategoryCount) * 100}%`,
              }"
            ></div>
          </div>
        </div>

        <div>
          <p class="text-sm font-medium text-slate-900 mb-2">
            Questions: {{ totalQuestionsLoaded }}/120
          </p>
          <div class="w-full bg-slate-200 rounded-full h-3">
            <div
              class="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              :style="{ width: `${(totalQuestionsLoaded / 120) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Import Existante -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
      <h2 class="text-lg font-bold text-slate-900">📤 Importer des Questions</h2>
      <p class="text-slate-600">Importer un fichier JSON avec des questions personnalisées</p>
      <!-- ... reste du formulaire d'import existant ... -->
    </div>
  </div>
</template>
```

### Étape 4: Modifier `useDataStore.ts`

```typescript
import { loadAllQuestionsFromJsonParallel } from '@/db/loaders/questionsLoader'
import { getLoadedCategoriesState } from '@/services/categoryLoadingService'

async function initData() {
  try {
    // ============ QUESTIONS ============
    const loadedQuestions = await questionRepository.getAll()

    if (loadedQuestions.length === 0) {
      console.log('[DataStore] No questions in IndexedDB')
      // Les questions seront chargées via l'UI d'import
      questions.value = []
    } else {
      console.log(
        `[DataStore] Loaded ${loadedQuestions.length} questions from IndexedDB`
      )
      questions.value = loadedQuestions
    }

    // ============ CATEGORIES ============
    const loadedCategories = await categoryRepository.getAll()
    if (loadedCategories.length === 0) {
      console.log('[DataStore] Loading default categories...')
      categories.value = DEFAULT_CATEGORIES
      await categoryRepository.saveMany(DEFAULT_CATEGORIES)
    } else {
      categories.value = loadedCategories
    }

    // ============ BADGES ============
    let loadedBadges = await metaRepository.getBadges()
    if (loadedBadges.length === 0) {
      console.log('[DataStore] Loading default badges...')
      await metaRepository.saveBadges(DEFAULT_BADGES)
      loadedBadges = DEFAULT_BADGES
    }
    badges.value = loadedBadges

    isLoading.value = false
    console.log('[DataStore] Data initialization complete')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error initializing data:', err)
    isLoading.value = false
  }
}
```

---

## Flow Utilisateur Complet

### Scénario: Premier Lancement

```
1. App démarre
   → Aucune question en IndexedDB
   → Aucune catégorie chargée

2. Utilisateur va sur /settings/import
   → Voit bloc "Catégories Disponibles (0/7)"
   → Voit 7 boutons "+" (un par catégorie)
   → Voit bouton "Ajouter tout"

3. Utilisateur clic sur "+" pour React
   → Progressbar s'affiche: 0/18 → 18/18
   → Bouton devient grisé avec ✓
   → État persiste dans localStorage

4. Utilisateur clic sur "+" pour TypeScript
   → Progressbar s'affiche: 0/20 → 20/20
   → Bouton devient grisé avec ✓
   → Bloc affiche "2/7 catégories"

5. Utilisateur clic sur "Ajouter tout"
   → Double progressbar affiche:
     - Catégories: 2/7 → 3/7 → ... → 7/7
     - Questions: 38/120 → 60/120 → ... → 120/120
   → Chaque catégorie se charge séquentiellement
   → Boutons deviennent grisés avec ✓ au fur et à mesure

6. Chargement terminé
   → "Catégories Disponibles (7/7 chargées)"
   → Tous les boutons grisés avec ✓
   → 120 questions disponibles pour les quiz
   → État persisté dans localStorage

7. Utilisateur recharge la page
   → Import.vue recharge l'état depuis localStorage
   → Voit immédiatement "7/7 chargées"
   → Aucun re-chargement des questions
```

---

## Structure des Fichiers

```
src/
├── db/
│   ├── loaders/
│   │   └── questionsLoader.ts        (MODIFIÉ - add onProgress)
│   └── repositories.ts               (existant)
├── services/
│   └── categoryLoadingService.ts     (NOUVEAU)
├── stores/
│   └── useDataStore.ts               (MODIFIÉ - simplifié)
└── views/
    └── settings/
        └── Import.vue                (MODIFIÉ - ajout bloc catégories)
```

---

## Gestion des Erreurs Détaillée

### Erreur lors du Fetch

```typescript
// Cas: Fichier JSON manquant
try {
  const response = await fetch(`/questions/${category}.json`)
  if (!response.ok) throw new Error('File not found')
} catch (err) {
  // Afficher message + bouton Retry
  loadedCategoriesState = markCategoryAsError(category, err.message, state)
  // Utilisateur peut cliquer Retry
}
```

### Erreur lors du Parse

```typescript
// Cas: JSON malformé
try {
  const data = await response.json()
} catch (err) {
  // Même gestion: message + Retry
}
```

### Erreur lors de la Sauvegarde IndexedDB

```typescript
// Cas: IndexedDB échoue
try {
  await questionRepository.saveMany(questions)
} catch (err) {
  // Message + Retry
  // Questions ne sont pas marquées comme chargées
}
```

---

## Persistence de l'État

### Stockage

```typescript
// localStorage['quiz-master-loaded-categories']
{
  "react": {
    "categoryId": "cat_react",
    "categoryLabel": "React",
    "loaded": true,
    "questionCount": 18,
    "loadedAt": "2025-11-27T10:30:00Z"
  },
  "typescript": {
    "categoryId": "cat_typescript",
    "categoryLabel": "TypeScript",
    "loaded": true,
    "questionCount": 20,
    "loadedAt": "2025-11-27T10:31:00Z"
  },
  // ... etc
}
```

### Avantages

- ✅ Charge après page refresh
- ✅ Différencie les catégories chargées
- ✅ Permet de savoir lesquelles recharger
- ✅ Persiste entre les sessions

---

## Performance

### Chargement d'une Catégorie

```
Temps estimé: 100-150ms par catégorie
├─ Fetch JSON: ~50ms
├─ Parse: ~20ms
├─ Normaliser: ~10ms
└─ IndexedDB save: ~30ms

Affichage du bouton grisé: instantané
```

### "Ajouter tout" (7 catégories)

```
Temps estimé: 700-1000ms total (séquentiel)
├─ React: 100ms → ✓ chargée
├─ TypeScript: 100ms → ✓ chargée
├─ Node.js: 100ms → ✓ chargée
├─ Next.js: 100ms → ✓ chargée
├─ CSS: 100ms → ✓ chargée
├─ Database: 100ms → ✓ chargée
└─ Entretien: 100ms → ✓ chargée

Après: 120 questions en IndexedDB
```

---

## Checklist de Mise en Œuvre

### Avant de Commencer

- [ ] Vérifier 7 fichiers JSON existent dans `/questions/`
- [ ] Vérifier format de chaque JSON
- [ ] Vérifier Vue Router a route `/settings/import`

### Implémentation

- [ ] Créer `src/services/categoryLoadingService.ts`
- [ ] Modifier `src/db/loaders/questionsLoader.ts` (add onProgress)
- [ ] Modifier `src/views/settings/Import.vue` (add bloc catégories)
- [ ] Modifier `useDataStore.ts` (simplifier initData)
- [ ] Vérifier imports et types TypeScript

### Testing

- [ ] Effacer localStorage et IndexedDB
- [ ] Aller sur `/settings/import`
- [ ] Vérifier bloc "Catégories Disponibles (0/7)"
- [ ] Cliquer "+" sur React
  - [ ] Progressbar s'affiche
  - [ ] Bouton devient grisé ✓
  - [ ] localStorage mis à jour
- [ ] Cliquer "Ajouter tout"
  - [ ] Double progressbar s'affiche
  - [ ] Catégories se chargent séquentiellement
  - [ ] Bloc affiche "7/7 chargées"
- [ ] Recharger la page
  - [ ] État persiste (7/7)
  - [ ] Aucun re-chargement
- [ ] Créer un quiz
  - [ ] 120 questions disponibles
  - [ ] Toutes les catégories présentes
- [ ] Cliquer "+" de nouveau (permet recharge)
  - [ ] Questions remplacées
  - [ ] Progressbar s'affiche

### Build & Deploy

- [ ] `npm run build` (doit passer)
- [ ] `npm run preview`
- [ ] Tester complet en production build

---

## Résumé

| Aspect | Détail |
|--------|--------|
| **Source de données** | JSON files (`/questions/*.json`) |
| **Stockage persistant** | IndexedDB + localStorage |
| **Interface** | `/settings/import` avec bloc catégories |
| **Chargement** | Individuel ou "Ajouter tout" |
| **Progress** | Double progressbar (catégories + questions) |
| **Erreurs** | Gestion avec Retry + message |
| **Persistence** | localStorage (état des catégories) |
| **Total questions** | 120 |
| **Catégories** | 7 |
| **Recharge** | Autorisée (remplace questions) |

---

## Prochaines Étapes

1. **Créer** `src/services/categoryLoadingService.ts`
2. **Modifier** `src/db/loaders/questionsLoader.ts`
3. **Modifier** `src/views/settings/Import.vue`
4. **Modifier** `useDataStore.ts`
5. **Tester** complet (premier lancement + recharge)
6. **Build & deploy** `npm run build && npm run preview`

---

**Plan Complet avec UI/UX pour Chargement Progressif des Catégories** ✅
