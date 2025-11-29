# Mapping: Pages d'Application ↔ Fichiers HTML Mockups

## Vue d'ensemble
Ce document mappe chaque page de l'application Quiz Master PWA à son fichier HTML mockup correspondant.

**Total pages**: 11
**Total HTML mockups**: 11 (plus 2 fichiers de base: `index.html`, `Prototype.html`)

---

## Tableau de Mapping

| # | Route | Vue.js Component | HTML Mockup | Description |
|---|-------|------------------|-------------|-------------|
| 1 | `/home` ou `/quiz/home` | `src/views/quiz/Home.vue` | `UI_SPEC_HOME_APPLE.html` | Sélection de catégorie + Accès au mode aléatoire |
| 2 | `/quiz/difficulty` | `src/views/quiz/Difficulty.vue` | `UI_SPEC_QUIZ_CONFIG_APPLE.html` | Sélection du niveau de difficulté (Facile, Moyen, Difficile, Aléatoire) |
| 3 | `/quiz/count` | `src/views/quiz/Count.vue` | `UI_SPEC_QUIZ_CONFIG_APPLE.html` | Sélection du nombre de questions (5, 10, 20) |
| 4 | `/quiz/randomconfig` | `src/views/quiz/RandomConfig.vue` | `UI_SPEC_RANDOMCONFIG_APPLE.html` | Sélection multiple des catégories pour mode aléatoire |
| 5 | `/quiz/active` | `src/views/quiz/Active.vue` | `UI_SPEC_ACTIVE_APPLE.html` | Gameplay du quiz (affichage question + réponses + progression) |
| 6 | `/quiz/summary` | `src/views/quiz/Summary.vue` | `UI_SPEC_SUMMARY_APPLE.html` | Résumé des résultats (score, badges obtenus) |
| 7 | `/stats` | `src/views/stats/Index.vue` | `UI_SPEC_STATS_DASHBOARD_APPLE.html` | Tableau de bord statistiques (KPIs + graphique 30j + badges) |
| 8 | `/settings/import` | `src/views/settings/Import.vue` | `UI_SPEC_IMPORT_APPLE.html` | Gestion de l'importation de données (chargement catégories + upload JSON) |
| 9 | `/settings/select-category` | `src/views/settings/SelectCategory.vue` | `UI_SPEC_SELECTCATEGORY_APPLE.html` | Sélection des catégories à importer + formulaire création nouvelle catégorie |
| 10 | `/settings/categories` | `src/views/settings/Categories.vue` | `UI_SPEC_CATEGORIES_APPLE.html` | Liste des catégories existantes avec swipe-to-delete + bouton FAB |
| 11 | `/settings/categories/edit` | `src/views/settings/CategoryEdit.vue` | `UI_SPEC_CATEGORYEDIT_APPLE.html` | Créer ou modifier une catégorie (formulaire: nom + icône + couleur) |

---

## Notes Importantes

### 1. **Pages Unifiées**
- **Difficulté & Nombre de questions**: Partagent un seul fichier HTML `UI_SPEC_QUIZ_CONFIG_APPLE.html`
  - Page `/quiz/difficulty` = Configuration de difficulté
  - Page `/quiz/count` = Configuration du nombre
  - Les deux pages auront la même structure mais des options différentes

### 2. **Pages Stats**
- Un seul fichier HTML pour stats: `UI_SPEC_STATS_DASHBOARD_APPLE.html`
- Fichier `UI_SPEC_STATS_APPLE.html` semble être une variante ou ancien fichier

### 3. **Fichiers HTML Non Mappés**
- `index.html` - Fichier d'entrée standard Vite (non modifiable, utilisé pour dev)
- `Prototype.html` (53.6 KB) - Prototype général ou archive (à déterminer son usage)

### 4. **Structure des Fichiers**
- Tous les fichiers HTML mockup utilisent **Tailwind CSS v4**
- Tous suivent la **Apple Design System** (glassmorphisme, soft shadows, hairlines)
- Pas d'interactivité frontend (HTML + CSS uniquement, JavaScript limité)

---

## Prochaines Étapes

Une fois ce mapping validé, les étapes suivantes sont:

1. **Examiner chaque HTML mockup** pour identifier les différences avec les spécifications markdown
2. **Comparer structure HTML** avec structure Vue.js actuelle
3. **Modifier les composants Vue** pour correspondre aux interfaces HTML mockups:
   - Ajuster structure du template
   - Mettre à jour classes Tailwind CSS
   - Ajouter/modifier interactions si nécessaire
   - Vérifier alignement icônes Phosphor avec HTML mockups

---

## Légende des Routes

```
/quiz/*        = Pages liées au quiz (catégories, configuration, gameplay)
/quiz/active   = Page de jeu en cours
/quiz/summary  = Résumé post-quiz
/stats         = Tableau de bord statistiques
/settings/*    = Pages de gestion (import, catégories)
```

---

**Créé**: 2025-11-28
**Version**: 1.0
**Statut**: Prêt pour validation et analyse des HTML mockups
