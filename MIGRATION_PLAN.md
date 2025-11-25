# Plan de Migration : Prototype Quiz → Architecture Production

## Vue d'ensemble
Migrer une application Quiz monolithique (HTML + Vue 3 CDN) vers une architecture modulaire et scalable avec Vite, TypeScript, Pinia et Vue Router.

**Prototype actuel:** 1 fichier HTML (~1447 lignes), état global en mémoire
**Cible:** Architecture complète avec séparation des responsabilités

---

## Phase 1 : Configuration des types et modèles

### 1.1 `src/types/models.ts`
Créer les interfaces TypeScript pour tous les modèles métier :

```
- Question { id, intitule, reponses, indexBonneReponse, explication, categorie, difficulte, countApparition, countBonneReponse }
- SessionQuestion { ...Question, ordreReponses[], estSkippe, estCorrecte, estChoisie }
- QuizSession { sessionId, dateDebut, dateFin, questions[], indexQuestionCourante, nbQuestions, scorePondere, scorePondereMax, notePourcentage, difficulteChoisie, categories, dateJour }
- Badge { id, nom, description, statut, icon, dateDebloque }
- GlobalStats { moyenneGlobale, meilleurScore, streakActuel, totalSessions, historiqueSessions[] }
- ImportData (pour validation import JSON)
```

### 1.2 `src/types/constants.ts`
- Constantes d'énumération (difficultés, statut badges, etc.)
- Données par défaut (DEFAULT_QUESTIONS, DEFAULT_BADGES)

---

## Phase 2 : Persistence (IndexedDB)

### 2.1 `src/db/config.ts`
- Configuration IndexedDB : DB_NAME, DB_VERSION, stores
- `initDatabase()` : création des object stores
- `getDbPromise()` : singleton d'accès

### 2.2 `src/db/repositories.ts`
Isolation complète de la logique d'accès données :

```
- saveQuestion(q: Question): Promise
- loadAllQuestions(): Promise<Question[]>
- updateQuestion(q: Question): Promise
- saveSession(session: QuizSession): Promise
- loadAllSessions(): Promise<QuizSession[]>
- deleteSession(sessionId: string): Promise
- updateBadges(badges: Badge[]): Promise
- loadBadges(): Promise<Badge[]>
- clearAllSessions(): Promise
```

---

## Phase 3 : Stores Pinia

### 3.1 `src/stores/useDataStore.ts`
**Responsabilité:** Gestion des données statiques (questions, badges)

```
State:
- questions: Question[]
- badges: Badge[]
- isLoading: boolean
- error: string

Actions:
- initData() - charge questions et badges du DB, ou defaults
- importQuestions(json: any[]) - valide et sauvegarde import
- resetBadges() - réinitialise status à "verrouille"
```

### 3.2 `src/stores/useQuizStore.ts`
**Responsabilité:** Gestion d'une session de quiz active

```
State:
- activeSession: QuizSession | null
- selectedAnswerIndex: number | null
- hasAnswered: boolean
- showResumeModal: boolean

Computed:
- currentQuestion
- currentQuestionIndex
- progressPercent
- isLastQuestion

Actions:
- createQuizSession(categories[], difficulty, count)
- submitAnswer(answerIndex)
- skipQuestion()
- nextQuestion()
- finishQuiz()
- resumePreviousSession()
- abandonSession()
- saveCurrentSession() (aux)
```

### 3.3 `src/stores/useStatsStore.ts`
**Responsabilité:** Calcul des statistiques et logique des badges

```
State:
- globalStats: GlobalStats
- previousStats: { average }
- newlyUnlockedBadges: Badge[]

Computed:
- badgesNonLus (getter pour notification)

Actions:
- loadStats() - recalcule depuis toutes les sessions
- updateStatsAndBadges(session) - après fin de quiz
- calculateStreak(sessions[]) (helper)
- calculateDailyAverages(sessions[]) (helper)
- checkAndUnlockBadges(session, allSessions) (helper)
- resetAllStats()
```

---

## Phase 4 : Routing avec Vue Router

### 4.1 `src/router/index.ts`
Configuration des routes remplaçant `currentView` :

```
Routes:
- /home - HomeView
- /quiz/difficulty - DifficultyView
- /quiz/count - QuestionCountView
- /quiz/randomconfig - RandomConfigView
- /quiz/active - QuizView
- /quiz/summary - QuizSummaryView
- /stats - StatsView
- /settings/import - ImportView
- / (redirect to /home)

Navigation patterns:
- selectCategory() → router.push('/quiz/difficulty')
- selectDifficulty() → router.push('/quiz/count')
- startQuiz() → router.push('/quiz/active')
- finishQuiz() → router.push('/quiz/summary')
```

---

## Phase 5 : Composants Vue

### 5.1 Layout & Structure
```
src/components/
├── layout/
│   ├── AppHeader.vue - Header avec logo + stats button
│   └── AppLayout.vue - Wrapper avec header + <router-view>
└── ...
```

