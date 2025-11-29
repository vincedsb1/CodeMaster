# CodeMaster - Spécification Fonctionnelle Complète

**Version:** 1.0
**Date:** Novembre 2024
**Application:** Progressive Web Application (PWA) de Quiz
**Nom du projet:** CodeMaster (Quiz Master)

---

## 1. Vue d'ensemble de l'application

### 1.1 Problème métier adressé

CodeMaster est une application web permettant aux utilisateurs de :
- **S'entraîner** via des quiz sur des sujets techniques (TypeScript, React, Next.js, Node.js, CSS, JavaScript, Entretiens)
- **Progresser** en suivant leurs statistiques sur 30 jours
- **Débloquer des badges** pour récompenser les jalons d'apprentissage
- **Gérer les données** en important des questions depuis des fichiers JSON personnalisés
- **Organiser le contenu** en créant et en gérant des catégories de questions

### 1.2 Type d'utilisateurs

**Utilisateur final / Apprenant**
- Accès unique, pas de système d'authentification
- Toutes les données sont locales (IndexedDB) et non synchronisées
- Une session par appareil / navigateur
- Pas de notion d'utilisateur distinct

### 1.3 Grandes fonctionnalités

1. **Système de quiz**
   - Sélection de catégories
   - Choix de difficulté (facile, moyen, difficile, aléatoire)
   - Sélection du nombre de questions (5, 10, 20)
   - Navigation dans les questions (suivant, passer)
   - Réponses aux questions avec feedback explicatif

2. **Gestion des catégories et des questions**
   - Import de questions depuis fichiers JSON
   - Création et édition de catégories personnalisées
   - Suppression de catégories et questions associées
   - Association des questions à des catégories

3. **Système de statistiques**
   - Moyenne des scores (pourcentage)
   - Meilleur score atteint
   - Streak actuel (jours consécutifs)
   - Total de quizzes complétés
   - Évolution sur 30 jours (graphique)

4. **Système de badges**
   - 6 badges distincts avec conditions de déblocage
   - Notifications lors du déblocage
   - Historique du déblocage (date)

5. **Persistance des données**
   - Toutes les données stockées localement dans IndexedDB
   - Reprise automatique d'une session non terminée
   - Aucun serveur ni synchronisation cloud

---

## 2. Stack technique & architecture

### 2.1 Technologies côté frontend

| Aspect | Technologie | Version |
|--------|-------------|---------|
| Framework | Vue.js | 3.5.22 |
| Language | TypeScript | 5.9 |
| Build | Vite | 7.1.11 |
| State Management | Pinia | 3.0.3 |
| Routing | Vue Router | 4.6.3 |
| Styling | Tailwind CSS | v4 (via @tailwindcss/postcss) |
| Icons | Phosphor Icons | (CDN unpkg) |
| Charts | Chart.js | 4.5.1 |
| Markdown | marked | 17.0.1 |

### 2.2 Architecture générale

**Pattern:** Monolithique frontend-only (aucun serveur backend)

**Structure des dossiers:**
```
src/
├── main.ts                    # Point d'entrée Vue + Pinia + Router
├── App.vue                    # Root component avec transitions
├── style.css                  # Tailwind + custom components
├── types/
│   ├── models.ts             # Interfaces TypeScript
│   └── constants.ts          # Constantes et données par défaut
├── db/
│   ├── config.ts             # IndexedDB setup et opérations
│   └── repositories.ts       # Repository pattern (CRUD)
├── stores/                    # 3 stores Pinia
│   ├── useDataStore.ts       # Questions, badges, catégories
│   ├── useQuizStore.ts       # Session de quiz active
│   └── useStatsStore.ts      # Statistiques et badges
├── router/
│   └── index.ts              # Configuration Vue Router (8 routes)
├── views/                     # Pages (10 fichiers Vue)
│   ├── quiz/
│   │   ├── Home.vue
│   │   ├── Difficulty.vue
│   │   ├── Count.vue
│   │   ├── RandomConfig.vue
│   │   ├── Active.vue
│   │   └── Summary.vue
│   ├── stats/
│   │   └── Index.vue
│   └── settings/
│       ├── Import.vue
│       ├── SelectCategory.vue
│       ├── Categories.vue
│       └── CategoryEdit.vue
├── components/                # Composants réutilisables
│   ├── layout/
│   │   ├── AppHeader.vue      # En-tête + navigation
│   │   └── AppLayout.vue      # Layout principal
│   ├── quiz/
│   │   ├── QuestionCard.vue   # Affichage question
│   │   ├── AnswerOption.vue   # Bouton réponse
│   │   └── ProgressBar.vue    # Barre de progression
│   ├── stats/
│   │   ├── StatCard.vue       # Carte KPI
│   │   ├── EvolutionChart.vue # Graphique 30j
│   │   └── BadgesGrid.vue     # Grille de badges
│   └── common/
│       ├── BaseButton.vue     # Bouton réutilisable
│       ├── BaseModal.vue      # Modal
│       ├── LoadingSpinner.vue # Spinner
│       └── MarkdownText.vue   # Rendu Markdown
└── fixtures/
    └── questions.ts          # Données de test (30 questions)
```

### 2.3 Gestion des données (IndexedDB)

**Base de données:** `quiz-master-db` (version 3)

**Stores (Object Stores) et indices:**

| Store | Key Path | Indices | Rôle |
|-------|----------|---------|------|
| `questions` | `id` | `countApparition` (non-unique) | Questions et métadonnées |
| `sessions` | `sessionId` | `dateFin` (non-unique) | Historique des quiz |
| `meta` | `id` | aucun | Badges, métadonnées globales |
| `categories` | `id` | `label` (unique) | Catégories de questions |

**Schéma relationnel:**
- Une `Question` appartient à une `Category` (via `categorie: string` = category ID)
- Une `QuizSession` contient plusieurs `SessionQuestion` (questions modifiées pour le quiz)
- Un `Badge` est indépendant, lié aux `QuizSession` via logique métier

### 2.4 Librairies clés

**Authentification:** Aucune (app locale)

**Formulaires:** Vue standard (réactivité via `ref()`)

**Data fetching:** IndexedDB direct (repositories pattern)

**Validation:** Logique imperméative dans les stores et composants

**Routing:** Vue Router 4 avec navigation par nom de route

**Internationalisation:** Aucune (application en français)

**Tests:**
- Unitaires: Vitest 3.2.4 + @vue/test-utils 2.4.6
- E2E: Playwright 1.56.1

---

## 3. Routage & Pages (cartographie exhaustive)

### 3.1 Structure des routes

Toutes les routes sont imbriquées sous `/` avec `AppLayout` comme composant parent.

```
/
├── /home                          → HomeView
├── /quiz/difficulty               → DifficultyView
├── /quiz/count                    → CountView
├── /quiz/randomconfig             → RandomConfigView
├── /quiz/active                   → QuizActiveView
├── /quiz/summary                  → SummaryView
├── /stats                         → StatsView
├── /settings/import               → ImportView
├── /settings/select-category      → SelectCategoryView
├── /settings/categories           → CategoriesView
└── /settings/categories/edit      → CategoryEditView (create ou edit mode)
```

Redirection: `/` → `/home`

### 3.2 Détail des routes / pages

#### **Route: `/home` (HomeView)**

**Composant:** `src/views/quiz/Home.vue`

**Rôle:** Page d'accueil et sélection de catégorie pour un quiz

**Utilisateurs autorisés:** Tous

**Actions principales:**
1. Afficher la liste des catégories disposant de questions
2. Permettre la sélection d'une catégorie → parcours `Difficulté → Nombre de questions → Quiz`
3. Ouvrir le mode aléatoire (multi-catégories) → parcours `RandomConfig → Difficulté → Nombre de questions → Quiz`
4. Naviguer vers l'import de données si aucune catégorie disponible

**Données affichées:**
- Grille de catégories (labels, icônes colorées)
- Bouton "Mode Aléatoire"
- Alerte si aucune catégorie disponible
- Lien d'accès à l'import de données

**API / Stores:**
- `useDataStore`: `questions`, `allCategories`, `reloadQuestions()`
- `useQuizStore`: `selectCategory()`, `openRandomConfig()`

**Navigation sortante:**
- `selectCategory(label)` → `/quiz/difficulty`
- `openRandomConfig()` → `/quiz/randomconfig`
- `goToImport()` → `/settings/import`

---

#### **Route: `/quiz/difficulty` (DifficultyView)**

**Composant:** `src/views/quiz/Difficulty.vue`

**Rôle:** Sélection du niveau de difficulté

**Utilisateurs autorisés:** Tous

**Actions principales:**
1. Afficher 4 boutons (Facile, Moyen, Difficile, Aléatoire)
2. Enregistrer la sélection dans le store
3. Naviguer vers la sélection du nombre de questions

**Données affichées:**
- Boutons avec labels de difficulté
- Description des points accordés par niveau

**API / Stores:**
- `useQuizStore`: `selectDifficulty(difficulty)`

**Navigation sortante:**
- Après sélection → `/quiz/count`

---

#### **Route: `/quiz/count` (CountView)**

**Composant:** `src/views/quiz/Count.vue`

**Rôle:** Sélection du nombre de questions pour le quiz

**Utilisateurs autorisés:** Tous

**Actions principales:**
1. Afficher 3 options (5, 10, 20 questions)
2. Créer une session de quiz avec :
   - Catégories sélectionnées (Home ou RandomConfig)
   - Difficulté sélectionnée (Difficulty)
   - Nombre de questions choisi
3. Naviguer vers le quiz actif

**Données affichées:**
- 3 boutons de sélection (5/10/20)

**API / Stores:**
- `useQuizStore`: `createQuizSession(categories, difficulty, count)`

**Navigation sortante:**
- Après création → `/quiz/active`

---

#### **Route: `/quiz/randomconfig` (RandomConfigView)**

