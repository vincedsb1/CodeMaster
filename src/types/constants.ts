/**
 * Constants, enums, and default data for Quiz Master
 */

import type { Badge, Category, Question, TailwindColor } from './models'

export const DB_CONFIG = {
  NAME: 'quiz-master-db',
  VERSION: 3,
  STORES: {
    QUESTIONS: 'questions',
    SESSIONS: 'sessions',
    META: 'meta',
    CATEGORIES: 'categories',
  },
}

// Unified Category Configuration
export const CATEGORY_CONFIG: Record<string, { id: string; label: string; icon: string; color: TailwindColor; fileName: string }> = {
  typescript: { id: 'cat_typescript', label: 'TypeScript', icon: 'Code', color: 'blue', fileName: 'typescript' },
  react: { id: 'cat_react', label: 'React', icon: 'Code', color: 'cyan', fileName: 'react' },
  nextjs: { id: 'cat_nextjs', label: 'Next.js', icon: 'Rocket', color: 'slate', fileName: 'nextjs' },
  nodejs: { id: 'cat_nodejs', label: 'Node.js', icon: 'Cpu', color: 'green', fileName: 'nodejs' },
  css: { id: 'cat_css', label: 'CSS', icon: 'Palette', color: 'purple', fileName: 'css' },
  javascript: { id: 'cat_javascript', label: 'JavaScript', icon: 'Code', color: 'yellow', fileName: 'javascript' },
  entretiens: { id: 'cat_entretiens', label: 'Entretiens', icon: 'Chat', color: 'indigo', fileName: 'entretiens' },
}

export const DEFAULT_CATEGORIES: Category[] = Object.values(CATEGORY_CONFIG).map(c => ({
  id: c.id,
  label: c.label,
  icon: c.icon,
  color: c.color
}))

export const DEFAULT_QUESTIONS: Question[] = []

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first_quiz',
    nom: 'Premier Pas',
    description: 'Terminer un premier quiz',
    statut: 'verrouille',
    icon: '🐣',
  },
  {
    id: 'perfect_score',
    nom: 'Perfection',
    description: 'Obtenir 100% à un quiz',
    statut: 'verrouille',
    icon: '🎯',
  },
  {
    id: 'streak_3',
    nom: 'Habitué',
    description: '3 jours de suite',
    statut: 'verrouille',
    icon: '🔥',
  },
  {
    id: 'streak_7',
    nom: 'Accro',
    description: '7 jours de suite',
    statut: 'verrouille',
    icon: '⚡',
  },
  {
    id: 'marathon',
    nom: 'Marathonien',
    description: 'Faire 20 quiz au total',
    statut: 'verrouille',
    icon: '🏃',
  },
  {
    id: 'math_expert',
    nom: 'Boss des Maths',
    description: '5 quiz de Maths terminés',
    statut: 'verrouille',
    icon: '📐',
  },
]

export const DIFFICULTY_POINTS: Record<string, number> = {
  facile: 1,
  moyen: 2,
  difficile: 3,
}

export const DIFFICULTY_COLORS = {
  facile: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-700',
  },
  moyen: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  difficile: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-700',
  },
}

export function getCategoryLabel(key: string): string {
  // Check if key matches an ID or fileName in config
  const config = Object.values(CATEGORY_CONFIG).find(c => c.id === key || c.fileName === key || c.label === key)
  return config ? config.label : key
}
