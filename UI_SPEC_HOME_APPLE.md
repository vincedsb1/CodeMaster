# Spécification UI : Home (Apple Design System)

**Version:** 1.0
**Page:** `/home`
**Composant:** `src/views/quiz/Home.vue`
**Design System:** Apple Human Interface Guidelines (iOS/macOS)
**Aesthetic:** Premium, Minimaliste, Glassmorphism, Translucidité
**Statut:** À implémenter

---

## 1. Objectif & Contexte

### Objectif principal
La page **Home** est le point d'entrée principal de l'application. Elle permet à l'utilisateur de **sélectionner une catégorie de questions** pour lancer un nouveau quiz ou d'accéder au **mode aléatoire** pour mélanger plusieurs catégories.

L'interface respire l'élégance minimaliste : grands espaces blancs, transitions fluides, glassmorphic elements pour la navigation, et une hiérarchie claire du contenu.

### Action primaire attendue
- **Tap sur une catégorie** → Initier le flux de quiz (catégorie stockée en store, navigation vers `/quiz/difficulty`)
- **Alternative :** Tap sur "Mode Aléatoire" → Navigation vers `/quiz/randomconfig`

### Actions secondaires
- **Tap Settings (gear icon en haut)** → Navigation vers `/settings/categories`
- **Tap Stats (chart icon en haut)** → Navigation vers `/stats` avec badge de notification
- **Tap Import link (footer)** → Navigation vers `/settings/import`

### Contexte utilisateur
- Utilisateur revient à l'accueil après un quiz complété
- OU utilisateur ouvre l'app pour la première fois (peut être vide de données)
- OU utilisateur veut changer de catégorie/difficulté en milieu de parcours

### Feeling attendu
**Premium, calme, invitant.** Comme l'écran d'accueil d'une app Apple native : minimaliste, fluide, avec des transitions subtiles et une profondeur créée par la translucidité plutôt que par des ombres dures.

---

## 2. Structure & Layout (iOS/macOS Style)

### Vue générale

```
┌──────────────────────────────────┐
│  [Large Title: CodeMaster]   ⚙️  │  ← Navigation Bar (glassmorphic)
│                              📊  │
├──────────────────────────────────┤
│                                  │
│  [Content scrollable]            │
│  - Carte accueil                 │
│  - Grille catégories (2-col)     │
│  - OU Alerte (vide)              │
│  - Bouton Mode Aléatoire         │
│                                  │
│  [Espacement blanc]              │
│                                  │
│  ⬇ Gestion des données / Import  │
│                                  │
└──────────────────────────────────┘
```

### Navigation Bar (Large Title)

**Concept iOS :** Un "Large Title" qui réduit au scroll, avec une barre translucide en dessous.

**Spécifications :**
- **Composition :**
  - **Large Title** : "CodeMaster" aligné à gauche, grand et bold au repos
  - **Réduit au scroll** : Titre rétréci, icônes de droite (Settings + Stats) restent visibles

- **États :**

  **Au repos (scrollTop ≈ 0):**
  ```
  ┌─────────────────────────────────┐
  │ CodeMaster                  ⚙️ 📊│
  │                                 │
  │ [Hairline separator]            │
  └─────────────────────────────────┘
  ```
  - Height: ~100-120px (large)
  - Title: `text-4xl font-bold` (32-36sp)
  - Padding: `px-6 pt-6 pb-4`
  - Background: `bg-white/95 backdrop-blur-md border-b border-white/20`

  **Scrollé vers le bas:**
  ```
  ┌─────────────────────────────────┐
  │ CodeMaster                  ⚙️ 📊│
  │ [Hairline separator]            │
  └─────────────────────────────────┘
  ```
  - Height: ~60px (reduced)
  - Title: `text-xl font-bold` (18-20sp)
  - Padding: `px-6 py-3`
  - Background: Same glassmorphic

- **Positionnement :** `sticky top-0 z-40` (flotte au-dessus du contenu)

