/**
 * TypeScript Models and Interfaces for Quiz Master PWA
 */

export type Difficulty = 'facile' | 'moyen' | 'difficile' | 'random'
export type BadgeStatus = 'verrouille' | 'debloque'
export type TailwindColor = 'slate' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'blue' | 'indigo' | 'purple' | 'pink'

export interface Category {
  id: string
  label: string
  icon: string
  color: TailwindColor
}

export interface Question {
  id: string
  intitule: string
  reponses: string[]
  indexBonneReponse: number
  explication: string
  categorie: string
  difficulte: Exclude<Difficulty, 'random'>
  countApparition: number
  countBonneReponse: number
}

export interface SessionQuestion extends Question {
  ordreReponses: number[]
  estSkippe: boolean
  estCorrecte: boolean | null
}

export interface QuizSession {
  sessionId: string
  dateDebut: string
  dateFin: string | null
  questions: SessionQuestion[]
  indexQuestionCourante: number
  nbQuestions: number
  scorePondere: number
  scorePondereMax: number
  notePourcentage: number
  difficulteChoisie: Difficulty
  categories: string[]
  dateJour?: string
  isDailyChallenge?: boolean
}

export interface Badge {
  id: string
  nom: string
  description: string
  statut: BadgeStatus
  icon?: string
  dateDebloque?: string | null
}

export interface GlobalStats {
  moyenneGlobale: number
  meilleurScore: number
  streakActuel: number
  totalSessions: number
  historiqueSessions: QuizSession[]
  xp: number
  level: number
}

export interface ImportData {
  questions: any[]
}

export interface ComparisonStats {
  average: number
}
