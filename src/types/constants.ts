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
    description: 'Complétez votre premier quiz',
    statut: 'verrouille',
    icon: '🐣',
  },
  {
    id: 'perfect_score',
    nom: 'Perfection',
    description: 'Obtenez 100% à un quiz',
    statut: 'verrouille',
    icon: '🎯',
  },
  {
    id: 'streak_3',
    nom: 'Habitué',
    description: 'Jouez 3 jours de suite',
    statut: 'verrouille',
    icon: '🔥',
  },
  {
    id: 'streak_7',
    nom: 'Accro',
    description: 'Jouez 7 jours de suite',
    statut: 'verrouille',
    icon: '⚡',
  },
  {
    id: 'streak_14',
    nom: 'Dévoué',
    description: 'Jouez 14 jours de suite',
    statut: 'verrouille',
    icon: '🗓️',
  },
  {
    id: 'streak_30',
    nom: 'Inarrêtable',
    description: 'Jouez 30 jours de suite',
    statut: 'verrouille',
    icon: '🚀',
  },
  {
    id: 'volume_10',
    nom: 'Explorateur',
    description: 'Terminez 10 quiz',
    statut: 'verrouille',
    icon: '🧭',
  },
  {
    id: 'volume_50',
    nom: 'Vétéran',
    description: 'Terminez 50 quiz',
    statut: 'verrouille',
    icon: '🎖️',
  },
  {
    id: 'marathon',
    nom: 'Marathonien',
    description: 'Terminez 100 quiz',
    statut: 'verrouille',
    icon: '🏃',
  },
  {
    id: 'score_1000',
    nom: 'Apprenti',
    description: 'Cumulez 1000 points d\'XP',
    statut: 'verrouille',
    icon: '⭐',
  },
  {
    id: 'score_5000',
    nom: 'Expert',
    description: 'Cumulez 5000 points d\'XP',
    statut: 'verrouille',
    icon: '🌟',
  },
  {
    id: 'hard_perfect',
    nom: 'Maître',
    description: '100% sur un quiz Difficile',
    statut: 'verrouille',
    icon: '👑',
  },
  {
    id: 'persistance',
    nom: 'Persévérant',
    description: 'Terminez un quiz même avec un score < 50%',
    statut: 'verrouille',
    icon: '🛡️',
  },
  {
    id: 'speedster',
    nom: 'Éclair',
    description: 'Quiz >10 questions, >80% score en < 2 min',
    statut: 'verrouille',
    icon: '⚡',
  },
  {
    id: 'explorer',
    nom: 'Aventurier',
    description: 'Jouez aux 3 niveaux de difficulté',
    statut: 'verrouille',
    icon: '🗺️',
  },
  {
    id: 'night_owl',
    nom: 'Oiseau de nuit',
    description: 'Terminez un quiz entre 2h et 5h du matin',
    statut: 'verrouille',
    icon: '🦉',
  },
  {
    id: 'early_bird',
    nom: 'Lève-tôt',
    description: 'Terminez un quiz entre 5h et 8h du matin',
    statut: 'verrouille',
    icon: '🌅',
  },
  {
    id: 'polyglot',
    nom: 'Polyglotte',
    description: 'Jouez à 3 catégories différentes',
    statut: 'verrouille',
    icon: '🗣️',
  },
  {
    id: 'focus',
    nom: 'Focus',
    description: '5 quiz de suite dans la même catégorie',
    statut: 'verrouille',
    icon: '🔬',
  },
  {
    id: 'weekend_warrior',
    nom: 'Guerrier du WE',
    description: 'Jouez Samedi et Dimanche',
    statut: 'verrouille',
    icon: '⚔️',
  },
  {
    id: 'daily_challenger',
    nom: 'Quotidien',
    description: 'Terminez un Défi Quotidien',
    statut: 'verrouille',
    icon: '📅',
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