- **Contenu :**

  1. **Logo + Title (gauche):**
     - Container: Flex, gap=2, items center
     - Logo box: `w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center`
     - Logo letter: `text-white font-bold text-lg` → "C"
     - Title: "CodeMaster", transitions de taille au scroll
     - Click: Navigue `/home` (refresh implicite)

  2. **Icon buttons (droite):**
     - Flex, gap=1, items center

     a) **Settings gear:**
        - Element: `button` ou `RouterLink`
        - Size: `w-10 h-10`
        - Styling: `rounded-full p-2.5 hover:bg-gray-100/50 active:scale-90 transition-all duration-200`
        - Icon: Phosphor "Gear", weight='light', size=20, color=`text-slate-600`
        - Click: Router → `/settings/categories`

     b) **Stats chart:**
        - Element: `button`
        - Size: `w-10 h-10` (same as settings)
        - Styling: `rounded-full p-2.5 hover:bg-gray-100/50 active:scale-90 relative transition-all duration-200`
        - Icon: Phosphor "ChartBar", weight='light', size=20, color=`text-slate-600`
        - Badge notification:
          - Condition: `v-if="showStatsBadge"`
          - Element: Cercle rouge très petit
          - Classes: `absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full`
          - Effect: Pulse optionnel (animation) pour attirer attention
        - Click: `@click="goToStats()"` → Router `/stats`, call `statsStore.loadStats()`

### Body (Contenu scrollable)

**Container principal:**
- Classes: `px-6 py-6 space-y-6 pb-12`
- **Padding horizontal:** `px-6` (marge généreuse, respects "Safe Areas")
- **Padding vertical:** `py-6` entre éléments, `pb-12` à la fin (pour footer)
- **Spacing :** `space-y-6` (24px entre sections)
- **Overflow:** `overflow-y-auto` implicite du parent
- **Background:** `bg-slate-50` (très gris clair, minimaliste) ou `bg-white` pur

### Layout général pour grand écran

**Sur iPad/Desktop :**
- Container limité en largeur: `max-w-2xl mx-auto`
- Marges externes: `px-6` maintenu
- Grille peut passer à 3 colonnes (optionnel): `grid grid-cols-2 sm:grid-cols-3`
- Resto du layout identique

### Tab Bar (optionnel)

Pour cette page, **pas de Tab Bar visible** si on utilise une seule colonne mobile. Si architecture globale de l'app inclut Tab Bar (Home, Stats, Settings), ce dernier serait :
- `fixed bottom-0 h-20 bg-white/80 backdrop-blur-xl border-t border-white/20 rounded-t-3xl`
- Glassmorphic avec icons (+badge sur Stats)

**Pour cette implémentation initiale, on utilise AppHeader sticky + navigation inline.**

---

## 3. Composants Apple Design (Détail Critique)

### 3.1 Navigation Bar (Large Title avec Glassmorphism)

**Composant Apple :** `Navigation Bar` avec `Large Title`

**Principe :** La barre a une background translucide (glass) et les éléments passant en dessous du scroll sont floutés.

```html
<nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20">
  <!-- Large Title Section -->
  <div class="px-6 pt-6 pb-4 transition-all duration-300"
       :class="{ 'pt-3 pb-2': isScrolled }">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <!-- Logo -->
        <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-lg">C</span>
        </div>
        <!-- Title -->
        <h1 class="font-bold transition-all duration-300"
            :class="{ 'text-4xl': !isScrolled, 'text-xl': isScrolled }">
          CodeMaster
        </h1>
      </div>

      <!-- Right Icons -->
      <div class="flex items-center gap-1">
        <!-- Settings -->
        <RouterLink to="/settings/categories"
                    class="w-10 h-10 rounded-full p-2.5 hover:bg-gray-100/50 active:scale-90 transition-all duration-200">
          <PhosphorIcon weight="light" size="20" class="text-slate-600">Gear</PhosphorIcon>
        </RouterLink>

        <!-- Stats with badge -->
        <button @click="goToStats"
                class="w-10 h-10 rounded-full p-2.5 hover:bg-gray-100/50 active:scale-90 relative transition-all duration-200">
          <PhosphorIcon weight="light" size="20" class="text-slate-600">ChartBar</PhosphorIcon>
          <span v-if="showStatsBadge"
                class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      </div>
    </div>
  </div>
</nav>
```

