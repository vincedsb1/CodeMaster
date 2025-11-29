# Spécification UI : Quiz Configuration Flow (Apple Design System)

**Version:** 1.0
**Pages:** `/quiz/difficulty` et `/quiz/count`
**Composants:** `src/views/quiz/Difficulty.vue` et `src/views/quiz/Count.vue`
**Design System:** Apple Human Interface Guidelines (iOS/macOS)
**Aesthetic:** Premium, Minimaliste, Glassmorphism, Translucidité
**Statut:** À implémenter

---

## Vue d'ensemble du flux

Le flux de configuration du quiz comprend **deux étapes distinctes** :

1. **Étape 1 : Sélection de la difficulté** (`/quiz/difficulty`)
   - Utilisateur choisit : Facile, Moyen, Difficile, ou Aléatoire
   - Navigue vers `/quiz/count`

2. **Étape 2 : Sélection du nombre de questions** (`/quiz/count`)
   - Utilisateur choisit : 5, 10, ou 20 questions
   - Crée la session et navigue vers `/quiz/active`

**Design unifié :** Les deux pages partagent le même langage design Apple (glassmorphism, large title, card-based selection).

---

## ÉTAPE 1 : Sélection Difficulté

### 1. Objectif & Contexte

#### Objectif principal
L'utilisateur vient de sélectionner une catégorie (depuis Home) et doit maintenant **choisir le niveau de difficulté** du quiz. Cette page présente quatre options claires :
- **Facile** (1 point par question correcte)
- **Moyen** (2 points par question correcte)
- **Difficile** (3 points par question correcte)
- **Aléatoire** (mélange des trois niveaux)

#### Action primaire attendue
- **Tap sur une difficulté** → Enregistrer en store, naviguer vers `/quiz/count`

#### Feeling attendu
**Clair, progressive, invitant.** L'utilisateur comprend immédiatement les options et leur progression de difficulté. Design épuré, une seule décision par écran (Progressive Disclosure).

---

### 2. Structure & Layout (iOS/macOS Style)

#### Navigation Bar (Collapsible/Large Title)

```
┌──────────────────────────────────┐
│  ← Difficulté                  ✕ │  ← Compact back button + close
├──────────────────────────────────┤
```

**Spécifications :**
- **Arrière-plan:** `bg-white/80 backdrop-blur-xl border-b border-white/20`
- **Position:** `sticky top-0 z-40`
- **Padding:** `px-6 py-4` (compact, pas de large title ici)

**Contenu :**

1. **Back button (gauche):**
   - Type: Icon Button
   - Icône: Phosphor "CaretLeft", weight='light', size=20
   - Classes: `flex items-center text-blue-600 hover:text-blue-700 transition-colors`
   - Click: `router.back()` → Revient à `/home` ou `/quiz/randomconfig`

2. **Titre (centre):**
   - Text: "Difficulté"
   - Classes: `text-lg font-semibold text-slate-900 flex-1 text-center`

3. **Close button (droite, optionnel):**
   - Type: Icon Button
   - Icône: Phosphor "X", weight='light', size=20
   - Classes: `flex items-center text-slate-400 hover:text-slate-600 transition-colors`
   - Click: Navigue `/home` (abandon du flux)

#### Body (Contenu scrollable)

**Container principal:**
- Classes: `px-6 py-8 space-y-4 pb-12`
- Padding: `px-6` (marge généreuse)
- Vertical spacing: `space-y-4` (16px entre sections)

**Layout :**
```
┌─────────────────────────────────┐
│  Sélectionne un niveau          │  ← Description (optionnel)
├─────────────────────────────────┤
│                                 │
│  [Facile]                       │  ← 4 boutons/cards
│  Parfait pour débuter           │     (verticaux, fullwidth)
│                                 │
│  [Moyen]                        │
│  Pour progresser                │
│                                 │
│  [Difficile]                    │
│  Teste tes connaissances        │
│                                 │
│  [Aléatoire]                    │
│  Mélange tous les niveaux       │
│                                 │
└─────────────────────────────────┘
```

---

### 3. Composants Apple Design pour Difficulté

#### Description (optionnel, top)

```html
<div class="text-center space-y-1">
  <h2 class="text-2xl font-bold text-slate-900">Quel niveau ?</h2>
  <p class="text-sm text-slate-500">Choisis une difficulté pour commencer</p>
</div>
```

