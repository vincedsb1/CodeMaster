/**
 * Application Routes Constants
 * Centralizes all route names to avoid magic strings and ensure consistency.
 */

export const AppRoutes = {
  Home: 'home',
  Quiz: {
    Difficulty: 'quiz-difficulty',
    Count: 'quiz-count',
    RandomConfig: 'quiz-randomconfig',
    Active: 'quiz-active',
    Summary: 'quiz-summary',
  },
  Stats: 'stats',
  Settings: {
    Import: 'settings-import',
    SelectCategory: 'settings-select-category',
    Categories: 'settings-categories',
    CategoryEdit: 'settings-categories-edit',
  },
} as const