**Spécifications CSS:**
- **Background glass:** `bg-white/80 backdrop-blur-xl`
- **Separator:** `border-b border-white/20` (hairline très fine)
- **Position:** `sticky top-0 z-40`
- **Transition:** `duration-300 ease-out` pour réductions titres/padding

---

### 3.2 Welcome Card (Grouped Background)

**Composant Apple :** `Grouped List` ou `Card` isolée

**Layout:**
```
┌─────────────────────────────────┐
│  👋 Bonjour !                   │
│                                 │
│  Prêt pour un entraînement ?    │
│  Choisis une catégorie.         │
└─────────────────────────────────┘
```

**Spécifications:**
- **Container:**
  - Classes: `rounded-3xl bg-white p-6 space-y-3`
  - Background: `bg-white` (pur blanc sur fond gris clair)
  - Rounding: `rounded-3xl` (~20px, très arrondi à l'Apple)
  - Padding: `p-6` (24px)
  - Border: Aucune (ombre diffuse à la place)
  - Shadow: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]` (très douce et diffuse)

**Enfants:**

1. **Titre (h2):**
   - Classes: `text-3xl font-bold text-slate-900 flex items-center gap-2`
   - Typographie: `text-3xl` (~28sp), `font-bold` (weight 700)
   - Contenu: "👋 Bonjour !" (emoji inline)

2. **Description (p):**
   - Classes: `text-base text-slate-500 leading-relaxed`
   - Typographie: `text-base` (16sp), `text-slate-500` (secondary label color)
   - Contenu: "Prêt pour un entraînement ? Choisis une catégorie."
   - `leading-relaxed` pour meilleure lisibilité

---

### 3.3 Alerte / Empty State (Conditionnel)

**Condition:** `v-if="categoriesDisponibles.length === 0"`

**Composant Apple :** Alert / Error state

**Layout:**
```
┌─────────────────────────────────────┐
│  ⚠️  AUCUNE CATÉGORIE DISPONIBLE   │
│                                     │
│  Vous devez d'abord charger les     │
│  questions depuis les fichiers JSON.│
│                                     │
│  [↻ Recharger]  [⬇ Aller Import]   │
└─────────────────────────────────────┘
```

**Spécifications:**
- **Container:**
  - Classes: `rounded-3xl bg-red-50/50 p-6 space-y-4 border border-red-200/50`
  - Background: `bg-red-50/50` (très clair, presque blanc avec teinte rouge)
  - Rounding: `rounded-3xl` (~20px)
  - Padding: `p-6`
  - Border: `border border-red-200/50` (hairline subtile, pas d'ombre)
  - Shadow: Optionnel, très léger si présent

**Enfants:**

1. **Bloc contenu (flex):**
   - Classes: `flex gap-4`

   a) **Icône warning:**
      - Phosphor "Warning", weight='regular', size=24
      - Classes: `flex-shrink-0 text-red-600`
      - Kept same height as title

   b) **Texte bloc:**
      - **Titre:**
        - Classes: `text-lg font-semibold text-red-900`
        - Contenu: "Aucune catégorie disponible"

      - **Description:**
        - Classes: `text-sm text-red-700 leading-relaxed`
        - Contenu: "Vous devez d'abord charger les questions depuis les fichiers JSON. Allez dans "Gestion des données" et cliquez sur les boutons "+" pour charger les catégories."

2. **Boutons action (flex):**
   - Container: `flex gap-3`

   a) **Bouton "Recharger" (Secondary Button):**
      - Type: Secondary Button (Apple style)
      - Classes: `flex-1 px-4 py-3 rounded-full bg-gray-100/70 text-slate-600 font-semibold hover:bg-gray-200/70 active:scale-95 transition-all duration-200`
      - Contenu: "↻ Recharger"
      - Click: `@click="reloadQuestionsManual()"`

   b) **Bouton "Aller à Import" (Primary Button):**
      - Type: Primary Button (Apple style - système blue)
      - Classes: `flex-1 px-4 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-[0_4px_12px_rgba(0,122,255,0.3)]`
      - Contenu: "⬇ Aller à Import"
      - Click: `@click="goToImport()"`

---

### 3.4 Grille de Catégories (Grouped Background)

**Condition:** `v-if="categoriesDisponibles.length > 0"`

**Composant Apple :** Grouped List / Card Grid

**Layout général:**
```
┌───────────────┬───────────────┐
│  TypeScript   │    React      │
└───────────────┴───────────────┘
┌───────────────┬───────────────┐
│  Next.js      │  Node.js      │
└───────────────┴───────────────┘
```

**Container grille:**
- Classes: `grid grid-cols-2 gap-4`
- **Gap:** `gap-4` (16px d'espacement, généreux comme Apple)
- **Colonnes:** 2 sur mobile, optionnel 3+ sur desktop

**Carte catégorie (enfant):**

**Composant Apple :** `Grouped Card` / Interactive element

```html
<button @click="selectCategory(cat.label)"
        class="group rounded-3xl bg-white p-6 flex flex-col items-center gap-3
               hover:bg-gray-50/50 active:scale-95
               border border-gray-100/50
               shadow-[0_4px_12px_rgba(0,0,0,0.05)]
               transition-all duration-200">

  <!-- Icon Badge -->
  <div class="w-14 h-14 rounded-full flex items-center justify-center
              transition-all duration-200"
       :style="{ backgroundColor: getM3ColorClasses(cat.color).containerBg }">
    <PhosphorIcon weight="regular"
                   size="28"
                   :class="getM3ColorClasses(cat.color).text">
      {{ cat.icon }}
    </PhosphorIcon>
  </div>

  <!-- Label -->
  <span class="text-center text-lg font-semibold text-slate-900">
    {{ cat.label }}
  </span>
