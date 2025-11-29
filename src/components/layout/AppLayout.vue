<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { useQuizStore } from '@/stores/useQuizStore'
import { useRouter } from 'vue-router'

const quizStore = useQuizStore()
const router = useRouter()
const route = useRoute()

// Hide header on stats page (has its own navigation)
const showHeader = computed(() => !route.path.startsWith('/stats'))

function abandonResume() {
  quizStore.abandonSession()
  quizStore.showResumeModal = false
}

function confirmResume() {
  quizStore.resumePreviousSession()
  router.push('/quiz/active')
}
</script>

<template>
  <div
    class="h-dvh flex flex-col mx-auto w-full bg-white relative overflow-hidden"
  >
    <AppHeader v-if="showHeader" />

    <main class="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50">
      <router-view />
    </main>

    <!-- Resume Modal -->
    <BaseModal
      v-if="quizStore.showResumeModal"
      title="Quiz en cours"
      :show="quizStore.showResumeModal"
    >
      <template #default>
        <p class="text-slate-600 mb-6">Tu avais un quiz non terminé. Veux-tu le reprendre ?</p>
      </template>

      <template #actions>
        <button
          @click="abandonResume"
          class="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-lg"
        >
          Abandonner
        </button>
        <button
          @click="confirmResume"
          class="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-200"
        >
          Reprendre
        </button>
      </template>
    </BaseModal>
  </div>
</template>
