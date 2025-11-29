# Audit du Code & Recommandations - CodeMaster

Ce document présente un audit technique de l'application CodeMaster. Il se concentre sur des améliorations **concrètes, à faible risque et à fort impact** pour la maintenabilité et la qualité du code.

## 1. Centralisation des Constantes et "Magic Strings"

Actuellement, la gestion des catégories et des correspondances (Ids <-> Labels <-> Fichiers) est dispersée entre `src/types/constants.ts` et `src/db/loaders/questionsLoader.ts`. Cela crée un risque d'incohérence.

**Problème identifié :**
- `CATEGORY_LABEL_MAPPING` est défini dans `questionsLoader.ts`.
- `CATEGORY_DISPLAY_MAP` est défini dans `constants.ts`.
- Les chaînes de caractères comme `'cat_react'`, `'react'` sont dupliquées.

**Recommandation :**
Tout regrouper dans `src/types/constants.ts` sous une seule structure de vérité.

```typescript
// src/types/constants.ts

// Définir une map unique pour la configuration des catégories
export const CATEGORY_CONFIG: Record<string, { id: string; label: string; fileName: string }> = {
  react: { id: 'cat_react', label: 'React', fileName: 'react' },
  typescript: { id: 'cat_typescript', label: 'TypeScript', fileName: 'typescript' },
  // ... autres
};

// Helpers dérivés pour la rétro-compatibilité
export const getCategoryLabel = (key: string) => 
  Object.values(CATEGORY_CONFIG).find(c => c.id === key || c.fileName === key)?.label || key;
```

## 2. Modernisation du clopage d'objets (Deep Clone)

Dans `useDataStore.ts` et `repositories.ts`, l'approche `JSON.parse(JSON.stringify(...))` est utilisée fréquemment pour "nettoyer" les Proxies Vue avant sauvegarde IndexedDB.

**Problème identifié :**
C'est une méthode ancienne, moins performante et qui perd certains types de données (dates, undefined).

**Recommandation :**
Utiliser `structuredClone()`, qui est natif dans les navigateurs modernes et Node.js (version du projet > 20).

```typescript
// Avant
const cleaned = JSON.parse(JSON.stringify(data));

// Après
const cleaned = structuredClone(data);
```

## 3. Sécurisation de l'Import JSON

Dans `useDataStore.ts`, la fonction `importQuestions` fait confiance au JSON entrant avec un simple casting.

**Problème identifié :**
Si le JSON est mal formé mais passe les vérifications basiques, l'application peut crasher au runtime. L'usage de `as Record<string, unknown>` puis de casts force le type sans garantie réelle.

**Recommandation :**
Créer une fonction "Type Guard" explicite dans un nouveau fichier `src/utils/validators.ts`.

```typescript
// src/utils/validators.ts
export function isValidQuestion(data: unknown): data is Question {
  return (
    typeof data === 'object' &&
    data !== null &&
    'intitule' in data &&
    'reponses' in data &&
    Array.isArray((data as any).reponses)
    // ... autres vérifications
  );
}
```

## 4. Nettoyage des Logs en Production

Les fichiers comme `useDataStore.ts` et `questionsLoader.ts` contiennent beaucoup de `console.log` qui polluent la console en production.

**Recommandation :**
Créer un petit utilitaire de log qui ne s'active qu'en mode développement.

```typescript
// src/utils/logger.ts
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => isDev && console.log(...args),
  warn: (...args: any[]) => isDev && console.warn(...args),
  error: (...args: any[]) => console.error(...args), // Toujours afficher les erreurs
};
```

## 5. Allègement du Composant `Active.vue`

`Active.vue` contient de la logique de présentation complexe, notamment `getAnswerClasses` et `getBadgeClasses`.

**Problème identifié :**
Le template devient difficile à lire et la logique de style conditionnel (Tailwind) est mélangée à la logique Vue.

**Recommandation :**
Extraire cette logique dans un composable dédié à l'UI du quiz ou simplement des fonctions utilitaires pures dans un fichier séparé (ex: `src/utils/quizStyles.ts`).

```typescript
// src/utils/quizStyles.ts
export function getAnswerVariant(
  index: number, 
  selectedIndex: number | null, 
  correctIndex: number, 
  hasAnswered: boolean
) {
  if (!hasAnswered) return 'default';
  if (index === correctIndex) return 'correct';
  if (index === selectedIndex) return 'wrong';
  return 'dimmed';
}
// Retourner ensuite les classes Tailwind correspondantes
```

## 6. Amélioration de l'UX/UI (Tailwind)

**Observation :**
Dans `Active.vue`, des animations (`@keyframes`) sont définies dans le `<style scoped>`.

**Recommandation :**
Déplacer ces animations dans `tailwind.config.js` (section `theme.extend.keyframes` et `animation`). Cela rendra les animations réutilisables partout dans l'app (comme pour les modales ou les toasts) et allégera le composant Vue.

## Résumé des actions prioritaires

1.  [ ] Créer `src/utils/logger.ts` et remplacer les `console.log`.
2.  [ ] Refactorer `src/types/constants.ts` pour centraliser la config des catégories.
3.  [ ] Remplacer `JSON.parse(JSON.stringify())` par `structuredClone()`.
4.  [ ] (Optionnel) Extraire la logique de style de `Active.vue`.

Ces changements n'altèrent pas la logique métier critique mais solidifient grandement la base de code pour le futur.