</button>
```

**Spécifications:**
- **Base (button):**
  - Classes: `rounded-3xl bg-white p-6 flex flex-col items-center gap-3`
  - Rounding: `rounded-3xl` (~20px, Apple style)
  - Background: `bg-white` pur
  - Padding: `p-6` (24px, généreux)
  - Flex: `flex flex-col items-center gap-3` (vertical, centré)

- **Border & Shadow:**
  - Border: `border border-gray-100/50` (hairline très fine, presque invisible)
  - Shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.05)]` (très douce, diffuse)
  - NO drop shadow dur (différence clé vs Material)

- **Interactions:**
  - Hover: `hover:bg-gray-50/50` (teinte très légère)
  - Active: `active:scale-95` (feedback scale down, rapide et doux)
  - Transition: `transition-all duration-200`

**Enfants:**

1. **Badge d'icône (circle):**
   - Container: `w-14 h-14 rounded-full flex items-center justify-center`
   - Dimensions: 56px (14 * 4px Tailwind)
   - Rounding: `rounded-full` (cercle pur)
   - Background: Dynamique selon couleur catégorie
   - Color mapping (exemple):
     ```javascript
     {
       blue: 'bg-blue-100/80',
       indigo: 'bg-indigo-100/80',
       cyan: 'bg-cyan-100/80',
       green: 'bg-green-100/80',
       // ... etc
     }
     ```

   - Icône intérieure:
     - Phosphor Icon: weight='regular', size=28
     - Couleur: Adapté au background (darker variant)
     - Exemples: 'Code', 'Rocket', 'Cpu', 'Palette', 'Database', 'Chat'

2. **Label catégorie:**
   - Classes: `text-center text-lg font-semibold text-slate-900 line-clamp-2`
   - Typographie: `text-lg` (18sp), `font-semibold` (600)
   - Alignment: Centré
   - Clamp: `line-clamp-2` (max 2 lignes avant ellipsis)

---

### 3.5 Bouton Mode Aléatoire (Primary Action)

**Composant Apple :** Large Primary Button

**Layout:**
```
┌────────────────────────────────────┐
│  🔀  Mode Aléatoire               │  →
│      Mélange les catégories        │
└────────────────────────────────────┘
```

