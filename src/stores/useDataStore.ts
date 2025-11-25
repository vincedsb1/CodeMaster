/**
 * Data Store - Manages static data (Questions, Badges)
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Question, Badge } from '@/types/models'
import { DEFAULT_QUESTIONS, DEFAULT_BADGES } from '@/types/constants'
import { questionRepository, metaRepository } from '@/db/repositories'

export const useDataStore = defineStore('data', () => {
  // State
  const questions = ref<Question[]>([])
  const badges = ref<Badge[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function initData() {
    isLoading.value = true
    error.value = null

    try {
      // Load questions from DB
      let qs = await questionRepository.getAll()

      if (qs.length === 0) {
        // First time: load defaults
        await questionRepository.saveMany(DEFAULT_QUESTIONS)
        qs = DEFAULT_QUESTIONS
      }

      questions.value = qs

      // Load badges from meta store
      let bdgs = await metaRepository.getBadges()

      if (bdgs.length === 0) {
        // First time: load defaults
        await metaRepository.saveBadges(DEFAULT_BADGES)
        bdgs = DEFAULT_BADGES
      }

      badges.value = bdgs
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des données'
      console.error('Data init error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function importQuestions(json: any[]) {
    error.value = null

    try {
      // Validation
      if (!Array.isArray(json)) {
        throw new Error('Le fichier doit contenir un tableau JSON')
      }

      if (json.length === 0) {
        throw new Error('Le fichier est vide')
      }

      const firstQuestion = json[0]
      if (
        !firstQuestion.intitule ||
        !firstQuestion.reponses ||
        firstQuestion.indexBonneReponse === undefined ||
        !firstQuestion.categorie ||
        !firstQuestion.difficulte
      ) {
        throw new Error('Format invalide : propriétés requises manquantes')
      }

      // Normalize and save
      const normalized = json.map((q, idx) => ({
        id: q.id || `imported-${Date.now()}-${idx}`,
        intitule: q.intitule,
        reponses: q.reponses,
        indexBonneReponse: q.indexBonneReponse,
        explication: q.explication || '',
        categorie: q.categorie,
        difficulte: q.difficulte,
        countApparition: 0,
        countBonneReponse: 0,
      }))

      // Clear and reload
      await questionRepository.clear()
      await questionRepository.saveMany(normalized)
      questions.value = normalized

      return { success: true, count: normalized.length }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de l\'import'
      throw error.value
    }
  }

  async function resetBadges() {
    try {
      const resetBadges = badges.value.map((b) => ({
        ...b,
        statut: 'verrouille' as const,
        dateDebloque: null,
      }))
      await metaRepository.saveBadges(resetBadges)
      badges.value = resetBadges
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la réinitialisation'
      throw error.value
    }
  }

  async function updateBadges(newBadges: Badge[]) {
    try {
      badges.value = newBadges
      await metaRepository.saveBadges(newBadges)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour des badges'
      throw error.value
    }
  }

  return {
    // State
    questions,
    badges,
    isLoading,
    error,

    // Actions
    initData,
    importQuestions,
    resetBadges,
    updateBadges,
  }
})
