# Spécification UI : Home (Accueil Quiz Master)

**Version:** 1.0
**Page:** `/home`
**Composant:** `src/views/quiz/Home.vue`
**Statut:** À implémenter

---

## 1. Objectif & Contexte

### Objectif principal
La page **Home** est le point d'entrée principal de l'application. Elle permet à l'utilisateur de **sélectionner une catégorie de questions** pour lancer un nouveau quiz ou d'accéder au **mode aléatoire** pour mélanger plusieurs catégories.

### Action primaire attendue
- **Clic sur une catégorie** → Initier le flux de quiz (catégorie sélectionnée stockée en store, navigation vers `/quiz/difficulty`)
- **Alternative :** Clic sur "Mode Aléatoire" → Navigation vers `/quiz/randomconfig` pour multi-sélection

### Actions secondaires
- **Bouton Import (footer)** → Navigation vers `/settings/import` si aucune données disponible
- **Recharger manuellement** → Bouton "↻ Recharger" si besoin de resynchroniser IndexedDB

### Contexte utilisateur
- Utilisateur revient à l'accueil après un quiz complété
- OU utilisateur ouvre l'app pour la première fois (peut être vide)
- OU utilisateur veut changer de catégorie/difficulté en milieu de parcours

---

## 2. Structure & Layout (Mobile First)

### Layout général
```
┌─────────────────────────────┐
│  AppHeader (sticky top)     │  ← Voir AppHeader spec
├─────────────────────────────┤
│                             │
│  [CONTENU PRINCIPAL]        │  ← Scrollable
│                             │
│  - Carte d'accueil          │
│  - Grille catégories (2col) │
│  - OU Alerte (vide)         │
│  - Bouton Mode Aléatoire    │
│                             │
│  [ESPACEMENT]               │
│                             │
│  - Footer Import Link       │
│                             │
└─────────────────────────────┘
```

### Dimensions & Spacing

