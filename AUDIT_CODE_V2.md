# Audit de Code Approfondi & Plan de Refactoring - CodeMaster v2

Ce document complète le premier audit en se concentrant sur l'architecture, la logique métier, le couplage et l'accessibilité. Il propose un plan d'action découpé en 4 phases logiques et testables.

---

## 🚨 Synthèse des Risques Critiques Identifiés

1.  **"God Object" Store (`useQuizStore`)** :
    *   Ce store gère *tout* : sélection de configuration, état de la session, logique de jeu (score, réponse), persistance (appels DB directs), et même des bouts de navigation.
    *   **Risque** : Impossible de tester la logique de calcul de score sans mocker toute la DB et Pinia. Difficile d'ajouter de nouveaux modes de jeu.

2.  **Couplage Fort (Store <-> DB)** :
    *   Les stores importent directement `sessionRepository` et `questionRepository`.
    *   **Risque** : Si on change de backend (ex: Firebase au lieu d'IndexedDB), il faut réécrire tous les stores.

3.  **Fragilité du Routage ("Magic Strings")** :
    *   Les noms de routes (`'quiz-active'`, `'summary'`, `'home'`) sont éparpillés dans `src/router/index.ts` et dans les composants/stores.
    *   **Risque** : Une typo ou un renommage de route casse silencieusement la navigation.

4.  **Accessibilité & Sémantique** :
    *   `QuestionCard.vue` utilise des `<div>` avec `@click` pour certaines interactions ou n'utilise pas assez les attributs ARIA pour décrire l'état (réponse sélectionnée vs correcte).
    *   Les couleurs des catégories sont hardcodées dans le template (chaine `if/else` géante), ce qui rend l'ajout de catégories pénible.

---

## 🗓️ Plan de Refactoring par Phases

### Phase 1 : Fondations & "Quick Wins" (Sécurité & Constants)
*Objectif : Assainir la base de code sans toucher à la logique complexe.*

1.  **Centralisation des Routes** :
    *   Créer `src/router/routes.ts` exportant un objet `AppRoutes` contenant tous les noms de routes.
    *   Remplacer toutes les chaînes `'quiz-active'` par `AppRoutes.Quiz.Active`.
2.  **Consolidation des Constantes (Catégories)** :
    *   Appliquer la recommandation de l'Audit v1 (fusionner `CATEGORY_CONFIG`).
    *   Refactoriser `QuestionCard.vue` pour utiliser cette config dynamique pour les couleurs (supprimer le bloc `v-if/class` géant).
3.  **Logger Service** :
    *   Créer `src/utils/logger.ts` et remplacer les `console.log`.

**Testabilité :**
*   Vérifier que l'application compile.
*   Vérifier que la navigation fonctionne toujours.
*   Vérifier qu'une nouvelle catégorie ajoutée dans `constants.ts` apparaît bien avec sa couleur sans modifier `QuestionCard.vue`.

### Phase 2 : Découplage des Données (Pattern Repository & Service)
*Objectif : Séparer la persistance de la logique métier.*

1.  **Abstraction des Repositories** :
    *   S'assurer que les stores n'appellent pas directement `indexedDB` (déjà partiellement fait, mais à renforcer).
2.  **Validation des Données (Import)** :
    *   Créer `src/utils/validators.ts` avec des Type Guards (`isValidQuestion`).
    *   Sécuriser `useDataStore.ts` -> `importQuestions`.
3.  **Standardisation des Clones** :
    *   Remplacer `JSON.parse(JSON.stringify())` par `structuredClone()`.

**Testabilité :**
*   Unit Test : Tester `isValidQuestion` avec des JSON valides et invalides.
*   E2E : Tenter d'importer un fichier JSON corrompu via l'UI et vérifier que l'erreur est gérée proprement sans crash.

### Phase 3 : Logique Métier Pure (Extraction du "Game Engine")
*Objectif : Rendre le cœur du quiz testable unitairement sans Vue/Pinia.*

1.  **Création de `src/logic/quizEngine.ts`** :
    *   Extraire la logique de calcul de score (`calculateScore(questions)`) dans une fonction pure.
    *   Extraire la logique de mélange (`shuffleAnswers`, `selectQuestions`) dans des fonctions pures.
2.  **Nettoyage de `useQuizStore`** :
    *   Le store ne doit faire qu'orchestrer : appeler `quizEngine` pour les calculs, puis sauvegarder le résultat via le Repository.
    *   Déplacer la logique de "Sélection de configuration" (Categories, Difficulty) dans un petit store dédié `useQuizConfigStore` ou garder séparé dans le state pour ne pas polluer la session active.

**Testabilité :**
*   Unit Test : Créer `src/logic/quizEngine.spec.ts`. Tester `calculateScore` avec un tableau de questions mocké. Vérifier que le score est juste (1pt facile, 3pts difficile).
*   Ceci est impossible actuellement car la logique est enfouie dans `finishQuiz` du store.

### Phase 4 : UI & Accessibilité (A11y)
*Objectif : Rendre l'app utilisable par tous et nettoyer les templates.*

1.  **Composables UI** :
    *   Extraire la logique de style de `Active.vue` vers `src/composables/useQuizStyles.ts`.
2.  **Accessibilité (ARIA)** :
    *   Dans `AnswerOption.vue`, utiliser `<button type="button" :aria-pressed="isSelected" :aria-label="...">`.
    *   S'assurer que le focus est géré lors du passage à la question suivante (pour les lecteurs d'écran).
3.  **Animations** :
    *   Déplacer les `@keyframes` dans `tailwind.config.js`.

**Testabilité :**
*   Audit Lighthouse/Axe pour vérifier le score d'accessibilité.
*   Vérifier la navigation au clavier (Tab / Enter).

---

## 🚀 Exemple Concret : Refactoring Phase 3 (Game Engine)

Actuellement (`useQuizStore.ts`) :
```typescript
// Difficile à tester
async function finishQuiz() {
  // ... accès state ...
  activeSession.value.questions.forEach((q) => {
     const points = DIFFICULTY_POINTS[q.difficulte] || 1
     // ... mutation state ...
  })
}
```

Cible (`src/logic/scoring.ts`) :
```typescript
// Facile à tester (Fonction pure)
export function calculateSessionScore(questions: SessionQuestion[]): QuizScoreResult {
  let score = 0;
  let max = 0;
  // ... calcul ...
  return { score, max, percentage };
}
```

Nouveau Store :
```typescript
import { calculateSessionScore } from '@/logic/scoring';

async function finishQuiz() {
  const result = calculateSessionScore(activeSession.value.questions);
  activeSession.value.scorePondere = result.score;
  // ... save ...
}
```
