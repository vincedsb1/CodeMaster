import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Layout
import AppLayout from '@/components/layout/AppLayout.vue'

// Quiz Views
import HomeView from '@/views/quiz/Home.vue'
import DifficultyView from '@/views/quiz/Difficulty.vue'
import CountView from '@/views/quiz/Count.vue'
import RandomConfigView from '@/views/quiz/RandomConfig.vue'
import QuizActiveView from '@/views/quiz/Active.vue'
import SummaryView from '@/views/quiz/Summary.vue'

// Other Views
import StatsView from '@/views/stats/Index.vue'
import ImportView from '@/views/settings/Import.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        redirect: '/home',
      },
      {
        path: 'home',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'quiz/difficulty',
        name: 'difficulty',
        component: DifficultyView,
      },
      {
        path: 'quiz/count',
        name: 'count',
        component: CountView,
      },
      {
        path: 'quiz/randomconfig',
        name: 'randomConfig',
        component: RandomConfigView,
      },
      {
        path: 'quiz/active',
        name: 'quiz-active',
        component: QuizActiveView,
      },
      {
        path: 'quiz/summary',
        name: 'summary',
        component: SummaryView,
      },
      {
        path: 'stats',
        name: 'stats',
        component: StatsView,
      },
      {
        path: 'settings/import',
        name: 'import',
        component: ImportView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