**Conteneur principal:**
- `class="p-4 space-y-6 h-full flex flex-col"`
- **Padding:** `px-4 py-6` (standard pour contenu)
- **Hauteur:** `h-full` (remplit l'écran)
- **Flex layout:** Permet au footer d'être en bas avec `flex-1` spacer

**Structure des sections:**

```
1. Carte Accueil (Welcome Card)
   └─ p-4 space-y-2
   └─ rounded-md (12px)

2. Espace alerte OU grille catégories
   └─ max-w-lg mx-auto (centré sur grand écran)

3. Grille catégories
   └─ grid grid-cols-2 gap-3 (responsive)

4. Bouton Mode Aléatoire
   └─ w-full p-4 (fullwidth)

5. Spacer flexible
   └─ flex-1

6. Divider + Footer
   └─ border-t pt-8
```

### Comportement sur grand écran (Desktop)
- Conteneur centré avec `max-w-md mx-auto` (limite à largeur mobile, idéal pour PWA)
- OU optionnel : `max-w-2xl mx-auto` pour utiliser plus d'espace
- Grille catégories reste 2 colonnes (pas d'expansion à 3-4 colonnes)
- Tout le contenu scrollable verticalement

### Top App Bar (AppHeader)
- Fixé en haut (`sticky`)
- Contient : Logo CodeMaster + Settings icon + Stats icon (avec badge notification)
- Ne défile pas avec le contenu
- Voir spec détaillée `AppHeader` pour détails

### Body (Contenu scrollable)
- **Container principal :** `p-4 space-y-6 h-full flex flex-col`
- **Overflow :** `overflow-y-auto overflow-x-hidden` implicite du parent
- **Fond :** Hérite de AppLayout (blanc / surface)

### Navigation
- **Top App Bar :** Fournit accès Settings (gear icon) et Stats (chart icon)
- **Pas de Bottom App Bar** sur cette page
- **Pas de Floating Action Button** (FAB) sur Home
- **Footer implicit :** Lien "Gestion des données / Import" en bas

---

## 3. Composants Material Design 3 (Détail Critique)

### 3.1 Top App Bar (via AppHeader)

**Composant MD3:** `Top App Bar` (Small)

**Éléments:**
```
┌────────────────────────────────────┐
│ [Logo] CodeMaster │      [⚙️] [📊] │  ← Icons sur droite
└────────────────────────────────────┘
```

**Spécifications:**
- **Height:** 56px (standard petit Top App Bar)
- **Background:** `bg-surface` (blanc en light theme)
- **Border-bottom:** `border-b border-outline` (subtle divider)
- **Z-index:** `z-20` (reste au-dessus du contenu)
- **Position:** `sticky` (défile pas)

**Éléments enfants:**
1. **Logo/Title:**
   - **Container:** Flexbox avec `gap-2`, cliquable
   - **Logo Box:** `w-8 h-8 bg-primary rounded-lg flex items-center justify-center`
   - **Couleur logo:** `bg-indigo-600` (primary)
   - **Lettre:** `text-white font-bold text-lg`
   - **Title:** "CodeMaster", `font-bold text-lg tracking-tight`, `text-slate-900`
   - **Click handler:** Navigue vers `/home` (rafraîchit page)

2. **Icon buttons (droite):**
   - **Settings gear:**
     - `RouterLink to="/settings/categories"`
     - `p-2 rounded-full hover:bg-slate-100 transition`
     - Icon: Phosphor "Gear" (regular, size 24)
     - Title: "Gestion des catégories"

   - **Stats chart:**
     - Button with `@click="goToStats()"`
     - `p-2 rounded-full hover:bg-slate-100 transition`
     - Icon: Phosphor "ChartBar" ou `<i class="ph ph-chart-bar text-2xl text-slate-600"></i>`
     - **Badge notification (if new badges):**
       - Cercle rouge petit (`w-2.5 h-2.5 bg-red-500 rounded-full`)
       - Positionné `absolute top-1 right-1`
       - Border blanc `border-2 border-white`
     - Condition: Afficher badge si `showStatsBadge === true` (from statsStore)

---

### 3.2 Welcome Card (Section accueil)

**Composant MD3:** `Surface Container`

**Layout:**
```
┌─────────────────────────────────┐
│ 👋 Bonjour !                    │
│ Prêt pour un entraînement ?     │
│ Choisis une catégorie.          │
└─────────────────────────────────┘
```

**Spécifications:**
- **Container:** `rounded-md p-4 space-y-2`
- **Background:** `bg-surface` (blanc)
- **Border:** `border border-outline` (subtle, ~1px)
- **Shadow:** `shadow-level-1` (elevation très faible)
- **Rounding:** `rounded-md` (~12px, pas trop arrondi)

**Enfants:**

1. **Titre (h2):**
   - **Classe:** `text-headline-lg`
   - **MD3 Typographie:** `Headline Large` (32sp, weight 400-700 bold)
   - **Actual Tailwind:** `text-2xl font-bold text-slate-900`
   - **Contenu:** "Bonjour ! 👋"

2. **Sous-titre (p):**
   - **Classe:** `text-body-md text-on-surface-variant`
   - **MD3 Typographie:** `Body Medium` (14sp, weight 400)
   - **Actual Tailwind:** `text-sm text-slate-600`
   - **Contenu:** "Prêt pour un entraînement ? Choisis une catégorie."

---

### 3.3 Alert / Empty State (Conditionnel)

**Condition d'affichage:** `v-if="categoriesDisponibles.length === 0"`

**Composant MD3:** `Alert Container` (custom)

**Layout:**
```
┌─────────────────────────────────────┐
│ ⚠️  AUCUNE CATÉGORIE DISPONIBLE     │
│                                     │
│ Vous devez d'abord charger les      │
│ questions depuis les fichiers JSON. │
│ Allez dans "Gestion des données"    │
│ et cliquez sur les boutons "+" pour │
│ charger les catégories.             │
│                                     │
│ [↻ Recharger] [⬇ Aller à Import]   │
└─────────────────────────────────────┘
```

**Spécifications:**
- **Background:** `bg-error-container` (rouge très clair)
- **Border:** `border border-outline`
- **Rounding:** `rounded-md`
- **Padding:** `p-4`
- **Space between elements:** `space-y-4`

**Enfants:**

1. **Flex wrapper avec icône:**
   - `flex gap-4`

   a) **Icône warning:**
      - Phosphor Icon "Warning" (weight: regular)
      - `text-error text-2xl`
      - `flex-shrink-0 mt-1` (reste vertical)
      - Color: `text-error` (~#E53935)

   b) **Texte bloc:**
      - `<div>` container

      - **h3 (titre alerte):**
        - `text-title-lg font-semibold mb-1`
        - MD3: `Title Large` (22sp, semibold)
        - Tailwind: `text-lg font-semibold text-on-error-container`
        - Contenu: "Aucune catégorie disponible"

      - **p (description):**
        - `text-body-sm`
        - MD3: `Body Small` (12sp)
        - Tailwind: `text-xs text-on-error-container`
        - Contenu: "Vous devez d'abord charger les questions depuis les fichiers JSON. Allez dans "Gestion des données" et cliquez sur les boutons "+" pour charger les catégories."

2. **Boutons action (flex):**
   - Container: `flex gap-2`

   a) **Bouton "Recharger":**
      - Type: `Tonal Button` (MD3)
      - Tailwind: `flex-1 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg hover:bg-secondary-container/90 transition text-label-lg font-semibold active:scale-95`
      - Contenu: "↻ Recharger"
      - Click: `reloadQuestionsManual()` (force reload from IndexedDB)

   b) **Bouton "Aller à Import":**
      - Type: `Filled Button` (MD3 - primary action)
      - Tailwind: `flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 shadow-level-1 transition text-label-lg font-semibold active:scale-95`
      - Contenu: "⬇ Aller à Import"
      - Click: `goToImport()` → router.push('/settings/import')