**Spécifications:**
- **Titre:** `text-2xl font-bold text-slate-900`
- **Description:** `text-sm text-slate-500`
- **Spacing:** `space-y-1`
- **Alignment:** Centré

#### Options de difficulté (4 cartes)

**Container des options:**
- Classes: `space-y-4 mt-8`

**Carte difficulté (répétée x4):**

```html
<button @click="selectDifficulty('facile')"
        class="group w-full rounded-3xl bg-white p-6 border border-gray-100/50
               shadow-[0_4px_12px_rgba(0,0,0,0.05)]
               hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
               hover:bg-gray-50/50
               active:scale-95
               transition-all duration-200
               flex flex-col items-start gap-3">

  <!-- Icon + Level Name Row -->
  <div class="flex items-center gap-3 w-full">
    <!-- Difficulty Color Badge -->
    <div class="w-12 h-12 rounded-full flex items-center justify-center"
         :style="{ backgroundColor: difficultyColor.bgLight }">
      <PhosphorIcon weight="regular" size="24" :class="difficultyColor.textDark">
        {{ getDifficultyIcon(difficulty) }}
      </PhosphorIcon>
    </div>

    <!-- Level Name -->
    <div class="flex flex-col gap-0.5">
      <h3 class="text-lg font-semibold text-slate-900 capitalize">
        {{ difficulty }}
      </h3>
      <span class="text-xs font-medium text-slate-400">
        {{ getPointsText(difficulty) }} point(s)
      </span>
    </div>
  </div>

  <!-- Description -->
  <p class="text-sm text-slate-600 leading-relaxed">
    {{ getDifficultyDescription(difficulty) }}
  </p>
</button>
```

**Spécifications complètes :**

