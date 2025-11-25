<script setup lang="ts">
import { onMounted } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import { useQuizStore } from '@/stores/useQuizStore'

const dataStore = useDataStore()
const quizStore = useQuizStore()

onMounted(async () => {
  // Initialize data from IndexedDB
  await dataStore.initData()
  // Check if there's a pending quiz session to resume
  await quizStore.checkResumableSession()
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <transition name="slide" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