---

### 3.4 Grille de Catégories

**Condition d'affichage:** `v-if="categoriesDisponibles.length > 0"`

**Composant MD3:** Grille de `Surface Container` (cartes)

**Layout:**
```
┌───────────────┬───────────────┐
│  [TypeScript] │    [React]    │
├───────────────┼───────────────┤
│  [Next.js]    │  [Node.js]    │
├───────────────┼───────────────┤
│   [CSS]       │ [JavaScript]  │
├───────────────┼───────────────┤
│ [Entretiens]  │               │
└───────────────┴───────────────┘
```

**Spécifications générales:**
- **Container:** `grid grid-cols-2 gap-3`
- **2 colonnes** (responsive, 50% chacune moins gap)
- **Gap:** `gap-3` (12px d'espacement)
- **Centering:** Conteneur parent centré `max-w-lg mx-auto` (optionnel)

**Carte catégorie (enfant):**

**Composant MD3:** `Surface Container` (cliquable)

```
┌──────────────────────┐
│   [⚪ ICON]          │
│    TypeScript        │
└──────────────────────┘
```

**Spécifications:**
- **Base:** Button element (pas de link, émet event)
- **Classe:** `p-4 bg-surface text-on-surface rounded-md border border-outline shadow-level-1 flex flex-col items-center gap-2 hover:shadow-level-2 transition active:scale-95`
- **Dimensions:** Square-ish, flexible height
- **Rounding:** `rounded-md` (~12px)
- **Background:** `bg-surface` (blanc)
- **Border:** `border border-outline` (subtle)
- **Shadow:** `shadow-level-1` → hover → `shadow-level-2` (elevation change)
- **Padding:** `p-4`
- **Flex:** `flex flex-col items-center gap-2` (vertical, icône centrée)
- **Interaction:**
  - Hover: `shadow-level-2` (élévation remonte)
  - Active/Click: `active:scale-95` (feedback haptique)
  - Click handler: `selectCategory(cat.label)` → store + route

**Enfants de la carte:**

1. **Badge d'icône (cercle coloré):**
   - **Container:** `w-10 h-10 rounded-full flex items-center justify-center`
   - **Couleur:** Dynamique selon `cat.color`
   - **Classes appliquées:**
     - `bg-primary-30` (ou secondary-30, tertiary-30, error-30, neutral-30 selon color)
     - Via fonction `getM3ColorClasses(cat.color)` → `{ containerBg: '...', text: '...' }`
   - **Icône intérieure:**
     - Phosphor Icon composant: `<PhosphorIcon :weight="'bold'" :size="24" :class="getM3ColorClasses(cat.color).text">`
     - Icône dynamique: `{{ cat.icon }}` (ex: 'Code', 'Rocket', 'Cpu', 'Palette', 'Database', 'Chat', etc.)
     - Couleur texte icône: `text-primary-100` (ou secondary-100, etc.)

2. **Label catégorie:**
   - **Classe:** `text-label-lg font-semibold text-center`
   - **MD3 Typographie:** `Label Large` (14sp, semibold)
   - **Tailwind:** `text-sm font-semibold text-slate-900`
   - **Contenu:** `{{ cat.label }}`
   - **Alignment:** Centré, peut aller sur 2 lignes max
   - **Overflow:** `text-ellipsis` ou clip si trop long

**Mapping des couleurs M3 (via `m3ColorMap`):**

```typescript
{
  blue: { containerBg: 'bg-primary-30', text: 'text-primary-100' },
  indigo: { containerBg: 'bg-primary-30', text: 'text-primary-100' },
  cyan: { containerBg: 'bg-secondary-30', text: 'text-secondary-100' },
  teal: { containerBg: 'bg-secondary-30', text: 'text-secondary-100' },
  green: { containerBg: 'bg-tertiary-30', text: 'text-tertiary-100' },
  emerald: { containerBg: 'bg-tertiary-30', text: 'text-tertiary-100' },
  lime: { containerBg: 'bg-tertiary-30', text: 'text-tertiary-100' },
  yellow: { containerBg: 'bg-error-30', text: 'text-error-100' },
  amber: { containerBg: 'bg-error-30', text: 'text-error-100' },
  orange: { containerBg: 'bg-error-30', text: 'text-error-100' },
  red: { containerBg: 'bg-error-30', text: 'text-error-100' },
  pink: { containerBg: 'bg-error-30', text: 'text-error-100' },
  purple: { containerBg: 'bg-neutral-30', text: 'text-neutral-100' },
  slate: { containerBg: 'bg-neutral-30', text: 'text-neutral-100' },
}
```

**Material Design 3 Colors utilisés:**
- `primary-30` / `primary-100` - Primary color palette
- `secondary-30` / `secondary-100` - Secondary color palette
- `tertiary-30` / `tertiary-100` - Tertiary (accent) color palette
- `error-30` / `error-100` - Error color palette
- `neutral-30` / `neutral-100` - Neutral color palette

Assurez-vous que ces couleurs sont définies dans `tailwind.config.js` et `style.css`.

---

### 3.5 Bouton Mode Aléatoire

**Condition d'affichage:** `v-if="categoriesDisponibles.length > 0"`

**Composant MD3:** `Filled Button` (ou `Tonal Button` si moins prioritaire)

**Layout:**
```
┌───────────────────────────────────────┐
│  [🔀]  Mode Aléatoire                 │ →
│        Mélange les catégories         │
└───────────────────────────────────────┘
```

**Spécifications:**
- **Type:** `Filled Button` (action secondaire principale)
- **Width:** `w-full` (fullwidth)
- **Padding:** `p-4`
- **Rounding:** `rounded-lg` (~16px, un peu plus arrondi que cards)
- **Background:** `bg-primary` (indigo, action color)
- **Text color:** `text-on-primary` (blanc)
- **Shadow:** `shadow-level-2`
- **Hover:** `hover:shadow-level-3` (elevation remonte)
- **Active:** `active:scale-95` (feedback)
- **Classes full:** `w-full p-4 bg-primary text-on-primary rounded-lg shadow-level-2 flex items-center justify-between hover:shadow-level-3 active:scale-95 transition`

**Contenu / Layout:**
- **Flex wrapper:** `flex items-center justify-between`
- **Côté gauche (contenu):** `flex items-center gap-4`

  1. **Badge icône:**
     - `w-10 h-10 rounded-full bg-on-primary/20 flex items-center justify-center`
     - Icône: Phosphor "Shuffle" (weight regular, size 20)
     - `text-label-lg` (visible mais pas trop grand)

  2. **Texte bloc:**
     - `text-left`
     - **Ligne 1 (titre):** `text-label-lg font-semibold` → "Mode Aléatoire"
     - **Ligne 2 (sous-titre):** `text-body-sm text-on-primary/80` → "Mélange les catégories"

- **Côté droit (chevron):**
  - Phosphor Icon "CaretRight" (weight regular, size 20)
  - Color: `text-label-lg`
  - Implicite: montre que c'est cliquable

**Click handler:**
- `@click="openRandomConfig()"`
- Appelle `quizStore.openRandomConfig(categoryLabels)`
- Route vers `/quiz/randomconfig`

---

### 3.6 Footer Import Link

**Composant MD3:** `Text Button` (action tertiaire / lien)

**Layout:**
```
─────────────────────────────────────────
 ⬇ Gestion des données / Import
```

**Spécifications:**
- **Container wrapper:**
  - `pt-8 border-t border-outline`
  - Divider en haut (`border-t`)
  - Padding top pour séparation `pt-8`

- **Button (Text Button):**
  - **Type:** `Text Button`
  - **Classes:** `text-label-md text-on-surface-variant flex items-center gap-2 hover:text-primary transition`
  - **Text color:** `text-on-surface-variant` (gris clair, non-primaire)
  - **Hover:** `hover:text-primary` (devient primaire au survol)
  - **Transition:** `transition` (animation lisse)
  - **Flex:** `flex items-center gap-2` (icône + texte)

**Contenu:**
- **Icône:** Phosphor "DownloadSimple" (ou "Download", weight regular)
- **Texte:** "Gestion des données / Import"

**Click handler:**
- `@click="goToImport()"`
- Route vers `/settings/import`

---

## 4. Palette & Couleurs Sémantiques

### Couleurs MD3 à utiliser

| Zone | Variable | Usage |
|------|----------|-------|
| **Welcome Card** | `bg-surface` | Fond blanc |
| Welcome Card titre | `text-on-surface` | Texte dark (noir/gris foncé) |
| Welcome Card description | `text-on-surface-variant` | Texte gris moyen |
| **Alert Container** | `bg-error-container` | Fond rouge très clair |
| Alert titre | `text-on-error-container` | Texte rouge foncé |
| Alert description | `text-on-error-container` | Texte rouge moyen |
| Alert icône | `text-error` | Rouge vif |
| **Grille catégories** | `bg-surface` | Fond carte blanc |
| Grille carte border | `border-outline` | Border gris clair |
| Grille carte shadow | `shadow-level-1` | Elevation très faible |
| Grille carte hover | `shadow-level-2` | Elevation moyenne |
| **Icônes badges** | Dynamique (primary/secondary/tertiary/error/neutral) | Selon couleur catégorie |
| **Mode Aléatoire** | `bg-primary` | Indigo foncé (#4F46E5 ou variable) |
| Mode Aléatoire texte | `text-on-primary` | Blanc |
| Mode Aléatoire shadow | `shadow-level-2` | Elevation |
| Mode Aléatoire hover | `shadow-level-3` | Elevation renforcée |
| **Footer link** | `text-on-surface-variant` | Gris clair (secondaire) |
| Footer link hover | `text-primary` | Devient primaire |

### Palette complète MD3 à définir dans Tailwind

**Variables Tailwind CSS à ajouter dans `tailwind.config.js`:**

```javascript
colors: {
  // Primary (Indigo)
  primary: '#4F46E5',
  'on-primary': '#FFFFFF',
  'primary-container': '#EEE5FF',
  'on-primary-container': '#3A0099',
  'primary-30': '#E8DEFD',
  'primary-100': '#2D1A99',

  // Secondary (Muted Indigo/Teal)
  secondary: '#625B71',
  'on-secondary': '#FFFFFF',
  'secondary-container': '#E8DEF8',
  'on-secondary-container': '#1E192B',
  'secondary-30': '#E8E0F5',
  'secondary-100': '#1A1428',

  // Tertiary (Rose/Accent)
  tertiary: '#7D5260',
  'on-tertiary': '#FFFFFF',
  'tertiary-container': '#FFD8E4',
  'on-tertiary-container': '#31111D',
  'tertiary-30': '#F5D8EA',
  'tertiary-100': '#35182B',

  // Error (Red)
  error: '#E53935',
  'on-error': '#FFFFFF',
  'error-container': '#F9DEDC',
  'on-error-container': '#410E0B',
  'error-30': '#F8CFCC',
  'error-100': '#6B0808',

  // Neutral (Gray)
  neutral: '#1C1B1F',
  'on-surface': '#1C1B1F',
  'on-surface-variant': '#49454F',
  'surface': '#FFFBFE',
  'surface-variant': '#F5EFF7',
  'outline': '#D0C9D8',
  'neutral-30': '#E6E1E8',
  'neutral-100': '#16141B',

  // Surface containers (elevations)
  'surface-container-low': '#F8F5FA',
  'surface-container': '#F3EFF6',
  'surface-container-high': '#ECE7F0',
  'surface-container-highest': '#E7E1E8',

  // For icons (inherited from text colors usually)
  slate: { ... },
  indigo: { ... },
  // ... other Tailwind defaults
}
```

### Shadows / Elevations (Tailwind)

```javascript
shadows: {
  'level-1': '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
  'level-2': '0px 3px 6px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.12)',
  'level-3': '0px 5px 10px rgba(0, 0, 0, 0.15), 0px 3px 6px rgba(0, 0, 0, 0.12)',
  'level-4': '0px 7px 14px rgba(0, 0, 0, 0.15), 0px 4px 8px rgba(0, 0, 0, 0.12)',
  'level-5': '0px 10px 20px rgba(0, 0, 0, 0.15), 0px 5px 10px rgba(0, 0, 0, 0.12)',
}
```

---

## 5. Contenu & Données

### Données dynamiques

| Item | Source | Type | Exemple |
|------|--------|------|---------|
| **Catégories disponibles** | `useDataStore().questions` (filtrées) | Array<Category> | [{ id: 'cat_typescript', label: 'TypeScript', icon: 'Code', color: 'blue' }, ...] |
| **Catégorie label** | `category.label` | string | "TypeScript", "React", "Next.js" |
| **Catégorie icône** | `category.icon` | string (Phosphor name) | "Code", "Rocket", "Cpu", "Palette", "Database", "Chat" |
| **Catégorie couleur** | `category.color` | TailwindColor | "blue", "cyan", "green", "purple", "yellow", "indigo", "slate" |
| **État vide** | `categoriesDisponibles.length === 0` | boolean | true/false |
| **États chargement** | `dataStore.isLoading` | boolean | true/false (affiche spinner) |
| **Erreur** | `dataStore.error` | string\|null | "Erreur lors du chargement..." |

### Icônes Phosphor utilisés

| Localisation | Icône | Nom Phosphor | Props |
|-------------|-------|------------|-------|
| **Welcome card** | (emoji) | N/A | "👋" emoji text |
| **Alert warning** | Avertissement | `Warning` | weight="regular", size="24", color="text-error" |
| **Catégorie badge** | Dynamique | `{{ cat.icon }}` | weight="bold", size="24", color="dynamique" |
| **Mode Aléatoire badge** | Shuffle | `Shuffle` | weight="regular", size="20" |
| **Mode Aléatoire chevron** | Caret Right | `CaretRight` | weight="regular", size="20" |
| **Footer icon** | Download | `DownloadSimple` ou `Download` | weight="regular", size="16" |
| **AppHeader Settings** | Gear | `Gear` | weight="bold", size="24" |
| **AppHeader Stats** | Chart Bar | `ChartBar` | weight="regular", size="24" |

**Source des icônes:** Phosphor Icons (https://phosphoricons.com/)
- Utiliser via composant `<PhosphorIcon>` custom Vue
- OU via classe CSS: `<i class="ph ph-{name} ph-{weight}"></i>`

### Contenu texte statique

| Zone | Texte | Notes |
|------|-------|-------|
| **Welcome Card h2** | "Bonjour ! 👋" | Amical, accent emoji |
| **Welcome Card p** | "Prêt pour un entraînement ? Choisis une catégorie." | Clair et court |
| **Alert h3** | "Aucune catégorie disponible" | Explicite |
| **Alert p** | "Vous devez d'abord charger les questions depuis les fichiers JSON. Allez dans "Gestion des données" et cliquez sur les boutons "+" pour charger les catégories." | Instructif, guide utilisateur |
| **Alert btn 1** | "↻ Recharger" | Symbole + texte court |
| **Alert btn 2** | "⬇ Aller à Import" | Symbole + texte court |
| **Mode Aléatoire titre** | "Mode Aléatoire" | Court, cliquable |
| **Mode Aléatoire sous-titre** | "Mélange les catégories" | Description action |
| **Footer link** | "⬇ Gestion des données / Import" | Accès rapide |

---

## 6. États & Interactions

### 6.1 États principaux de la page

#### **État Normal (données présentes)**
- Affiche Welcome Card
- Affiche grille catégories (2 colonnes)
- Affiche bouton Mode Aléatoire
- Affiche footer import link
- **Pas d'alerte**

#### **État Vide (aucune catégorie)**
- Affiche Welcome Card
- **Masque** grille catégories (`v-if="categoriesDisponibles.length === 0"`)
- **Affiche** Alert "Aucune catégorie disponible"
- **Masque** bouton Mode Aléatoire
- Affiche footer import link + bouton Recharger dans alerte

#### **État Chargement (isLoading = true)**
- AppHeader normal
- **Centre** LoadingSpinner au milieu du body
- Texte optionnel: "Chargement des données..."
- Masque tout autre contenu

#### **État Erreur**
- Affiche erreur message (optionnel: dans alerte)
- Peut afficher données partielles ou rien
- Offre bouton "Réessayer" ou "Recharger"

### 6.2 Interactions & Comportements

#### **Clic sur catégorie**
- **Trigger:** Click sur card catégorie
- **Feedback immédiat:** `active:scale-95` (feedback tactile scale down)
- **Action:**
  ```typescript
  function selectCategory(category: string) {
    quizStore.selectCategory(category)
    router.push('/quiz/difficulty')
  }
  ```
- **Animation:** Navigation slide (définie dans App.vue transitions)
- **Destination:** `/quiz/difficulty` (page sélection difficulté)

#### **Clic sur Mode Aléatoire**
- **Trigger:** Click sur bouton mode aléatoire
- **Feedback:** `active:scale-95` + `shadow-level-3` hover
- **Action:**
  ```typescript
  function openRandomConfig() {
    quizStore.openRandomConfig(categoryLabels)
    router.push('/quiz/randomconfig')
  }
  ```
- **Destination:** `/quiz/randomconfig` (multi-sélection catégories)

#### **Clic sur Settings (gear icon)**
- **Trigger:** Click AppHeader gear icon
- **Link:** `RouterLink to="/settings/categories"`
- **Destination:** `/settings/categories` (gestion catégories)

#### **Clic sur Stats (chart icon)**
- **Trigger:** Click AppHeader chart icon
- **Action:** `goToStats()` → `router.push('/stats')`
- **Side-effect:** Appelle `statsStore.loadStats()` pour actualiser
- **Badge:** Affiche petit badge rouge si `badgesNonLus = true`
- **Destination:** `/stats` (dashboard statistiques)

#### **Clic Logo CodeMaster**
- **Trigger:** Click sur logo/title
- **Action:** `goHome()` → `router.push('/home')`
- **Effect:** Rafraîchit la page (reload)

#### **Clic Recharger (dans alerte)**
- **Trigger:** Click bouton "↻ Recharger"
- **Action:** `reloadQuestionsManual()` → `dataStore.reloadQuestions()`
- **Effect:** Recharge questions depuis IndexedDB
- **Side-effect:** Si questions trouvées, cache l'alerte et affiche grille

#### **Clic Aller à Import (dans alerte)**
- **Trigger:** Click bouton "⬇ Aller à Import"
- **Action:** `goToImport()` → `router.push('/settings/import')`
- **Destination:** `/settings/import` (import données)

#### **Clic Footer Import Link**
- **Trigger:** Click lien footer
- **Action:** `goToImport()` → `router.push('/settings/import')`
- **Destination:** `/settings/import`

### 6.3 États hover & active

#### **Cartes catégories**
- **Default:** `bg-surface border-outline shadow-level-1`
- **Hover:** `shadow-level-2` (élévation remonte) + fond légèrement plus clair (optionnel)
- **Active:** `scale-95` (feedback scale down)
- **Transition:** `transition` smooth (150ms default)

#### **Bouton Mode Aléatoire**
- **Default:** `bg-primary shadow-level-2`
- **Hover:** `shadow-level-3` (élévation remonte davantage)
- **Active:** `scale-95`
- **Transition:** `transition` smooth

#### **Boutons alerte**
- **Recharger (Tonal):**
  - Default: `bg-secondary-container text-on-secondary-container`
  - Hover: `bg-secondary-container/90`
  - Active: `scale-95`

- **Aller à Import (Filled):**
  - Default: `bg-primary text-on-primary shadow-level-1`
  - Hover: `bg-primary/90 shadow-level-2`
  - Active: `scale-95`

#### **AppHeader icons**
- **Default:** `text-slate-600`
- **Hover:** `bg-slate-100` (fond arrondi tight)
- **Transition:** `transition` smooth
- **Rounding:** `rounded-full` (circular hit area)

#### **Footer link**
- **Default:** `text-on-surface-variant`
- **Hover:** `text-primary` (devient bleu indigo)
- **Transition:** `transition` smooth

### 6.4 États de chargement (Loading)

#### **Spinner page**
- **Composant:** `LoadingSpinner` (SVG spinner indigo)
- **Placement:** Centré verticalement/horizontalement dans body
- **Animation:** Rotation continue (CSS keyframe)
- **Visibilité:** `v-if="dataStore.isLoading"`
- **Masque:** Tout le contenu dessous (sauf header)

#### **Chargement initial (onMounted)**
- `dataStore.initData()` appelé au mount
- Si vide → affiche alerte
- Si données → affiche grille

#### **Recharge manuelle**
- Appelée quand utilisateur clique "Recharger"
- `dataStore.reloadQuestions()`
- Actualise list in-place (pas de flicker si données existantes)

### 6.5 Animations de transition

#### **Page transition (slide)**
- Définie dans `App.vue`
- Classe: `transition.slide-enter-active`, `transition.slide-leave-active`
- Propriétés: `opacity` et `translateX(30px)` / `translateX(-30px)`
- Durée: `0.3s ease`
- Effect: Nouvelle page slide in du côté droit, ancienne slide out vers gauche

#### **Card focus (optionnel)**
- Sur catégorie sélectionnée: laisser scale-95 en place
- Feedback tactile clear

---

## 7. Cas d'usage & Scénarios

### Scénario 1: Utilisateur revient après quiz

1. **Démarrage:** App monte → `App.vue` appelle `dataStore.initData()` + `quizStore.checkResumableSession()`
2. **Si modal de reprise** → propose reprendre quiz antérieur
3. **Après fermeture modal:** Navigue vers `/home`
4. **Page Home chargée:** Grille catégories affichée
5. **Utilisateur choisit catégorie** → flow difficulté/count/active

### Scénario 2: Utilisateur lance app pour la 1ère fois

1. **Démarrage:** App monte
2. **IndexedDB initData():** Charge questions (vides)
3. **Home page:** Affiche alerte "Aucune catégorie"
4. **Utilisateur clique "Aller à Import"** → `/settings/import`
5. **Import page:** Choisit catégorie
6. **Questions chargées:** Revient à Home
7. **Grille affichée:** Peut lancer quiz

### Scénario 3: Mode aléatoire multi-catégories

1. **Home affichée:** Grille catégories
2. **Utilisateur clique "Mode Aléatoire"** → `/quiz/randomconfig`
3. **RandomConfig page:** Multi-select catégories avec checkboxes
4. **Utilisateur valide sélection** → navigate `/quiz/difficulty`
5. **Difficulty page:** Sélectionne difficulté
6. **Count page:** Choisit nombre questions
7. **Active page:** Quiz lancé avec catégories mélangées

### Scénario 4: Utilisateur accède settings catégories

1. **Home affichée**
2. **Utilisateur clique gear icon (AppHeader)** → `/settings/categories`
3. **Categories page:** Gère création/édition/suppression catégories
4. **Retour à Home:** Questions recalculées, grille mise à jour

---

## 8. Résumé des Tailwind Classes clés

```css
/* Welcome Card */
.welcome-card {
  @apply rounded-md p-4 space-y-2 bg-surface border border-outline shadow-level-1
}

/* Grille catégories */
.categories-grid {
  @apply grid grid-cols-2 gap-3 max-w-lg mx-auto
}

/* Carte catégorie */
.category-card {
  @apply p-4 bg-surface text-on-surface rounded-md border border-outline shadow-level-1 flex flex-col items-center gap-2 hover:shadow-level-2 transition active:scale-95
}

/* Badge icône */
.icon-badge {
  @apply w-10 h-10 rounded-full flex items-center justify-center
}

/* Bouton Mode Aléatoire */
.random-button {
  @apply w-full p-4 bg-primary text-on-primary rounded-lg shadow-level-2 flex items-center justify-between hover:shadow-level-3 active:scale-95 transition
}

/* AppHeader */
.app-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-outline bg-surface z-20 sticky top-0
}

/* Alert container */
.alert-container {
  @apply space-y-4 bg-error-container rounded-md p-4 border border-outline
}

/* Footer link */
.footer-link {
  @apply text-label-md text-on-surface-variant flex items-center gap-2 hover:text-primary transition
}
```

---

## 9. Checklist de validation

- [ ] AppHeader sticky en haut avec logo + settings + stats icons
- [ ] Welcome Card affichée avec emoji + titre + description
- [ ] Grille catégories 2-col avec badges icônes colorés (M3)
- [ ] Bouton Mode Aléatoire fullwidth avec icône shuffle
- [ ] Alert state affichée si aucune catégorie (avec recharger + import)
- [ ] Footer link "Gestion des données" visible en bas
- [ ] Spinner LoadingSpinner visible si `isLoading = true`
- [ ] Tous les clics routent correctement (selectCategory, openRandomConfig, goToImport, etc.)
- [ ] Transitions slide entre pages fluides
- [ ] Hover effects (shadow level change) visibles sur cartes
- [ ] Active scale-95 feedback sur clics
- [ ] Couleurs M3 correctement appliquées (primary, error, surface, etc.)
- [ ] Rounding cohérent (cards: md=12px, buttons: lg=16px, badges: full=9999px)
- [ ] Padding/spacing cohérent (p-4, gap-3, space-y-6)
- [ ] Typographie MD3 correcte (Headline Large, Label Large, Body Medium, etc.)

---

## 10. Notes pour développeur

1. **Material Design 3 Integration:**
   - Assurez-vous que `tailwind.config.js` contient toutes les couleurs sémantiques M3
   - Validez que les elevations (shadow-level-1/2/3/4/5) sont définies
   - Utilisez les variables de couleurs, **jamais** de codes hex hardcoded

2. **Phosphor Icons:**
   - Composant custom `PhosphorIcon` doit être disponible globalement
   - Props: `:weight="'bold'|'regular'|..."`, `:size="24|20|..."`
   - Assurez-vous que le CDN Phosphor est chargé dans `index.html`

3. **Réactivité & State:**
   - `categoriesDisponibles` computed doit filtrer les catégories ayant des questions
   - `dataStore.isLoading` contrôle l'affichage du spinner
   - `dataStore.questions` source de vérité pour les catégories disponibles

4. **Accessibilité (bonus):**
   - Cartes catégories: button role, cliquable au clavier
   - AppHeader icons: title attributes pour descriptions
   - Alt text implicite sur icônes Phosphor (Phosphor handle l'aria-label)

5. **Performance:**
   - Pas de lazy loading critique sur cette page
   - IndexedDB queries assez rapides pour affichage instantané
   - Images: aucune, tout vectoriel (icons)

6. **Testing (optionnel):**
   - Tester les routages (router.push works)
   - Tester les états (empty, loading, normal)
   - Tester les interactions (clicks → router)
   - Tester la réactivité des computed (categories filter)

---

**Version:** 1.0 | **Auteur:** UI/UX Spec | **Date:** 2024 | **Statut:** En cours d'implémentation