1. **Container button:**
   - Classes: `group w-full rounded-3xl bg-white p-6 border border-gray-100/50`
   - Width: `w-full` (fullwidth)
   - Rounding: `rounded-3xl` (~20px)
   - Padding: `p-6` (24px all sides)
   - Border: `border border-gray-100/50` (hairline très fine)
   - Shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.05)]` (douce par défaut)
   - Hover: `hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]` + `hover:bg-gray-50/50`
   - Active: `active:scale-95` (feedback rapide)
   - Transition: `transition-all duration-200`
   - Flex: `flex flex-col items-start gap-3` (vertical, aligné à gauche)

2. **Icon + Name row:**
   - Container: `flex items-center gap-3 w-full`

   a) **Difficulty badge:**
      - Container: `w-12 h-12 rounded-full flex items-center justify-center`
      - Rounding: `rounded-full`
      - Background: Dynamique selon difficulté
        ```javascript
        {
          facile: { bgLight: '#D1FAE5', textDark: '#065F46' },      // Vert
          moyen: { bgLight: '#FEF3C7', textDark: '#92400E' },      // Jaune/Amber
          difficile: { bgLight: '#FEE2E2', textDark: '#991B1B' },  // Rouge
          random: { bgLight: '#F3E8FF', textDark: '#6B21A8' }      // Violet
        }
        ```
      - Icône: Phosphor icon dynamique selon difficulté
        - Facile: "Smiley" 😊
        - Moyen: "Lightning" ⚡
        - Difficile: "Flame" 🔥
        - Aléatoire: "Shuffle" 🔀

   b) **Name + Points:**
      - Name: `text-lg font-semibold text-slate-900 capitalize`
      - Points: `text-xs font-medium text-slate-400`

3. **Description:**
   - Classes: `text-sm text-slate-600 leading-relaxed`
   - Textes:
     - Facile: "Parfait pour débuter. Consolidez les bases."
     - Moyen: "Pour progresser. Teste tes connaissances."
     - Difficile: "Ultime défi. Maîtrise complète requise."
     - Aléatoire: "Mélange tous les niveaux. Variété garantie."

#### Mapping des couleurs (Difficulty)

```javascript
const DIFFICULTY_COLORS = {
  facile: {
    bgLight: '#D1FAE5',        // Vert 100 très clair
    bgMedium: '#86EFAC',       // Vert 300
    textDark: '#065F46',       // Vert 900
    textBadge: '#047857'       // Vert 700
  },
  moyen: {
    bgLight: '#FEF3C7',        // Amber 100
    bgMedium: '#FBBF24',       // Amber 400
    textDark: '#92400E',       // Amber 900
    textBadge: '#B45309'       // Amber 700
  },
  difficile: {
    bgLight: '#FEE2E2',        // Red 100
    bgMedium: '#F87171',       // Red 400
    textDark: '#991B1B',       // Red 900
    textBadge: '#DC2626'       // Red 700
  },
  random: {
    bgLight: '#F3E8FF',        // Violet 100
    bgMedium: '#D8B4FE',       // Violet 300
    textDark: '#6B21A8',       // Violet 900
    textBadge: '#9333EA'       // Violet 700
  }
}
```

---

### 4. Interactions & States (Difficulté)

#### Tap sur carte difficulté

```typescript
function selectDifficulty(difficulty: Difficulty) {
  quizStore.selectDifficulty(difficulty)
  router.push('/quiz/count')
}
```

**Feedback visuel:**
- `active:scale-95` (réduction légère 95%)
- Transition `duration-200` (200ms, rapide)
- Ombre augmente au hover (elevation change)

#### Transitions

- Entrance: Slide from right, fade in (`opacity-0 translate-x-10` → `opacity-100 translate-x-0`, duration-300)
- Exit: Slide to left, fade out
- Smooth easing: `ease-out`

---

## ÉTAPE 2 : Sélection Nombre de Questions

### 1. Objectif & Contexte

#### Objectif principal
L'utilisateur a choisi la difficulté et doit maintenant sélectionner le **nombre de questions** pour le quiz. Trois options :
- **5 questions** (rapide, ~2-3 min)
- **10 questions** (standard, ~5-7 min)
- **20 questions** (complet, ~10-15 min)

Après cette sélection, la session de quiz est créée (`createQuizSession()`) et l'utilisateur est dirigé vers `/quiz/active`.

#### Action primaire attendue
- **Tap sur un nombre** → Créer la session, naviguer vers `/quiz/active`

#### Feeling attendu
**Rapide, efficace, progressif.** Deuxième étape du flow d'onboarding quiz. Choix simple entre trois options clairement différenciées.

---

### 2. Structure & Layout (iOS/macOS Style)

#### Navigation Bar

Identique à Difficulté :
- Back button (CaretLeft) → revient à `/quiz/difficulty`
- Titre "Nombre de questions"
- Close button (optionnel) → `/home`

```html
<nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20">
  <div class="px-6 py-4 flex items-center justify-between">
    <button @click="router.back()"
            class="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
      <PhosphorIcon weight="light" size="20">CaretLeft</PhosphorIcon>
    </button>
    <h1 class="text-lg font-semibold text-slate-900">Nombre de questions</h1>
    <button @click="router.push('/home')"
            class="flex items-center text-slate-400 hover:text-slate-600 transition-colors">
      <PhosphorIcon weight="light" size="20">X</PhosphorIcon>
    </button>
  </div>
</nav>
```

#### Body (Contenu scrollable)

**Container principal:**
- Classes: `px-6 py-8 space-y-6 pb-12`

**Layout :**
```
┌─────────────────────────────────┐
│  Combien de questions ?         │  ← Description
│  Peux pas modifier après        │
├─────────────────────────────────┤
│                                 │
│  [5 questions]                  │  ← 3 cartes grandes
│  Rapide ~2-3 min                │     (avec icônes)
│                                 │
│  [10 questions]                 │
│  Standard ~5-7 min              │
│                                 │
│  [20 questions]                 │
│  Complet ~10-15 min             │
│                                 │
└─────────────────────────────────┘
```

---

### 3. Composants Apple Design pour Count

#### Description (top)

```html
<div class="text-center space-y-1">
  <h2 class="text-2xl font-bold text-slate-900">Combien de questions ?</h2>
  <p class="text-sm text-slate-500">Peux pas modifier après avoir commencé</p>