**Composant:** `src/views/quiz/RandomConfig.vue`

**Rôle:** Configuration du mode aléatoire (sélection multi-catégories)

**Utilisateurs autorisés:** Tous

**Actions principales:**
1. Afficher toutes les catégories avec questions
2. Multi-sélection de catégories (checkboxes)
3. Valider la sélection (minimum 1 catégorie)
4. Enregistrer la sélection
5. Naviguer vers le choix de difficulté

**Données affichées:**
- Liste de catégories sélectionnables
- Nombre de questions par catégorie (optionnel)

**API / Stores:**
- `useDataStore`: `allCategories`, `questions`
- `useQuizStore`: `randomCategoriesSelection`, `validateRandomSelection()`

**Validation:**
- Au moins 1 catégorie doit être sélectionnée

**Navigation sortante:**
- Après validation → `/quiz/difficulty`

---

#### **Route: `/quiz/active` (QuizActiveView)**

**Composant:** `src/views/quiz/Active.vue`

**Rôle:** Interface de quiz en cours (page principale de jeu)

**Utilisateurs autorisés:** Tous (si session active)

**Actions principales:**
1. Afficher la question courante avec :
   - Énoncé (peut contenir du Markdown)
   - Catégorie et difficulté de la question
   - 4 réponses mélangées
   - Numéro de la question et progression
2. Permettre à l'utilisateur de :
   - Sélectionner une réponse → valider (`submitAnswer()`)
   - Passer la question (`skipQuestion()`)
3. Afficher l'explication après réponse
4. Progresser vers la question suivante ou terminer le quiz

**Données affichées:**
- Barre de progression (%)
- Numéro question / total
- Texte de la question
- 4 boutons réponse
- Badge difficulté et catégorie
- Explication (après réponse)

**API / Stores:**
- `useQuizStore`:
  - `activeSession`, `currentQuestion`, `selectedAnswerIndex`, `hasAnswered`
  - `submitAnswer(index)`, `skipQuestion()`, `nextQuestion()`
  - `progressPercent`, `isLastQuestion`, `isQuizFinished`

**Comportements métier:**
- Les réponses sont mélangées aléatoirement à chaque question (`ordreReponses`)
- Les réponses correctes incrémentent `countBonneReponse` de la question originale
- Les apparitions incrémentent `countApparition`
- Si la dernière question → appeler `finishQuiz()`

**Navigation sortante:**
- Après quiz terminé → `/quiz/summary`

---

#### **Route: `/quiz/summary` (SummaryView)**

**Composant:** `src/views/quiz/Summary.vue`

**Rôle:** Résumé et résultats du quiz

**Utilisateurs autorisés:** Tous (après avoir terminé un quiz)

**Actions principales:**
1. Afficher le score obtenu (%)
2. Afficher le nombre de bonnes réponses
3. Comparer avec la moyenne globale
4. Afficher le streak courant
5. Afficher les badges nouvellement débloqués
6. Permettre de :
   - Retourner à l'accueil
   - Refaire le même quiz (replay)

**Données affichées:**
- Score en cercle de progression (0-100%)
- Bonnes réponses / total
- Moyenne globale et comparaison
- Streak actuel
- Badges débloqués (nom, icône, description)
- Message personnalisé selon performance

**API / Stores:**
- `useQuizStore`: `activeSession`, `getReplayParams()`
- `useStatsStore`: `globalStats`, `newlyUnlockedBadges`, `loadStats()`

**Calculs métier:**
- Score en % = (correct answers / total questions) × 100
- Score pondéré = somme des points selon difficulté des bonnes réponses
- Comparaison à la moyenne globale

**Navigation sortante:**
- `goHome()` → `/home`
- `replayQuiz()` → `/quiz/count` avec paramètres précédents

---

#### **Route: `/stats` (StatsView)**

**Composant:** `src/views/stats/Index.vue`

**Rôle:** Tableau de bord statistiques

**Utilisateurs autorisés:** Tous

**Actions principales:**
1. Afficher 4 KPI cards :
   - Moyenne globale (%)
   - Meilleur score (%)
   - Streak actuel (jours)
   - Total de quizzes complétés
2. Afficher graphique d'évolution 30 jours (moyenne quotidienne)
3. Afficher grille de badges (vérouillés / débloqués)
4. Afficher détails badge au clic (modal)

**Données affichées:**
- 4 cartes de statistiques
- Graphique Chart.js (30 jours)
- Grille 3 colonnes de badges
- Détails badge au hover/clic

**API / Stores:**
- `useStatsStore`:
  - `globalStats` (moyenne, meilleur score, streak, sessions)
  - `calculateDailyAverages(sessions)` pour le graphique
- `useDataStore`: `badges`

**Calculs métier:**
- Moyenne globale = moyenne de tous les scores en %
- Meilleur score = max des scores
- Streak = jours consécutifs avec au moins 1 quiz
- Historique 30 jours = groupé par date

**Navigation sortante:**
- Aucune (page de consultation)

---

#### **Route: `/settings/import` (ImportView)**

**Composant:** `src/views/settings/Import.vue`

**Rôle:** Gestion des données et import de questions

**Utilisateurs autorisés:** Tous

**Actions principales:**
1. Afficher liste des catégories pré-chargées avec statut :
   - "Non chargé", "En cours", "Chargé", "Erreur"
2. Charger catégories individuelles (via fichiers JSON internes)
3. Charger toutes les catégories (avec progression globale)
4. Réessayer une catégorie échouée
5. Upload personnalisé : sélectionner fichier JSON → `SelectCategory`
6. Réinitialiser les statistiques (danger zone)
7. Annuler opération en cours

**Données affichées:**
- Tableau / liste des catégories avec statut de chargement
- Barre de progression (par catégorie et globale)
- Boutons d'action
- Zone de danger (reset stats)

**API / Stores:**
- `useDataStore`: `importQuestions()`, `reloadQuestions()`
- `useStatsStore`: pour reset stats
- `sessionRepository`, `questionRepository` pour réinitialisation

**Comportements métier:**
- Les fichiers JSON doivent être dans `questions/` du repo (pré-chargés)
- Format JSON attendu : array de { intitule, reponses[], indexBonneReponse, difficulte, explication?, categorie? }
- Upload personnalisé stocke en `sessionStorage` puis bascule vers `SelectCategory`
- Reset stats réinitialise les sessions mais garde les questions

**Navigation sortante:**
- Upload → `/settings/select-category` (via sessionStorage)

---

#### **Route: `/settings/select-category` (SelectCategoryView)**

**Composant:** `src/views/settings/SelectCategory.vue`

**Rôle:** Sélection ou création de catégorie pour import personnalisé

**Utilisateurs autorisés:** Tous (après upload)

