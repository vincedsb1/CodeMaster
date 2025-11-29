<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import { useStatsStore } from '@/stores/useStatsStore'
import { sessionRepository } from '@/db/repositories'
import { useRouter } from 'vue-router'
import {
  getLoadedCategoriesState,
  markCategoryAsLoaded,
  markCategoryAsError,
  getTotalQuestionsLoaded,
  type LoadedCategory,
} from '@/services/categoryLoadingService'
import { loadQuestionsFromJsonFile } from '@/db/loaders/questionsLoader'
import { questionRepository } from '@/db/repositories'

const router = useRouter()
const dataStore = useDataStore()
const statsStore = useStatsStore()

// Import message state
const importMessage = ref('')
const importError = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Category loading state
const loadedCategoriesState = ref<Record<string, LoadedCategory>>({})
const isLoading = ref(false)
const currentLoadingCategory = ref<string | null>(null)
const currentProgress = ref({ loaded: 0, total: 0 })
const globalProgress = ref({ loaded: 0, total: 0 })
const categoryError = ref<string | null>(null)
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

const categoriesProgressPercent = computed(() => {
  if (totalCategoryCount.value === 0) return 0
  const current = loadedCategoryCount.value + (currentLoadingCategory.value ? 1 : 0)
  return (current / totalCategoryCount.value) * 100
})

const getProgressPercent = (progress: { loaded: number; total: number }) => {
  if (progress.total === 0) return 0
  return (progress.loaded / progress.total) * 100
}

const getCategoryClass = (category: any) => {
  if (category.loaded) return 'bg-green-50/40 border-green-200/60'
  if (category.error) return 'bg-red-50/40 border-red-200/60'
  return 'bg-white border-slate-200/60'
}

// Lifecycle
onMounted(() => {
  loadedCategoriesState.value = getLoadedCategoriesState()
  console.log('[Import] Loaded categories state:', loadedCategoriesState.value)
})

// Methods for JSON file upload
async function handleFileUpload(event: Event) {
  console.log('[Import] handleFileUpload called')
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  console.log('[Import] File selected:', file?.name)
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      console.log('[Import] File read, parsing JSON...')
      const json: Array<Record<string, unknown>> = JSON.parse(e.target?.result as string)
      console.log('[Import] JSON parsed, questions count:', json.length)

      // Store JSON in sessionStorage and navigate to category selection page
      sessionStorage.setItem('pendingImportJson', JSON.stringify(json))
      console.log('[Import] Navigating to category selection')
      router.push({ name: 'settings-select-category' })
    } catch (err) {
      console.error('[Import] Error parsing JSON:', err)
      importMessage.value = err instanceof Error ? err.message : 'Erreur lors du parsing du JSON'
      importError.value = true
      target.value = ''
    }
  }
  reader.readAsText(file)
}

async function resetStats() {
  if (!confirm('Vraiment tout effacer ? Cette action est irréversible.')) return

  try {
    // Clear sessions
    await sessionRepository.clear()

    // Reset badges
    await dataStore.resetBadges()

    // Reload stats
    await statsStore.loadStats()

    alert('Statistiques remises à zéro.')
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation')
  }
}