</div>
```

#### Options de nombre (3 cartes)

**Container:**
- Classes: `space-y-4 mt-8`

**Carte nombre (répétée x3):**

```html
<button @click="startQuiz(count)"
        class="group w-full rounded-3xl bg-white p-6 border border-gray-100/50
               shadow-[0_4px_12px_rgba(0,0,0,0.05)]
               hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
               hover:bg-blue-50/30
               active:scale-95
               transition-all duration-200
               flex items-center justify-between gap-4">

  <!-- Left: Icon + Info -->
  <div class="flex items-center gap-4 flex-1">
    <!-- Count Icon Badge -->
    <div class="w-14 h-14 rounded-full flex items-center justify-center
                bg-blue-100/60 flex-shrink-0">
      <PhosphorIcon weight="regular" size="28" class="text-blue-700">
        {{ getCountIcon(count) }}
      </PhosphorIcon>
    </div>

    <!-- Text -->
    <div class="text-left flex flex-col gap-0.5">
      <h3 class="text-xl font-bold text-slate-900">
        {{ count }} questions
      </h3>
      <span class="text-sm text-slate-500">
        {{ getTimeEstimate(count) }} minutes
      </span>
    </div>
  </div>

  <!-- Right: Chevron -->
  <PhosphorIcon weight="light" size="20" class="text-slate-400 flex-shrink-0">
    CaretRight
  </PhosphorIcon>
</button>
```

**Spécifications complètes :**

1. **Container button:**
   - Classes: `group w-full rounded-3xl bg-white p-6 border border-gray-100/50`
   - Width: `w-full`
   - Rounding: `rounded-3xl` (~20px)
   - Padding: `p-6` (24px)
   - Border: `border border-gray-100/50` (hairline)
   - Shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.05)]` (subtle)
   - Hover: `hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]` + `hover:bg-blue-50/30`
   - Active: `active:scale-95`
   - Transition: `transition-all duration-200`
   - Flex: `flex items-center justify-between gap-4` (horizontal, space-between)

2. **Left section (icon + info):**
   - Container: `flex items-center gap-4 flex-1`

   a) **Count badge:**
      - Container: `w-14 h-14 rounded-full flex items-center justify-center bg-blue-100/60`
      - Size: 56px (14 * 4px)
      - Background: `bg-blue-100/60` (bleu très clair, translucide)
      - Rounding: `rounded-full`
      - Flex-shrink: `flex-shrink-0` (ne pas réduire)
      - Icône:
        - 5 questions: "Lightning" ⚡ (rapide)
        - 10 questions: "Books" 📚 (standard)
        - 20 questions: "Target" 🎯 (complet)
      - Icône color: `text-blue-700` (dark blue)

   b) **Text info:**
      - Container: `flex flex-col gap-0.5 text-left`
      - Count: `text-xl font-bold text-slate-900`
      - Time: `text-sm text-slate-500`
      - Exemples:
        - 5: "~2-3 minutes"
        - 10: "~5-7 minutes"
        - 20: "~10-15 minutes"

3. **Right section (chevron):**
   - Icône: Phosphor "CaretRight", weight='light', size=20
   - Color: `text-slate-400`
   - Flex-shrink: `flex-shrink-0`

---

### 4. Interactions & States (Count)

#### Tap sur carte nombre

```typescript
async function startQuiz(count: number) {
  try {
    await quizStore.createQuizSession(
      quizStore.selectedCategories,
      quizStore.selectedDifficulty,
      count
    )
    router.push('/quiz/active')
  } catch (err) {
    console.error('Error creating quiz session:', err)
    // Afficher alerte erreur
  }
}
```

**Feedback visuel:**
- `active:scale-95` (réduction)
- Transition `duration-200`
- Ombre augmente au hover

#### Transitions

- Entrance: Slide from right, fade in (duration-300)
- Exit: Slide to left, fade out

#### Loading State (optionnel)

Si `createQuizSession()` est lent :
- Afficher spinner dans la carte cliquée
- Désactiver tous les autres boutons
- Garder la nav bar visible

---

## Palette & Couleurs (Unified)

### Couleurs système Apple

| Utilisation | Variable | Valeur | Notes |
|-------------|----------|--------|-------|
| **Backgrounds** | `bg-white` | #FFFFFF | Pur blanc pour cartes |
| **Page bg** | `bg-slate-50` | #F8F8F8 | Gris très clair |
| **Text primary** | `text-slate-900` | #0F172A | Presque noir |
| **Text secondary** | `text-slate-500` | #64748B | Gris moyen |
| **Text tertiary** | `text-slate-400` | #94A3B8 | Gris clair |
| **Accent** | `text-blue-600` | #2563EB | Système blue |
| **Accent hover** | `text-blue-700` | #1D4ED8 | Bleu plus foncé |
| **Borders** | `border-gray-100/50` | Hairline subtile | Ultra fine |
| **Glass background** | `bg-white/80` | rgba(255,255,255,0.8) | Translucide + blur |

### Difficultés (spécifiques)

