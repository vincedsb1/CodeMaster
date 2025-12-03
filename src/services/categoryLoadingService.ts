/**
 * Service for managing category loading state and persistence
 */

import type { Question } from '@/types/models'

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
    'javascript': 'cat_javascript',
    'entretiens': 'cat_entretiens',
  }

  const CATEGORY_LABELS: Record<string, string> = {
    'react': 'React',
    'typescript': 'TypeScript',
    'nodejs': 'Node.js',
    'nextjs': 'Next.js',
    'css': 'CSS',
    'javascript': 'JavaScript',
    'entretiens': 'Entretiens',
  }

  return Object.entries(CATEGORY_FILE_MAPPING).reduce(
    (acc, [file, id]) => ({
      ...acc,
      [file]: {
        categoryId: id,
        categoryLabel: CATEGORY_LABELS[file] || file.charAt(0).toUpperCase() + file.slice(1),
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
  const existing = state[categoryFile]
  if (!existing) {
    throw new Error(`Category ${categoryFile} not found in state`)
  }
  const updated: Record<string, LoadedCategory> = {
    ...state,
    [categoryFile]: {
      categoryId: existing.categoryId,
      categoryLabel: existing.categoryLabel,
      loaded: true,
      questionCount,
      loadedAt: new Date().toISOString(),
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
  const existing = state[categoryFile]
  if (!existing) {
    throw new Error(`Category ${categoryFile} not found in state`)
  }
  const updated: Record<string, LoadedCategory> = {
    ...state,
    [categoryFile]: {
      categoryId: existing.categoryId,
      categoryLabel: existing.categoryLabel,
      loaded: existing.loaded,
      questionCount: existing.questionCount,
      loadedAt: existing.loadedAt,
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
