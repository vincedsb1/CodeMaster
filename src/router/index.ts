import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { AppRoutes } from '@/router/routes'

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
import ProfileView from '@/views/stats/Profile.vue'
import ImportView from '@/views/settings/Import.vue'
import SelectCategoryView from '@/views/settings/SelectCategory.vue'
import CategoriesView from '@/views/settings/Categories.vue'
import CategoryEditView from '@/views/settings/CategoryEdit.vue'

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
        name: AppRoutes.Home,
        component: HomeView,
      },
      {
        path: 'quiz/difficulty',
        name: AppRoutes.Quiz.Difficulty,
        component: DifficultyView,
      },
      {
        path: 'quiz/count',
        name: AppRoutes.Quiz.Count,
        component: CountView,
      },
      {
        path: 'quiz/randomconfig',
        name: AppRoutes.Quiz.RandomConfig,
        component: RandomConfigView,
      },
      {
        path: 'quiz/active',
        name: AppRoutes.Quiz.Active,
        component: QuizActiveView,
      },
      {
        path: 'quiz/summary',
        name: AppRoutes.Quiz.Summary,
        component: SummaryView,
      },
      {
        path: 'stats',
        name: AppRoutes.Stats,
        component: StatsView,
      },
      {
        path: 'profile',
        name: AppRoutes.Profile,
        component: ProfileView,
      },
      {
        path: 'settings/import',
        name: AppRoutes.Settings.Import,
        component: ImportView,
      },
      {
        path: 'settings/select-category',
        name: AppRoutes.Settings.SelectCategory,
        component: SelectCategoryView,
      },
      {
        path: 'settings/categories',
        name: AppRoutes.Settings.Categories,
        component: CategoriesView,
      },
      {
        path: 'settings/categories/edit',
        name: AppRoutes.Settings.CategoryEdit,
        component: CategoryEditView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