**Spécifications:**
- **Type:** Primary Button (système blue avec gradient optionnel)
- **Container:**
  - Classes: `w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between gap-4`
  - Width: `w-full` (fullwidth)
  - Rounding: `rounded-full` (pilule classique Apple)
  - Background: `bg-blue-600` uni OU `bg-gradient-to-r from-blue-600 to-blue-700` (gradient subtil)
  - Padding: `p-4` (vertical 16px, horizontal 16px)
  - Flex: `flex items-center justify-between` (icône gauche, chevron droite)
  - Shadow: `shadow-[0_6px_20px_rgba(37,99,235,0.3)]` (ombre diffuse bleue)

- **Interactions:**
  - Hover: `hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)]` (ombre plus prononcée)
  - Active: `active:scale-95` (feedback scale)
  - Transition: `transition-all duration-200`

**Contenu:**

1. **Côté gauche (flex):**
   - Classes: `flex items-center gap-3`

   a) **Icon badge:**
      - Container: `w-12 h-12 rounded-full bg-white/20 flex items-center justify-center`
      - Background: `bg-white/20` (glassmorphic blanc translucide)
      - Rounding: `rounded-full`
      - Icône: Phosphor "Shuffle", weight='regular', size=24, color=white

   b) **Texte bloc:**
      - Container: `text-left`
      - **Titre:** `text-lg font-bold text-white` → "Mode Aléatoire"
      - **Sous-titre:** `text-sm font-medium text-white/75` → "Mélange les catégories"

2. **Côté droit (chevron):**
   - Icon: Phosphor "CaretRight", weight='regular', size=20, color=white
   - Opacité: `text-white/80`

**Click handler:**
```javascript
@click="openRandomConfig()"
// quizStore.openRandomConfig(categoryLabels)
// router.push('/quiz/randomconfig')
```

---

### 3.6 Footer (Import Link - Tertiaire Button)

**Composant Apple :** Link Button / Tertiaire action

**Layout:**
```
─────────────────────────────────
 ⬇ Gestion des données / Import
```

**Spécifications:**
- **Container wrapper:**
  - Classes: `pt-12 border-t border-gray-200/50 text-center`
  - Border-top: `border-t border-gray-200/50` (hairline très subtile)
  - Padding-top: `pt-12` (espacement large)
  - Text-center: Centré horizontalement

