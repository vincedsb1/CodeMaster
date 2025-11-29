# Spécification UI : Select Category (Sélection de Catégorie pour Import)

**Route:** `/settings/select-category`
**Composant:** `src/views/settings/SelectCategory.vue`

---

## 1. Objectif & Contexte

### Quel est le but principal de cette page ?

La page **Select Category** permet à l'utilisateur de **choisir ou créer une catégorie** pour importer des questions JSON. C'est une page transitoire dans le flux d'import:

```
Import JSON File → SelectCategory → Import Questions → Home
```

L'utilisateur arrive ici après avoir sélectionné un fichier JSON sur `/settings/import`. Le JSON est stocké temporairement en `sessionStorage` et sera importé dans la catégorie sélectionnée.

### Quelle est l'action principale attendue ?

**Action Primaire:** Sélectionner une catégorie existante OU créer une nouvelle catégorie, puis valider pour importer les questions.

**Workflow:**
1. Utilisateur arrive avec JSON en sessionStorage
2. Voit liste des catégories existantes (sélectable)
3. OU crée une nouvelle catégorie via formulaire (label + icon + color)
4. Sélectionne une catégorie (existante ou nouvelle)
5. Clique "Importer" pour déclencher l'import
6. Page affiche loading state + success message
7. Retour auto à Home après 2s

**Contraintes:**
- Le bouton "Importer" est **désactivé** si aucune catégorie sélectionnée
- Le formulaire de création est **désactivé** si label vide
- Pendant l'import, les boutons sont **désactivés**

---

## 2. Structure & Layout (iOS/macOS Style)

### 2.1 Navigation Bar (Large Title Style)

**Position:** Sticky en haut

```
┌─────────────────────────────────────┐
│ Sélectionner une catégorie          │
│ Choisissez la catégorie...          │
└─────────────────────────────────────┘
```

**Implémentation:**
```html
<div class="space-y-2 pt-6 px-6">
  <h1 class="text-3xl font-bold text-slate-900">Sélectionner une catégorie</h1>
  <p class="text-base text-slate-600 leading-relaxed font-medium">
    Choisissez la catégorie pour les questions importées
  </p>
</div>
```

**Caractéristiques:**
- Titre: `text-3xl font-bold text-slate-900` (Large Title concept)
- Subtitle: `text-base text-slate-600` (Descriptif)
- Padding: `pt-6 px-6` (Marges généreuses)
- NOT sticky (scrolls with content, typical Apple form behavior)

### 2.2 Corps Principal (Scrollable Content)

**Layout Vertical (single column):**

```
┌─────────────────────────────────────┐
│  [Header Title/Subtitle]            │
├─────────────────────────────────────┤
│                                     │
│  [Section 1: Catégories Existantes] │ ← Scrollable
│  ┌─────────────────────────────────┐ │
│  │ [Cat 1] (radio/select state)    │ │
│  │ [Cat 2] (radio/select state)    │ │
│  │ ...                             │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Divider Line]                     │
│                                     │
│  [Section 2: Créer Nouvelle Catég.] │
│  ┌─────────────────────────────────┐ │
│  │ Label Input                     │ │
│  │ [Icon Picker - 6 columns]       │ │
│  │ [Color Picker - 7 columns]      │ │
│  │ [Créer et sélectionner Button]  │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Action Buttons - Fixed Bottom]    │ ← Fixed
│  ├─ [Annuler] [Importer] ─┤        │
│                                     │
└─────────────────────────────────────┘
```

**Dimensions:**
- Max-width: `max-w-2xl` (896px)
- Padding horizontal: `px-6` (24px)
- Spacing vertical: `space-y-6` (aération)
- Padding bottom: `pb-20` (pour boutons fixe)

### 2.3 Safe Areas

- **Top:** Header scrolls with content
- **Bottom:** Action buttons fixed at bottom with glassmorphic background
- Content scrolls underneath

---

## 3. Composants Apple Design (Détail Critique)

### 3.1 Catégories Existantes (Selection List)

**Container:**

