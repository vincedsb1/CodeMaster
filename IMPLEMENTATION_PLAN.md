# Plan d'implémentation : Gestion des catégories dynamiques

**Date**: 2025-11-25
**Objectif**: Permettre aux utilisateurs de créer, modifier et supprimer des catégories avec icônes et couleurs personnalisées.

---

## Vue d'ensemble

### Changements de la structure de données

**Avant**: Les catégories sont des simples strings stockées dans les questions.

**Après**: Les catégories deviennent des objets structurés avec:
```typescript
interface Category {
  id: string              // unique identifier
  label: string           // nom affichable
  icon: string            // nom de l'icône Phosphor (ex: "Code", "Database")
  color: TailwindColor    // couleur Tailwind (ex: "indigo", "blue")
}
```

### Architecture à mettre en place

1. **Persistance**:
   - Nouvelle table IndexedDB `categories`
   - Repository `categoryRepository` pour CRUD

2. **State Management**:
   - Étendre `useDataStore` avec logique de gestion des catégories
   - Getter pour récupérer une catégorie par label

3. **UI**:
   - Nouvelle page `/settings/categories` pour CRUD
   - Icône settings dans le header
   - Mise à jour Home.vue et RandomConfig.vue
   - Modal de confirmation suppression
   - Sélecteur de catégorie lors de l'import JSON

---

## Étapes d'implémentation

### ✅ ÉTAPE 1 : Mise à jour de la structure de données