- **Facile:** Vert menthe (success color)
- **Moyen:** Amber/Jaune (warning color)
- **Difficile:** Rouge corail (error color)
- **Aléatoire:** Violet (accent color)

### Shadows (Apple style)

```css
/* Subtle (default) */
shadow-[0_4px_12px_rgba(0,0,0,0.05)]

/* Medium (hover) */
shadow-[0_8px_24px_rgba(0,0,0,0.08)]

/* Strong (pressed) - rare */
shadow-[0_12px_40px_rgba(0,0,0,0.10)]
```

---

## Contenu & Données

### Données dynamiques

| Item | Source | Type | Exemple |
|------|--------|------|---------|
| **Difficulté sélectionnée** | `quizStore.selectedDifficulty` | Difficulty | "facile", "moyen", "difficile", "random" |
| **Catégories sélectionnées** | `quizStore.selectedCategories` | string[] | ["TypeScript", "React"] |
| **Nombre de questions** | User input | 5 \| 10 \| 20 | 5, 10, or 20 |
| **État session création** | `quizStore.activeSession` | QuizSession \| null | Null jusqu'à création |

### Icônes Phosphor

| Localisation | Icône | Weight | Size |
|-------------|-------|--------|------|
| **Nav back** | CaretLeft | light | 20 |
| **Nav close** | X | light | 20 |
| **Facile badge** | Smiley | regular | 24 |
| **Moyen badge** | Lightning | regular | 24 |
| **Difficile badge** | Flame | regular | 24 |
| **Aléatoire badge** | Shuffle | regular | 24 |
| **5Q badge** | Lightning | regular | 28 |
| **10Q badge** | Books | regular | 28 |
| **20Q badge** | Target | regular | 28 |
| **Count chevron** | CaretRight | light | 20 |

---

## États & Interactions (Global)

### Loading State

**Condition:** `v-if="isLoadingSession"`

- Spinner centré
- Texte "Création du quiz..."
- Tous les boutons désactivés (disabled opacity)
- Navigation bar visible

### Error State

**Condition:** `v-if="error"`

- Alert sheet au bas (optionnel)
- Message erreur avec icon warning
- Bouton "Réessayer" + "Annuler"

### Empty/Fallback State

Si données manquantes (pas de catégories/difficulté) :
- Rediriger immédiatement à `/home`
- OU afficher alerte "Veuillez sélectionner une catégorie d'abord"

---

## Hiérarchie visuelle

### Difficulté
1. **Primaire:** Cartes difficulté (4)
2. **Secondaire:** Description top
3. **Tertiaire:** Nav bar, back button

### Count
1. **Primaire:** Cartes nombre (3)
2. **Secondaire:** Description top
3. **Tertiaire:** Nav bar

---

## Animations & Transitions (Unified)

```css
/* Page entry/exit */
duration-300 ease-out

/* Interactive feedback (hover/active) */
duration-200 ease-out

/* Micro-interactions */
duration-100 ease-out
```

**Spring effect (optionnel):**
```css
transition-all
cubic-bezier(0.16, 1, 0.3, 1)  /* Spring easing */
```

---

## Casssss d'usage & Flow

### Flow complet : Home → Difficulty → Count → Active

1. **Home:** Utilisateur sélectionne catégorie + clique bouton
2. **Difficulty:** Sélectionne difficulté (Facile/Moyen/Difficile/Aléatoire)
   - Store: `quizStore.selectDifficulty(difficulty)`
   - Route: `/quiz/count`
3. **Count:** Sélectionne nombre questions (5/10/20)
   - Store: `quizStore.createQuizSession(categories, difficulty, count)`
   - DB Save: Session stockée en IndexedDB
   - Route: `/quiz/active`
4. **Active:** Quiz lancé, questions affichées

### Edge cases

**Utilisateur clique back:**
- Difficulté → Home (perd sélection)
- Count → Difficulté (garde sélection)

**Utilisateur clique close:**
- N'importe quel écran → Home (abandon complet)

---

## Checklist de validation

### Difficulté