```html
<div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6 space-y-4">

  <!-- Section Title -->
  <h3 class="text-lg font-semibold text-slate-900">Catégories existantes</h3>

  <!-- Category Items List -->
  <div class="space-y-2">
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="selectedCategory = cat.label"
      type="button"
      :class="[
        'w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-200',
        'flex items-center gap-3 active:scale-95',
        selectedCategory === cat.label
          ? 'border-blue-400 bg-blue-50 shadow-[0_4px_12px_rgba(59,130,246,0.1)]'
          : 'border-gray-100/50 bg-white/50 hover:border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
      ]"
    >
      <!-- Category Icon -->
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-white/60 flex items-center justify-center border border-gray-100/50">
        <i :class="['ph', `ph-${cat.icon.toLowerCase()}`, 'text-slate-700']"></i>
      </div>

      <!-- Category Label -->
      <span class="font-semibold text-slate-900 flex-1">{{ cat.label }}</span>

      <!-- Selection Indicator -->
      <div v-if="selectedCategory === cat.label" class="flex-shrink-0">
        <i class="ph ph-check text-blue-600 text-lg"></i>
      </div>
    </button>
  </div>
</div>
```

**Category Item States:**

**Non-Sélectionné (Default):**
- Border: `border-gray-100/50` (très subtil)
- Background: `bg-white/50` (translucent)
- Shadow: `shadow-[0_2px_8px_rgba(0,0,0,0.04)]` (very soft)
- Hover: `border-gray-200` (becomes slightly more visible)
- Cursor: pointer

**Sélectionné (Selected):**
- Border: `border-blue-400` (System blue)
- Background: `bg-blue-50` (blue tint)
- Shadow: `shadow-[0_4px_12px_rgba(59,130,246,0.1)]` (blue-tinted)
- Icon: Check (`ph-check text-blue-600`)
- Active: `scale-95` (press feedback)

### 3.2 Formulaire Créer Nouvelle Catégorie

**Container:**

```html
<div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6 space-y-4">

  <!-- Section Title -->
  <h3 class="text-lg font-semibold text-slate-900">Créer une nouvelle catégorie</h3>

  <!-- Label Input -->
  <div class="space-y-2">
    <label class="text-sm font-semibold text-slate-600 uppercase tracking-wide">Nom</label>
    <input
      v-model="newCategory.label"
      type="text"
      placeholder="Ex: Python, Data Science..."
      class="w-full px-4 py-3 rounded-2xl border border-gray-200/50 bg-white/80
             placeholder:text-slate-400
             focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20
             transition-all duration-200"
    />
  </div>

  <!-- Icon Picker -->
  <div class="space-y-3">
    <label class="text-sm font-semibold text-slate-600 uppercase tracking-wide">Icône</label>
    <div class="grid grid-cols-6 gap-2">
      <button
        v-for="icon in availableIcons"
        :key="icon"
        type="button"
        @click="newCategory.icon = icon"
        :class="[
          'aspect-square rounded-2xl border-2 flex items-center justify-center transition-all duration-200 active:scale-95',
          newCategory.icon === icon
            ? 'border-blue-400 bg-blue-50 shadow-[0_4px_12px_rgba(59,130,246,0.1)]'
            : 'border-gray-100/50 bg-white/50 hover:border-gray-200'
        ]"
        :title="icon"
      >
        <i :class="['ph', `ph-${icon.toLowerCase()}`, 'text-slate-700 text-lg']"></i>
      </button>
    </div>
  </div>

  <!-- Color Picker -->
  <div class="space-y-3">
    <label class="text-sm font-semibold text-slate-600 uppercase tracking-wide">Couleur</label>
    <div class="grid grid-cols-7 gap-2">
      <button
        v-for="color in availableColors"
        :key="color"
        type="button"
        @click="newCategory.color = color"
        :class="[
          'aspect-square rounded-2xl border-2 transition-all duration-200 active:scale-95',
          newCategory.color === color
            ? 'border-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.2)]'
            : 'border-gray-200 opacity-80 hover:opacity-100',
          colorMap[color]
        ]"
        :title="color"
      ></button>
    </div>
  </div>

  <!-- Create & Select Button -->
  <button
    type="button"
    @click="createAndSelect"
    :disabled="!newCategory.label.trim()"
    class="w-full rounded-full px-6 py-3.5 font-semibold text-white
           bg-blue-600 hover:bg-blue-700 active:scale-95
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-all duration-200
           shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
  >
    <i class="ph ph-plus mr-2"></i>
    Créer et sélectionner
  </button>
</div>
```

**Input Text Styling:**
- Shape: `rounded-2xl` (20px)
- Border: `border-gray-200/50` (hairline)
- Background: `bg-white/80` (translucent)
- Focus: `border-blue-400 ring-2 ring-blue-500/20` (blue glow)
- Padding: `px-4 py-3` (generous)

