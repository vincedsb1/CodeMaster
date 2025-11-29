/**
 * Loader for question JSON files with progress tracking
 */

import type { Question, Difficulty } from '@/types/models'

// Mapping between JSON filename and category ID
const CATEGORY_FILE_MAPPING: Record<string, string> = {
  'react': 'cat_react',
  'typescript': 'cat_typescript',
  'nodejs': 'cat_nodejs',
  'nextjs': 'cat_nextjs',
  'css': 'cat_css',
  'javascript': 'cat_javascript',
  'entretiens': 'cat_entretiens',
}

// Mapping between JSON filename and category label (display name)
const CATEGORY_LABEL_MAPPING: Record<string, string> = {
  'react': 'React',
  'typescript': 'TypeScript',
  'nodejs': 'Node.js',
  'nextjs': 'Next.js',
  'css': 'CSS',
  'javascript': 'JavaScript',
  'entretiens': 'Entretiens',
}

/**
 * Normalize category name to match mapping (handle case variations)
 */
function normalizeCategoryName(category: string): string {
  const normalized = category.toLowerCase().trim()

  // Direct mapping check
  if (CATEGORY_FILE_MAPPING[normalized]) {
    return CATEGORY_FILE_MAPPING[normalized]
  }

  // Handle variations like "Entretien" → "entretiens"
  const variations: Record<string, string> = {
    'entretien': 'cat_entretiens',
    'entretiens': 'cat_entretiens',
    'javascript': 'cat_javascript',
    'react': 'cat_react',
    'typescript': 'cat_typescript',
    'nodejs': 'cat_nodejs',
    'node.js': 'cat_nodejs',
    'node js': 'cat_nodejs',
    'nextjs': 'cat_nextjs',
    'next.js': 'cat_nextjs',
    'next js': 'cat_nextjs',
    'css': 'cat_css',
  }

  return variations[normalized] || `cat_${normalized}`
}

type ProgressCallback = (loaded: number, total: number) => void

interface RawQuestion {
  id: string
  intitule: string
  reponses: string[]
  indexBonneReponse: number
  difficulte: string
  explication?: string
  categorie: string
}

/**
 * Load questions from a single JSON file with progress tracking
 */
export async function loadQuestionsFromJsonFile(
  category: string,
  onProgress?: ProgressCallback
): Promise<Question[]> {
  try {
    console.log(`[QuestionsLoader] Loading ${category}.json...`)
    const response = await fetch(`/questions/${category}.json`)
    console.log(`[QuestionsLoader] Response status for ${category}.json: ${response.status}`)

    if (!response.ok) {
      console.warn(`[QuestionsLoader] JSON not found for category: ${category}`)
      return []
    }

    const data: RawQuestion[] = await response.json()
    console.log(`[QuestionsLoader] Parsed JSON for ${category}.json, ${data.length} questions`)

    // Normalize and add missing fields
    // Use the category label from the file mapping instead of the question's categorie
    const categoryLabel = CATEGORY_LABEL_MAPPING[category] || category
    const normalized: Question[] = data.map((q, index) => {
      // Call progress callback
      if (onProgress) {
        onProgress(index + 1, data.length)
      }

      return {
        ...q,
        explication: q.explication || '',
        difficulte: q.difficulte as Exclude<Difficulty, 'random'>,
        categorie: categoryLabel,  // Use the normalized label from file mapping
        countApparition: 0,
        countBonneReponse: 0,
      }
    })

    console.log(`[QuestionsLoader] Loaded ${normalized.length} questions from ${category}.json`)
    return normalized
  } catch (err) {
    console.error(`[QuestionsLoader] Error loading ${category}.json:`, err)
    throw err
  }
}

/**
 * Load all questions from JSON files in parallel
 */
export async function loadAllQuestionsFromJsonParallel(
  onProgress?: ProgressCallback
): Promise<Question[]> {
  const categories = Object.keys(CATEGORY_FILE_MAPPING)
  const promises = categories.map(category => loadQuestionsFromJsonFile(category, onProgress))

  const results = await Promise.all(promises)
  const allQuestions = results.flat()

  console.log(`[QuestionsLoader] Total: ${allQuestions.length} questions loaded from JSON files`)
  return allQuestions
}