**Actions principales:**
1. Afficher catégories existantes (sélection)
2. Formulaire pour créer nouvelle catégorie :
   - Label (texte, validation d'unicité)
   - Icône (24 options)
   - Couleur (14 options)
3. Valider et importer les questions vers la catégorie sélectionnée
4. Annuler (retour)

**Données affichées:**
- Liste des catégories existantes (boutons radio)
- Formulaire de création catégorie
- Sélection icône (grid 24 icônes)
- Sélection couleur (grid 14 couleurs)

**API / Stores:**
- `useDataStore`:
  - `allCategories`, `getCategoryByLabel()`
  - `addCategory()`, `importQuestions(category, json)`
- `sessionStorage` pour récupérer le JSON upload

**Validation:**
- Label requis et unique
- Icône requise
- Couleur requise

**Navigation sortante:**
- Après succès → `/home` (après 2s)
- Annuler → `router.back()`

---

#### **Route: `/settings/categories` (CategoriesView)**

**Composant:** `src/views/settings/Categories.vue`

**Rôle:** Liste et gestion des catégories

**Utilisateurs autorisés:** Tous

**Actions principales:**
1. Afficher liste de toutes les catégories avec nombre de questions
2. Créer nouvelle catégorie (FAB → CategoryEdit)
3. Éditer catégorie existante (clic → CategoryEdit)
4. Supprimer catégorie (avec confirmation) + cascader suppression questions

**Données affichées:**
- Tableau / liste des catégories
- Nombre de questions par catégorie
- Bouton FAB création
- Menu/boutons édition/suppression

**API / Stores:**
- `useDataStore`:
  - `allCategories`, `questions`
  - `deleteCategory(id)` (cascading)

**Navigation sortante:**
- Créer → `/settings/categories/edit` (sans params)
- Éditer → `/settings/categories/edit?id=<categoryId>`
- Après action → reste sur même page

---

#### **Route: `/settings/categories/edit` (CategoryEditView)**

**Composant:** `src/views/settings/CategoryEdit.vue`

**Rôle:** Formulaire création/édition de catégorie

**Utilisateurs autorisés:** Tous

**Actions principales:**
1. Détecter mode (création vs édition) via route query param `id`
2. En mode édition : pré-remplir le formulaire
3. Afficher formulaire :
   - Label (input text avec validation d'unicité)
   - Icône (grid de 24 icônes sélectionnables)
   - Couleur (grid de 14 couleurs sélectionnables)
4. Valider et sauvegarder (création ou mise à jour)
5. En cas de changement de label → mettre à jour toutes les questions associées
6. Annuler → retour à la liste

**Données affichées:**
- Formulaire avec 3 champs
- Grids de sélection (icônes, couleurs)
- Boutons Save/Cancel

**API / Stores:**
- `useDataStore`:
  - `allCategories`
  - `addCategory()`, `updateCategory()`
  - Logique de cascade pour label changement

**Validation:**
- Label requis, unique (sauf si édition de la même catégorie)
- Icône requise
- Couleur requise

**Erreurs métier:**
- Doublon de label → message d'erreur

**Navigation sortante:**
- Après succès → `/settings/categories`
- Annuler → `/settings/categories`

---

## 4. Modèles de données & logique métier

### 4.1 Entités TypeScript

#### **Category**
```typescript
interface Category {
  id: string           // Unique ID (ex: 'cat_typescript')
  label: string        // Nom affiché (ex: 'TypeScript')
  icon: string         // Nom icône Phosphor (ex: 'Code')
  color: TailwindColor // Couleur Tailwind (ex: 'blue')
}
```

**Rôle:** Organiseur de questions. Les catégories peuvent être modifiées et supprimées. Chaque question apartient à une catégorie.

**7 catégories pré-définies:**
- TypeScript (blue)
- React (cyan)
- Next.js (slate)
- Node.js (green)
- CSS (purple)
- JavaScript (yellow)
- Entretiens (indigo)

---

#### **Question**
```typescript
interface Question {
  id: string                    // Unique ID (ex: 'q-1', 'imported-123-0')
  intitule: string              // Énoncé (peut avoir du Markdown)
  reponses: string[]            // [answer0, answer1, answer2, answer3]
  indexBonneReponse: number     // Index de la bonne réponse (0-3)
  explication: string           // Texte d'explication (Markdown)
  categorie: string             // ID de la catégorie
  difficulte: 'facile' | 'moyen' | 'difficile'
  countApparition: number       // Nombre de fois affichée
  countBonneReponse: number     // Nombre de fois correctement répondue
}
```

**Rôle:** Donnée brute d'une question de quiz. Immuable après ajout au système (sauf métadonnées de comptage).

**Points par difficulté:**
- Facile (1 point)
- Moyen (2 points)
- Difficile (3 points)

**Importation:**
- Via JSON array (propriétés requises: intitule, reponses, indexBonneReponse, difficulte)
- Propriétés optionnelles: id, explication, categorie
- Validation au import avec messages d'erreur clairs

---

#### **SessionQuestion**
```typescript
interface SessionQuestion extends Question {
  ordreReponses: number[]   // [0, 2, 3, 1] - réponses mélangées
  estSkippe: boolean        // true si l'utilisateur a passé
  estCorrecte: boolean|null // true/false après réponse, null avant
}
```

**Rôle:** Snapshot de Question lors d'un quiz, avec état de réponse et ordre mélangé.

---

#### **QuizSession**
```typescript
interface QuizSession {
  sessionId: string            // UUID unique
  dateDebut: string            // ISO string
  dateFin: string | null       // ISO string (null si en cours)
  questions: SessionQuestion[] // Array des questions
  indexQuestionCourante: number
  nbQuestions: number
  scorePondere: number         // Somme des points
  scorePondereMax: number      // Max possible
  notePourcentage: number      // 0-100
  difficulteChoisie: Difficulty
  categories: string[]         // Labels des catégories
  dateJour?: string            // Format YYYY-MM-DD pour stats
}
```

**Rôle:** Session de quiz, persistée en IndexedDB. Peut être en cours ou complétée.

**Cycle de vie:**
- Création (dateFin = null)
- Progression (nextQuestion())
- Terminaison (finishQuiz() → dateFin défini, scores calculés)
- Suppression (abandon)

---

#### **Badge**
```typescript
interface Badge {
  id: string                 // Unique ID (ex: 'first_quiz', 'perfect_score')
  nom: string                // Nom (ex: 'Premier Pas')
  description: string        // Description du but
  statut: 'verrouille' | 'debloque'
  icon?: string              // Emoji (ex: '🐣')
  dateDebloque?: string|null // ISO string du déblocage
}
```

**Rôle:** Récompenses pour jalons d'apprentissage.

**6 badges pré-définis:**

| ID | Nom | Description | Condition |
|----|-----|-------------|-----------|
| first_quiz | Premier Pas | Terminer un premier quiz | Complétée ≥ 1 session |
| perfect_score | Perfection | Obtenir 100% à un quiz | Score = 100% sur une session |
| streak_3 | Habitué | 3 jours de suite | Streak ≥ 3 jours |
| streak_7 | Accro | 7 jours de suite | Streak ≥ 7 jours |
| marathon | Marathonien | Faire 20 quiz au total | Total complétées ≥ 20 |
| math_expert | Boss des Maths | 5 quiz de Maths terminés | 5 sessions monocatégorie 'Maths' |

**Règle métier:** Un badge verrouillé devient débloqué après qu'une condition soit remplie. Permanent (ne peut pas se re-verrouiller).

---

#### **GlobalStats**
```typescript
interface GlobalStats {
  moyenneGlobale: number       // Moyenne des scores (%)
  meilleurScore: number        // Max score (%)
  streakActuel: number         // Jours consécutifs
  totalSessions: number        // Sessions complétées
  historiqueSessions: QuizSession[] // Toutes sessions
}
```

**Rôle:** Statistiques agrégées globales.

---

### 4.2 Logique métier clé

#### **Calcul du streak**

```
- Streak = nombre de jours consécutifs avec au moins 1 quiz complété
- Se réinitialise à 0 si > 1 jour sans quiz
- Calculé en comparant les dateJour des sessions
- Utilisé pour les badges streak_3 et streak_7
```

#### **Calcul des scores**

```
- Score en % = (nombre de bonnes réponses / total questions) × 100
- Score pondéré = Σ(points_difficulte_si_correct)
  Où: facile=1, moyen=2, difficile=3
- Max score pondéré = Σ(points_difficulte_toutes_questions)
```

#### **Mélange des réponses**

À la création de la session:
```
- Générer ordreReponses = [0, 1, 2, 3] mélangé aléatoirement
- Afficher reponses[ordreReponses[0]], [ordreReponses[1]], etc.
- Comparer l'index sélectionné avec indexBonneReponse (original)
```

#### **Sélection des questions pour un quiz**

```
1. Filtrer par catégories sélectionnées
2. Filtrer par difficulté (sauf si 'random')
3. Trier par countApparition (ascending) + aléatoire pour égalité
4. Prendre les N premières
5. Lancer exception si < N questions disponibles
```

#### **Mise à jour des métadonnées de question**

Après chaque réponse:
```
- Incrémenter countApparition
- Si correcte: incrémenter countBonneReponse
- Persister en IndexedDB
```

#### **Déblocage de badges**

Après finishQuiz():
```
- Vérifier first_quiz: totalSessions >= 1
- Vérifier perfect_score: score == 100%
- Vérifier streak_3/7: calculer streak
- Vérifier marathon: totalSessions >= 20
- Vérifier math_expert: 5+ sessions monocatégorie 'Maths'
- Changer statut 'verrouille' → 'debloque' pour nouveaux
- Enregistrer dateDebloque = maintenant
- Ajouter à newlyUnlockedBadges pour notification
```

#### **Reprendre une session**

Au mount de App.vue:
```
- Rechercher QuizSession avec dateFin == null
- Si trouvée: afficher modal
  - "Reprendre" → router.push('/quiz/active')
  - "Abandonner" → sessionRepository.delete(sessionId)
```

---

## 5. Composants & comportements

### 5.0 Structure des composants

**Organisation par domaine fonctionnel:**
- `layout/` - Structure principale (AppHeader, AppLayout)
- `quiz/` - Composants de quiz (Questions, réponses, progression)
- `stats/` - Affichage statistiques (KPI cards, graphiques, badges)
- `settings/` - Gestion catégories et import (formulaires, listes)
- `common/` - Composants réutilisables (modal, bouton, spinner)

**Total: 13 composants** (6 pages principales via views/, 13 composants réutilisables)

### 5.1 Composants de layout

#### **AppLayout.vue** (`src/components/layout/AppLayout.vue`)

**Rôle:** Wrapper principal de l'application

**Props:** Aucune

**Enfants:**
- AppHeader (header fixe)
- router-view (contenu principal)
- BaseModal (reprise de session)

**Comportements:**
- Affiche modal de reprise si `quizStore.showResumeModal` est vrai
- Boutons actions:
  - Reprendre → `resumePreviousSession()` + navigate
  - Abandonner → `abandonSession()`

---

#### **AppHeader.vue** (`src/components/layout/AppHeader.vue`)

**Rôle:** En-tête de navigation

**Props:** Aucune

**Affichage:**
- Logo + titre "CodeMaster" (cliquable → home)
- Bouton settings (icône → `/settings/categories`)
- Bouton stats (icône + badge notification) → `/stats`

**Comportements:**
- Indicateur visuel (badge rouge) si badges non lus (`badgesNonLus` du statsStore)

---

### 5.2 Composants quiz

#### **QuestionCard.vue** (`src/components/quiz/QuestionCard.vue`)

**Props:**
```typescript
interface Props {
  question: SessionQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswerIndex: number | null
  hasAnswered: boolean
}
```

**Emits:**
- `answer-selected(answerIndex: number)`

**Affichage:**
- Numéro question / total
- Badges catégorie et difficulté
- Texte de la question (avec Markdown)
- 4 boutons AnswerOption
- Explication (après réponse)

**Comportements:**
- Affiche explication seulement après réponse (`hasAnswered && !estSkippe`)
- Désactive les boutons après réponse
- Les réponses sont dans `question.ordreReponses` (mélangées)

---

#### **AnswerOption.vue** (`src/components/quiz/AnswerOption.vue`)

**Props:**
```typescript
interface Props {
  text: string
  isCorrect: boolean
  isSelected: boolean
  hasAnswered: boolean
  disabled: boolean
}
```

**Emits:**
- `click()` - click du bouton

**Affichage:**
- Bouton avec texte réponse
- Classes dynamiques selon état :
  - Normal (enabled, non-répondu)
  - Correct (vert si sélectionné et correct)
  - Incorrect (rouge si sélectionné et faux)
  - Correct-non-sélectionné (vert faible si pas sélectionné mais correct)

---

#### **ProgressBar.vue** (`src/components/quiz/ProgressBar.vue`)

**Props:**
```typescript
interface Props {
  progress: number // 0-100
}
```

**Affichage:**
- Barre de progression horizontale
- Pourcentage du côté

---

### 5.3 Composants statistiques

#### **StatCard.vue** (`src/components/stats/StatCard.vue`)

**Props:**
```typescript
interface Props {
  label: string
  value: number | string
  icon: string
  color?: string
}
```

**Affichage:**
- Carte avec label, icône et valeur
- Couleur de fond selon type

---

#### **EvolutionChart.vue** (`src/components/stats/EvolutionChart.vue`)

**Props:**
```typescript
interface Props {
  data: Record<string, { sum: number; count: number }>
}
```

**Comportement:**
- Graphique Chart.js linéaire
- X-axis: 30 jours passés
- Y-axis: moyenne score (%)
- Montre l'évolution quotidienne

---

#### **BadgesGrid.vue** (`src/components/stats/BadgesGrid.vue`)

**Props:**
```typescript
interface Props {
  badges: Badge[]
}
```

**Affichage:**
- Grille 3 colonnes
- Chaque badge affiche :
  - Icône emoji
  - Nom
  - Statut (verrouillé/débloqué)
  - Date déblocage (si applicable)
  - Description au hover

---

### 5.4 Composants communs

#### **BaseButton.vue** (`src/components/common/BaseButton.vue`)

**Props:**
```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}
```

**Défauts:** variant='primary', size='md', disabled=false, loading=false, fullWidth=false, type='button'

**Slots:**
- default - contenu du bouton

**Comportements:**
- Affiche spinner (⌛) si `loading`
- Disabled opacity et cursor si `disabled` ou `loading`
- Active scale 95% au clic
- 4 variants pré-définis:
  - `primary`: Indigo bg, white text, hover darker, shadow
  - `secondary`: Light slate bg, slate text, hover darker
  - `danger`: Light red bg, red text, border rouge
  - `ghost`: No bg, slate text, hover light slate bg
- 3 tailles avec padding différent
- Optional fullWidth utilise w-full

---

#### **BaseModal.vue** (`src/components/common/BaseModal.vue`)

**Props:**
```typescript
interface Props {
  title: string      // Modal title header
  show: boolean      // Controls visibility (v-if)
}
```

**Slots:**
- `default` - contenu du modal (body)
- `actions` - boutons d'action (footer)

**Comportement:**
- Conditional rendering: affiche seulement si `show` est vrai
- Overlay full-screen avec backdrop blur (position absolute z-50)
- Centré au milieu de l'écran
- Titre en header distinct
- Actions dans footer (template slot)
- Responsive padding
- Box shadow d'élévation

---

#### **LoadingSpinner.vue** (`src/components/common/LoadingSpinner.vue`)

**Comportement:**
- Composant pur (aucune prop, aucun état)
- Affiche spinner SVG centré
- Animation rotation continue

---

#### **MarkdownText.vue** (`src/components/common/MarkdownText.vue`)

**Props:**
```typescript
interface Props {
  text: string  // Raw markdown text to render
}
```

**Comportement:**
1. **Parsing Markdown:**
   - Utilise `marked` library v10+ avec options:
     - `breaks: true` - convertit sauts de ligne en `<br>`
     - `gfm: true` - GitHub Flavored Markdown
   - Watcher sur `text` prop → async parsing
   - Gestion erreurs: fallback au texte brut

2. **Optimisations:**
   - Retire `<p>` tags wrapper si présents (inline rendering)
   - Gère texte vide sans erreur

3. **Formatage HTML:**
   - Code inline: fond gris clair, monospace, petit
   - Code blocks: scrollable, monospace, indentation
   - Strong: bold, indigo color
   - Em: italic
   - Support: headings, listes, liens, tables

4. **Sécurité:**
   - Utilise `v-html` (marked escaped par défaut)
   - Pas de risque XSS si source de confiance

**Side Effects:**
- Render HTML via `v-html` directive

---

### 5.3 Composants des paramètres (settings)

#### **FormCategorie.vue** (`src/components/settings/FormCategorie.vue`)

**Props:**
```typescript
interface Props {
  categorie: Category | null        // Category to edit (null = create new)
  allCategories: Category[]         // All existing for validation
}
```

**Emits:**
- `submit: [category: Category]` - Form soumis avec catégorie valide
- `cancel: []` - Utilisateur annule

**Données locales:**
```typescript
form: ref<{ label: string; icon: string; color: string }>
errors: ref<Record<string, string>>
```

**Fonctionnalités:**

1. **Initialisation:**
   - Watcher sur `categorie` prop
   - Mode édition: pré-remplir form avec données existantes
   - Mode création: form vide (defaults: icon='Code', color='blue')

2. **Sélection d'icône:**
   - 24 icônes disponibles: Code, Rocket, Cpu, Palette, Database, Chat, Calculator, Microscope, Globe, Lightning, Book, Moon, Bug, Wine, Sparkle, Lightbulb, Gear, Wrench, Hammer, Square, Star, Heart, Flag, Target
   - Grid display avec sélection

3. **Sélection de couleur:**
   - 14 couleurs Tailwind: slate, red, orange, amber, yellow, lime, green, emerald, teal, cyan, blue, indigo, purple, pink
   - Grid display avec sélection

4. **Validation:**
   - Label: requis, non-vide après trim
   - Label unique: vérifier contre toutes catégories (sauf la courante en édition)
   - Icon: requis
   - Color: requis
   - Messages d'erreur affichés sous champs

5. **Soumission:**
   - Valide avant émission
   - Génère ID pour nouvelles catégories: `cat_${timestamp}`
   - Émet `Category` complète

**Dépendances:**
- Vue composition API (ref, watch, computed, toRaw)
- Type Category

---

#### **ListeCategories.vue** (`src/components/settings/ListeCategories.vue`)

**Props:**
```typescript
interface Props {
  categories: Category[]  // Categories to list
  questions: Question[]   // For counting per category
}
```

**Emits:**
- `category-click: [categoryId: string]` - Row cliqué
- `delete: [categoryId: string]` - Delete confirmé (après swipe)

**Fonctionnalités:**

1. **Swipe-to-Delete (mobile/touch):**
   - `handleTouchStart(categoryId)`: Enregistre position X initiale
   - `handleTouchMove(categoryId, e)`: Calcule distance swipe, limite à -80px max
   - `handleTouchEnd(categoryId)`: Snap behavior
     - Si > 60px swiped: lock à -80px (reveal delete button)
     - Sinon: reset à 0
   - Hints pour swipe affichés sur mobile

2. **Affichage catégories:**
   - Icône avec badge fond coloré
   - Label de catégorie
   - Nombre de questions calculé dynamiquement
   - Chevron indicator

3. **États vides:**
   - Message si aucune catégorie

4. **Fonction helper:**
   ```typescript
   getQuestionCountForCategory(categoryId: string): number
     // Compte questions avec categorie === categoryId
   ```

5. **Mappages couleurs:**
   - Full-color: 500 intensity
   - Light badges: 100 intensity
   - 14 couleurs supportées

**Dépendances:**
- Vue composition API (ref, computed)
- Touch events API

---

#### **ModalSelectCategory.vue** (`src/components/settings/ModalSelectCategory.vue`)

**Props:**
```typescript
interface Props {
  isOpen: boolean       // Modal visibility
  categories: Category[] // Existing categories
}
```

**Emits:**
- `select: [categoryLabel: string]` - Catégorie sélectionnée
- `cancel: []` - Utilisateur annule

**Données locales:**
```typescript
selectedCategory: ref<string>('')  // Selected label
newCategory: ref({                 // New category form
  label: string
  icon: string        // default: 'Code'
  color: string       // default: 'blue'
})
```

**Fonctionnalités:**

1. **Mode Sélection (existantes):**
   - Boutons pour chaque catégorie existante
   - Click → sélectionne label

2. **Mode Création (nouvelle):**
   - Formulaire label + icon + color picker
   - Validation: label non-vide requis
   - `createAndSelect()`: valide, définit comme sélectionnée, reset form
   - Mêmes 24 icônes et 14 couleurs que FormCategorie

3. **Soumission:**
   - `handleSelect()`: émet label sélectionné (existing ou new)
   - Bouton disabled si rien sélectionné

**Dépendances:**
- Vue composition API (ref, computed)
- Type Category

---

### 5.4 Composants statistiques (détail)

#### **StatCard.vue** (`src/components/stats/StatCard.vue`)

**Props:**
```typescript
interface Props {
  label: string                               // Card title (uppercase)
  value: string | number                      // Main value to display
  icon?: string                               // Optional Phosphor icon name
  color?: 'primary' | 'green' | 'orange' | 'slate'  // Default: 'primary'
}
```

**Comportement:**
- Affiche label (petit, uppercase, espaced)
- Affiche icône + valeur (gros)
- Couleurs pré-définies:
  - `primary`: indigo-600
  - `green`: green-600
  - `orange`: orange-500
  - `slate`: slate-700
- Fond blanc, ombre, border subtle

**Utilisation dans Stats page:**
```typescript
// 4 cards pour KPIs
[
  { label: 'Moyenne', value: globalStats.moyenneGlobale.toFixed(1) + '%', color: 'primary' },
  { label: 'Meilleur Score', value: globalStats.meilleurScore.toFixed(1) + '%', color: 'green' },
  { label: 'Streak', value: globalStats.streakActuel + 'j', color: 'orange' },
  { label: 'Total Quizzes', value: globalStats.totalSessions, color: 'slate' }
]
```

---

#### **EvolutionChart.vue** (`src/components/stats/EvolutionChart.vue`)

**Props:**
```typescript
interface Props {
  sessions: QuizSession[]  // Sessions to chart
}
```

**Comportement:**

1. **Lifecycle:**
   - `onMounted`: Appelle `renderChart()` après `nextTick()`
   - `onUnmounted`: Destroy chart instance, cleanup

2. **Préparation données:**
   - Initialise map 30 jours avec `{ sum: 0, count: 0 }`
   - Agrège sessions par `dateJour` (YYYY-MM-DD)
   - Calcule moyenne quotidienne: `sum notePourcentage / count`
   - Remplit labels dates (MM-DD format)

3. **Rendu Chart.js:**
   - Type: Line chart
   - X-axis: Derniers 30 jours (MM-DD format)
   - Y-axis: Pourcentage 0-100
   - Ligne indigo (#4F46E5) avec area semi-transparente
   - Tension 0.3 (smooth curves)
   - Fill: true
   - spanGaps: true (relie à travers jours manquants)
   - Responsive: true
   - Aspect ratio: auto
   - Legend: hidden

4. **État vide:**
   - Message si pas de sessions

**Canvas Reference:**
- HTML element avec ID `evolutionChart`
- Chart.js référence cet ID

**Dépendances:**
- Chart.js library
- Vue lifecycle (onMounted, onUnmounted, nextTick)

---

#### **BadgesGrid.vue** (`src/components/stats/BadgesGrid.vue`)

**Props:**
```typescript
interface Props {
  badges: Badge[]  // All badges to display
}
```

**Emits:**
- `badge-click: [badge: Badge]` - Badge cliqué

**Fonctionnalités:**

1. **Affichage grille:**
   - 3 colonnes responsive
   - Carré aspect ratio pour chaque badge
   - Contenu: emoji icon + nom

2. **États badge:**
   - Débloqué (`statut === 'debloque'`):
     - Fond blanc, border jaune
     - Opacité 100%, sans grayscale
     - Hover effects, clickable
   - Verrouillé (`statut === 'verrouille'`):
     - Fond gris sombre, opacité réduite (60%)
     - Grayscale filter
     - Non-clickable

3. **Contenu:**
   - Icône emoji: `badge.icon` (ex: '🐣', '🎯', '🔥')
   - Nom: `badge.nom` (max 2 lignes avec ellipsis)
   - Date déblocage: affichée si disponible

**Intégration Stats page:**
- Crée BadgesGrid avec `dataStore.badges`
- Écoute `badge-click` pour afficher détails (modal optionnel)

---

### 5.5 Composants quiz (détail complet)

#### **AnswerOption.vue** (`src/components/quiz/AnswerOption.vue`)

**Props:**
```typescript
interface Props {
  text: string              // Answer text
  isCorrect: boolean | null // null = unanswered, true/false = answered
  isSelected: boolean       // User selected this option
  hasAnswered: boolean      // Quiz state: answered
  disabled: boolean         // Button disabled
}
```

**Emits:**
- `click: []` - Bouton cliqué

**Comportement dynamique:**

| État | Classe | Icône |
|------|--------|-------|
| Avant réponse | White border, hover | None |
| Sélectionné correct | Green bg | ✓ check-circle |
| Sélectionné incorrect | Red bg reduced opacity | ✗ x-circle |
| Non-sélectionné correct (après) | Green tint light | - |
| Non-sélectionné incorrect | Gray out | - |

**Interactions:**
- Cliquable tant que `!disabled`
- Transitions smooth entre états
- Feedback visuel clair pour correct/incorrect

---

#### **ProgressBar.vue** (`src/components/quiz/ProgressBar.vue`)

**Props:**
```typescript
interface Props {
  progress: number  // 0-100 percentage
}
```

**Affichage:**
- Barre horizontale remplie progressivement
- Pourcentage affiché à côté ou dans la barre
- Couleur indigo

---

#### **QuestionCard.vue** (détail complet)

**Props:**
```typescript
interface Props {
  question: SessionQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswerIndex: number | null
  hasAnswered: boolean
}
```

**Emits:**
- `answer-selected: [answerIndex: number]`

**Sections affichées:**

1. **Header question:**
   - Numéro: "Question X/Y"
   - Badge catégorie: Affiche label + couleur category
   - Badge difficulté: Affiche niveau (facile/moyen/difficile)

2. **Texte question:**
   - Rendu avec MarkdownText (support Markdown complet)
   - Font grande et lisible

3. **4 réponses:**
   - Appelle AnswerOption pour chaque réponse
   - Indice affiché = `question.ordreReponses[idx]`
   - Index sélectionné comparé à `question.indexBonneReponse`
   - Disabled après réponse

4. **Explication (conditionnelle):**
   - Affichée seulement si `hasAnswered && !question.estSkippe`
   - Fond bleu clair, border bleu
   - Titre "Explication" avec icône
   - Rendu avec MarkdownText

**Logique réponses mélangées:**
```typescript
// Affichage dans template:
v-for="(answerIndex, idx) in question.ordreReponses"
  // answerIndex = 0,1,2,3 (original index dans reponses[])
  :text="question.reponses[answerIndex]"
  :is-correct="answerIndex === question.indexBonneReponse"

// Comparaison après réponse:
selectedAnswerIndex === question.indexBonneReponse → correct
```

---

## 5.6 Services et Utilities

### **categoryLoadingService.ts** (`src/services/categoryLoadingService.ts`)

**Rôle:** Gestion persistante de l'état de chargement des catégories via localStorage

**Interface de données:**
```typescript
interface LoadedCategory {
  categoryId: string        // UUID de la catégorie (ex: 'cat_react')
  categoryLabel: string     // Label affichable
  loaded: boolean          // État chargement
  questionCount: number    // Total questions chargées
  loadedAt?: string        // ISO timestamp du chargement
  error?: string           // Message d'erreur si échec
}
```

**Fonctions principales:**

1. **getLoadedCategoriesState(): Record<string, LoadedCategory>**
   - Récupère depuis localStorage clé `'quiz-master-loaded-categories'`
   - Retourne état initial si pas trouvé

2. **getInitialState(): Record<string, LoadedCategory>**
   - Crée état par défaut pour 7 catégories pré-définies
   - Mapping: react → cat_react, typescript → cat_typescript, etc.
   - Initial: `loaded: false, questionCount: 0` pour chaque

3. **saveLoadedCategoriesState(state: Record<string, LoadedCategory>)**
   - Persiste en localStorage
   - Try-catch pour erreurs

4. **markCategoryAsLoaded(categoryLabel: string, count: number)**
   - Met à jour catégorie à `loaded: true`
   - Enregistre `questionCount` et `loadedAt`
   - Lance erreur si catégorie non trouvée

5. **markCategoryAsError(categoryLabel: string, error: string)**
   - Enregistre message d'erreur
   - Préserve autres champs

6. **getLoadedCategoryCount(): number**
   - Compte catégories avec `loaded: true`

7. **getTotalQuestionsLoaded(): number**
   - Somme des `questionCount` toutes catégories

**Persistance:**
- localStorage key: `'quiz-master-loaded-categories'`
- Format JSON sérialisé
- Survit aux fermetures/rechargements

**Erreurs:** Try-catch silencieux, fallback à initial state

---

### **questionsLoader.ts** (`src/db/loaders/questionsLoader.ts`)

**Rôle:** Chargement asynchrone de fichiers JSON contenant questions depuis `public/questions/`

**Mapping catégories → fichiers:**
```typescript
const CATEGORY_FILE_MAPPING = {
  'react': 'cat_react',
  'typescript': 'cat_typescript',
  'nodejs': 'cat_nodejs',
  'nextjs': 'cat_nextjs',
  'css': 'cat_css',
  'javascript': 'cat_javascript',
  'entretiens': 'cat_entretiens',
}
```

**Type de callback:**
```typescript
type ProgressCallback = (loaded: number, total: number) => void
// Appelé pour chaque question chargée (pour barre de progression)
```

**Fonctions principales:**

1. **normalizeCategoryName(input: string): string**
   - Normalise noms de catégories vers IDs
   - Lowercases + trim
   - Variations gérées: "Node.js" → "nodejs", "Entretien" → "entretiens", etc.
   - Mapping 13+ variations
   - Fallback: `cat_${normalized}`
   - Exemple:
     ```typescript
     normalizeCategoryName('React') → 'cat_react'
     normalizeCategoryName('Node.js') → 'cat_nodejs'
     ```

2. **async loadQuestionsFromJsonFile(category: string, onProgress?: ProgressCallback): Promise<Question[]>**
   - Charge JSON depuis `/questions/{category}.json`
   - Normalise chaque question:
     - Ajoute defaults: `explication: ''`, `countApparition: 0`, `countBonneReponse: 0`
     - Convertit difficulte (excluant 'random')
     - Normalise categorie via `normalizeCategoryName()`
   - Appelle `onProgress(index, total)` pour chaque question
   - Retourne array normalisé
   - Fetch 404 → empty array (warning log)
   - Fetch erreur → throw (error log)
   - Extensive debug logging

3. **async loadAllQuestionsFromJsonParallel(onProgress?: ProgressCallback): Promise<Question[]>**
   - Charge toutes catégories en parallèle via `Promise.all()`
   - Flatten résultats
   - Log total questions loaded
   - Appelle `onProgress` pour chaque question

**Gestion erreurs:**
- HTTP 404 → logged as warning, empty array retourné
- Network errors → thrown, propagé à caller
- Progress callback errors → propagated

**Dépendances:**
- Fetch API (natif browser)
- Question type

---

### **questions.ts** (`src/fixtures/questions.ts`)

**Rôle:** Questions de test/fixture pour développement (20 questions)

**Export:** `ADDITIONAL_QUESTIONS: Question[]`

**Contenu par catégorie (5 questions chaque):**

1. **Maths** (IDs 11-15):
   - 15 × 12 = ? (moyen)
   - 7³ = ? (difficile)
   - Nombre premier (moyen)
   - Côtés d'hexagone (facile)
   - 45/180 en % (moyen)

2. **Géographie** (IDs 16-20):
   - Plus haute montagne (facile)
   - Plus grand océan (moyen)
   - Capitale du Japon (facile)
   - Pays avec plus d'îles (difficile)
   - Plus grand désert (moyen)

3. **Science** (IDs 21-25):
   - Symbole du fer (moyen)
   - Chromosomes humains (difficile)
   - Gaz atmosphere (moyen)
   - Groupe sanguin ABO (moyen)
   - Production insuline (difficile)

4. **Art** (IDs 26-30):
   - Van Gogh oreille (difficile)
   - Starry Night artiste (moyen)
   - Mouvement Picasso (difficile)
   - Olympia année (difficile)
   - Nationalité Schiele (difficile)

**Structure question:**
```typescript
{
  id: string                    // Unique ID
  intitule: string              // Énoncé
  reponses: string[]            // 4 réponses
  indexBonneReponse: number    // Index correct (0-3)
  explication: string           // Explication
  categorie: string             // Nom catégorie (ex: 'Maths')
  difficulte: Difficulty        // facile | moyen | difficile
  countApparition: 0            // Always 0 (fixture)
  countBonneReponse: 0          // Always 0 (fixture)
}
```

**Utilisation:** Développement sans dépendre du chargement JSON

---

## 6. Data fetching & gestion de l'état

### 6.1 Architecture d'état (Pinia stores)

**3 stores Pinia distincts:**

#### **useDataStore** (src/stores/useDataStore.ts)

**État:**
```typescript
const questions = ref<Question[]>([])        // Toutes les questions
const badges = ref<Badge[]>([])              // Tous les badges
const categories = ref<Category[]>([])       // Toutes les catégories
const isLoading = ref(false)                 // État chargement global
const error = ref<string|null>(null)         // Erreur globale
```

**Actions (asynchrones):**
- `initData()` - Charger questions, badges, catégories depuis IndexedDB
- `importQuestions(json, targetCategory?)` - Importer depuis fichier JSON
- `resetBadges()` - Réinitialiser tous les badges à 'verrouille'
- `updateBadges(newBadges)` - Sauvegarder badges modifiés
- `loadCategories()` - Recharger catégories
- `addCategory(category)` - Créer nouvelle catégorie
- `updateCategory(category)` - Modifier catégorie (cascading label)
- `deleteCategory(categoryId)` - Supprimer + supprimer questions
- `getCategoryByLabel(label)` - Lookup
- `resetCategories()` - Réinitialiser à valeurs par défaut
- `reloadQuestions()` - Recharger questions depuis IndexedDB

**Getters:**
- `allCategories` - Computed categories.value

---

#### **useQuizStore** (src/stores/useQuizStore.ts)

**État:**
```typescript
const activeSession = ref<QuizSession|null>(null)
const selectedAnswerIndex = ref<number|null>(null)
const hasAnswered = ref(false)
const showResumeModal = ref(false)

// Sélections temporaires
const selectedCategories = ref<string[]>([])
const randomCategoriesSelection = ref<string[]>([])
const selectedDifficulty = ref<Difficulty|null>(null)
```

**Computed:**
- `currentQuestion` - Question actuelle
- `currentQuestionIndex` - Index
- `progressPercent` - 0-100
- `isLastQuestion` - booléen
- `isQuizFinished` - booléen

**Actions (asynchrones):**
- `checkResumableSession()` - Chercher session en cours au mount
- `resumePreviousSession()` - Reprendre session en cours
- `abandonSession()` - Supprimer session en cours
- `createQuizSession(categories, difficulty, count)` - Créer nouvelle session
- `submitAnswer(answerIndex)` - Enregistrer réponse
- `skipQuestion()` - Passer question
- `nextQuestion()` - Aller question suivante ou finir
- `saveCurrentSession()` - Persister session courante
- `finishQuiz()` - Terminer quiz + calculer scores + mettre à jour stats

**Actions (synchrones):**
- `clearActiveSession()` - Vider l'état
- `selectCategory(category)` - Enregistrer sélection
- `openRandomConfig(availableCategories)` - Pré-remplir sélection aléatoire
- `validateRandomSelection()` - Valider sélection aléatoire
- `selectDifficulty(difficulty)` - Enregistrer difficulté
- `getReplayParams()` - Retourner paramètres pour replay

**Comportements clés:**
- Questions triées par countApparition (moins vues en premier)
- Réponses mélangées aléatoirement
- Sauvegarde après chaque action (submitAnswer, nextQuestion)
- Appelle statsStore après finishQuiz()

---

#### **useStatsStore** (src/stores/useStatsStore.ts)

**État:**
```typescript
const globalStats = ref<GlobalStats>({
  moyenneGlobale: 0,
  meilleurScore: 0,
  streakActuel: 0,
  totalSessions: 0,
  historiqueSessions: []
})
const previousStats = ref<ComparisonStats>({ average: 0 })
const newlyUnlockedBadges = ref<Badge[]>([])
```

**Computed:**
- `badgesNonLus` - Vrai si newlyUnlockedBadges non vide

**Actions (asynchrones):**
- `loadStats()` - Charger et calculer stats depuis IndexedDB
- `updateStatsAndBadges(session)` - Après finishQuiz(), vérifier badges
- `calculateDailyAverages(sessions)` - Calculer moyennes par jour (30j)

**Actions (synchrones):**
- `checkAndUnlockBadges(session, completedSessions, currentStreak, badges)` - Logique déblocage
- `calculateCurrentStreak(sessions)` - Calculer streak actuel

**Calculs:**
- Moyenne = moyenne des notePourcentage
- Meilleur = max notePourcentage
- Streak = jours consécutifs avec ≥1 session
- Historique = sessions.filter(s => s.dateFin !== null)

---

### 6.2 Cycle de données

**Initialisation (App.vue mount):**
1. `dataStore.initData()` - Charge questions, badges, catégories
2. `quizStore.checkResumableSession()` - Vérifie session en cours

**Flux quiz:**
1. Sélection catégorie (Home)
2. Sélection difficulté (Difficulty)
3. Sélection compte (Count)
4. `createQuizSession()` - Crée session en IndexedDB
5. Chaque réponse: `submitAnswer()` → sauvegarde
6. Fin: `finishQuiz()` → calcul scores + appelle `statsStore.updateStatsAndBadges()`
7. Stats recalculées et badges mis à jour

**Import de données:**
1. Upload JSON → stocke en sessionStorage
2. SelectCategory → sélectionne/crée catégorie
3. `importQuestions(json, categoryLabel)` → valide, normalise, sauvegarde
4. `reloadQuestions()` pour mettre à jour l'état

**Gestion des erreurs:**
- Try-catch dans chaque action async
- Erreurs enregistrées dans store.error
- Messages affichés à l'utilisateur

---

## 7. API & contrat backend

### 7.1 Note: Pas d'API backend

L'application est **100% frontend** (client-side only). Toutes les données sont stockées localement dans IndexedDB. Il n'y a pas de serveur backend, pas d'API REST, pas de synchronisation cloud.

### 7.2 Repository pattern (IndexedDB)

Les opérations base de données sont abstraites via des **repositories**:

#### **questionRepository** (src/db/repositories.ts)

```typescript
interface QuestionRepository {
  getAll(): Promise<Question[]>
  getById(id: string): Promise<Question|undefined>
  save(question: Question): Promise<void>
  saveMany(questions: Question[]): Promise<void>
  clear(): Promise<void>
  incrementApparition(id: string): Promise<void>
  incrementCorrect(id: string): Promise<void>
}
```

**Implémentation:** Transactions IndexedDB readwrite/readonly

---

#### **sessionRepository** (src/db/repositories.ts)

```typescript
interface SessionRepository {
  getAll(): Promise<QuizSession[]>
  getById(sessionId: string): Promise<QuizSession|undefined>
  save(session: QuizSession): Promise<void>
  delete(sessionId: string): Promise<void>
  getPendingSession(): Promise<QuizSession|undefined>
  getCompleted(): Promise<QuizSession[]>
  clear(): Promise<void>
}
```

---

#### **metaRepository** (src/db/repositories.ts)

```typescript
interface MetaRepository {
  get(key: string): Promise<any>
  save(key: string, data: any): Promise<void>
  getBadges(): Promise<Badge[]>
  saveBadges(badges: Badge[]): Promise<void>
}
```

---

#### **categoryRepository** (src/db/repositories.ts)

```typescript
interface CategoryRepository {
  getAll(): Promise<Category[]>
  getById(id: string): Promise<Category|undefined>
  getByLabel(label: string): Promise<Category|undefined>
  save(category: Category): Promise<void>
  update(category: Category): Promise<void>
  delete(id: string): Promise<void>
  deleteByLabel(label: string): Promise<void>
  saveMany(categories: Category[]): Promise<void>
  clear(): Promise<void>
}
```

### 7.3 Format des données importées (JSON)

**Requis:**
```json
[
  {
    "intitule": "Qu'est-ce que TypeScript ?",
    "reponses": ["Un langage", "Une lib", "Un framework", "Un IDE"],
    "indexBonneReponse": 0,
    "difficulte": "facile"
  },
  ...
]
```

**Optionnels:**
```json
{
  "id": "q-custom-1",
  "explication": "TypeScript est un **sur-ensemble** de JavaScript",
  "categorie": "TypeScript"
}
```

**Validation:**
- Array requis
- Chaque item doit avoir: intitule, reponses (array 4 éléments), indexBonneReponse (0-3), difficulte
- Si categorie absent: 'Sans catégorie'
- Si explication absent: ''
- Si id absent: généré comme `imported-${timestamp}-${index}`

---

## 8. Authentification & autorisation

### 8.1 Pas d'authentification

L'application **n'a pas de système d'authentification**. Il n'y a pas de:
- Login / signup
- Tokens JWT
- Sessions utilisateur
- Rôles / permissions

### 8.2 Accès aux pages

**Toutes les pages sont publiques.** N'importe quel utilisateur peut y accéder directement.

**Restriction fonctionnelle:**
- `/quiz/active` ne fonctionne que s'il existe une `activeSession` en store
  - Si pas de session: composant vide ou redirection implicite vers `/home`
- `/quiz/summary` nécessite une session terminée (`isQuizFinished`)

### 8.3 Isolation des données

Chaque navigateur/appareil a **ses propres données** (IndexedDB isolée par origin).

Il n'y a pas de partage de données entre appareils / utilisateurs.

---

## 9. Cas particuliers & règles métier avancées

### 9.1 Cas particuliers gérés

#### **Pas de questions disponibles**

**Situation:** Utilisateur crée un quiz avec catégories/difficulté où il n'y a aucune question.

**Comportement:**
- `createQuizSession()` lance une exception: "Pas assez de questions disponibles pour cette sélection"
- Utilisateur reste sur la page et voit le message d'erreur

**Prévention:**
- Home affiche alerte si aucune catégorie disponible
- Encourage l'import

---

#### **Session non terminée à la fermeture**

**Situation:** Utilisateur ferme le navigateur pendant un quiz.

**Comportement:**
- Session non terminée persiste en IndexedDB (`dateFin === null`)
- Au prochain mount de l'app: modal "Quiz en cours" propose reprendre ou abandonner
- Si reprendre: active la session et navigue vers `/quiz/active`

---

#### **Suppression de catégorie avec questions**

**Situation:** Utilisateur supprime une catégorie qui contient des questions.

**Comportement (cascading):**
- Toutes les questions de cette catégorie sont supprimées
- Les sessions historiques gardent les snapshots de questions
- Aucun impact sur les statistiques (basées sur historiqueSessions)

---

#### **Changement de label de catégorie**

**Situation:** Utilisateur change le label d'une catégorie (ex: 'TypeScript' → 'TS').

**Comportement:**
- Toutes les questions ayant `categorie: 'TypeScript'` sont mises à jour vers `'TS'`
- Sauvegarder en IndexedDB
- Garder les sessions historiques inchangées (dateJour/categories referant aux labels d'époque)

---

#### **Import sur catégorie existante**

**Situation:** Utilisateur importe des questions dans une catégorie qui existe déjà.

**Comportement:**
- Les questions s'ajoutent aux existantes
- `questionRepository.saveMany()` utilise `store.put()` (insert or update)
- Si ID collide: l'ancien est écrasé

---

#### **Score de 100% dans Summary**

**Situation:** Utilisateur obtient 100% à un quiz.

**Comportement:**
- `perfect_score` badge est débloqué (si pas déjà débloqué)
- Ajouté à `newlyUnlockedBadges` pour notification
- Message personnalisé "Parfait ! Vous êtes un expert !"

---

#### **Streak réinitialisation**

**Situation:** Utilisateur ne fait pas de quiz pendant 2+ jours.

**Comportement:**
- `calculateCurrentStreak()` calcule jours consécutifs
- Si dernière session < 2 jours: streak continue
- Si > 1 jour: streak = 0
- Affichage dans Summary et Stats reflète le streak actuel

---

#### **Markdown dans questions/explications**

**Situation:** Questions ou explications contiennent du Markdown.

**Composant:** `MarkdownText.vue` utilise `marked` library.

**Comportement:**
- Markdown parsé et rendu en HTML
- Support: **bold**, *italic*, `code`, # headers, listes, liens
- Pas de risque XSS (HTML échappé sauf si balisé)

---

### 9.2 Restrictions et limites

#### **Tailles limites**

- **Questions par quiz:** 5, 10 ou 20 seulement (choix limité)
- **Catégories:** 7 par défaut, illimitées en ajout manuel
- **Difficultés:** 3 (facile/moyen/difficile) + random
- **Reponses par question:** Exactement 4

#### **Limites IndexedDB**

- IndexedDB a des limites par origin (typiquement 50MB+)
- Pas de gestion de quota
- Dépassement → erreur implicite

#### **Pas de pagination**

- Toutes les questions chargées en mémoire
- Grille de badges chargée complètement
- Pas de lazy-loading

---

### 9.3 Comportements edge case

#### **Vide/null/undefined**

- Questions vides: pas de création (validation)
- Categories vides: interdites (validation label)
- Sessions supprimées: continuent d'exister en historique
- Badges sans date: `dateDebloque = null` si verrouille

#### **Connaître le statut d'une opération**

Les stores fournissent:
- `isLoading` pour signaler un chargement
- `error` pour un message d'erreur
- Pas de loading détaillé par opération (global uniquement)

#### **Double-clic sur boutons**

- Submit answer: `hasAnswered` empêche double soumission
- Créer catégorie: pas de protection (peut causer duplication en double-clic rapide)

---

## 10. Notes non-fonctionnelles

### 10.1 Performance

**Optimisations observées:**

- **Lazy loading questions:** Questions filtrées et triées en mémoire (pas d'indexation avancée)
- **Tri efficace:** `countApparition` index en IndexedDB
- **Minimal state:** Seule la session active en mémoire (autres restent en IndexedDB)
- **No re-renders coûteux:** Pinia réactivité fine-grained
- **Mélange aléatoire:** Fait à la création (O(n), pas à chaque affichage)

**Goulots potentiels:**
- Import de 1000+ questions peut être lent (parsing + sauvegarde)
- Calcul de streak sur 30j: linéaire sur toutes les sessions
- Graphique 30j: recalculé à chaque loadStats()

---

### 10.2 Sécurité

**Aspects de sécurité applicatifs:**

1. **Validation des entrées**
   - Label catégorie: validation d'unicité
   - JSON import: validation structure et propriétés
   - Difficulte: enum (Exclude<Difficulty, 'random'>)

2. **Prévention XSS**
   - Markdown rendu via `marked` (escaped par défaut)
   - Pas de `v-html` brut (sauf MarkdownText qui parse)
   - Props TypeScript fortement typées

3. **Confidentialité des données**
   - Toutes les données locales (IndexedDB client-side only)
   - Aucune synchronisation, aucun serveur
   - Chaque appareil/navigateur isolé
   - Pas de traçage utilisateur

4. **Pas de sécurité entre utilisateurs**
   - Mono-utilisateur par appareil
   - Pas de chiffrement local
   - Données en plaintext dans IndexedDB

---

### 10.3 Accessibilité comportementale

**Éléments observés (non-visuels):**

- **Labels:**
  - Questions ont numéro de question (contexte)
  - Badges ont descriptions (pour lecteur d'écran)

- **Focus:**
  - Boutons navigables au clavier
  - Pas d'ordre de tabulation explicite observé

- **Modaux:**
  - BaseModal avec titre
  - Boutons d'action distincts

- **Feedback:**
  - Spinner pour chargement
  - Messages d'erreur texte
  - États de réponse (correct/incorrect) explicites

**Observations:**
- Pas d'ARIA labels détaillés
- Pas de gestionnaire de focus modal
- Pas de skip-to-content
- Couleurs pour difficulté (risque pour daltoniens)

---

### 10.4 Maintenabilité

**Patterns appliqués:**

1. **Repository Pattern**
   - Abstraction IndexedDB
   - Échange facile (changer vers LocalStorage, HTTP, etc.)

2. **Store Pinia**
   - Séparation claire: Data / Quiz / Stats
   - Logique métier centralisée

3. **Composants atomiques**
   - BaseButton, BaseModal réutilisables
   - QuestionCard = logique quiz isolée

4. **Types TypeScript**
   - Interfaces pour toutes entités
   - Exclude<> pour types conditionnels

5. **Logs de debug**
   - [DataStore], [QuizStore], [Repository] préfixes
   - Facilite trace des opérations

**Absence de patterns:**
- Pas de tests unitaires couverts (test files existent mais vides)
- Pas de E2E complets
- Pas de storybook
- Pas de documentation API (JSDoc minimal)

---

## 11. Fichiers de configuration

### 11.1 Configuration de build (vite.config.ts)

```typescript
export default defineConfig({
  plugins: [
    vue(),              // Support .vue files
    vueJsx(),           // JSX support
    vueDevTools(),      // Vue DevTools plugin
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
```

**Points clés:**
- Target ES2020
- Alias `@` pour `src/`
- Vite v7 (full ESM)

### 11.2 Configuration TypeScript (tsconfig.app.json)

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**Points clés:**
- Strict mode activé (hérité de @vue/tsconfig)
- Include fichiers .vue
- Alias path matching

### 11.3 Configuration Tailwind CSS v4

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Material Design 3 colors customisés
      }
    }
  }
}
```

**Intégration:**
- @tailwindcss/postcss (PostCSS plugin)
- src/style.css: `@import "tailwindcss"`
- CSS compilé et tree-shaken

### 11.4 PostCSS (postcss.config.js)

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

Intégration simple Tailwind.

### 11.5 ESLint (eslint.config.ts)

Lint avec:
- Oxlint (1.23) - correctness
- ESLint 9.37 - rules
- Vue plugin
- TypeScript plugin
- Vitest plugin (pour __tests__)
- Prettier plugin (formatting)

### 11.6 Prettier (.prettierrc.json)

Configuration de formatage (indentation 2 spaces, semi, etc.)

---

## 12. Build et déploiement

### 12.1 Scripts npm

```bash
npm run dev              # Vite dev server (http://localhost:5174)
npm run build            # type-check + vite build (production)
npm run preview          # Prévisualiser prod localement
npm run test:unit        # Vitest
npm run test:e2e         # Playwright
npm run lint             # Oxlint + ESLint avec auto-fix
npm run format           # Prettier format
```

### 12.2 Artefacts de build

**Production:**
- `dist/` - bundles optimisés minifiés
- `dist/assets/` - CSS, JS, chunks
- `dist/index.html` - entry point

**Taille estimée:**
- CSS: ~32kB (~6.3kB gzipped)
- JS: Dépend de bundle splitting

### 12.3 Environment

- Node.js: ^20.19.0 || >=22.12.0
- Package manager: npm (package-lock.json)

---

## Appendix A - Référence rapide des composants

### Tableau résumé

| Chemin | Nom | Type | Rôle principal |
|--------|-----|------|-----------------|
| `layout/AppLayout.vue` | AppLayout | Layout | Wrapper principal avec header et modal |
| `layout/AppHeader.vue` | AppHeader | Navigation | En-tête avec logo et accès stats |
| `quiz/QuestionCard.vue` | QuestionCard | Présentation | Affichage question + 4 réponses |
| `quiz/AnswerOption.vue` | AnswerOption | Bouton | Réponse cliquable avec feedback état |
| `quiz/ProgressBar.vue` | ProgressBar | Indicateur | Barre progression 0-100% |
| `stats/StatCard.vue` | StatCard | KPI | Card statistique (moyenne, streak, etc.) |
| `stats/EvolutionChart.vue` | EvolutionChart | Graphique | Chart.js 30-day trend line |
| `stats/BadgesGrid.vue` | BadgesGrid | Grille | Affichage 3-col badges (vérouillé/débloqué) |
| `settings/FormCategorie.vue` | FormCategorie | Formulaire | Create/edit catégorie (label, icon, color) |
| `settings/ListeCategories.vue` | ListeCategories | Liste | Swipe-to-delete catégories avec counts |
| `settings/ModalSelectCategory.vue` | ModalSelectCategory | Modal | Sélection catégorie existante ou création |
| `common/BaseButton.vue` | BaseButton | Composant | Bouton réutilisable (4 variants, 3 sizes) |
| `common/BaseModal.vue` | BaseModal | Layout | Modal wrapper générique |
| `common/LoadingSpinner.vue` | LoadingSpinner | Indicateur | Spinner SVG pur |
| `common/MarkdownText.vue` | MarkdownText | Rendu | Parse Markdown vers HTML |

---

## Appendix B - Référence des stores Pinia

### useDataStore

| Item | Type | Rôle |
|------|------|------|
| `questions` | ref | Array questions depuis IndexedDB |
| `badges` | ref | Array badges 6 pré-définis |
| `categories` | ref | Array catégories |
| `isLoading` | ref | Flag état chargement |
| `error` | ref | Message erreur global |
| `initData()` | action | Load q, badges, cats au mount |
| `importQuestions(json, cat)` | action | Validate + save JSON import |
| `addCategory(cat)` | action | Créer catégorie (avec unicité) |
| `updateCategory(cat)` | action | Edit + cascade label change |
| `deleteCategory(id)` | action | Delete + cascade questions |
| `resetBadges()` | action | Set all à 'verrouille' |
| `updateBadges(badges)` | action | Save badges state |

### useQuizStore

| Item | Type | Rôle |
|------|------|------|
| `activeSession` | ref | QuizSession en cours ou null |
| `selectedAnswerIndex` | ref | Index réponse sélectionnée |
| `hasAnswered` | ref | Flag question répondue |
| `showResumeModal` | ref | Affiche modal reprise |
| `selectedCategories` | ref | Categories sélectionnées |
| `selectedDifficulty` | ref | Difficulty sélectionnée |
| `currentQuestion` | computed | SessionQuestion courante |
| `progressPercent` | computed | 0-100 progression |
| `isLastQuestion` | computed | Dernière question flag |
| `createQuizSession(cats, diff, count)` | action | Create + save session |
| `submitAnswer(idx)` | action | Enregistrer réponse |
| `skipQuestion()` | action | Passer question |
| `nextQuestion()` | action | Question suivante ou finish |
| `finishQuiz()` | action | Terminer + calc scores + badges |
| `checkResumableSession()` | action | Find pending session |

### useStatsStore

| Item | Type | Rôle |
|------|------|------|
| `globalStats` | ref | Agrégation stats (moyenne, streak, etc.) |
| `newlyUnlockedBadges` | ref | Badges débloqués cette session |
| `badgesNonLus` | computed | True si badges nouveaux |
| `loadStats()` | action | Calculate global stats |
| `updateStatsAndBadges(session)` | action | After finishQuiz + check badges |
| `calculateDailyAverages(sessions)` | action | 30-day map for chart |
| `calculateCurrentStreak(sessions)` | action | Days consécutifs |

---

## Appendix C - Routes complètes avec méthodes HTTP fictives

(Rappel: App 100% client-side, pas d'API backend)

```
GET  /                      → IndexedDB (dbPromise)
POST /quiz/create-session   → QuizSession save (sessionRepository)
PUT  /quiz/session/{id}     → Session update (sessionRepository)
DELETE /quiz/session/{id}   → Session delete (sessionRepository)
GET  /quiz/sessions         → getAll (sessionRepository)
POST /questions/import      → saveMany (questionRepository)
GET  /statistics            → calculateStats (sessionRepository + Pinia)
```

---

## Appendix D - Validation des données clés

### Validation Question (import)

```typescript
// Requis:
- intitule: string (non-vide)
- reponses: string[] (exactement 4 éléments)
- indexBonneReponse: number (0-3)
- difficulte: 'facile' | 'moyen' | 'difficile'

// Optionnels (avec défauts):
- id: string (default: `imported-${timestamp}-${idx}`)
- explication: string (default: '')
- categorie: string (default: 'Sans catégorie')
- countApparition: number (default: 0)
- countBonneReponse: number (default: 0)
```

### Validation Category

```typescript
// Tous requis:
- label: string (non-vide, unique)
- icon: string (parmi 24 icônes)
- color: TailwindColor (parmi 14 couleurs)

// Généré:
- id: string (user-created ou timestamp-based)
```

### Validation Badge Unlock

```
first_quiz:      completed >= 1 session
perfect_score:   score == 100% this session
streak_3:        currentStreak >= 3 days
streak_7:        currentStreak >= 7 days
marathon:        totalCompleted >= 20
math_expert:     5+ sessions monocatégorie 'Maths'
```

---

## Appendix E - Fichiers JSON de données pré-chargées

### Structure fichier questions JSON

**Localisation:** `public/questions/{category}.json`

**Exemples de fichiers:**
- `cat_react.json` - Questions React
- `cat_typescript.json` - Questions TypeScript
- `cat_nodejs.json` - Questions Node.js
- `cat_nextjs.json` - Questions Next.js
- `cat_css.json` - Questions CSS
- `cat_javascript.json` - Questions JavaScript
- `cat_entretiens.json` - Questions entretiens techniques

**Format JSON:**
```json
[
  {
    "intitule": "Qu'est-ce que React ?",
    "reponses": [
      "Une librairie JavaScript",
      "Un framework backend",
      "Une base de données",
      "Un serveur"
    ],
    "indexBonneReponse": 0,
    "difficulte": "facile",
    "explication": "React est une librairie JavaScript développée par Facebook pour construire des UI avec composants réutilisables.",
    "categorie": "React"
  },
  ...
]
```

---

## Appendix F - Tableau des entités et relations

```
Question
  ├─ categorie (string) ──→ Category.id
  ├─ difficulte: 'facile' | 'moyen' | 'difficile'
  ├─ countApparition (métrique usage)
  └─ countBonneReponse (métrique succès)

Category
  ├─ id (unique)
  ├─ label (unique, changeable)
  ├─ icon (24 options)
  └─ color (14 Tailwind colors)

QuizSession
  ├─ sessionId (UUID)
  ├─ dateDebut, dateFin (ISO strings)
  ├─ questions: SessionQuestion[] (snapshots)
  ├─ categories: string[] (labels of selected)
  ├─ difficulteChoisie: Difficulty
  ├─ scorePondere (weighted points)
  ├─ notePourcentage (0-100)
  └─ dateJour (YYYY-MM-DD, streak calc)

Badge
  ├─ id (unique, predefined)
  ├─ nom, description
  ├─ statut: 'verrouille' | 'debloque'
  ├─ icon (emoji)
  └─ dateDebloque (ISO timestamp)

GlobalStats
  ├─ moyenneGlobale (avg %)
  ├─ meilleurScore (max %)
  ├─ streakActuel (consecutive days)
  ├─ totalSessions (count)
  └─ historiqueSessions: QuizSession[] (for aggregation)
```

---

## 13. Dépendances et versions

### Production
- vue@3.5.22
- pinia@3.0.3
- vue-router@4.6.3
- chart.js@4.5.1
- marked@17.0.1
- @tailwindcss/postcss@4.1.17

### Dev
- vite@7.1.11
- typescript@~5.9.0
- @vitejs/plugin-vue@6.0.1
- @vue/test-utils@2.4.6
- vitest@3.2.4
- @playwright/test@1.56.1
- oxlint@~1.23.0
- eslint@9.37.0

---

## 14. Conclusion

### Résumé

**CodeMaster** est une Progressive Web Application (PWA) de quiz 100% client-side. Elle permet aux utilisateurs de:
- Faire des quiz catégorisés avec difficulté variable
- Suivre leurs progrès via statistiques et badges
- Importer des questions personnalisées
- Gérer des catégories

### Points clés d'architecture

1. **Frontend Only:** Aucun serveur, pas d'API, IndexedDB seul
2. **3 Stores Pinia:** Données (questions/badges), Quiz (session), Stats (agrégation)
3. **Repository Pattern:** Abstraction IndexedDB pour maintenabilité
4. **8 Routes:** Flux quiz + import + stats + catégories
5. **TypeScript Strict:** Types pour toutes entités
6. **Tailwind CSS v4:** Styling avec custom components
7. **Chart.js & Markdown:** Visualisations et contenu riche

### Fichiers critiques

- `src/stores/` - Logique métier (3 stores)
- `src/db/` - Persistance (IndexedDB)
- `src/views/` - Pages (10 fichiers)
- `src/router/` - Navigation
- `src/types/` - Models TypeScript

---

**Fin de la spécification fonctionnelle**