**Icon Picker Grid:**
- Layout: `grid-cols-6` (6 icons per row)
- Item: `aspect-square` (perfect squares)
- Shape: `rounded-2xl`
- Selection: Blue border + blue tint + shadow
- Hover: Slightly more visible border

**Color Picker Grid:**
- Layout: `grid-cols-7` (7 colors per row)
- Item: `aspect-square` (perfect squares)
- Shape: `rounded-2xl`
- Colors: 14 total (slate, red, orange, amber, yellow, lime, green, emerald, teal, cyan, blue, indigo, purple, pink)
- Selection: Dark border (slate-900) + shadow
- Non-selected: Reduced opacity (80%)

**Create Button:**
- Shape: `rounded-full` (pilule)
- Color: Blue-600 (System Blue)
- Disabled: 50% opacity
- Active: `scale-95`
- Icon: Plus (`ph-plus`)

### 3.3 Divider

Simple hairline separator:

```html
<div class="border-t border-gray-200/50"></div>
```

### 3.4 Action Buttons (Fixed Bottom)

**Container (Fixed):**

```html
<div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20 px-6 py-4">
  <div class="max-w-2xl mx-auto flex gap-3">

    <!-- Cancel Button (Secondary) -->
    <button
      @click="handleCancel"
      :disabled="isImporting"
      class="flex-1 rounded-full px-6 py-3.5 font-semibold text-slate-700
             bg-slate-100/60 border border-slate-200/50
             hover:bg-slate-100 active:scale-95
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-200"
    >
      <i class="ph ph-x mr-2"></i>
      Annuler
    </button>

    <!-- Import Button (Primary) -->
    <button
      @click="handleSelect"
      :disabled="!selectedCategory || isImporting"
      class="flex-1 rounded-full px-6 py-3.5 font-semibold text-white
             bg-blue-600 hover:bg-blue-700 active:scale-95
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-200
             shadow-[0_4px_12px_rgba(37,99,235,0.3)]
             flex items-center justify-center gap-2"
    >
      <span v-if="isImporting" class="animate-spin">⏳</span>
      <i v-else class="ph ph-download"></i>
      <span>{{ isImporting ? 'Import en cours...' : 'Importer' }}</span>
    </button>
  </div>
</div>

<!-- Spacer (prevent content overlap) -->
<div class="h-24"></div>
```

**Button Styles:**

**Cancel (Secondary):**
- Background: `bg-slate-100/60`
- Border: `border-slate-200/50`
- Text: `text-slate-700`
- Hover: `bg-slate-100`

**Import (Primary):**
- Background: `bg-blue-600`
- Hover: `bg-blue-700`
- Text: `text-white`
- Shadow: Blue glow
- Icon: Download (`ph-download`) or spinner

### 3.5 Success Message (Toast - Optional)

Appears after successful import:

```html
<div v-if="importSuccess"
     class="fixed bottom-8 right-6 bg-green-500 text-white px-6 py-3 rounded-full
            shadow-[0_8px_30px_rgba(34,197,94,0.3)]
            flex items-center gap-3 animate-fade-in
            z-50">
  <i class="ph ph-check-circle text-xl"></i>
  <span class="font-semibold">Import réussi!</span>
</div>
```

**Characteristics:**
- Position: Bottom-right corner, floating
- Animation: Fade-in (300ms)
- Color: Green-500 (success)
- Shadow: Soft green shadow
- Auto-dismiss: After 2s (navigates to home)

---

## 4. Palette & Couleurs Sémantiques

### 4.1 Système Colors (Apple)

```css
/* Primary Accent (Selection) */
--system-blue: #007AFF;           /* Selection state, buttons */
--blue-400: #60A5FA;              /* Border when selected */
--blue-50: #EFF6FF;               /* Background when selected */

/* Secondary (Actions) */
--system-white: #FFFFFF;          /* Card backgrounds */
--system-gray: #F2F2F7;           /* Page background */

/* Text */
--text-primary: #000000;          /* Headlines */
--text-secondary: #3C3C43;        /* Body text */
--text-tertiary: #8E8E93;         /* Hints/placeholders */

/* Separators */
--separator: #E5E5EA;             /* Hairlines */
--separator-opaque: #D1D1D6;      /* Full opacity */
```