**Fichier**: `src/types/models.ts`
**Modifications**:
- Ajouter interface `Category` avec propriétés: `id`, `label`, `icon`, `color`
- Ajouter type `TailwindColor` (union des 12 couleurs Tailwind: slate, red, orange, amber, yellow, lime, green, emerald, teal, cyan, blue, indigo, purple, pink)
- Modifier Question pour garder `categorie: string` (référence au label, pas à l'id)

**Fichier**: `src/types/constants.ts`
**Modifications**:
- Ajouter `DEFAULT_CATEGORIES: Category[]` avec les catégories initiales :
  - TypeScript (icon: "Code", color: "blue")
  - React (icon: "React", color: "cyan")
  - Next.js (icon: "Rocket", color: "slate")
  - Node.js (icon: "Node", color: "green")
  - CSS (icon: "Palette", color: "purple")
  - Database (icon: "Database", color: "orange")
  - Entretien (icon: "Chat", color: "indigo")
  - + 5 autres pour les questions par défaut (Maths, Géographie, etc.)

**À tester**:
- Les interfaces TypeScript compilent sans erreur
- Les types sont corrects

---

### ✅ ÉTAPE 2 : Configuration IndexedDB et repository

**Fichier**: `src/db/config.ts`
**Modifications**:
- Ajouter `'categories'` dans `DB_CONFIG.STORES`
- Définir le schéma: keyPath `'id'`, index sur `'label'` (unique)

**Fichier**: `src/db/repositories.ts`
**Modifications**:
- Créer `categoryRepository` avec méthodes:
  - `getAll(): Promise<Category[]>`
  - `getByLabel(label: string): Promise<Category | undefined>`
  - `save(category: Category): Promise<void>`
  - `update(category: Category): Promise<void>`
  - `delete(id: string): Promise<void>`
  - `deleteByLabel(label: string): Promise<void>`

**À tester**:
- Créer, lire, mettre à jour, supprimer une catégorie en IndexedDB
- Vérifier que les données persisten après rechargement de page
- L'index sur `label` empêche les doublons

---

### ✅ ÉTAPE 3 : Store Pinia pour les catégories

**Fichier**: `src/stores/useDataStore.ts`
**Modifications**:
- Ajouter state `categories: Category[]`
- Ajouter actions:
  - `loadCategories()`: charge depuis IndexedDB au démarrage
  - `addCategory(category: Category): Promise<void>`: avec validation (label unique)
  - `updateCategory(category: Category): Promise<void>`: validation label
  - `deleteCategory(categoryId: string): Promise<void>`: supprime aussi les questions avec cette catégorie
  - `getCategoryByLabel(label: string): Category | undefined`
  - `resetCategories()`: réinitialise avec les catégories par défaut
- Ajouter getter `allCategories`

**Logique de suppression**:
```typescript
async deleteCategory(categoryId: string) {
  const category = this.categories.find(c => c.id === categoryId)
  if (!category) return

  // Supprimer les questions de cette catégorie
  this.questions = this.questions.filter(q => q.categorie !== category.label)
  await questionRepository.saveMany(this.questions)

  // Supprimer la catégorie
  await categoryRepository.delete(categoryId)
  this.categories = this.categories.filter(c => c.id !== categoryId)
}
```

**À tester**:
- Les catégories se chargent au démarrage de l'app
- Ajouter une catégorie l'ajoute au state et à IndexedDB
- Modifier une catégorie met à jour le state et IndexedDB
- Supprimer une catégorie supprime aussi les questions associées
- Validation des labels uniques (empêcher les doublons)

---

### ✅ ÉTAPE 4 : Installation de phosphor-vue

**Fichier**: `package.json`
**Modification**:
- Ajouter dépendance: `phosphor-vue@^2.x` (ou version compatible)

**Commande**:
```bash
npm install phosphor-vue
```

**Fichier**: `src/main.ts`
**Modification**:
- Importer et enregistrer le plugin Phosphor global:
```typescript
import { PhosphorIcon } from 'phosphor-vue'

app.component('PhosphorIcon', PhosphorIcon)
```

**Utilisation dans templates**:
```vue
<PhosphorIcon :weight="'bold'" :size="24">
  {{ iconName }}
</PhosphorIcon>
```

**À tester**:
- Les icônes s'affichent correctement
- Pas d'erreurs de compilation
- Les icônes Phosphor sont bien chargées (inspecter l'app)

---

### ✅ ÉTAPE 5 : Créer la page `/settings/categories`

**Fichier à créer**: `src/views/settings/Categories.vue`

**Structure**:
```vue
<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div>
      <h1 class="text-2xl font-bold">Gestion des catégories</h1>
      <p class="text-slate-600">Créer, modifier ou supprimer des catégories</p>
    </div>

    <!-- Formulaire d'ajout/édition -->
    <FormCategorie
      :categorie="editingCategory"
      @submit="handleSaveCategory"
      @cancel="editingCategory = null"
    />

    <!-- Liste des catégories -->
    <ListeCategories
      :categories="dataStore.allCategories"
      @edit="editingCategory = $event"
      @delete="handleDeleteCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import FormCategorie from '@/components/settings/FormCategorie.vue'
import ListeCategories from '@/components/settings/ListeCategories.vue'

const dataStore = useDataStore()
const editingCategory = ref(null)

const handleSaveCategory = async (category) => {
  if (editingCategory.value?.id) {
    await dataStore.updateCategory(category)
  } else {
    await dataStore.addCategory(category)
  }
  editingCategory.value = null
}

const handleDeleteCategory = async (categoryId) => {
  if (confirm('Êtes-vous sûr? Toutes les questions de cette catégorie seront supprimées.')) {
    await dataStore.deleteCategory(categoryId)
  }
}
</script>
```

**Fichier à créer**: `src/components/settings/FormCategorie.vue`

**Features**:
- Champs: label (input text), icon (select Phosphor), color (select Tailwind)
- Boutons: Sauvegarder, Annuler
- Validation: label non-vide et unique (sauf en édition)
- Mode création/édition

**Fichier à créer**: `src/components/settings/ListeCategories.vue`

**Features**:
- Tableau affichant: icône + couleur + label
- Actions: Éditer (remplis le formulaire), Supprimer (avec modale de confirmation)
- Affichage du nombre de questions par catégorie

**À tester**:
- Ajouter une catégorie (validée en IndexedDB)
- Modifier une catégorie (label change aussi dans les questions)
- Supprimer une catégorie (modale de confirmation, questions supprimées)
- Validation des champs (label unique)
- Navigation fonctionne correctement

---

### ✅ ÉTAPE 6 : Ajouter l'icône settings dans le header

**Fichier**: `src/components/layout/AppHeader.vue`
**Modifications**:
- Ajouter un bouton settings à côté du bouton stats
- Router link vers `/settings/categories`
- Icône: `Gear` ou `Sliders` de Phosphor

**Template**:
```vue
<RouterLink to="/settings/categories" class="...">
  <PhosphorIcon :weight="'bold'" :size="24">Gear</PhosphorIcon>
</RouterLink>
```

**À tester**:
- L'icône s'affiche dans le header
- Clic redirige vers `/settings/categories`
- Navigation fonctionne sur tous les écrans

---

### ✅ ÉTAPE 7 : Ajouter la route `/settings/categories`

**Fichier**: `src/router/index.ts`
**Modifications**:
- Ajouter route: `/settings/categories` → `Categories.vue`

**À tester**:
- URL `/settings/categories` charge la page
- Navigation par RouterLink fonctionne

---

### ✅ ÉTAPE 8 : Modifier l'import JSON avec sélection de catégorie

**Fichier**: `src/views/settings/Import.vue`
**Modifications**:
- Avant de lancer l'import, afficher un modal pour sélectionner une catégorie cible
- Le modal liste toutes les catégories existantes
- Option pour créer une nouvelle catégorie à la volée
- Une fois sélectionnée, assigner cette catégorie à TOUTES les questions du JSON

**Logique**:
1. L'utilisateur sélectionne un fichier JSON
2. Modal s'affiche avec liste des catégories
3. Utilisateur sélectionne une catégorie
4. Import exécuté avec assignment de catégorie

**Fichier à créer**: `src/components/settings/ModalSelectCategory.vue`
**Features**:
- Liste des catégories existantes
- Champ texte pour créer nouvelle catégorie + select icon/color
- Boutons: Importer, Annuler

**À tester**:
- Modal s'affiche au bon moment
- Sélectionner une catégorie existante fonctionne
- Créer une nouvelle catégorie à la volée fonctionne
- L'import assigne bien la catégorie à TOUTES les questions
- Données en IndexedDB sont correctes

---

### ✅ ÉTAPE 9 : Mettre à jour Home.vue pour afficher les icônes/couleurs

**Fichier**: `src/views/quiz/Home.vue`
**Modifications**:
- Récupérer les catégories depuis le store au lieu d'extraire des questions
- Afficher l'icône Phosphor et couleur de chaque catégorie
- Dynamiser les classes Tailwind basées sur la couleur

**Logique de couleur**:
```vue
<div
  :class="{
    'bg-indigo-50': cat.color === 'indigo',
    'bg-blue-50': cat.color === 'blue',
    // ... pour les 12 couleurs
  }"
>
  <PhosphorIcon :weight="'bold'" :size="24">{{ cat.icon }}</PhosphorIcon>
</div>
```

**À tester**:
- Les catégories s'affichent avec les bonnes icônes
- Les couleurs sont cohérentes
- Cliquer sur une catégorie lance un quiz avec les bonnes questions
- Les questions des catégories supprimées ne s'affichent pas

---

### ✅ ÉTAPE 10 : Mettre à jour RandomConfig.vue

**Fichier**: `src/views/quiz/RandomConfig.vue`
**Modifications**:
- Afficher les icônes et couleurs pour chaque catégorie
- Utiliser le même style que Home.vue pour cohérence

**À tester**:
- Les catégories s'affichent avec icônes/couleurs
- Multi-sélection fonctionne
- Lancer un quiz avec sélection aléatoire fonctionne

---

### ✅ ÉTAPE 11 : Tester l'application complète

**Tests manuels**:

1. **Workflow création catégorie**:
   - Naviguer vers settings/categories
   - Créer une nouvelle catégorie avec label, icône, couleur
   - Vérifier en IndexedDB que c'est persisté
   - Vérifier que le label s'ajoute aux choix d'import

2. **Workflow modification catégorie**:
   - Modifier une catégorie existante
   - Changer son label
   - Vérifier que les questions mises à jour reflètent le nouveau label

3. **Workflow suppression catégorie**:
   - Importer des questions avec une catégorie
   - Supprimer la catégorie
   - Modale de confirmation s'affiche
   - Vérifier que les questions sont supprimées
   - Vérifier que les questions ne s'affichent plus en Home.vue

4. **Workflow import JSON**:
   - Aller à /settings/import
   - Sélectionner un fichier JSON
   - Modal de sélection catégorie s'affiche
   - Sélectionner une catégorie
   - Import réussit
   - Vérifier que les questions ont la bonne catégorie

5. **Workflow quiz normal**:
   - Home.vue affiche les catégories avec icônes/couleurs
   - Sélectionner une catégorie et lancer un quiz
   - Quiz fonctionne correctement
   - Résultats sauvegardés

6. **Tests de validation**:
   - Impossible de créer deux catégories avec le même label
   - Impossible de créer une catégorie sans label
   - Modification d'une catégorie n'affecte pas les autres

7. **Tests de persistance**:
   - Créer une catégorie
   - Rafraîchir la page
   - Catégorie existe toujours
   - Questions importées sont toujours là

**À tester**:
- Tous les workflows ci-dessus fonctionnent
- Pas d'erreurs console
- Pas de mutations involontaires en IndexedDB
- Performances acceptables avec beaucoup de catégories/questions

---

## Dépendances à ajouter

```json
{
  "phosphor-vue": "^2.x"
}
```

---

## Fichiers à créer

1. `src/views/settings/Categories.vue`
2. `src/components/settings/FormCategorie.vue`
3. `src/components/settings/ListeCategories.vue`
4. `src/components/settings/ModalSelectCategory.vue`

---

## Fichiers à modifier

1. `src/types/models.ts` - Ajouter interface `Category`
2. `src/types/constants.ts` - Ajouter `DEFAULT_CATEGORIES`
3. `src/db/config.ts` - Ajouter store 'categories'
4. `src/db/repositories.ts` - Ajouter `categoryRepository`
5. `src/stores/useDataStore.ts` - Ajouter logique catégories
6. `src/components/layout/AppHeader.vue` - Ajouter bouton settings
7. `src/router/index.ts` - Ajouter route /settings/categories
8. `src/views/settings/Import.vue` - Ajouter modal sélection catégorie
9. `src/views/quiz/Home.vue` - Afficher icônes/couleurs
10. `src/views/quiz/RandomConfig.vue` - Afficher icônes/couleurs
11. `src/main.ts` - Enregistrer plugin Phosphor

---

## Notes d'implémentation

### Couleurs Tailwind disponibles
```
slate, red, orange, amber, yellow, lime, green, emerald, teal, cyan, blue, indigo, purple, pink
```

### Icônes Phosphor recommandées (par catégorie)
```
- TypeScript: "Code", "Brackets"
- React: "React"
- Next.js: "Rocket"
- Node.js: "Cpu"
- CSS: "Palette"
- Database: "Database"
- Entretien: "Chat", "Microphone"
- Maths: "Calculator"
- Science: "Microscope"
- Géographie: "Globe"
- Art: "Palette"
```

### Validation des données
- Label de catégorie: non-vide, unique (case-sensitive)
- Color: doit être dans la liste des 12 couleurs Tailwind
- Icon: doit être un nom valide d'icône Phosphor

### Gestion des erreurs
- Import JSON avec catégorie n'existant pas → créer la catégorie
- Suppression catégorie avec questions → confirmation modale, supprimer questions
- Mise à jour catégorie → mettre à jour toutes les questions avec l'ancien label

---

## Ordre recommandé d'implémentation

1. ✅ ÉTAPE 1 : Types
2. ✅ ÉTAPE 2 : IndexedDB + Repository
3. ✅ ÉTAPE 3 : Store Pinia
4. ✅ ÉTAPE 4 : Phosphor Vue
5. ✅ ÉTAPE 5-7 : Page + Route
6. ✅ ÉTAPE 8 : Import JSON
7. ✅ ÉTAPE 9-10 : UI Home + RandomConfig
8. ✅ ÉTAPE 6 : Header
9. ✅ ÉTAPE 11 : Tests

Chaque étape est testable indépendamment avant de passer à la suivante.