- **Button (Link):**
  - Type: Link Button (texte simple, accent color)
  - Classes: `inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 active:scale-90 transition-all duration-200 font-medium`
  - Text color: `text-blue-600` (système blue, accent)
  - Hover: `hover:text-blue-700` (plus foncé légèrement)
  - Active: `active:scale-90` (scale down feedback, pas d'ombre)
  - Transition: `transition-all duration-200`

**Contenu:**
- Icône: Phosphor "DownloadSimple" ou "Download", weight='regular', size=18
- Texte: "Gestion des données / Import"
- Flex: `inline-flex items-center gap-2` (inline, icône + texte côte à côte)

**Click handler:**
```javascript
@click="goToImport()"
// router.push('/settings/import')
```

---

## 4. Palette & Couleurs Sémantiques (Apple System Colors)

### Couleurs principales

| Utilisation | Variable Tailwind | Hex | Explication |
|-------------|-------------------|-----|-------------|
| **Backgrounds principaux** | `bg-slate-50` ou `bg-white` | `#F8F8F8` ou `#FFFFFF` | Neutral, minimaliste, breathing room |
| **Cartes/Containers** | `bg-white` | `#FFFFFF` | Fond pur blanc sur gris clair |
| **Texte primaire** | `text-slate-900` | `#0F172A` | Presque noir, très lisible |
| **Texte secondaire** | `text-slate-500` | `#64748B` | Gris moyen pour descriptions |
| **Texte tertiaire** | `text-slate-400` | `#94A3B8` | Gris clair pour hints |
| **Accent Color** | `text-blue-600` / `bg-blue-600` | `#2563EB` | Système blue (action primaire) |
| **Accent Hover** | `text-blue-700` / `bg-blue-700` | `#1D4ED8` | Bleu plus foncé au hover |
| **Success** | `text-green-600` | `#16A34A` | Vert menthe pour validations |
| **Warning** | `text-red-600` | `#DC2626` | Rouge corail pour alertes |
| **Borders/Separators** | `border-gray-200/50` | `rgba(229,229,234,0.5)` | Hairline très fine, translucide |
| **Backgrounds glassmorphic** | `bg-white/80` | `rgba(255,255,255,0.8)` | Glass avec blur |
| **Error background** | `bg-red-50/50` | `rgba(254,242,242,0.5)` | Alert state, très clair |

### Patterns appliqués

**Fond glassmorphic (Navigation):**
```css
bg-white/80 backdrop-blur-xl border-b border-white/20
```

**Ombre douce et diffuse:**
```css
shadow-[0_4px_12px_rgba(0,0,0,0.05)]
shadow-[0_8px_30px_rgb(0,0,0,0.04)]
shadow-[0_6px_20px_rgba(37,99,235,0.3)]
```

**Hairline border:**
```css
border border-gray-100/50
border-b border-white/20
```

**Transitions fluides:**
```css
transition-all duration-200
transition-all duration-300
```

---

## 5. Contenu & Données

### Données dynamiques

| Item | Source | Type | Exemple |
|------|--------|------|---------|
| **Catégories disponibles** | `useDataStore().questions` | Array<Category> | [{ id: 'cat_typescript', label: 'TypeScript', ... }] |
| **Label catégorie** | `category.label` | string | "TypeScript", "React", "Next.js" |
| **Icône catégorie** | `category.icon` | string | "Code", "Rocket", "Cpu", "Palette" |
| **Couleur catégorie** | `category.color` | string | "blue", "green", "purple", etc. |
| **État vide** | `categoriesDisponibles.length === 0` | boolean | true/false |
| **État chargement** | `dataStore.isLoading` | boolean | true/false |
| **Erreur** | `dataStore.error` | string\|null | Message d'erreur |
| **Badge stats** | `statsStore.badgesNonLus` | boolean | true = affiche badge rouge |

### Icônes Phosphor (Style Apple = Light/Regular)

| Localisation | Icône | Weight | Size | Color | Notes |
|-------------|-------|--------|------|-------|-------|
| **Welcome emoji** | 👋 | N/A | N/A | N/A | Emoji texte, pas icône |
| **Catégorie badge** | Dynamique | regular | 28 | Selon couleur | Code, Rocket, Cpu, Palette, Database, Chat |
| **Mode Aléatoire icône** | Shuffle | regular | 24 | white | À l'intérieur badge translucide |
| **Mode Aléatoire chevron** | CaretRight | regular | 20 | white | Côté droit pour indiquer navigation |
| **AppHeader Settings** | Gear | light | 20 | slate-600 | Subtil, light weight |
| **AppHeader Stats** | ChartBar | light | 20 | slate-600 | Subtil, light weight |
| **Alert Warning** | Warning | regular | 24 | red-600 | Standard, visible |
| **Footer Download** | DownloadSimple | regular | 18 | blue-600 | Accent color |
| **Recharge button** | RotateCcw ou RotateCw | regular | 18 | slate-600 | Dans texte du bouton |

---

## 6. États & Interactions (Physique Apple)

### 6.1 États principaux

#### **État Normal (données présentes)**
- Welcome Card affichée
- Grille catégories (2 colonnes) affichée
- Mode Aléatoire bouton affichée
- Footer link affichée
- Navigation Bar sticky avec Large Title

#### **État Vide (aucune catégorie)**
- Welcome Card affichée
- Alert block au lieu de grille
- Mode Aléatoire masqué
- Footer link visible
- Bouton "Recharger" dans alerte

#### **État Chargement**
- LoadingSpinner centré
- Tout autre contenu masqué
- Navigation Bar toujours visible

### 6.2 Interactions & Feedback (Apple Physics)

#### **Tap sur catégorie**
- **Visual Feedback:** `active:scale-95` (réduction légère, instantanée)
- **Timing:** transition `duration-200` (très rapide, ressort)
- **Feedback haptique:** Optionnel, API Web Vibration
- **Navigation:** Route vers `/quiz/difficulty` avec transition slide

```css
.category-card {
  @apply rounded-3xl bg-white p-6 flex flex-col items-center gap-3
         hover:bg-gray-50/50 active:scale-95
         border border-gray-100/50
         shadow-[0_4px_12px_rgba(0,0,0,0.05)]
         transition-all duration-200;
}
```

#### **Tap sur Mode Aléatoire**
- **Visual Feedback:** `active:scale-95` + ombre augmente
- **Timing:** transition `duration-200`
- **Navigation:** Route vers `/quiz/randomconfig`

```css
.random-button {
  @apply w-full rounded-full bg-blue-600 p-4 flex items-center justify-between gap-4
         text-white font-semibold
         hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)]
         active:scale-95
         shadow-[0_6px_20px_rgba(37,99,235,0.3)]
         transition-all duration-200;
}
```

#### **Tap sur AppHeader icons**
- **Settings/Stats:**
  - Visual: `active:scale-90` (plus de réduction que cartes)
  - Hover: `hover:bg-gray-100/50` (fond très subtil)
  - Navigation instantanée

```css
.header-icon-button {
  @apply w-10 h-10 rounded-full p-2.5
         hover:bg-gray-100/50 active:scale-90
         transition-all duration-200;
}
```

#### **Tap sur Alerte boutons**
- **Recharger (Secondary):** `active:scale-95`
- **Import (Primary):** `active:scale-95` + ombre change
- Feedback rapide, pas lag

#### **Tap sur Footer link**
- **Visual:** `active:scale-90` (scale down subtil)
- **Hover:** `hover:text-blue-700` (teinte plus foncée)
- **Navigation:** Route `/settings/import`

### 6.3 Translucidité & Blur (Glassmorphism)

#### **Navigation Bar:**
```css
.nav-bar {
  @apply sticky top-0 z-40
         bg-white/80 backdrop-blur-xl
         border-b border-white/20;
}
```
- `bg-white/80` → 80% opacité blanc
- `backdrop-blur-xl` → Flou très intense (12px)
- Contenu sous la nav est flou ✓

#### **Conteneurs volants (optionnel):**
Si modales/sheets :
```css
.glass-modal {
  @apply bg-white/90 backdrop-blur-lg
         border border-white/20
         rounded-3xl;
}
```

### 6.4 Animations & Transitions (Fluide)

**Durées standard Apple:**
- Micro-interactions (hover → background): `duration-200` (200ms)
- Transitions de page (navigation): `duration-300` (300ms)
- Animations de scroll (Large Title réduction): `duration-300` (300ms)

**Easing:** Tous utiliser `ease-out` implicite de Tailwind (ou `cubic-bezier(0.16, 1, 0.3, 1)` pour ressort)

---

## 7. States de Contenu

### Empty State

**Condition:** `v-if="categoriesDisponibles.length === 0"`

- Affiche alerte complète avec instructions claires
- Boutons d'action visibles (Recharger, Import)
- Texte bienveillant et clair

### Loading State

**Condition:** `v-if="dataStore.isLoading"`

- Spinner centrée (LoadingSpinner Phosphor icon ou SVG)
- Optionnel: texte "Chargement..." sous spinner
- Navigation Bar toujours visible

### Error State

**Condition:** `v-if="dataStore.error"`

- Peut afficher au-dessus du contenu ou dans une alerte
- Texte d'erreur avec suggestions
- Bouton "Réessayer"

---

## 8. Hiérarchie & Priorité visuelle

1. **Primaire:** Grille catégories (si données) OU Alerte (si vide)
2. **Secondaire:** Mode Aléatoire bouton
3. **Tertiaire:** Footer link (import)
4. **Utilitaire:** Settings/Stats icons en top

**Via taille, couleur, shadow depth, spacing.**

---

## 9. Cas d'usage & Scénarios

### Scénario 1: First-time user
1. App démarre
2. IndexedDB vide → `categoriesDisponibles.length === 0`
3. Alert affichée : "Aucune catégorie disponible"
4. Utilisateur clique "Aller à Import"
5. Route `/settings/import`, charge données
6. Revient Home → grille catégories affichée

### Scénario 2: Utilisateur régulier
1. App démarre
2. IndexedDB chargée → catégories affichées
3. Grille visible, utilisateur sélectionne catégorie
4. Route `/quiz/difficulty`, flow continue
5. Quiz lancé

### Scénario 3: Scroll & Large Title
1. Page chargée, utilisateur voit Large Title "CodeMaster"
2. Scroll down → title réduit progressivement
3. Navigation Bar reste sticky, icons visibles
4. Scroll up → title revient à taille normale
5. Smooth animation `duration-300`

---

## 10. Checklist de validation

- [ ] Navigation Bar sticky avec Large Title (réduit au scroll)
- [ ] Glassmorphic background (`bg-white/80 backdrop-blur-xl`)
- [ ] Logo gradient (blue-600 → blue-700)
- [ ] Settings + Stats icons avec light weight Phosphor
- [ ] Badge de notification rouge sur Stats (pulsing optionnel)
- [ ] Welcome Card avec ombre douce `shadow-[0_8px_30px...]`
- [ ] Alert state avec hairline border `border-red-200/50`
- [ ] Grille catégories 2-col avec `gap-4` généreux
- [ ] Cartes catégories `rounded-3xl` avec shadow douce
- [ ] Icon badges circulaires, couleurs dynamiques
- [ ] Mode Aléatoire bouton bleu avec gradient et ombre bleue
- [ ] Shuffle icon blanc dans badge translucide
- [ ] Footer link centré, accent color blue
- [ ] Transitions `duration-200` pour micro-interactions
- [ ] Active states `scale-95` pour tous les boutons
- [ ] Pas d'ombres dures (drop shadows) → ombres diffuses uniquement
- [ ] Hairlines `border-gray-200/50` pour séparations
- [ ] Padding généreux (`px-6`, `p-6`, espacement `space-y-6`)
- [ ] Safe areas respectées (no overlap sur notch/Dynamic Island)
- [ ] Responsive sur iPad (`max-w-2xl mx-auto` optionnel)

---

## 11. Notes pour développeur

### Intégration Tailwind CSS v4

**Assurer que Tailwind config inclut:**

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      boxShadow: {
        'smooth-xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'smooth-sm': '0 4px 12px rgba(0,0,0,0.05)',
        'smooth-md': '0 8px 30px rgb(0,0,0,0.04)',
        'smooth-lg': '0 12px 40px rgba(0,0,0,0.08)',
        'blue-glow': '0 6px 20px rgba(37,99,235,0.3)',
      },
      backdropBlur: {
        'xl': '12px',
        'xl': '16px',
      },
    }
  }
}
```

### Phosphor Icons usage

```html
<!-- Light weight for subtle icons -->
<PhosphorIcon weight="light" size="20" class="text-slate-600">
  Gear