// Methods for category loading
async function loadCategory(categoryFile: string) {
  try {
    isLoading.value = true
    currentLoadingCategory.value = categoryFile
    currentProgress.value = { loaded: 0, total: 0 }
    categoryError.value = null

    const onProgress = (loaded: number, total: number) => {
      currentProgress.value = { loaded, total }
    }

    const questions = await loadQuestionsFromJsonFile(categoryFile, onProgress)

    if (questions.length > 0) {
      console.log(`[Import] Saving ${questions.length} questions to IndexedDB for ${categoryFile}...`)
      console.log(`[Import] Sample question:`, questions[0])
      await questionRepository.saveMany(questions)
      console.log(`[Import] Successfully saved ${questions.length} questions to IndexedDB`)

      loadedCategoriesState.value = markCategoryAsLoaded(
        categoryFile,
        questions.length,
        loadedCategoriesState.value
      )

      const verifyCount = await questionRepository.getAll()
      console.log(`[Import] Verified: ${verifyCount.length} total questions now in IndexedDB`)
      console.log(`[Import] Store has ${dataStore.questions.length} questions before reload`)

      console.log(`[Import] Reloading questions in store...`)
      await dataStore.reloadQuestions()
      console.log(`[Import] Store now has ${dataStore.questions.length} questions after reload`)

      const categorySet = new Set(dataStore.questions.map((q) => q.categorie))
      console.log(`[Import] Categories in store: ${Array.from(categorySet).join(', ')}`)

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

    categoryError.value = `Erreur lors du chargement de ${categoryFile}: ${errorMsg}`
  } finally {
    isLoading.value = false
    currentLoadingCategory.value = null
  }
}

async function retryCategory(categoryFile: string) {
  const existing = loadedCategoriesState.value[categoryFile]
  if (!existing) return

  loadedCategoriesState.value = {
    ...loadedCategoriesState.value,
    [categoryFile]: {
      categoryId: existing.categoryId,
      categoryLabel: existing.categoryLabel,
      loaded: existing.loaded,
      questionCount: existing.questionCount,
      loadedAt: existing.loadedAt,
    },
  }
  await loadCategory(categoryFile)
}

async function loadAllCategories() {
  try {
    loadingAll.value = true
    cancelLoading.value = false
    categoryError.value = null

    const categoriesToLoad = Object.keys(loadedCategoriesState.value).filter(
      cat => {
        const category = loadedCategoriesState.value[cat]
        return category && !category.loaded
      }
    )

    for (let i = 0; i < categoriesToLoad.length; i++) {
      if (cancelLoading.value) break

      const categoryFile = categoriesToLoad[i]
      if (!categoryFile) continue
      currentLoadingCategory.value = categoryFile

      try {
        const onProgress = (loaded: number, total: number) => {
          currentProgress.value = { loaded, total }
          const previousLoaded = getTotalQuestionsLoaded(loadedCategoriesState.value)
          globalProgress.value = {
            loaded: previousLoaded + loaded,
            total: 120,
          }
        }

        const questions = await loadQuestionsFromJsonFile(categoryFile, onProgress)

        if (questions.length > 0) {
          console.log(`[Import] [AddAll] Saving ${questions.length} questions from ${categoryFile}...`)
          await questionRepository.saveMany(questions)
          console.log(`[Import] [AddAll] Saved ${questions.length} questions from ${categoryFile}`)

          loadedCategoriesState.value = markCategoryAsLoaded(
            categoryFile,
            questions.length,
            loadedCategoriesState.value
          )

          const allQuestions = await questionRepository.getAll()
          console.log(`[Import] [AddAll] Total questions in IndexedDB: ${allQuestions.length}`)
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

    console.log(`[Import] [AddAll] Reloading all questions in store...`)
    await dataStore.reloadQuestions()

    console.log(`[Import] [AddAll] Final verification:`)
    console.log(`[Import] [AddAll] - Store has ${dataStore.questions.length} questions`)

    const finalCategories = new Set(dataStore.questions.map((q) => q.categorie))
    console.log(`[Import] [AddAll] - Categories loaded: ${Array.from(finalCategories).join(', ')}`)
    console.log(`[Import] [AddAll] ✓ IMPORT COMPLETE - Refresh Home to see categories`)
  } finally {
    loadingAll.value = false
    currentLoadingCategory.value = null
  }
}

function cancelLoadAll() {
  cancelLoading.value = true
}

</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <!-- Main Content -->
    <main class="flex-grow pt-6 pb-12 px-6 max-w-2xl mx-auto w-full space-y-8 opacity-0 animate-page-enter">

      <!-- Page Title Section -->
      <section class="space-y-2 pt-2">
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">Gestion des données</h1>
        <p class="text-[15px] text-slate-600 leading-relaxed font-medium">
          Charger les catégories de questions, importer des questions personnalisées, ou gérer vos statistiques.
        </p>
      </section>

      <!-- Available Categories Section -->
      <section>
        <div class="rounded-[24px] bg-white/60 backdrop-blur-md border border-gray-200/50 p-6 space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">

          <!-- Header -->
          <div class="flex items-center justify-between">
            <h2 class="text-[17px] font-semibold text-slate-900 flex items-center gap-2">
              <i class="ph-fill ph-folder text-blue-600"></i>
              Catégories Disponibles
            </h2>
            <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {{ loadedCategoryCount }}/{{ totalCategoryCount }}
            </span>
          </div>

          <!-- Global Error Alert -->
          <div v-if="categoryError" class="rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-200/50 p-4 flex gap-3 animate-fade-in">
            <i class="ph-fill ph-warning text-red-600 text-xl flex-shrink-0 mt-0.5"></i>
            <div>
              <h4 class="font-semibold text-red-900 text-sm">Erreur de chargement</h4>
              <p class="text-xs text-red-700/90 mt-0.5 leading-relaxed">{{ categoryError }}</p>
            </div>
          </div>

          <!-- Categories List -->
          <div class="space-y-3">
            <div v-for="cat in categoriesList" :key="cat.file"
                 class="rounded-2xl border p-4 flex items-center justify-between gap-4 transition-all duration-300"
                 :class="getCategoryClass(cat)">

              <!-- Left: Info -->
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-slate-900 capitalize truncate text-[15px]">
                  {{ cat.categoryLabel }}
                </p>

                <!-- Subtext based on state -->
                <div class="mt-1">
                  <p v-if="cat.loaded" class="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <i class="ph-bold ph-check text-green-600"></i>
                    {{ cat.questionCount }} questions
                  </p>
                  <p v-else-if="cat.error" class="text-xs text-red-600 flex items-center gap-1.5 font-medium">
                    <i class="ph-bold ph-warning"></i>
                    Erreur réseau
                  </p>
                  <p v-else-if="currentLoadingCategory === cat.file" class="text-xs text-blue-600 font-medium">
                    Chargement en cours...
                  </p>
                  <p v-else class="text-xs text-slate-400 font-medium">
                    Prêt à charger
                  </p>
                </div>
              </div>

              <!-- Middle: Progress Bar (Active Loading) -->
              <div v-if="currentLoadingCategory === cat.file" class="w-24 sm:w-32 space-y-1.5 animate-fade-in">
                <div class="text-[10px] font-semibold text-slate-500 text-right">
                  {{ currentProgress.loaded }}/{{ currentProgress.total }}
                </div>
                <div class="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-600 transition-all duration-200 ease-out"
                       :style="{ width: getProgressPercent(currentProgress) + '%' }"></div>
                </div>
              </div>

              <!-- Right: Action Button -->
              <div class="flex-shrink-0" v-if="currentLoadingCategory !== cat.file">
                <button v-if="cat.loaded" disabled
                        class="w-8 h-8 rounded-full bg-green-100/50 border border-green-200 text-green-600 flex items-center justify-center cursor-default">
                  <i class="ph-bold ph-check text-base"></i>
                </button>

                <button v-else-if="cat.error" @click="retryCategory(cat.file)"
                        class="px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-xs hover:bg-orange-200 active:scale-95 transition-all">
                  <i class="ph-bold ph-arrow-clockwise mr-1"></i> Réessayer
                </button>

                <button v-else @click="loadCategory(cat.file)"
                        :disabled="isLoading || loadingAll"
                        class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:scale-100">
                  <i class="ph-bold ph-plus text-base"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Load All Section -->
          <div class="pt-4 border-t border-gray-100">
            <!-- Normal State -->
            <button v-if="!loadingAll"
                    @click="loadAllCategories"
                    :disabled="loadedCategoryCount === totalCategoryCount || isLoading"
                    class="w-full rounded-full px-6 py-3.5 bg-indigo-600 text-white font-semibold text-[15px]
                           hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2">
              <i class="ph-bold ph-lightning text-lg"></i>
              Tout ajouter
            </button>

            <!-- Loading All State -->
            <div v-else class="space-y-4 animate-fade-in">
              <button @click="cancelLoadAll"
                      class="w-full rounded-full px-6 py-3.5 bg-red-500 text-white font-semibold text-[15px]
                             hover:bg-red-600 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_12px_rgba(239,68,68,0.15)] flex items-center justify-center gap-2">
                <i class="ph-bold ph-x text-lg"></i>
                Annuler
              </button>

              <!-- Global Progress -->
              <div class="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <!-- Categories Progress -->
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-semibold text-slate-700">Catégories</span>
                    <span class="font-medium text-slate-500">
                      {{ loadedCategoryCount + (currentLoadingCategory ? 1 : 0) }}/{{ totalCategoryCount }}
                    </span>
                  </div>
                  <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 transition-all duration-300"
                         :style="{ width: categoriesProgressPercent + '%' }"></div>
                  </div>
                </div>

                <!-- Questions Progress -->
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-semibold text-slate-700">Questions chargées</span>
                    <span class="font-medium text-slate-500">{{ totalQuestionsLoaded }} total</span>
                  </div>
                  <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-500 transition-all duration-300"
                         :style="{ width: (totalQuestionsLoaded / 200 * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Import JSON Section -->
      <section>
        <div class="rounded-[24px] bg-white/60 backdrop-blur-md border border-gray-200/50 p-6 space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <h2 class="text-[17px] font-semibold text-slate-900 flex items-center gap-2">
            <i class="ph-fill ph-upload-simple text-blue-600"></i>
            Importer JSON personnalisé
          </h2>

          <p class="text-[13px] text-slate-500 leading-relaxed font-medium">
            Le fichier doit contenir un tableau d'objets avec : question, reponses[], bonneReponse, categorie, difficulte.
          </p>

          <div class="relative group">
            <input ref="fileInput" type="file" accept=".json" @change="handleFileUpload"
                   class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer" />
          </div>

          <div v-if="importMessage"
               class="text-[13px] font-semibold flex items-center gap-2 animate-fade-in"
               :class="importError ? 'text-red-600' : 'text-green-600'">
            <i :class="importError ? 'ph-fill ph-warning-circle' : 'ph-fill ph-check-circle'" class="text-lg"></i>
            {{ importMessage }}
          </div>
        </div>
      </section>

      <!-- Danger Zone -->
      <section class="pb-6">
        <div class="rounded-[24px] bg-red-50/50 border border-red-100 p-6 space-y-4">
          <h2 class="text-[17px] font-semibold text-red-900 flex items-center gap-2">
            <i class="ph-fill ph-warning-octagon text-red-600"></i>
            Zone de danger
          </h2>

          <p class="text-[13px] text-red-800/80 leading-relaxed font-medium">
            Cette action est irréversible. Elle supprimera toutes vos statistiques, sessions et badges, mais conservera les questions chargées.
          </p>

          <button @click="resetStats"
                  class="w-full rounded-full px-6 py-3.5 bg-white border border-red-200 text-red-600 font-semibold text-[15px]
                         hover:bg-red-50 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2">
            <i class="ph-bold ph-trash text-lg"></i>
            Réinitialiser toutes les stats
          </button>
        </div>
      </section>

    </main>

  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

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
</style>
