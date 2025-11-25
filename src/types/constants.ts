/**
 * Constants, enums, and default data for Quiz Master
 */

import type { Question, Badge } from './models'

export const DB_CONFIG = {
  NAME: 'quiz-master-db',
  VERSION: 1,
  STORES: {
    QUESTIONS: 'questions',
    SESSIONS: 'sessions',
    META: 'meta',
  },
}

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: '1',
    intitule: 'Combien font 2 + 2 ?',
    reponses: ['3', '4', '5', '0'],
    indexBonneReponse: 1,
    explication: 'Mathématiques de base : 2 + 2 = 4',
    categorie: 'Maths',
    difficulte: 'facile',
    countApparition: 0,
    countBonneReponse: 0,
  },
  {
    id: '2',
    intitule: 'Capitale de la France ?',
    reponses: ['Lyon', 'Marseille', 'Paris', 'Bordeaux'],
    indexBonneReponse: 2,
    explication: 'Paris est la capitale et la plus grande ville de France.',
    categorie: 'Géographie',
    difficulte: 'facile',
    countApparition: 0,
    countBonneReponse: 0,
  },
  {
    id: '3',
    intitule: "Symbole chimique de l'Or ?",
    reponses: ['Ag', 'Au', 'Fe', 'Cu'],
    indexBonneReponse: 1,
    explication: 'Au vient du latin Aurum, qui signifie or.',
    categorie: 'Science',
    difficulte: 'moyen',
    countApparition: 0,
    countBonneReponse: 0,
  },
  {
    id: '4',
    intitule: 'Qui a peint la Joconde ?',
    reponses: ['Michel-Ange', 'Van Gogh', 'Léonard de Vinci', 'Picasso'],
    indexBonneReponse: 2,
    explication: 'Léonard de Vinci a peint la Joconde au début du XVIe siècle.',
    categorie: 'Art',
    difficulte: 'moyen',
    countApparition: 0,
    countBonneReponse: 0,
  },
  {
    id: '5',
    intitule: 'Vitesse de la lumière ?',
    reponses: ['300 000 km/s', '150 000 km/s', '1 000 km/s', 'Sonique'],
    indexBonneReponse: 0,
    explication: 'Environ 299 792 458 m/s, communément arrondie à 300 000 km/s.',
    categorie: 'Physique',
    difficulte: 'difficile',
    countApparition: 0,
    countBonneReponse: 0,
  },
  {
    id: '6',
    intitule: 'Racine carrée de 144 ?',
    reponses: ['10', '11', '12', '14'],
    indexBonneReponse: 2,
    explication: '12 × 12 = 144, donc √144 = 12',
    categorie: 'Maths',
    difficulte: 'moyen',
    countApparition: 0,
    countBonneReponse: 0,
  },
  {
    id: '7',
    intitule: 'Année de la chute du mur de Berlin ?',
    reponses: ['1987', '1989', '1991', '1990'],
    indexBonneReponse: 1,
    explication: 'Le mur de Berlin est tombé le 9 novembre 1989.',
    categorie: 'Histoire',
    difficulte: 'moyen',
    countApparition: 0,
    countBonneReponse: 0,
  },
  {
    id: '8',
    intitule: 'Planète la plus proche du soleil ?',
    reponses: ['Vénus', 'Terre', 'Mercure', 'Mars'],
    indexBonneReponse: 2,
    explication: 'Mercure est la première planète du système solaire.',
    categorie: 'Astronomie',
    difficulte: 'moyen',
    countApparition: 0,
    countBonneReponse: 0,
  },
  {
    id: '9',
    intitule: "Nombre de pattes d'une araignée ?",
    reponses: ['6', '8', '10', '12'],
    indexBonneReponse: 1,
    explication: 'Les arachnides ont 8 pattes (ex : araignées, scorpions).',
    categorie: 'Biologie',
    difficulte: 'facile',
    countApparition: 0,
    countBonneReponse: 0,
  },
  {
    id: '10',
    intitule: "Pays d'origine du Sushi ?",
    reponses: ['Chine', 'Corée', 'Japon', 'Thaïlande'],
    indexBonneReponse: 2,
    explication: "C'est un plat emblématique de la cuisine japonaise.",
    categorie: 'Culture',
    difficulte: 'facile',
    countApparition: 0,
    countBonneReponse: 0,
  },
]

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
