/**
 * Loader for question JSON files with progress tracking
 */

import type { Question, Difficulty } from '@/types/models'
import { logger } from '@/utils/logger'
import { CATEGORY_CONFIG } from '@/types/constants'

/**
 * Normalize category name to match mapping (handle case variations)
 */
function normalizeCategoryName(category: string): string {
  const normalized = category.toLowerCase().trim()

  // Find matching config
  const config = Object.values(CATEGORY_CONFIG).find(
    c => c.id === normalized || c.fileName === normalized || c.id === `cat_${normalized}`
  )

  if (config) {
    return config.id
  }

  // Handle variations like "Entretien" → "entretiens"
  const variations: Record<string, string> = {
    'entretien': 'cat_entretiens',
    'entretiens': 'cat_entretiens',
    'node.js': 'cat_nodejs',
    'node js': 'cat_nodejs',
    'next.js': 'cat_nextjs',
    'next js': 'cat_nextjs',
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
    logger.log(`[QuestionsLoader] Loading ${category}.json...`)
    const response = await fetch(`/questions/${category}.json`)
    logger.log(`[QuestionsLoader] Response status for ${category}.json: ${response.status}`)

    if (!response.ok) {
      logger.warn(`[QuestionsLoader] JSON not found for category: ${category}`)
      return []
    }

    const data: RawQuestion[] = await response.json()
    logger.log(`[QuestionsLoader] Parsed JSON for ${category}.json, ${data.length} questions`)

    // Normalize and add missing fields
    // Find config for this category file
    const config = Object.values(CATEGORY_CONFIG).find(c => c.fileName === category)
    const categoryLabel = config ? config.label : category

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

    logger.log(`[QuestionsLoader] Loaded ${normalized.length} questions from ${category}.json`)
    return normalized
  } catch (err) {
    logger.error(`[QuestionsLoader] Error loading ${category}.json:`, err)
    throw err
  }
}

/**
 * Load all questions from JSON files in parallel
 */
export async function loadAllQuestionsFromJsonParallel(
  onProgress?: ProgressCallback
): Promise<Question[]> {
  // Derive categories from config where fileName is defined
  const categories = Object.values(CATEGORY_CONFIG)
    .map(c => c.fileName)
    .filter(Boolean)
  
  const promises = categories.map(category => loadQuestionsFromJsonFile(category, onProgress))

  const results = await Promise.all(promises)
  const allQuestions = results.flat()

  logger.log(`[QuestionsLoader] Total: ${allQuestions.length} questions loaded from JSON files`)
  return allQuestions
}