### 5.2 Vues (par feature)
```
src/views/
├── quiz/
│   ├── Home.vue - Sélection catégorie + mode aléatoire
│   ├── RandomConfig.vue - Checkbox catégories
│   ├── Difficulty.vue - Choix difficulté
│   ├── Count.vue - Choix nombre questions
│   ├── Active.vue - Quiz actif avec progression
│   └── Summary.vue - Score + badges + comparaison stats
├── stats/
│   └── Index.vue - KPIs + chart + badges
└── settings/
    └── Import.vue - Import JSON + Reset
```

### 5.3 Composants réutilisables
```
src/components/
├── quiz/
│   ├── QuestionCard.vue - Affichage intitulé + explication
│   ├── AnswerOption.vue - Bouton réponse avec states
│   └── ProgressBar.vue - Barre de progression
├── stats/
│   ├── StatCard.vue - KPI (moyenne, meilleur score, etc.)
│   ├── EvolutionChart.vue - Chart.js wrapper
│   └── BadgesGrid.vue - Grille badges 3 colonnes
└── common/
    ├── BaseButton.vue - Button réutilisable
    ├── BaseModal.vue - Modal générique (resume, etc.)
    └── LoadingSpinner.vue
```

---

## Phase 6 : Transitions et animations

### 6.1 App.vue wrapper
```vue
<template>
  <transition name="slide" mode="out-in">
    <router-view />
  </transition>
</template>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from { opacity: 0; transform: translateX(30px); }
.slide-leave-to { opacity: 0; transform: translateX(-30px); }
</style>
```

---

## Phase 7 : Fixtures et données de test

### 7.1 `src/fixtures/questions.ts`
10 questions par défaut (math, géographie, science, art, physique, etc.)

### 7.2 `src/fixtures/index.ts`
Export DEFAULT_QUESTIONS, DEFAULT_BADGES, helper pour créer sessions de test

---

## Mapping Logique : Prototype → Production

| Logique | Localisation | Type |
|---------|--------------|------|
| State questions/badges | `useDataStore` | Store |
| State activeSession | `useQuizStore` | Store |
| State globalStats | `useStatsStore` | Store |
| IndexedDB operations | `db/repositories.ts` | Services |
| Validation import JSON | `useDataStore.importQuestions()` | Action Store |
| Calcul streak/badges | `useStatsStore.checkAndUnlockBadges()` | Action Store |
| Chart.js rendering | `EvolutionChart.vue` | Composant |
| Modal resume | `BaseModal.vue` (controlled by `useQuizStore`) | Composant |
| Navigation | `router/index.ts` + `router.push()` | Router |

---

## Checklist de mise en œuvre

### Phase 1 : Fondations
- [ ] Créer `types/models.ts` avec toutes les interfaces
- [ ] Créer `types/constants.ts` avec enums et defaults
- [ ] Configurer `db/config.ts` et `db/repositories.ts`

### Phase 2 : Stores
- [ ] Implémenter `useDataStore.ts`
- [ ] Implémenter `useQuizStore.ts`
- [ ] Implémenter `useStatsStore.ts`

### Phase 3 : Router et Layout
- [ ] Configurer `router/index.ts` avec 7 routes
- [ ] Créer `App.vue` avec `<router-view>` et transitions
- [ ] Créer `AppHeader.vue` et `AppLayout.vue`

### Phase 4 : Vues principales
- [ ] HomeView, DifficultyView, CountView
- [ ] RandomConfigView
- [ ] QuizView (active)
- [ ] SummaryView
- [ ] StatsView
- [ ] ImportView

### Phase 5 : Composants réutilisables
- [ ] Composants quiz (QuestionCard, AnswerOption, ProgressBar)
- [ ] Composants stats (StatCard, EvolutionChart, BadgesGrid)
- [ ] Composants common (BaseButton, BaseModal)

### Phase 6 : Finition
- [ ] Fixtures/données de test
- [ ] Tests unitaires pour stores
- [ ] Tests e2e pour workflows clés
- [ ] Optimisations CSS/responsiveness

---

## Décisions architecturales clés

1. **Resume modal → useQuizStore** : Au démarrage de l'app (onMounted), le store vérifie si une session existe en DB
2. **Transitions → router-view** : Transitions automatiques sur les changements de route
3. **Structure views par feature** : Plus facile à maintenir quand la feature grandit
4. **Chart.js in component** : `onMounted()` init, `onUnmounted()` cleanup
5. **Seed données** : DEFAULT_QUESTIONS dans `types/constants.ts`, chargeables au premier lancement

---

## Ordre de développement recommandé

1. Types + Constants
2. DB Layer
3. Stores (dans cet ordre : DataStore → QuizStore → StatsStore)
4. Router setup
5. AppLayout + AppHeader
6. Vue principale : HomeView (simple structure)
7. Composants communs (BaseButton, BaseModal)
8. Vues quiz complètes
9. Vues stats + composants
10. Fixtures + tests
11. Polish + optimisations
