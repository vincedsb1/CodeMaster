<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStatsStore } from '@/stores/useStatsStore'
import { AppRoutes } from '@/router/routes'
import { getTitleForLevel } from '@/logic/gamification'

const router = useRouter()
const statsStore = useStatsStore()

const avatars = ['🧑‍💻', '👩‍💻', '🚀', '🦊', '🦁', '🦄', '🤖', '👾', '👽', '👻', '🦸', '🦹', '🧙', '🧚', '🧛', '🧞']

const globalStats = computed(() => statsStore.globalStats)
const currentLevel = computed(() => globalStats.value.level || 1)
const currentTitle = computed(() => getTitleForLevel(currentLevel.value))
const currentAvatar = computed(() => globalStats.value.avatar || '🧑‍💻')

const selectedAvatar = ref(currentAvatar.value)

function selectAvatar(avatar: string) {
  selectedAvatar.value = avatar
}

async function saveProfile() {
  await statsStore.updateAvatar(selectedAvatar.value)
  router.back()
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="flex flex-col bg-slate-50 text-slate-900 min-h-screen">
    <!-- Navigation Bar (Fixed) -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200/50">
      <div class="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between h-14">
        <button @click="goBack"
                class="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-slate-100/50 active:scale-90 transition-all text-slate-900">
          <i class="ph ph-caret-left text-xl"></i>
        </button>

        <h1 class="text-[17px] font-semibold text-slate-900">Profil</h1>

        <div class="w-10"></div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow pt-20 pb-12 px-6 max-w-2xl mx-auto w-full space-y-8 animate-fade-in">
      
      <!-- Current Info -->
      <div class="text-center space-y-2">
        <div class="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-5xl shadow-inner border-4 border-white mb-4">
          {{ selectedAvatar }}
        </div>
        <h2 class="text-2xl font-bold text-slate-900">{{ currentTitle }}</h2>
        <p class="text-indigo-600 font-semibold">Niveau {{ currentLevel }}</p>
      </div>

      <!-- Avatar Selection -->
      <section class="space-y-4">
        <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Choisir un avatar</h3>
        <div class="grid grid-cols-4 gap-4">
          <button v-for="avatar in avatars" :key="avatar"
                  @click="selectAvatar(avatar)"
                  class="aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-200 active:scale-95 border-2"
                  :class="selectedAvatar === avatar 
                    ? 'bg-white border-indigo-500 shadow-md scale-105' 
                    : 'bg-white border-transparent hover:border-indigo-200'">
            {{ avatar }}
          </button>
        </div>
      </section>

    </main>

    <!-- Action Buttons (Fixed Bottom) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-md border-t border-white/30 px-6 py-4 z-50">
      <div class="max-w-2xl mx-auto">
        <button @click="saveProfile"
                class="w-full rounded-full px-4 py-3.5 font-semibold text-[15px] bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200 transition-all duration-200">
          Enregistrer
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
