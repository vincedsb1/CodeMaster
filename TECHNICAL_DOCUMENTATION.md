# CodeMaster - Documentation Technique Complète

**Version:** 2.0
**Date:** Novembre 2024
**Application:** Progressive Web Application (PWA) de Quiz
**Nom du projet:** CodeMaster (Quiz Master)
**Status:** Production (Deployé sur Vercel)

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture générale](#2-architecture-générale)
3. [Stack technique](#3-stack-technique)
4. [Structure des fichiers](#4-structure-des-fichiers)
5. [Routage et Pages](#5-routage-et-pages)
6. [Modèles de données](#6-modèles-de-données)
7. [Gestion d'état (Pinia)](#7-gestion-détat-pinia)
8. [Composants détaillés](#8-composants-détaillés)
9. [Services et Utilities](#9-services-et-utilities)
10. [Persistance (IndexedDB)](#10-persistance-indexeddb)
11. [Chargement des questions](#11-chargement-des-questions)
12. [Configuration et Build](#12-configuration-et-build)
13. [Quick Start](#13-quick-start)
14. [Diagrammes de flux](#14-diagrammes-de-flux)
15. [Checklist de test](#15-checklist-de-test)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Vue d'ensemble

### 1.1 Description

**CodeMaster** est une Progressive Web Application (PWA) pour l'apprentissage via des quiz. Elle permet aux utilisateurs de :
- Faire des quiz sur des sujets techniques (TypeScript, React, Next.js, Node.js, CSS, JavaScript, Entretiens)
- Suivre leurs statistiques en temps réel
- Débloquer des badges pour récompenser leurs progrès
- Importer des questions personnalisées
- Gérer des catégories de questions

### 1.2 Caractéristiques clés

- **100% Frontend** : Aucun serveur backend, IndexedDB pour la persistance
- **Offline-first** : Fonctionne complètement offline une fois chargée
- **Responsive** : Design mobile-first, fonctionne sur tous les appareils
- **PWA-compliant** : Installable sur écran d'accueil (iOS/Android)
- **TypeScript strict** : Types sécurisés sur 100% du code
- **Pas d'authentification** : Mono-utilisateur par appareil

### 1.3 Données utilisateur

- **Stockage** : IndexedDB (local, non synchronisé)
- **Accessibilité** : Données accessibles uniquement sur l'appareil/navigateur
- **Isolation** : Chaque navigateur a sa propre base de données isolée
- **Confidentialité** : Aucune donnée envoyée à des serveurs

---

## 2. Architecture générale

### 2.1 Pattern architectural

**Monolithic Frontend + Local Storage**

```
┌─────────────────────────────────────────────┐
│         Vue 3 + TypeScript (Frontend)        │
├─────────────────────────────────────────────┤
│  Routes (Vue Router) → Pages → Composants   │
├─────────────────────────────────────────────┤
│  Pinia Stores (3 stores centralisés)        │
│  • useDataStore (questions, badges, cats)   │
│  • useQuizStore (session active)            │
│  • useStatsStore (statistiques globales)    │
├─────────────────────────────────────────────┤
│  Repository Pattern (abstraction DB)        │
│  • questionRepository                        │
│  • sessionRepository                         │
│  • metaRepository                            │
│  • categoryRepository                        │
├─────────────────────────────────────────────┤
│  IndexedDB (Persistance locale)             │
│  • questions store                           │
│  • sessions store                            │
│  • meta store                                │
│  • categories store                          │
└─────────────────────────────────────────────┘
```

### 2.2 Flux de données global

```
User Interaction
    ↓
Vue Component (emits event)
    ↓
Pinia Store (action asynchrone)
    ↓
Repository (CRUD IndexedDB)
    ↓
IndexedDB (persist)
    ↓
Store (update state)
    ↓
Component (computed reactivity)
    ↓
UI Update
```

### 2.3 Cycles principaux

#### Quiz Workflow
```
Home (sélect catégorie)
  → Difficulty (sélect difficulté)
  → Count (sélect nombre questions)
  → createQuizSession() [IndexedDB save]
  → Active (gameplay)
    ├─ submitAnswer() → save session
    ├─ skipQuestion() → save session
    ├─ nextQuestion() → save ou finishQuiz()
  → finishQuiz() [calcul scores, badges]
  → Summary (affichage résultats)
```

#### Import Data Workflow
```
Import.vue (sélect fichier local)
  → handleFileUpload() [read JSON]
  → sessionStorage.setItem('pendingImportJson', JSON)
  → router.push('/settings/select-category')
  → SelectCategory.vue (choose ou create catégorie)
  → importQuestions(json, category)
  → questionRepository.saveMany() [IndexedDB]
  → dataStore.reloadQuestions()
  → Auto-navigate to Home (1.5s)
```

---

## 3. Stack technique

### 3.1 Framework et librairies

| Aspect | Technologie | Version | Rôle |
|--------|-------------|---------|------|
| **Framework** | Vue.js | 3.5.22 | Framework frontend réactif |
| **Langage** | TypeScript | 5.9 | Typage statique |
| **Build** | Vite | 7.1.11 | Bundler moderne ultra-rapide |
| **State Mgmt** | Pinia | 3.0.3 | Gestion d'état centralisée |
| **Routing** | Vue Router | 4.6.3 | Navigation et routes |
| **CSS** | Tailwind CSS | v4 (@tailwindcss/postcss) | Styling utility-first |
| **Icons** | Phosphor Icons | CDN unpkg | 1000+ icônes vectorielles |
| **Charts** | Chart.js | 4.5.1 | Graphiques statistiques |
| **Markdown** | marked | 17.0.1 | Parsing Markdown |

### 3.2 Outils de développement

| Outil | Version | Rôle |
|-------|---------|------|
| **Oxlint** | ~1.23.0 | Linting correctness |
| **ESLint** | 9.37.0 | Linting rules (Vue, TS, Prettier) |
| **Prettier** | 3.6 | Code formatting |
| **Vitest** | 3.2.4 | Tests unitaires |
| **@vue/test-utils** | 2.4.6 | Utilitaires test Vue |
| **Playwright** | 1.56.1 | Tests E2E |

### 3.3 Architecture de déploiement

- **Hébergement** : Vercel (serverless, auto-deploy on git push)
- **Routing** : Configuration `vercel.json` pour SPA (redirige tout vers index.html)
- **Assets statiques** : `public/` servie directement (questions JSON pré-chargés)
- **Build** : `npm run build` → type-check + vite build
- **Output** : `dist/` prêt pour production

---

## 4. Structure des fichiers

### 4.1 Arborescence complète

```
Test-cm/
├── index.html                          # Entry point HTML
├── vite.config.ts                      # Configuration Vite
├── tsconfig.json                       # TypeScript global
├── tsconfig.app.json                   # TypeScript app
├── tsconfig.vitest.json                # TypeScript vitest
├── tailwind.config.js                  # Configuration Tailwind CSS v4
├── postcss.config.js                   # PostCSS config (Tailwind)
├── eslint.config.ts                    # ESLint flat config
├── .prettierrc.json                    # Prettier config
├── package.json                        # Dépendances et scripts
├── package-lock.json                   # Lock file npm
├── vercel.json                         # Configuration Vercel (SPA routing)
├── CLAUDE.md                           # Instructions pour Claude Code
├── FUNCTIONAL_SPECIFICATION.md         # Spécification fonctionnelle v1
├── TECHNICAL_DOCUMENTATION.md          # Ce fichier
│
├── src/
│   ├── main.ts                         # Entry point Vue (init App + Pinia + Router)
│   ├── style.css                       # Tailwind CSS v4 + custom components
│   ├── App.vue                         # Root component (layout + transitions)
│   │
│   ├── types/
│   │   ├── models.ts                   # Interfaces TypeScript (8 entités)
│   │   └── constants.ts                # Constantes, enums, données par défaut
│   │
│   ├── db/
│   │   ├── config.ts                   # IndexedDB initialization (3 stores)
│   │   ├── repositories.ts             # Repository pattern (CRUD)
│   │   └── loaders/
│   │       └── questionsLoader.ts      # Async JSON loader pour questions
│   │
│   ├── stores/
│   │   ├── useDataStore.ts             # Questions + Badges + Categories
│   │   ├── useQuizStore.ts             # Active session + navigation
│   │   └── useStatsStore.ts            # Stats globales + badges unlock
│   │
│   ├── services/
│   │   └── categoryLoadingService.ts   # localStorage persistence pour état chargement
│   │
│   ├── router/
│   │   └── index.ts                    # Vue Router config (8 routes)
│   │
│   ├── views/
│   │   ├── quiz/
│   │   │   ├── Home.vue                # Sélection catégorie
│   │   │   ├── Difficulty.vue          # Sélection difficulté
│   │   │   ├── Count.vue               # Sélection nombre questions
│   │   │   ├── RandomConfig.vue        # Multi-sélection catégories (random mode)
│   │   │   ├── Active.vue              # Gameplay (quiz en cours)
│   │   │   └── Summary.vue             # Résultats et badges
│   │   ├── stats/
│   │   │   └── Index.vue               # Dashboard stats (KPI + graphique + badges)
│   │   └── settings/
│   │       ├── Import.vue              # Gestion données + chargement catégories
│   │       ├── SelectCategory.vue      # Sélection/création catégorie pour import
│   │       ├── Categories.vue          # Gestion catégories (liste + delete + create)
│   │       └── CategoryEdit.vue        # Formulaire création/édition catégorie
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue           # En-tête avec logo et navigation
│   │   │   └── AppLayout.vue           # Layout principal avec modal reprise
│   │   ├── quiz/
│   │   │   ├── QuestionCard.vue        # Affichage question + réponses
│   │   │   ├── AnswerOption.vue        # Bouton réponse avec états
│   │   │   └── ProgressBar.vue         # Barre de progression
│   │   ├── stats/
│   │   │   ├── StatCard.vue            # Card KPI (moyenne, streak, etc.)
│   │   │   ├── EvolutionChart.vue      # Graphique Chart.js 30 jours
│   │   │   └── BadgesGrid.vue          # Grille badges 3 colonnes
│   │   └── common/
│   │       ├── BaseButton.vue          # Bouton réutilisable (4 variants)
│   │       ├── BaseModal.vue           # Modal wrapper générique
│   │       ├── LoadingSpinner.vue      # Spinner SVG
│   │       └── MarkdownText.vue        # Rendu Markdown avec marked
│   │
│   ├── fixtures/
│   │   └── questions.ts                # Questions de test (30 questions)
│   │
│   └── __tests__/
│       └── App.spec.ts                 # Tests unitaires
│
├── public/
│   ├── index.html                      # (auto-généré par Vite)
│   └── questions/                      # ⭐ NEW: JSON questions statiques
│       ├── react.json                  # ~100 questions React
│       ├── typescript.json             # ~100 questions TypeScript
│       ├── javascript.json             # ~100 questions JavaScript
│       ├── nodejs.json                 # ~100 questions Node.js
│       ├── nextjs.json                 # ~100 questions Next.js
│       ├── css.json                    # ~100 questions CSS
│       └── entretiens.json             # ~100 questions entretiens techniques
│
├── e2e/
│   ├── fixtures/
│   ├── specs/
│   └── tsconfig.json
│
├── dist/                               # Production build (après npm run build)
│   ├── index.html
│   └── assets/
│       ├── index-*.css                 # CSS bundled (~32kB → ~6.3kB gzipped)
│       └── index-*.js                  # JS bundled (~450kB → ~150kB gzipped)
│
└── node_modules/                       # Dépendances (npm install)
```

### 4.2 Fichiers critiques à connaître

| Fichier | Ligne(s) | Importance | Raison |
|---------|----------|-----------|--------|
| `src/stores/useDataStore.ts` | - | 🔴 CRITIQUE | Gère toutes les questions et catégories |
| `src/stores/useQuizStore.ts` | 91-96 | 🔴 CRITIQUE | Filtre questions par labels (FIX récent) |
| `src/db/loaders/questionsLoader.ts` | 18-27, 93-104 | 🔴 CRITIQUE | Normalisation catégories (CATEGORY_LABEL_MAPPING) |
| `src/views/quiz/Home.vue` | 14-18 | 🟡 IMPORTANT | Filtre catégories disponibles par labels |
| `src/views/settings/Import.vue` | 259-272 | 🟡 IMPORTANT | Auto-navigation après import |
| `public/questions/*.json` | - | 🟡 IMPORTANT | Questions statiques pré-chargées |
| `vercel.json` | - | 🟡 IMPORTANT | Configuration routing SPA |
| `src/db/repositories.ts` | - | 🟡 IMPORTANT | Abstraction IndexedDB |

---

## 5. Routage et Pages

### 5.1 Configuration des routes

**Fichier:** `src/router/index.ts`

```typescript
// 8 routes organisées par domaine fonctionnel
const routes = [
  {
    path: '/',
    component: AppLayout,  // Wrapper principal
    children: [
      { path: 'home', name: 'home', component: Home },

      // Quiz flow
      { path: 'quiz/difficulty', name: 'quiz-difficulty', component: Difficulty },
      { path: 'quiz/count', name: 'quiz-count', component: Count },
      { path: 'quiz/randomconfig', name: 'quiz-randomconfig', component: RandomConfig },
      { path: 'quiz/active', name: 'quiz-active', component: Active },
      { path: 'quiz/summary', name: 'quiz-summary', component: Summary },

      // Stats
      { path: 'stats', name: 'stats', component: Stats },

      // Settings
      { path: 'settings/import', name: 'settings-import', component: Import },
      { path: 'settings/select-category', name: 'settings-select-category', component: SelectCategory },
      { path: 'settings/categories', name: 'settings-categories', component: Categories },
      { path: 'settings/categories/edit', name: 'settings-categories-edit', component: CategoryEdit },
    ]
  }
];

// Redirection: / → /home
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next('/home');
  } else {
    next();
  }
});
```

### 5.2 Pages détaillées

#### **Home.vue** (`/home`)
- **Rôle** : Sélection catégorie pour quiz
- **Données affichées** :
  - Grille catégories avec questions disponibles
  - Bouton "Mode Aléatoire"
  - Alerte si aucune catégorie
- **Logique clé** :
  ```typescript
  const categoriesDisponibles = computed(() => {
    if (!dataStore.questions || !dataStore.allCategories) return []
    // Filtre catégories ayant au moins une question
    const questionsCategories = new Set(dataStore.questions.map((q) => q.categorie))
    return dataStore.allCategories.filter((cat) => questionsCategories.has(cat.label))
  })
  ```
- **Navigation sortante** :
  - `selectCategory(label)` → `/quiz/difficulty`
  - `openRandomConfig()` → `/quiz/randomconfig`

---

#### **Difficulty.vue** (`/quiz/difficulty`)
- **Rôle** : Sélection niveau de difficulté
- **Choix** : facile, moyen, difficile, aléatoire
- **Points associés** : facile=1, moyen=2, difficile=3
- **Store** : `quizStore.selectDifficulty(difficulty)`
- **Navigation** : → `/quiz/count`

---

#### **Count.vue** (`/quiz/count`)
- **Rôle** : Sélection nombre de questions
- **Choix** : 5, 10, ou 20 questions
- **Action** :
  ```typescript
  async function startQuiz(count: number) {
    try {
      await quizStore.createQuizSession(
        quizStore.selectedCategories,  // catégories sélectionnées
        quizStore.selectedDifficulty,  // difficulté sélectionnée
        count                           // nombre questions
      )
      router.push({ name: 'quiz-active' })
    } catch (err) {
      // Affiche erreur "Pas assez de questions"
    }
  }
  ```
- **Logique clé** : Filtre questions par catégories et difficulté, les trie par countApparition (moins vues en premier)
- **Navigation** : → `/quiz/active`

---

#### **Active.vue** (`/quiz/active`)
- **Rôle** : Interface de quiz (gameplay)
- **Affichage** :
  - Barre de progression (X/Y)
  - Question avec Markdown
  - 4 boutons réponses mélangés
  - Explication après réponse
- **Interactions** :
  - `submitAnswer(index)` : Enregistrer réponse
  - `skipQuestion()` : Passer la question
  - `nextQuestion()` : Aller à la suivante ou finir
- **Logique** :
  ```typescript
  // Réponses mélangées via ordreReponses
  const displayedAnswers = currentQuestion.value.ordreReponses.map(
    (idx) => currentQuestion.value.reponses[idx]
  )

  // Vérification réponse: comparer selectedAnswerIndex avec indexBonneReponse original
  const isCorrect = selectedAnswerIndex.value === currentQuestion.value.indexBonneReponse
  ```
- **Données sauvegardées** : Après chaque action (submit, skip, next)
- **Fin** : Quand `isLastQuestion` → `finishQuiz()` → `/quiz/summary`

---

#### **Summary.vue** (`/quiz/summary`)
- **Rôle** : Affichage résultats et badges débloqués
- **Affichage** :
  - Score en pourcentage (cercle de progression)
  - Bonnes réponses / total
  - Comparaison avec moyenne globale
  - Streak actuel
  - Badges nouveaux (notifications)
  - Message personnalisé selon score
- **Données** :
  ```typescript
  const score = computed(() => {
    const session = quizStore.activeSession
    return session ? Math.round((session.notePourcentage)) : 0
  })

  const newBadges = statsStore.newlyUnlockedBadges
  ```
- **Actions** :
  - `goHome()` → `/home`
  - `replayQuiz()` → `/quiz/count` avec paramètres précédents
- **Workflow** :
  1. `finishQuiz()` calcule les scores
  2. `statsStore.updateStatsAndBadges()` cherche badges à débloquer
  3. `newlyUnlockedBadges` rempli pour affichage

---

#### **Index.vue** (`/stats`)
- **Rôle** : Dashboard statistiques
- **Sections** :
  1. **KPI Cards** (4 cartes) :
     - Moyenne globale (%)
     - Meilleur score (%)
     - Streak actuel (jours)
     - Total quizzes complétés
  2. **Graphique évolution** (Chart.js) :
     - 30 derniers jours
     - Moyenne quotidienne
     - Ligne lissée (tension 0.3)
  3. **Grille badges** :
     - 3 colonnes
     - Verrouillés/débloqués
     - Date déblocage si applicable
- **Données** :
  ```typescript
  const globalStats = computed(() => statsStore.globalStats)
  // { moyenneGlobale, meilleurScore, streakActuel, totalSessions, historiqueSessions }
  ```
- **Charts** :
  ```typescript
  const dailyAverages = statsStore.calculateDailyAverages(sessions)
  // { '2024-11-29': { sum: 85, count: 2 }, ... }
  ```

---

#### **Import.vue** (`/settings/import`)
- **Rôle** : Gestion données et import questions
- **Sections** :
  1. **Catégories disponibles** :
     - Liste des 7 catégories pré-chargées
     - État : non chargé, en cours, chargé, erreur
     - Boutons : chargement individuel ou "Tout ajouter"
     - Progression barre (par catégorie et globale)
  2. **Upload JSON personnalisé** :
     - Input file (accept .json)
     - Stocke en sessionStorage
     - Navigue vers SelectCategory
  3. **Danger Zone** :
     - Bouton reset stats (irréversible)
     - Supprime sessions mais garde questions
- **Logique clé** :
  ```typescript
  async function loadCategory(categoryFile: string) {
    const questions = await loadQuestionsFromJsonFile(categoryFile)
    // categoryFile = 'react', 'typescript', etc.

    // Charge depuis /questions/{categoryFile}.json
    // Normalise catégories via CATEGORY_LABEL_MAPPING

    await questionRepository.saveMany(questions)
    await dataStore.reloadQuestions()

    // Auto-navigate to home après "Tout ajouter"
    setTimeout(() => router.push({ name: 'home' }), 1500)
  }
  ```
- **⭐ FIXE récent** : Auto-navigation après import complet (1.5s délai)

---

#### **SelectCategory.vue** (`/settings/select-category`)
- **Rôle** : Sélection/création catégorie pour import JSON custom
- **Modes** :
  1. **Sélection existante** : Boutons catégories
  2. **Création nouvelle** : Formulaire (label + icon + color)
- **Workflow** :
  1. Utilisateur upload JSON sur Import.vue
  2. JSON stocké en sessionStorage
  3. Navigue vers SelectCategory
  4. Choisit catégorie ou crée nouvelle
  5. `importQuestions(json, categoryLabel)` sauvegarde
  6. Auto-navigate vers Home

---

#### **Categories.vue** (`/settings/categories`)
- **Rôle** : Gestion des catégories (CRUD)
- **Actions** :
  - **Créer** : FAB → CategoryEdit (mode création)
  - **Éditer** : Clic → CategoryEdit (mode édition)
  - **Supprimer** : Confirmation → cascade supression questions
- **Affichage** :
  - Liste/tableau catégories
  - Nombre de questions par catégorie
  - Icône + label + couleur

---

#### **CategoryEdit.vue** (`/settings/categories/edit?id=...`)
- **Rôle** : Formulaire création/édition catégorie
- **Modes** :
  - **Création** : form vide, aucun params
  - **Édition** : pré-rempli avec ?id=categoryId
- **Champs** :
  - Label (input, validation d'unicité)
  - Icon (grid 24 icônes)
  - Color (grid 14 couleurs)
- **Logique label change** :
  - Si label modifié en édition
  - Toutes questions ayant ancienne catégorie → nouvelle catégorie
  - Sauvegarde en cascade

---

### 5.3 Navigation et transitions

```typescript
// Transitions de page
<Transition name="slide" mode="out-in">
  <router-view />
</Transition>

// Styles CSS
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease-out;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
```

---

## 6. Modèles de données

### 6.1 Entités TypeScript

**Fichier:** `src/types/models.ts`

```typescript
// ===== CATEGORY =====
interface Category {
  id: string                // Unique ID (ex: 'cat_typescript')
  label: string             // Nom affiché (ex: 'TypeScript')
  icon: string              // Phosphor icon name (ex: 'Code')
  color: TailwindColor      // Tailwind color (ex: 'blue')
}

// 7 catégories pré-définies par défaut
// Modifiable, créable, supprimable par l'utilisateur

// ===== QUESTION =====
interface Question {
  id: string                       // Unique ID
  intitule: string                 // Énoncé (peut avoir Markdown)
  reponses: string[]               // [answer0, answer1, answer2, answer3]
  indexBonneReponse: number        // Index correct (0-3)
  explication: string              // Explication (Markdown)
  categorie: string                // Label catégorie (ex: 'React', pas 'cat_react')
                                   // ⭐ FIX: Stocke label normalisé, pas ID
  difficulte: 'facile' | 'moyen' | 'difficile'
  countApparition: number          // Nb fois affichée
  countBonneReponse: number        // Nb fois correctement répondue
}

// Points par difficulté:
// - facile: 1 point
// - moyen: 2 points
// - difficile: 3 points

// ===== SESSION QUESTION =====
interface SessionQuestion extends Question {
  ordreReponses: number[]   // [0, 2, 3, 1] - réponses mélangées
  estSkippe: boolean        // true si passée
  estCorrecte: boolean|null // null avant réponse, true/false après
}

// ===== QUIZ SESSION =====
interface QuizSession {
  sessionId: string                // UUID unique
  dateDebut: string                // ISO string
  dateFin: string | null           // ISO string (null si en cours)
  questions: SessionQuestion[]     // Snapshot des questions
  indexQuestionCourante: number    // Index question active
  nbQuestions: number              // Total questions
  scorePondere: number             // Somme des points
  scorePondereMax: number          // Max possible
  notePourcentage: number          // 0-100
  difficulteChoisie: Difficulty    // Difficulté sélectionnée
  categories: string[]             // Labels catégories sélectionnées
  dateJour?: string                // YYYY-MM-DD pour streak calc
}

// Cycle de vie:
// 1. Création (dateFin = null)
// 2. Progression (nextQuestion())
// 3. Terminaison (finishQuiz() → dateFin défini)
// 4. Historique (persisté en IndexedDB)

// ===== BADGE =====
interface Badge {
  id: string                         // Unique ID (ex: 'first_quiz')
  nom: string                        // Nom (ex: 'Premier Pas')
  description: string                // Description but
  statut: 'verrouille' | 'debloque'
  icon?: string                      // Emoji (ex: '🐣')
  dateDebloque?: string | null       // ISO timestamp déblocage
}

// 6 badges pré-définis:
// - first_quiz: 1 session complétée
// - perfect_score: 100% sur une session
// - streak_3: 3 jours consécutifs
// - streak_7: 7 jours consécutifs
// - marathon: 20 sessions complétées
// - math_expert: 5 sessions monocatégorie 'Maths'

// ===== GLOBAL STATS =====
interface GlobalStats {
  moyenneGlobale: number           // Moyenne (%)
  meilleurScore: number            // Max (%)
  streakActuel: number             // Jours consécutifs
  totalSessions: number            // Sessions complétées
  historiqueSessions: QuizSession[] // Toutes sessions
}

// ===== CONSTANTS =====
type Difficulty = 'facile' | 'moyen' | 'difficile' | 'random'
type TailwindColor = 'slate' | 'red' | 'orange' | ... // 14 couleurs
```

### 6.2 Énumérations et constantes

**Fichier:** `src/types/constants.ts`

```typescript
// Catégories pré-définies
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_typescript', label: 'TypeScript', icon: 'Code', color: 'blue' },
  { id: 'cat_react', label: 'React', icon: 'Lightning', color: 'cyan' },
  { id: 'cat_nextjs', label: 'Next.js', icon: 'Rocket', color: 'slate' },
  { id: 'cat_nodejs', label: 'Node.js', icon: 'Server', color: 'green' },
  { id: 'cat_css', label: 'CSS', icon: 'Palette', color: 'purple' },
  { id: 'cat_javascript', label: 'JavaScript', icon: 'Code', color: 'yellow' },
  { id: 'cat_entretiens', label: 'Entretiens', icon: 'Chat', color: 'indigo' },
]

// Badges pré-définis
export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first_quiz',
    nom: 'Premier Pas',
    description: 'Complétez votre premier quiz',
    statut: 'verrouille',
    icon: '🐣',
  },
  // ... autres badges
]

// 10 questions par défaut (pour tests)
export const DEFAULT_QUESTIONS: Question[] = [ ... ]

// Couleurs Tailwind supportées (14)
export const TAILWIND_COLORS = [
  'slate', 'red', 'orange', 'amber', 'yellow',
  'lime', 'green', 'emerald', 'teal', 'cyan',
  'blue', 'indigo', 'purple', 'pink'
]

// 24 icônes Phosphor disponibles
export const PHOSPHOR_ICONS = [
  'Code', 'Rocket', 'Cpu', 'Palette', ...
]
```

### 6.3 Relations et intégrité

```
Question
  ├─ categorie (string)  ──→ Category.label [ForeignKey]
  ├─ difficulte (enum)   ──→ Une de { facile, moyen, difficile }
  └─ Métadonnées: countApparition, countBonneReponse

QuizSession
  ├─ questions: SessionQuestion[] (snapshots de Question)
  ├─ categories: string[] (labels sélectionnés)
  ├─ difficulteChoisie (enum)
  └─ Calculs: scorePondere, notePourcentage

Badge
  └─ Lié par logique métier (pas de FK, déblocage via conditions)

GlobalStats
  └─ Agrégation de toutes QuizSession complétées
```

---

## 7. Gestion d'état (Pinia)

### 7.1 useDataStore

**Fichier:** `src/stores/useDataStore.ts`

**État:**
```typescript
const questions = ref<Question[]>([])        // Toutes questions
const badges = ref<Badge[]>([])              // 6 badges
const categories = ref<Category[]>([])       // Catégories (7 par défaut)
const isLoading = ref(false)                 // Flag chargement
const error = ref<string | null>(null)       // Message erreur
```

**Actions clés:**

| Action | Signature | Rôle |
|--------|-----------|------|
| `initData()` | async () → void | Charge questions, badges, catégories au mount |
| `importQuestions(json, cat?)` | async (arr, string?) → { success, count } | Valide + sauvegarde JSON import |
| `reloadQuestions()` | async () → void | Recharge depuis IndexedDB (après import) |
| `addCategory(cat)` | async (Category) → void | Créer nouvelle catégorie |
| `updateCategory(cat)` | async (Category) → void | Modifier + cascade label |
| `deleteCategory(id)` | async (string) → void | Supprimer + supprimer questions |
| `resetBadges()` | async () → void | Tous badges → 'verrouille' |
| `updateBadges(badges)` | async (Badge[]) → void | Sauvegarder badges modifiés |

**Logique clé - Import:**
```typescript
async function importQuestions(json: Record[], targetCategory?: string) {
  // 1. Validation format
  if (!Array.isArray(json)) throw new Error('Array requis')
  if (json.length === 0) throw new Error('Fichier vide')

  // 2. Validation première question
  const first = json[0]
  if (!first.intitule || !first.reponses || first.indexBonneReponse === undefined) {
    throw new Error('Propriétés manquantes')
  }

  // 3. Normalisation
  const normalized = json.map((q, idx) => ({
    id: q.id || `imported-${Date.now()}-${idx}`,
    intitule: q.intitule,
    reponses: q.reponses,
    indexBonneReponse: q.indexBonneReponse,
    explication: q.explication || '',
    categorie: targetCategory || q.categorie || 'Sans catégorie',
    difficulte: q.difficulte,
    countApparition: 0,
    countBonneReponse: 0,
  }))

  // 4. Sauvegarde
  await questionRepository.clear()  // ou saveMany() pour ajouter
  await questionRepository.saveMany(JSON.parse(JSON.stringify(normalized)))
  questions.value = normalized
}
```

---

### 7.2 useQuizStore

**Fichier:** `src/stores/useQuizStore.ts`

**État:**
```typescript
const activeSession = ref<QuizSession | null>(null)
const selectedAnswerIndex = ref<number | null>(null)
const hasAnswered = ref(false)
const showResumeModal = ref(false)

// Sélections temporaires
const selectedCategories = ref<string[]>([])
const randomCategoriesSelection = ref<string[]>([])
const selectedDifficulty = ref<Difficulty | null>(null)
```

**Computed:**
```typescript
const currentQuestion = computed(() =>
  activeSession.value?.questions[activeSession.value.indexQuestionCourante]
)

const currentQuestionIndex = computed(() =>
  activeSession.value?.indexQuestionCourante ?? 0
)

const progressPercent = computed(() => {
  if (!activeSession.value) return 0
  return ((activeSession.value.indexQuestionCourante + 1) / activeSession.value.nbQuestions) * 100
})

const isLastQuestion = computed(() =>
  activeSession.value?.indexQuestionCourante === (activeSession.value?.nbQuestions ?? 0) - 1
)

const isQuizFinished = computed(() =>
  activeSession.value?.dateFin !== null
)
```

**Actions - Création session:**
```typescript
async function createQuizSession(
  categories: string[],     // Labels: ['React', 'TypeScript']
  difficulty: Difficulty,   // 'facile' | 'moyen' | 'difficile' | 'random'
  count: number            // 5, 10, 20
) {
  const dataStore = useDataStore()

  // 1. Filtre par catégories (labels)
  let pool = dataStore.questions.filter(
    (q) => categories.includes(q.categorie)  // ⭐ FIX: Filter by label, not ID
  )

  // 2. Filtre par difficulté
  if (difficulty !== 'random') {
    pool = pool.filter((q) => q.difficulte === difficulty)
  }

  // 3. Trie par countApparition + aléatoire
  pool.sort((a, b) => {
    if (a.countApparition === b.countApparition) {
      return Math.random() - 0.5
    }
    return a.countApparition - b.countApparition
  })

  // 4. Mélange réponses et crée SessionQuestion
  const questionsToPlay = pool.slice(0, count).map((q) => {
    const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5)
    return {
      ...q,
      ordreReponses: indices,
      estSkippe: false,
      estCorrecte: null,
    } as SessionQuestion
  })

  if (questionsToPlay.length === 0) {
    throw new Error('Pas assez de questions disponibles')
  }

  // 5. Crée session et sauvegarde
  activeSession.value = {
    sessionId: crypto.randomUUID(),
    dateDebut: new Date().toISOString(),
    dateFin: null,
    questions: questionsToPlay,
    indexQuestionCourante: 0,
    nbQuestions: questionsToPlay.length,
    scorePondere: 0,
    scorePondereMax: 0,
    notePourcentage: 0,
    difficulteChoisie: difficulty,
    categories: cleanCategories,
  }

  await sessionRepository.save(activeSession.value)
}
```

**Actions - Gameplay:**
```typescript
async function submitAnswer(answerIndex: number) {
  const session = activeSession.value
  const question = session.questions[session.indexQuestionCourante]

  // 1. Enregistrer réponse
  selectedAnswerIndex.value = answerIndex
  hasAnswered.value = true

  // 2. Vérifier si correcte
  const isCorrect = answerIndex === question.indexBonneReponse
  question.estCorrecte = isCorrect

  // 3. Mettre à jour métadonnées question
  question.countApparition++
  if (isCorrect) {
    question.countBonneReponse++
    // Calcul score
    const points = { facile: 1, moyen: 2, difficile: 3 }[question.difficulte]
    session.scorePondere += points
  }

  // 4. Sauvegarder
  await saveCurrentSession()
  await questionRepository.incrementApparition(question.id)
  if (isCorrect) {
    await questionRepository.incrementCorrect(question.id)
  }
}

async function skipQuestion() {
  const question = currentQuestion.value
  question.estSkippe = true
  question.countApparition++

  await saveCurrentSession()
  await questionRepository.incrementApparition(question.id)
}

async function nextQuestion() {
  const session = activeSession.value

  if (isLastQuestion.value) {
    await finishQuiz()
  } else {
    session.indexQuestionCourante++
    selectedAnswerIndex.value = null
    hasAnswered.value = false

    await saveCurrentSession()
  }
}

async function finishQuiz() {
  const session = activeSession.value

  // 1. Calcul scores finaux
  const correctCount = session.questions.filter((q) => q.estCorrecte === true).length
  session.notePourcentage = Math.round((correctCount / session.nbQuestions) * 100)
  session.scorePondereMax = session.questions.reduce((sum, q) => {
    const points = { facile: 1, moyen: 2, difficile: 3 }[q.difficulte]
    return sum + points
  }, 0)
  session.dateFin = new Date().toISOString()
  session.dateJour = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  // 2. Sauvegarde session
  await sessionRepository.save(session)

  // 3. Mise à jour stats et badges
  const statsStore = useStatsStore()
  await statsStore.updateStatsAndBadges(session)
  await statsStore.loadStats()
}
```

---

### 7.3 useStatsStore

**Fichier:** `src/stores/useStatsStore.ts`

**État:**
```typescript
const globalStats = ref<GlobalStats>({
  moyenneGlobale: 0,
  meilleurScore: 0,
  streakActuel: 0,
  totalSessions: 0,
  historiqueSessions: []
})

const newlyUnlockedBadges = ref<Badge[]>([])
```

**Actions:**

```typescript
async function loadStats() {
  // 1. Récupère toutes sessions complétées
  const sessions = await sessionRepository.getCompleted()

  // 2. Calcule stats
  const scores = sessions.map((s) => s.notePourcentage)
  globalStats.value = {
    moyenneGlobale: scores.length ? scores.reduce((a, b) => a + b) / scores.length : 0,
    meilleurScore: scores.length ? Math.max(...scores) : 0,
    streakActuel: calculateCurrentStreak(sessions),
    totalSessions: sessions.length,
    historiqueSessions: sessions
  }
}

async function updateStatsAndBadges(session: QuizSession) {
  // 1. Charge badges actuels
  const dataStore = useDataStore()
  const badges = dataStore.badges

  // 2. Vérifie conditions de déblocage
  const newUnlocked: Badge[] = []

  // first_quiz: 1 session complétée
  if (session && badges.find((b) => b.id === 'first_quiz')?.statut === 'verrouille') {
    const badge = badges.find((b) => b.id === 'first_quiz')!
    badge.statut = 'debloque'
    badge.dateDebloque = new Date().toISOString()
    newUnlocked.push(badge)
  }

  // perfect_score: 100%
  if (session.notePourcentage === 100 && badges.find((b) => b.id === 'perfect_score')?.statut === 'verrouille') {
    // ... unlock
  }

  // Autres badges...

  // 3. Sauvegarde et met à jour state
  await dataStore.updateBadges(badges)
  newlyUnlockedBadges.value = newUnlocked
}

function calculateCurrentStreak(sessions: QuizSession[]): number {
  if (sessions.length === 0) return 0

  // Récupère les dates des sessions (YYYY-MM-DD)
  const dates = sessions
    .filter((s) => s.dateJour)
    .map((s) => new Date(s.dateJour!))
    .sort((a, b) => b.getTime() - a.getTime())

  let streak = 0
  let currentDate = new Date()

  for (const date of dates) {
    const diff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diff === 0 || (diff === 1 && streak === 0)) {
      // Même jour ou hier
      streak++
      currentDate = date
    } else if (diff > 1) {
      // Brèche, arrêt
      break
    }
  }

  // Vérifie que dernière session n'est pas trop ancienne
  const lastDate = dates[0]
  if (lastDate) {
    const diff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diff > 1) return 0
  }

  return streak
}

function calculateDailyAverages(sessions: QuizSession[]): Record<string, { sum: number; count: number }> {
  // Agrège scores par jour sur 30 jours
  const last30Days: Record<string, { sum: number; count: number }> = {}

  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    last30Days[dateStr] = { sum: 0, count: 0 }
  }

  // Remplis avec sessions réelles
  sessions.forEach((session) => {
    if (session.dateJour && last30Days[session.dateJour]) {
      last30Days[session.dateJour].sum += session.notePourcentage
      last30Days[session.dateJour].count++
    }
  })

  return last30Days
}
```

---

## 8. Composants détaillés

### 8.1 Composants layout

#### **AppLayout.vue**

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/useQuizStore'
import { useRouter } from 'vue-router'
import AppHeader from './AppHeader.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const quizStore = useQuizStore()
const router = useRouter()

onMounted(async () => {
  // Vérifie s'il y a une session en cours à reprendre
  await quizStore.checkResumableSession()
})

function resumeSession() {
  router.push({ name: 'quiz-active' })
}

function abandonSession() {
  quizStore.abandonSession()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />

    <!-- Modal reprise de session -->
    <BaseModal
      v-if="quizStore.showResumeModal"
      title="Quiz en cours"
      show
    >
      <p class="text-slate-600">
        Vous aviez un quiz en cours. Voulez-vous continuer ?
      </p>

      <template #actions>
        <button @click="resumeSession" class="btn-primary">Reprendre</button>
        <button @click="abandonSession" class="btn-secondary">Abandonner</button>
      </template>
    </BaseModal>

    <!-- Pages -->
    <Transition name="slide" mode="out-in">
      <router-view />
    </Transition>
  </div>
</template>
```

#### **AppHeader.vue**

- Affiche logo + titre
- Bouton settings → `/settings/categories`
- Bouton stats (avec badge si nouveaux badges) → `/stats`

---

### 8.2 Composants quiz

#### **QuestionCard.vue**

```typescript
interface Props {
  question: SessionQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswerIndex: number | null
  hasAnswered: boolean
}

defineEmits<{
  answerSelected: [answerIndex: number]
}>()
```

**Affichage:**
- Numéro question / total
- Badges catégorie + difficulté
- Texte question (Markdown)
- 4 boutons réponses (mélangés)
- Explication (après réponse)

**Logique mélange:**
```typescript
// question.ordreReponses = [2, 0, 3, 1] (par exemple)
<div v-for="(originalIndex, displayIndex) in question.ordreReponses">
  <AnswerOption
    :text="question.reponses[originalIndex]"
    :isCorrect="originalIndex === question.indexBonneReponse"
    :isSelected="selectedAnswerIndex === displayIndex"
    @click="$emit('answerSelected', originalIndex)"
  />
</div>
```

#### **AnswerOption.vue**

```typescript
interface Props {
  text: string
  isCorrect: boolean | null
  isSelected: boolean
  hasAnswered: boolean
  disabled: boolean
}
```

**États:**
- Avant réponse : border blanc, hover
- Sélectionné correct : fond vert, icône ✓
- Sélectionné incorrect : fond rouge réduit, icône ✗
- Non-sélectionné correct (après) : tinte vert clair
- Non-sélectionné incorrect : grisé

#### **ProgressBar.vue**

- Barre horizontale 0-100%
- Pourcentage affiché
- Couleur indigo

---

### 8.3 Composants statistiques

#### **StatCard.vue**

```typescript
interface Props {
  label: string          // 'Moyenne', 'Meilleur Score', etc.
  value: string | number // '87.5%', '15j', '42'
  icon?: string          // Phosphor icon (optional)
  color?: 'primary' | 'green' | 'orange' | 'slate'
}
```

#### **EvolutionChart.vue**

```typescript
interface Props {
  sessions: QuizSession[]
}
```

**Logique:**
```typescript
const dailyAverages = calculateDailyAverages(sessions)
// { '2024-11-29': 85.5, '2024-11-28': 78.0, ... }

const chartData = {
  labels: last30Days.map((d) => formatDate(d)),
  datasets: [{
    label: 'Moyenne quotidienne',
    data: last30Days.map((d) => dailyAverages[d]?.average || 0),
    borderColor: '#4F46E5',
    fill: true,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    tension: 0.3,
    spanGaps: true,
  }]
}

const chart = new Chart(canvasRef.value, {
  type: 'line',
  data: chartData,
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
})
```

#### **BadgesGrid.vue**

```typescript
interface Props {
  badges: Badge[]
}

defineEmits<{
  badgeClick: [badge: Badge]
}>()
```

**Affichage:**
- Grille 3 colonnes
- Chaque badge : emoji + nom + statut
- Verrouillé : grayscale, opacité 60%
- Débloqué : blanc, border jaune, cliquable

---

### 8.4 Composants communs

#### **BaseButton.vue**

```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'  // default: 'primary'
  size?: 'sm' | 'md' | 'lg'                              // default: 'md'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}
```

**Variants:**
- `primary`: indigo bg, white text, shadow
- `secondary`: slate bg, slate text
- `danger`: red border, red text
- `ghost`: no bg, hover light bg

**Slots:**
```vue
<BaseButton @click="doSomething">
  Cliquez-moi
</BaseButton>
```

#### **BaseModal.vue**

```typescript
interface Props {
  title: string
  show: boolean
}

// Slots:
// <template #default> - contenu
// <template #actions> - boutons footer
```

#### **MarkdownText.vue**

```typescript
interface Props {
  text: string  // Raw markdown
}
```

**Logique:**
```typescript
const html = ref('')

watch(
  () => props.text,
  async (newText) => {
    try {
      const raw = await marked.parseInline(newText)
      // Retire <p> wrapper si présent
      html.value = raw.replace(/^<p>|<\/p>$/g, '')
    } catch (err) {
      html.value = newText
    }
  },
  { immediate: true }
)
```

**Rendu:**
```vue
<div v-html="html" class="prose prose-sm"></div>
```

---

## 9. Services et Utilities

### 9.1 categoryLoadingService.ts

**Rôle:** Gestion persistante de l'état de chargement des catégories via localStorage

```typescript
interface LoadedCategory {
  categoryId: string       // 'cat_react'
  categoryLabel: string    // 'React'
  loaded: boolean         // État chargement
  questionCount: number   // Total chargées
  loadedAt?: string       // ISO timestamp
  error?: string          // Message erreur
}

function getLoadedCategoriesState(): Record<string, LoadedCategory> {
  const stored = localStorage.getItem('quiz-master-loaded-categories')
  return stored ? JSON.parse(stored) : getInitialState()
}

function saveLoadedCategoriesState(state: Record<string, LoadedCategory>): void {
  localStorage.setItem('quiz-master-loaded-categories', JSON.stringify(state))
}

function markCategoryAsLoaded(
  categoryFile: string,
  count: number,
  currentState: Record<string, LoadedCategory>
): Record<string, LoadedCategory> {
  return {
    ...currentState,
    [categoryFile]: {
      ...currentState[categoryFile],
      loaded: true,
      questionCount: count,
      loadedAt: new Date().toISOString(),
    }
  }
}

function markCategoryAsError(
  categoryFile: string,
  errorMsg: string,
  currentState: Record<string, LoadedCategory>
): Record<string, LoadedCategory> {
  return {
    ...currentState,
    [categoryFile]: {
      ...currentState[categoryFile],
      error: errorMsg,
    }
  }
}

function getTotalQuestionsLoaded(state: Record<string, LoadedCategory>): number {
  return Object.values(state).reduce((sum, cat) => sum + (cat.questionCount || 0), 0)
}
```

---

### 9.2 questionsLoader.ts

**Rôle:** Chargement asynchrone de fichiers JSON depuis `public/questions/`

```typescript
// ⭐ MAPPING catégories → labels (FIX pour normalisation)
const CATEGORY_LABEL_MAPPING: Record<string, string> = {
  'react': 'React',
  'typescript': 'TypeScript',
  'nodejs': 'Node.js',
  'nextjs': 'Next.js',
  'css': 'CSS',
  'javascript': 'JavaScript',
  'entretiens': 'Entretiens',
}

type ProgressCallback = (loaded: number, total: number) => void

async function loadQuestionsFromJsonFile(
  category: string,
  onProgress?: ProgressCallback
): Promise<Question[]> {
  try {
    console.log(`[QuestionsLoader] Loading ${category}.json...`)

    // Fetch depuis /questions/{category}.json
    const response = await fetch(`/questions/${category}.json`)
    if (!response.ok) {
      console.warn(`[QuestionsLoader] JSON not found for category: ${category}`)
      return []
    }

    const data = await response.json() as RawQuestion[]

    // ⭐ FIX: Normalise categorie vers label
    const categoryLabel = CATEGORY_LABEL_MAPPING[category] || category

    const normalized: Question[] = data.map((q, index) => {
      if (onProgress) onProgress(index + 1, data.length)

      return {
        ...q,
        categorie: categoryLabel,  // Label normalisé, pas filename
        explication: q.explication || '',
        difficulte: q.difficulte as Exclude<Difficulty, 'random'>,
        countApparition: 0,
        countBonneReponse: 0,
      }
    })

    console.log(`[QuestionsLoader] Loaded ${normalized.length} questions from ${category}.json`)
    return normalized
  } catch (err) {
    console.error(`[QuestionsLoader] Error loading ${category}.json:`, err)
    throw err
  }
}

async function loadAllQuestionsFromJsonParallel(
  onProgress?: ProgressCallback
): Promise<Question[]> {
  const categories = Object.keys(CATEGORY_LABEL_MAPPING)
  const promises = categories.map((cat) => loadQuestionsFromJsonFile(cat, onProgress))
  const results = await Promise.all(promises)
  return results.flat()
}
```

---

## 10. Persistance (IndexedDB)

### 10.1 Configuration IndexedDB

**Fichier:** `src/db/config.ts`

```typescript
const DB_NAME = 'quiz-master-db'
const DB_VERSION = 3

const dbPromise = idb.openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    // Store: questions
    if (!db.objectStoreNames.contains('questions')) {
      const questionsStore = db.createObjectStore('questions', { keyPath: 'id' })
      questionsStore.createIndex('countApparition', 'countApparition', { unique: false })
    }

    // Store: sessions
    if (!db.objectStoreNames.contains('sessions')) {
      const sessionsStore = db.createObjectStore('sessions', { keyPath: 'sessionId' })
      sessionsStore.createIndex('dateFin', 'dateFin', { unique: false })
    }

    // Store: meta (badges, global state)
    if (!db.objectStoreNames.contains('meta')) {
      db.createObjectStore('meta', { keyPath: 'id' })
    }

    // Store: categories
    if (!db.objectStoreNames.contains('categories')) {
      const categoriesStore = db.createObjectStore('categories', { keyPath: 'id' })
      categoriesStore.createIndex('label', 'label', { unique: true })
    }
  }
})
```

### 10.2 Repository Pattern

**Fichier:** `src/db/repositories.ts`

```typescript
// ===== QUESTION REPOSITORY =====
export const questionRepository = {
  async getAll(): Promise<Question[]> {
    const db = await dbPromise
    return db.getAll('questions')
  },

  async save(q: Question): Promise<void> {
    const db = await dbPromise
    await db.put('questions', q)
  },

  async saveMany(questions: Question[]): Promise<void> {
    const db = await dbPromise
    const tx = db.transaction('questions', 'readwrite')
    for (const q of questions) {
      await tx.objectStore('questions').put(q)
    }
    await tx.done
  },

  async clear(): Promise<void> {
    const db = await dbPromise
    await db.clear('questions')
  },

  async incrementApparition(id: string): Promise<void> {
    const db = await dbPromise
    const question = await db.get('questions', id)
    if (question) {
      question.countApparition++
      await db.put('questions', question)
    }
  },

  async incrementCorrect(id: string): Promise<void> {
    const db = await dbPromise
    const question = await db.get('questions', id)
    if (question) {
      question.countBonneReponse++
      await db.put('questions', question)
    }
  }
}

// ===== SESSION REPOSITORY =====
export const sessionRepository = {
  async getAll(): Promise<QuizSession[]> {
    const db = await dbPromise
    return db.getAll('sessions')
  },

  async save(session: QuizSession): Promise<void> {
    const db = await dbPromise
    const cleaned = JSON.parse(JSON.stringify(session))  // Remove Vue proxies
    await db.put('sessions', cleaned)
  },

  async getPendingSession(): Promise<QuizSession | undefined> {
    const db = await dbPromise
    const all = await db.getAll('sessions')
    return all.find((s) => s.dateFin === null)
  },

  async getCompleted(): Promise<QuizSession[]> {
    const db = await dbPromise
    const all = await db.getAll('sessions')
    return all.filter((s) => s.dateFin !== null)
  },

  async clear(): Promise<void> {
    const db = await dbPromise
    await db.clear('sessions')
  }
}

// ===== META REPOSITORY =====
export const metaRepository = {
  async getBadges(): Promise<Badge[]> {
    const db = await dbPromise
    const data = await db.get('meta', 'badges')
    return data?.value || []
  },

  async saveBadges(badges: Badge[]): Promise<void> {
    const db = await dbPromise
    const cleaned = JSON.parse(JSON.stringify(badges))
    await db.put('meta', { id: 'badges', value: cleaned })
  }
}

// ===== CATEGORY REPOSITORY =====
export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    const db = await dbPromise
    return db.getAll('categories')
  },

  async save(cat: Category): Promise<void> {
    const db = await dbPromise
    const cleaned = JSON.parse(JSON.stringify(cat))
    await db.put('categories', cleaned)
  },

  async saveMany(cats: Category[]): Promise<void> {
    const db = await dbPromise
    const tx = db.transaction('categories', 'readwrite')
    for (const c of cats) {
      const cleaned = JSON.parse(JSON.stringify(c))
      await tx.objectStore('categories').put(cleaned)
    }
    await tx.done
  },

  async delete(id: string): Promise<void> {
    const db = await dbPromise
    await db.delete('categories', id)
  },

  async clear(): Promise<void> {
    const db = await dbPromise
    await db.clear('categories')
  }
}
```

---

## 11. Chargement des questions

### 11.1 Workflow complet

```
1. User navigue vers /settings/import
2. Affiche liste catégories pré-chargées (localStorage)
3. User clique "Chargement catégorie" (ex: React)
   ├─ loadCategory('react')
   ├─ fetch('/questions/react.json')
   ├─ loadQuestionsFromJsonFile('react')
   │  ├─ Parse JSON
   │  ├─ Normalise categorie: 'react' → 'React' (via CATEGORY_LABEL_MAPPING)
   │  └─ Retourne Question[]
   ├─ questionRepository.saveMany(questions)
   ├─ dataStore.reloadQuestions()
   ├─ markCategoryAsLoaded('react', count)
   └─ localStorage.setItem('quiz-master-loaded-categories', ...)

4. Questions maintenant disponibles sur Home.vue
   ├─ categoriesDisponibles computed filter
   ├─ Les questions ont categorie: 'React'
   ├─ Les catégories ont label: 'React'
   └─ Match! → Catégorie affichée
```

### 11.2 Structure JSON

**Fichier:** `public/questions/react.json`

```json
[
  {
    "id": "react_001",
    "intitule": "Qu'est-ce que **JSX** ?",
    "reponses": [
      "Une syntaxe HTML dans JavaScript",
      "Un nouveau langage",
      "Un composant React",
      "Un outil"
    ],
    "indexBonneReponse": 0,
    "difficulte": "facile",
    "explication": "JSX est une extension de syntaxe permettant d'écrire HTML dans JavaScript.",
    "categorie": "react"
  },
  ...
]
```

---

## 12. Configuration et Build

### 12.1 Vite (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    port: 5174,
    open: true,
    proxy: {}  // Pas de proxy (pas de backend)
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-core': ['vue', 'vue-router', 'pinia'],
          'chart': ['chart.js'],
          'marked': ['marked']
        }
      }
    }
  }
})
```

### 12.2 TypeScript (tsconfig.app.json)

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "target": "ES2020"
  }
}
```

### 12.3 Tailwind CSS v4 (tailwind.config.js)

```javascript
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'page-enter': 'pageEnter 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      colors: {
        // Custom Material Design 3 colors
      }
    }
  }
}
```

### 12.4 Vercel (vercel.json)

**⭐ IMPORTANT pour SPA routing:**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Rôle:** Redirige toutes les requêtes vers `index.html` pour que Vue Router prenne le contrôle.

---

## 13. Quick Start

### 13.1 Installation locale

**Prérequis:**
- Node.js >= 20.19.0 || >= 22.12.0
- npm (inclus avec Node)

**Étapes:**

```bash
# 1. Cloner le repo
git clone https://github.com/vincedsb1/codemaster.git
cd codemaster

# 2. Installer dépendances
npm install

# 3. Démarrer dev server
npm run dev
# Ouvre http://localhost:5174 automatiquement

# 4. Éditer fichiers src/
# Hot Module Reloading actif (changes en temps réel)

# 5. Voir erreurs TypeScript en temps réel
# Terminal affiche erreurs type-check live
```

### 13.2 Build pour production

```bash
# 1. Type-check + build optimisé
npm run build
# Génère dist/

# 2. Tester localement avant déployer
npm run preview
# Ouvre http://localhost:4173

# 3. Déployer sur Vercel
git add .
git commit -m "..."
git push origin dev05
# Vercel redéploie automatiquement
```

### 13.3 Scripts disponibles

```bash
npm run dev               # Dev server (Vite)
npm run build            # Type-check + build prod
npm run build-only       # Build seulement (skip type-check)
npm run preview          # Prévisualiser prod localement
npm run test:unit        # Tests Vitest
npm run test:unit -- --watch  # Mode watch
npm run test:e2e         # Tests Playwright
npm run lint             # Oxlint + ESLint (auto-fix)
npm run format           # Prettier format
```

### 13.4 Structure dossier de travail

```
src/
├── views/          ← Pages à modifier (Home, Difficulty, etc.)
├── components/     ← Composants réutilisables
├── stores/         ← Logique métier (Pinia)
├── router/         ← Routes
├── types/          ← Types TypeScript
├── db/             ← IndexedDB + repositories
├── services/       ← Utilitaires
└── style.css       ← Tailwind + custom CSS
```

### 13.5 Workflow type pour modification

```bash
# 1. Créer branche feature
git checkout -b feature/ma-feature

# 2. Démarrer dev server
npm run dev

# 3. Éditer fichiers
# VSCode avec Volar extension recommandé

# 4. Voir changements en temps réel
# http://localhost:5174

# 5. Tester dans navigateur
# Ouvrir console (F12) pour logs

# 6. Valider build
npm run build

# 7. Commit et push
git add .
git commit -m "Add feature..."
git push origin feature/ma-feature

# 8. Faire PR sur main
```

---

## 14. Diagrammes de flux

### 14.1 Flux quiz complet

```
┌─────────────────┐
│    HOME PAGE    │
│ Sélect catégorie│
└────────┬────────┘
         │ selectCategory('React')
         ▼
┌─────────────────────┐
│  DIFFICULTY PAGE    │
│ Facile / Moyen / ... │
└────────┬────────────┘
         │ selectDifficulty('facile')
         ▼
┌──────────────────────────┐
│   COUNT PAGE             │
│ 5 / 10 / 20 questions    │
└────────┬─────────────────┘
         │ startQuiz(5)
         │ createQuizSession(
         │   ['React'],
         │   'facile',
         │   5
         │ )
         ▼
    IndexedDB.save(session)
         ▼
┌──────────────────────────┐
│   ACTIVE PAGE            │
│ Gameplay in progress     │
└────────┬─────────────────┘
         │
    ┌────┴────┬────────┐
    │          │        │
    ▼          ▼        ▼
submitAnswer skipQuestion nextQuestion
    │          │        │
    └────┬─────┴────────┘
         │
    Save to IndexedDB
         │
    ▼────────────┐
    ├─ isLastQuestion? → finishQuiz()
    └─ Else → nextQuestion()
         │
         ▼
┌──────────────────────────┐
│  SUMMARY PAGE            │
│ Score + Badges           │
└────────┬─────────────────┘
         │
         ├─ goHome() → HOME
         └─ replayQuiz() → COUNT
```

### 14.2 Flux import données

```
┌──────────────────────────┐
│  IMPORT PAGE             │
│ Load catégories pré      │
└────────┬─────────────────┘
         │
    ┌────┴──────┬─────────────┐
    │            │             │
    ▼            ▼             ▼
Load React   Load TS       Load All
    │            │             │
    └────┬───────┴─────────────┘
         │
fetch('/questions/react.json')
fetch('/questions/typescript.json')
         │
         ▼
loadQuestionsFromJsonFile()
    - Normalise categorie: 'react' → 'React'
    - Retourne Question[]
         │
         ▼
questionRepository.saveMany(questions)
         │
         ▼
dataStore.reloadQuestions()
         │
         ▼
markCategoryAsLoaded('react', count)
         │
         ▼
localStorage.setItem('quiz-master-loaded-categories', ...)
         │
         ▼
AUTO-NAVIGATE to Home (1.5s)
         │
         ▼
┌──────────────────────────┐
│  HOME PAGE               │
│ Catégories apparaissent! │
└──────────────────────────┘
```

### 14.3 Flux données globales

```
┌────────────────────┐
│   App.vue mount    │
└────────┬───────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
dataStore   quizStore
.initData() .checkResumable()
    │          │
    └────┬─────┘
         │
    Load IndexedDB
    - questions
    - categories
    - badges
    - sessions (pending)
         │
         ▼
    Check modal reprise
    si session pending
         │
    ┌────┴────┐
    │ Yes     │ No
    ▼         ▼
Resume   Continue
Modal    Normally
    │         │
    └────┬────┘
         │
    Ready for interaction
```

### 14.4 Flux données après quiz

```
finishQuiz()
    │
    ├─ Calcul scores
    │  - scorePondere = Σ points
    │  - notePourcentage = correct / total * 100
    │  - dateFin = now
    │  - dateJour = YYYY-MM-DD
    │
    ├─ sessionRepository.save(session)
    │
    ▼
statsStore.updateStatsAndBadges(session)
    │
    ├─ Récupère toutes sessions
    ├─ Calcule stats:
    │  - moyenneGlobale
    │  - meilleurScore
    │  - streakActuel
    │  - totalSessions
    │
    ├─ Check badges conditions:
    │  - first_quiz: totalSessions >= 1
    │  - perfect_score: score == 100%
    │  - streak_3: streakActuel >= 3
    │  - streak_7: streakActuel >= 7
    │  - marathon: totalSessions >= 20
    │  - math_expert: 5+ sessions 'Maths'
    │
    ├─ dataStore.updateBadges(badges)
    │
    ▼
statsStore.loadStats()
    │
    ▼
Summary.vue
    - Affiche scores
    - Affiche badges nouveaux (newlyUnlockedBadges)
    - Options: Home ou Replay
```

---

## 15. Checklist de test

### 15.1 Tests fonctionnels - Quiz

- [ ] **Home page**
  - [ ] Affiche liste catégories (si questions chargées)
  - [ ] Message "Aucune catégorie" si pas de questions
  - [ ] Clique catégorie → navigue vers Difficulty
  - [ ] Bouton "Mode aléatoire" → navigue vers RandomConfig

- [ ] **Difficulty page**
  - [ ] 4 boutons (facile, moyen, difficile, aléatoire)
  - [ ] Clique → sélectionne + navigue vers Count
  - [ ] Points corrects affichés

- [ ] **Count page**
  - [ ] 3 options (5, 10, 20)
  - [ ] Clique créé session + navigue vers Active
  - [ ] Erreur "Pas assez de questions" si 0 questions
  - [ ] Session sauvegardée en IndexedDB

- [ ] **Active page**
  - [ ] Affiche question courante
  - [ ] 4 réponses mélangées différemment à chaque quiz
  - [ ] Barre progression correcte (X/Y)
  - [ ] Bouton réponse desactivé après réponse
  - [ ] Explication affichée après réponse
  - [ ] Boutton "Suivant" → question suivante
  - [ ] Bouton "Passer" → saute question (estSkippe=true)
  - [ ] Dernière question → "Terminer" → finishQuiz()
  - [ ] Session sauvegardée après chaque action

- [ ] **Summary page**
  - [ ] Score affiché (0-100%)
  - [ ] Bonnes réponses / total correct
  - [ ] Moyenne globale comparée
  - [ ] Streak actualisé
  - [ ] Badges débloqués affichés (si nouveaux)
  - [ ] Bouton "Accueil" → retour Home
  - [ ] Bouton "Rejouer" → Count avec même config

### 15.2 Tests fonctionnels - Import & Catégories

- [ ] **Import page**
  - [ ] Liste catégories affichée
  - [ ] Bouton "Charger" (React, TypeScript, etc.)
  - [ ] Barre progression pendant chargement
  - [ ] Après chargement: badge "✓" affichée
  - [ ] "Tout ajouter" charge toutes catégories
  - [ ] Après "Tout ajouter": auto-navigue vers Home
  - [ ] Upload JSON personnalisé → SelectCategory
  - [ ] Erreur handling (JSON invalide)
  - [ ] "Réinitialiser stats" efface sessions (confirmation)

- [ ] **SelectCategory page**
  - [ ] Liste catégories existantes (radio buttons)
  - [ ] Formulaire création nouvelle catégorie
  - [ ] Sélection icône (24 options)
  - [ ] Sélection couleur (14 options)
  - [ ] Validation: label requis + unique
  - [ ] Après sélection/création: import JSON
  - [ ] Auto-navigue vers Home après succès

- [ ] **Categories page**
  - [ ] Liste toutes catégories
  - [ ] Nombre questions par catégorie affiché
  - [ ] Clique → édite catégorie
  - [ ] Swipe left → révèle bouton supprimer
  - [ ] Supprimer → confirmation + cascade questions
  - [ ] FAB "+" → crée nouvelle catégorie

- [ ] **CategoryEdit page**
  - [ ] Mode création: form vide
  - [ ] Mode édition: form pré-rempli
  - [ ] Validation label unique
  - [ ] Sélection icône/couleur
  - [ ] Save → retour Categories
  - [ ] Label change cascade questions

### 15.3 Tests fonctionnels - Statistiques

- [ ] **Stats page**
  - [ ] KPI cards affichées:
    - [ ] Moyenne globale (%)
    - [ ] Meilleur score (%)
    - [ ] Streak actuel (jours)
    - [ ] Total quizzes
  - [ ] Graphique 30 jours:
    - [ ] Axes correctes (jours / %)
    - [ ] Données correctes (moyennes)
    - [ ] Responsive
  - [ ] Grille badges (3 colonnes):
    - [ ] Verrouillés: grayscale
    - [ ] Débloqués: couleur + date
    - [ ] Clique → détails badge

- [ ] **Badge unlock**
  - [ ] first_quiz: après 1er quiz
  - [ ] perfect_score: après 100%
  - [ ] streak_3: après 3j consécutifs
  - [ ] streak_7: après 7j consécutifs
  - [ ] marathon: après 20 quizzes
  - [ ] Notification affichée en Summary

### 15.4 Tests techniques - Persistance

- [ ] **IndexedDB**
  - [ ] Questions sauvegardées après import
  - [ ] Sessions sauvegardées pendant/après quiz
  - [ ] Badges sauvegardés après unlock
  - [ ] Categories sauvegardées après ajout
  - [ ] Reload page → données persistent

- [ ] **localStorage**
  - [ ] État catégories chargées persiste
  - [ ] Session resume modal appears si session pending

- [ ] **sessionStorage**
  - [ ] JSON upload stocké avant navigation
  - [ ] Récupéré sur SelectCategory

### 15.5 Tests techniques - Données

- [ ] **Catégories normalisées**
  - [ ] Questions ont: categorie='React' (label)
  - [ ] Catégories ont: label='React'
  - [ ] Match sur Home.vue (categoriesDisponibles)
  - [ ] Match sur QuizStore filter (createQuizSession)

- [ ] **Scores calculés**
  - [ ] Points corrects: facile=1, moyen=2, difficile=3
  - [ ] notePourcentage = correct/total*100
  - [ ] scorePondere = Σ points des bonnes réponses
  - [ ] scorePondereMax = Σ points toutes questions

- [ ] **Streak calculation**
  - [ ] Jours consécutifs comptés correctement
  - [ ] Réinitialise si > 1 jour sans quiz
  - [ ] Affichée en Summary et Stats

- [ ] **Réponses mélangées**
  - [ ] ordreReponses différent pour chaque session
  - [ ] Pas toujours [0, 1, 2, 3]
  - [ ] Vérification correcte avec indexBonneReponse original

### 15.6 Tests techniques - Build

- [ ] **npm run build**
  - [ ] Type-check passe (0 erreurs TypeScript)
  - [ ] Vite build réussit
  - [ ] dist/ générée avec assets
  - [ ] Tailles raisonnables:
    - CSS: < 40KB
    - JS: < 500KB

- [ ] **npm run preview**
  - [ ] Prévisualise prod correctement
  - [ ] http://localhost:4173 accessible
  - [ ] Routing SPA fonctionne (rechargement page)

- [ ] **Vercel deployment**
  - [ ] vercel.json present (SPA routing)
  - [ ] public/questions/*.json servis statiquement
  - [ ] Build redéploie automatiquement sur git push

### 15.7 Tests UX - Responsive

- [ ] **Mobile (iPhone SE / 375px)**
  - [ ] Texte lisible
  - [ ] Boutons cliquables (min 44x44px)
  - [ ] Grille badges 1 colonne
  - [ ] Graphique responsive
  - [ ] Swipe-to-delete catégories
  - [ ] Modal overlay correct

- [ ] **Tablet (iPad / 768px)**
  - [ ] Grille badges 2 colonnes
  - [ ] Layout centré
  - [ ] Touch events fonctionnent

- [ ] **Desktop (1920px)**
  - [ ] Grille badges 3 colonnes
  - [ ] Spacing optimal
  - [ ] Souris events fonctionnent

### 15.8 Tests UX - Offline

- [ ] **Offline mode**
  - [ ] Après chargement initial: fonctionne sans connexion
  - [ ] Quiz jouable offline
  - [ ] Données sauvegardées localement
  - [ ] Synchro données (n/a, pas de server)

### 15.9 Tests PWA

- [ ] **Installation**
  - [ ] Bouton "Install" appear (Chrome)
  - [ ] Ajouter à écran d'accueil (iOS)
  - [ ] App lanceable hors navigateur
  - [ ] Fonctionne offline une fois installée

- [ ] **Manifest.json** (si applicable)
  - [ ] Icons définis
  - [ ] Theme colors correct
  - [ ] Display: standalone

### 15.10 Tests de régression - Fixes récents

- [ ] **Category normalization (FIX: label matching)**
  - [ ] Questions importées ont categorie='React' (pas 'react')
  - [ ] Home.vue filtre par label correctement
  - [ ] QuizStore filter par label (pas ID)
  - [ ] Nouveau quiz trouve questions importées

- [ ] **Auto-navigate after import**
  - [ ] "Tout ajouter" complète 100%
  - [ ] Auto-navigate vers Home après 1.5s
  - [ ] Categories visibles sur Home

- [ ] **Vercel SPA routing**
  - [ ] Direct URL /quiz/active → charge correctement
  - [ ] Rafraîchir page → pas 404
  - [ ] public/questions/*.json accessibles

- [ ] **TypeScript strict**
  - [ ] npm run build 0 erreurs
  - [ ] Pas de `any` injustifiés
  - [ ] Props/emits correctement typées

---

## 16. Troubleshooting

### Problème: Aucune catégorie sur Home après import

**Diagnostic:**
```
1. Vérifier console: [QuestionsLoader] Loaded X questions from react.json
2. Vérifier: notePourcentage montre "250 questions" → OK DB
3. Vérifier categoriesDisponibles computed:
   - Question categories: react (❌ ancien) vs React (✅ nouveau)
   - Category labels: React
   - Match? Non → FIX appliqué
```

**Solution:**
- Assurer `CATEGORY_LABEL_MAPPING` utilisé dans `questionsLoader.ts`
- Questions doivent avoir `categorie: 'React'` (pas 'react')
- Catégories ont `label: 'React'`
- Filtre: `questionsCategories.has(cat.label)`

---

### Problème: Quiz ne démarre pas ("Pas assez de questions")

**Diagnostic:**
```typescript
[QuizStore] Total questions in store: 0
[QuizStore] Category labels for filtering: ['React']
[QuizStore] Questions after category filter: 0
```

**Cause possible:**
1. Catégories pas chargées → import categories d'abord
2. Filter par ID (ancien code) → vérifier QuizStore ligne 91-96
3. Catégorie filtrée mal → "React" vs "react" mismatch

**Solution:**
```typescript
// ✅ CORRECT
let pool = dataStore.questions.filter((q) => categoryLabels.includes(q.categorie))

// ❌ WRONG (ancien)
let pool = dataStore.questions.filter((q) => categoryIds.includes(q.categorie))
```

---

### Problème: Vercel 404 sur routes SPA

**Diagnostic:**
- `/quiz/active` → 404 Page not found
- Autres routes fonctionnent

**Cause:**
- `vercel.json` absent ou incorrect

**Solution:**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
Redéployer après ajout.

---

### Problème: Questions JSON pas trouvées (404)

**Diagnostic:**
```
[QuestionsLoader] Response status for react.json: 404
```

**Cause:**
- `public/questions/react.json` pas présent
- Vercel ne serve pas le dossier public/

**Solution:**
1. Vérifier `/public/questions/*.json` existent localement
2. Commiter: `git add public/questions/`
3. Pousser vers Vercel
4. Vérifier deployment log

---

### Problème: Build échoue avec erreurs TypeScript

**Exemple:**
```
error TS2322: Type 'string | undefined' not assignable to 'string'
```

**Solution:**
1. Lire la ligne exacte mentionnée
2. Ajouter type guard: `if (value !== undefined) { ... }`
3. Ou utiliser non-null assertion: `value!`
4. Tester: `npm run build`

---

### Problème: Import JSON échoue

**Erreur:**
```
Error parsing JSON
```

**Checklist:**
1. Format valide? Tester sur jsonlint.com
2. Propriétés requises? intitule, reponses[], indexBonneReponse, difficulte
4. Reponses exactement 4? `reponses.length === 4`
5. indexBonneReponse entre 0-3?
6. Difficulté est 'facile' | 'moyen' | 'difficile'?

---

### Problème: Stats vides après quiz

**Diagnostic:**
- Summary affiche score → OK
- Stats page vide

**Cause possible:**
- `statsStore.loadStats()` pas appelée après quiz
- Sessions pas sauvegardées

**Solution:**
```typescript
// Dans finishQuiz() → après sessionRepository.save(session)
await statsStore.updateStatsAndBadges(session)
await statsStore.loadStats()  // ← Important
```

---

### Problème: Session resume modal ne s'affiche pas

**Diagnostic:**
- Fermer navigateur pendant quiz
- Rouvrir → pas de modal

**Cause:**
- `checkResumableSession()` pas appelée
- Session pas sauvegardée avec `dateFin = null`

**Solution:**
```typescript
// App.vue onMounted
onMounted(async () => {
  await quizStore.checkResumableSession()  // ← Requis
})
```

---

## Conclusion

Cette documentation couvre l'intégralité de CodeMaster v2.0 avec tous les changements récents intégrés:

✅ **Catégories normalisées** (labels au lieu d'IDs)
✅ **JSON questions dans public/** (static serving)
✅ **QuizStore filtre par labels** (pas par IDs)
✅ **Auto-navigate après import** (1.5s)
✅ **Vercel SPA routing** (vercel.json)
✅ **TypeScript strict** (0 erreurs)

Pour des questions ou clarifications, consultez le code source ou exécutez les tests de la checklist.

**Version:** 2.0 (November 2024)
**Dernière mise à jour:** Post-deployment sur Vercel