### 4.2 Category Colors (14 Total)

| Color | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| Slate | `bg-slate-500` | #64748B | Neutral |
| Red | `bg-red-500` | #EF4444 | Energy |
| Orange | `bg-orange-500` | #F97316 | Warm |
| Amber | `bg-amber-500` | #F59E0B | Bright |
| Yellow | `bg-yellow-500` | #EAB308 | Energetic |
| Lime | `bg-lime-500` | #84CC16 | Fresh |
| Green | `bg-green-500` | #22C55E | Success |
| Emerald | `bg-emerald-500` | #10B981 | Cool |
| Teal | `bg-teal-500` | #14B8A6 | Balanced |
| Cyan | `bg-cyan-500` | #06B6D4 | Cool Blue |
| Blue | `bg-blue-500` | #3B82F6 | Primary |
| Indigo | `bg-indigo-500` | #6366F1 | Deep |
| Purple | `bg-purple-500` | #A855F7 | Vibrant |
| Pink | `bg-pink-500` | #EC4899 | Vibrant |

### 4.3 Icon Picker (24 Icons Available)

```
Code, Rocket, Cpu, Palette, Database, Chat,
Calculator, Microscope, Globe, Lightning, Book, Moon,
Bug, Wine, Sparkle, Lightbulb, Gear, Wrench,
Hammer, Square, Star, Heart, Flag, Target
```

---

## 5. Contenu & Données

### 5.1 Catégories Existantes

**Source:** `dataStore.allCategories`

```typescript
interface Category {
  id: string           // "cat_12345"
  label: string        // "Python", "Informatique"
  icon: string         // "Code", "Rocket"
  color: string        // "blue", "orange"
}
```

**Affichage:**
- Icon: Phosphor Icons (regular weight)
- Label: Category name
- Selection: Check icon when selected

### 5.2 Nouvelle Catégorie (Form)

**Data Structure:**

```typescript
const newCategory = ref({
  label: string        // User input
  icon: string         // Selected from 24 icons
  color: string        // Selected from 14 colors
})
```

**Validation:**
- Label must not be empty (button disabled if empty)
- Icon default: "Code"
- Color default: "blue"

### 5.3 Icônes (Icon Picker)

**24 Icônes Disponibles:**
- Phosphor Icons library
- Regular weight
- Size: 20px
- Arranged in 6-column grid

**Icons:**
`Code`, `Rocket`, `Cpu`, `Palette`, `Database`, `Chat`, `Calculator`, `Microscope`, `Globe`, `Lightning`, `Book`, `Moon`, `Bug`, `Wine`, `Sparkle`, `Lightbulb`, `Gear`, `Wrench`, `Hammer`, `Square`, `Star`, `Heart`, `Flag`, `Target`

### 5.4 Couleurs (Color Picker)

**14 Couleurs Disponibles:**
- Arranged in 7-column grid
- Perfect squares
- Colored backgrounds (from colorMap)

### 5.5 Session Data

**Source:** `sessionStorage.pendingImportJson`
- JSON file uploaded from `/settings/import`
- Contains array of question objects
- Retrieved and cleared after successful import

---

## 6. États & Interactions (Physique)

### 6.1 Page Load

**Timeline:**
```
User arrives with JSON in sessionStorage
         ↓
Page displays categories list + form
         ↓
All buttons enabled (except Import if no selection)
```

### 6.2 Category Selection

**Interaction:**
```
User clicks category item
         ↓
Button scales down (scale-95) and back (150ms)
         ↓
Border animates to blue (200ms)
         ↓
Background animates to blue tint (200ms)
         ↓
Check icon appears
         ↓
selectedCategory = cat.label
         ↓
Import button becomes enabled
```

**CSS:**
```css
.category-item {
  transition: all 0.2s ease-out;
}

.category-item:active {
  transform: scale(0.95);
  transition: transform 0.15s ease-out;
}

.category-item.selected {
  border-color: #60A5FA;
  background-color: #EFF6FF;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}
```

### 6.3 Icon Picker Selection

**Interaction:**
```
User clicks icon button
         ↓
Icon scales down (scale-95) and back (150ms)
         ↓
Border animates to blue
         ↓
Background animates to blue tint
         ↓
newCategory.icon = icon
         ↓
Visual update (new icon highlighted)
```