</PhosphorIcon>

<!-- Regular weight for prominent -->
<PhosphorIcon weight="regular" size="24" class="text-slate-600">
  ChartBar
</PhosphorIcon>
```

### Scroll detection (Large Title)

```javascript
// Optionnel: détecter scroll pour réduire title
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
```

### Performance tips
- Utiliser `v-if` pour Empty/Loading states (pas de display:none)
- Icônes SVG Phosphor optimisées (inline)
- Pas de heavy animations sur mobile (keep smooth)
- Ombres custom via `shadow-[...]` Tailwind (pas de class CSS épaisses)

### Accessibilité (bonus)
- Buttons avec role implicite `<button>`
- Icons avec `aria-label` implicite (Phosphor handle)
- Text contrast: noir sur blanc ✓
- Focus states: `focus:ring-2 ring-blue-500` (optionnel, très subtil)

### Testing
- Vérifier transitions au scroll (duration-300)
- Tester taps/clicks → scale-95 feedback
- Vérifier navigation routes correctes
- Test responsive (mobile vs iPad/Desktop)

---

## 12. Ressources & Références

- **Apple HIG:** https://developer.apple.com/design/human-interface-guidelines/
- **Phosphor Icons:** https://phosphoricons.com/ (utiliser light/regular weights)
- **Glassmorphism:** https://www.uxdesigninstitute.com/blog/glassmorphism/
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **Vue 3 Composition API:** https://vuejs.org/guide/introduction.html

---

**Version:** 1.0 | **Design System:** Apple HIG | **Aesthetic:** Premium Minimaliste Glassmorphism | **Statut:** Prêt pour implémentation
