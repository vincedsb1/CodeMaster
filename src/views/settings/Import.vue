<script setup lang="ts">
import { ref } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import { useStatsStore } from '@/stores/useStatsStore'
import { sessionRepository } from '@/db/repositories'

const dataStore = useDataStore()
const statsStore = useStatsStore()

const importMessage = ref('')
const importError = ref(false)

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const json = JSON.parse(e.target?.result as string)
      const result = await dataStore.importQuestions(json)
      importMessage.value = `Import réussi ! ${result.count} questions chargées.`
      importError.value = false
      target.value = ''
    } catch (err) {
      importMessage.value = err instanceof Error ? err.message : 'Erreur lors de l\'import'
      importError.value = true
    }
  }
  reader.readAsText(file)
}

async function resetStats() {
  if (!confirm('Vraiment tout effacer ? (Les questions restent)')) return

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
</script>

<template>
  <div class="p-4 space-y-6 h-full overflow-y-auto">
    <h2 class="text-xl font-bold">Gestion des données</h2>

    <!-- Import Section -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
      <h3 class="font-bold text-slate-700">Importer des questions</h3>
      <p class="text-sm text-slate-500">
        Le fichier doit être un JSON valide contenant un tableau de questions.
      </p>
      <input
        type="file"
        accept=".json"
        @change="handleFileUpload"
        class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
      <p
        v-if="importMessage"
        :class="importError ? 'text-red-500' : 'text-green-500'"
        class="text-sm font-bold"
      >
        {{ importMessage }}
      </p>
    </div>

    <!-- Danger Zone -->
    <div class="bg-red-50 p-4 rounded-xl border border-red-100 space-y-4">
      <h3 class="font-bold text-red-800">Zone de danger</h3>
      <button
        @click="resetStats"
        class="w-full py-2 px-4 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-100 transition"
      >
        Réinitialiser toutes les stats
      </button>
    </div>

    <div class="h-4"></div>
  </div>
</template>