**CSS:**
```css
.icon-picker-button {
  transition: all 0.2s ease-out;
}

.icon-picker-button:hover {
  border-color: #D1D5DB;
}

.icon-picker-button:active {
  transform: scale(0.95);
}

.icon-picker-button.selected {
  border-color: #60A5FA;
  background-color: #EFF6FF;
}
```

### 6.4 Color Picker Selection

**Interaction:**
```
User clicks color square
         ↓
Square scales down (scale-95) and back
         ↓
Border animates to dark slate
         ↓
Shadow appears
         ↓
newCategory.color = color
         ↓
Visual update (new color highlighted)
```

### 6.5 Form Validation

**Label Input:**
- Real-time validation
- "Créer et sélectionner" button disabled if `label.trim() === ""`
- Focus ring on input: `ring-2 ring-blue-500/20`

**Error Handling:** None (no error states defined, just disabled button)

### 6.6 Import Flow

**Timeline:**

```
User clicks "Importer" button
         ↓
isImporting = true
Button becomes disabled (opacity-50)
Button text changes: "⏳ Import en cours..."
Both buttons disabled
         ↓
Backend: Fetch/parse JSON → Save to IndexedDB
         ↓
Import completes (success or error)
         ↓
isImporting = false
importSuccess = true
Success toast appears: "✓ Import réussi!"
         ↓
After 2s: router.push('/home')
```

**Timeout:** 30 seconds (import timeout protection)

### 6.7 Button States

**Cancel Button:**
- Enabled: Normal cursor, full opacity
- Disabled (during import): cursor-not-allowed, opacity-50
- Hover: `bg-slate-100`
- Active: `scale-95`

**Import Button:**
- Disabled (no category selected): opacity-50
- Disabled (during import): opacity-50, spinner shown
- Enabled: Normal styling
- Hover: `bg-blue-700`
- Active: `scale-95`

### 6.8 Transitions & Animations

| Element | Transition | Duration | Easing |
|---------|-----------|----------|--------|
| Category selection | Border + Background | 200ms | ease-out |
| Icon selection | Border + Background | 200ms | ease-out |
| Color selection | Border + Shadow | 200ms | ease-out |
| Button press | Scale | 150ms | ease-out |
| Input focus ring | Ring appearance | 200ms | ease-out |
| Success toast | Fade-in | 300ms | ease-out |

---

## 7. Responsive Design

### 7.1 All Breakpoints

**Max Width:** `max-w-2xl` (896px)
**Padding:** `px-6` (24px) across all breakpoints
**Columns:**
- Icon picker: `grid-cols-6` (always 6 columns)
- Color picker: `grid-cols-7` (always 7 columns)
- Action buttons: `flex` 2-column (equal width)

### 7.2 Mobile (xs, sm: ≤640px)

- Full width with side padding
- Icon picker: 6 columns (default)
- Color picker: 7 columns (default)
- Button text: Visible

### 7.3 Tablet (md: 641px-1024px)

- Centered with max-width
- Same layout as mobile

### 7.4 Desktop (lg: ≥1025px)

- Centered, max-width respected
- More breathing room

---

## 8. Résumé Visuel Complet

```
╔════════════════════════════════════════════╗
║ Sélectionner une catégorie                 │
║ Choisissez la catégorie...                 │
║                                            │
╠════════════════════════════════════════════╣
║                                            │
║ Catégories existantes                      │
║ ┌──────────────────────────────────────┐  │
║ │ [📁] Informatique           [✓]      │  │
║ │ [🚀] Mathématiques                  │  │
║ │ [🔬] Science                        │  │
║ └──────────────────────────────────────┘  │
║                                            │
║ ─────────────────────────────────────────  │
║                                            │
║ Créer une nouvelle catégorie               │
║ ┌──────────────────────────────────────┐  │
║ │ Nom                                  │  │
║ │ [Input: Python]                      │  │
║ │                                      │  │
║ │ Icône                                │  │
║ │ [Code][Rocket][CPU][✓][Palette]...  │  │
║ │                                      │  │
║ │ Couleur                              │  │
║ │ [Slate][Red][Orange][✓][Yellow]...  │  │
║ │                                      │  │
║ │ [+ Créer et sélectionner]            │  │
║ └──────────────────────────────────────┘  │
║                                            │
║         [Annuler]   [⬇️ Importer]          │ ← Fixed bottom
║                                            │
╚════════════════════════════════════════════╝
```

---

**End of Spécification UI: Select Category**