- [ ] Navigation bar glassmorphic (`bg-white/80 backdrop-blur-xl`)
- [ ] Back button avec CaretLeft icon
- [ ] Titre "Difficulté" centré
- [ ] 4 cartes difficulté fullwidth
- [ ] Badges circulaires avec icônes dynamiques
- [ ] Couleurs selon difficulté (vert, amber, red, violet)
- [ ] Descriptions courtes et claires
- [ ] Hover: ombre augmente + bg clair
- [ ] Active: scale-95 feedback
- [ ] Transitions smooth (duration-200)
- [ ] Pas de drop shadows dures
- [ ] Hairlines pour borders
- [ ] Espacement généreux (px-6, space-y-4)
- [ ] Text contrast bon (AA+)

### Count

- [ ] Navigation bar identique à Difficulté
- [ ] Back button → `/quiz/difficulty`
- [ ] Titre "Nombre de questions"
- [ ] 3 cartes nombre fullwidth
- [ ] Badges bleus avec icônes (Lightning, Books, Target)
- [ ] Time estimates lisibles (2-3 min, 5-7 min, 10-15 min)
- [ ] Chevrons CaretRight alignés à droite
- [ ] Hover/Active feedback identique
- [ ] Transitions fluides
- [ ] Loading state visible pendant `createQuizSession()`
- [ ] Error handling si création échoue
- [ ] Safe areas respectées
- [ ] Responsive sur iPad

### Unified

- [ ] Couleurs cohérentes entre les deux pages
- [ ] Typographie uniforme
- [ ] Spacing cohérent
- [ ] Interactions identiques (scale-95, shadow progression)
- [ ] Animations fluides (duration-200/300)
- [ ] Pas de glassmorphism sur cartes (seulement nav)
- [ ] Icons Phosphor light/regular weights corrects
- [ ] Transitions entre pages smooth

---

## Notes pour développeur

### Implémentation Vue

```vue
<!-- Difficulté.vue -->
<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Nav Bar -->
    <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20">
      <!-- ... -->
    </nav>

    <!-- Content -->
    <main class="px-6 py-8 space-y-6 pb-12">
      <!-- Description -->
      <div class="text-center space-y-1">
        <!-- ... -->
      </div>

      <!-- Difficulty Cards -->
      <div class="space-y-4 mt-8">
        <button v-for="diff in DIFFICULTIES"
                :key="diff"
                @click="selectDifficulty(diff)"
                class="group w-full rounded-3xl bg-white p-6 border border-gray-100/50
                       shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                       hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                       active:scale-95 transition-all duration-200
                       flex flex-col items-start gap-3">
          <!-- Card content -->
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useQuizStore } from '@/stores/useQuizStore'
import { useRouter } from 'vue-router'

const quizStore = useQuizStore()
const router = useRouter()

const DIFFICULTIES = ['facile', 'moyen', 'difficile', 'random']

function selectDifficulty(difficulty: Difficulty) {
  quizStore.selectDifficulty(difficulty)
  router.push('/quiz/count')
}
</script>
```

### Tailwind config (si custom shadows nécessaires)

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      boxShadow: {
        'apple-subtle': '0px 4px 12px rgba(0, 0, 0, 0.05)',
        'apple-medium': '0px 8px 24px rgba(0, 0, 0, 0.08)',
      },
      backgroundColor: {
        'difficulty-facile': '#D1FAE5',
        'difficulty-moyen': '#FEF3C7',
        'difficulty-difficile': '#FEE2E2',
        'difficulty-random': '#F3E8FF',
      }
    }
  }
}
```

### Performance

- Pas de lazy loading critique
- Aucune image (tout icônes vectorielles)
- Session création rapide (IndexedDB write)
- Si slow, montrer spinner + disable boutons

### Accessibility

- Buttons avec roles implicites
- Icons avec aria-label implicite (Phosphor)
- Text contrast: slate-900 sur blanc ✓
- Focus states: `focus:ring-2 ring-blue-500` (optionnel, subtil)

### Testing

- Vérifier routages (back, forward)
- Tester création session
- Tester error states
- Vérifier animations smooth
- Test responsive (mobile, tablet)

---

## Ressources & Références

- **Apple HIG:** https://developer.apple.com/design/human-interface-guidelines/
- **Phosphor Icons:** https://phosphoricons.com/
- **Glassmorphism:** https://www.uxdesigninstitute.com/blog/glassmorphism/
- **Tailwind CSS v4:** https://tailwindcss.com/
- **Vue 3:** https://vuejs.org/

---

**Version:** 1.0 | **Design System:** Apple HIG | **Aesthetic:** Premium Minimaliste Glassmorphism | **Statut:** Prêt pour implémentation
