# Spécification UI : Random Config (Sélection Multi-Catégories)

**Route:** `/quiz/randomconfig`
**Composant:** `src/views/quiz/RandomConfig.vue`
**Objectif Utilisateur:** Sélectionner les catégories à inclure dans le quiz aléatoire avant de choisir la difficulté et le nombre de questions.

---

## 1. Objectif & Contexte

### 1.1 Quel est le but principal de cette page ?

La page **Random Config** permet à l'utilisateur de **sélectionner une ou plusieurs catégories de questions** avant de lancer un quiz en mode "Aléatoire" (mélange les catégories sélectionnées avec difficulté et nombre de questions variables).

### 1.2 Quelle est l'action principale attendue ?

**Action Primaire:** Sélectionner au moins une catégorie, puis valider la sélection pour avancer vers le choix de difficulté.

**Contexte de Navigation:**
1. Utilisateur clique sur "Mode Aléatoire" depuis la page Home
2. Store randomise les paramètres et ouvre RandomConfig
3. Utilisateur sélectionne les catégories (checkboxes)
4. Utilisateur clique "Valider la sélection"
5. Navigation vers `/quiz/difficulty` avec les catégories pré-sélectionnées

**Contrainte:** Le bouton "Valider" reste **désactivé** si zéro catégories sont sélectionnées. Au moins une catégorie doit être cochée.

---

## 2. Structure & Layout (iOS/macOS Style)

### 2.1 Navigation Bar (Large Title Style)

**Position:** Sticky en haut avec effet glassmorphique.

```
┌─────────────────────────────────────────────────────┐
│  ← Quelles catégories ?                             │
└─────────────────────────────────────────────────────┘
```

**Implémentation:**
```html
<div class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
  <div class="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
    <!-- Back Button -->
    <button @click="goBack" class="p-2 rounded-full hover:bg-slate-100/50 active:scale-95 transition">
      <i class="ph ph-caret-left text-slate-900 text-xl"></i>
    </button>

    <!-- Title -->
    <h1 class="text-lg font-semibold text-slate-900">Quelles catégories ?</h1>

    <!-- Spacer for symmetry -->
    <div class="w-10"></div>
  </div>
</div>
```

**Caractéristiques:**
- Fond translucide: `bg-white/80 backdrop-blur-xl`
- Bordure hairline: `border-b border-white/20`
- Padding généreux: `px-6 py-4`
- Sticky positioning: `sticky top-0 z-50`

### 2.2 Corps (Body) - Scrollable Content Area

**Layout Vertical:**
```
┌─────────────────────────────────────┐
│        Navigation Bar (sticky)      │
├─────────────────────────────────────┤
│                                     │
│    [Scrollable Categories List]     │ ← flex-1, overflow-y-auto
│    ☐ Informatique                   │
│    ☐ Mathématiques                  │
│    ☐ Science                        │
│    ☐ Philosophie                    │
│    ...                              │
│                                     │
├─────────────────────────────────────┤
│    [Validate Button (Fixed)]        │ ← Sticky bottom
└─────────────────────────────────────┘
```

**Dimensions:**
- Max width: `max-w-2xl` (896px)
- Padding horizontal: `px-6` (24px) sur tous les côtés
- Spacing vertical entre catégories: `space-y-2` (8px)
- Padding top: `pt-20` (pour compenser la nav bar sticky)
- Padding bottom: `pb-24` (pour le bouton fixed)

### 2.3 Safe Areas

- **Top Safe Area:** Navigateur/statusbar + navigation bar (environ 80-100px)
- **Bottom Safe Area:** Bouton d'action fixe (environ 60-70px)
- Contenu scrollable occupe l'espace entre

---

## 3. Composants Apple Design (Détail Critique)

### 3.1 Checkbox Item (Catégorie Sélectionnable)

**Structure Générale:**
```
┌────────────────────────────────────────────┐
│ ☐  [Colored Dot]  Informatique        →    │
│                                            │
│ Non coché:  Fond blanc pur, bordure gris  │
│ Coché:      Fond teinte couleur, bordure  │
│             couleur plus saturée          │
└────────────────────────────────────────────┘
```

**Implémentation Vue.js:**

```vue
<label
  v-for="cat in categoriesDisponibles"
  :key="cat.id"
  :class="[
    'flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200',
    'cursor-pointer active:scale-95',
    isSelected(cat)
      ? `${getColorClasses(cat.color).bg} ${getColorClasses(cat.color).border} border-${cat.color}-400`
      : 'bg-white border-slate-200/50 hover:border-slate-300'
  ]"
>
  <!-- Native Checkbox -->
  <input
    type="checkbox"
    :value="cat.label"
    v-model="quizStore.randomCategoriesSelection"
    class="w-5 h-5 rounded cursor-pointer accent-inherit"
  />

  <!-- Category Color Badge -->
  <div
    :class="[
      'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
      getColorClasses(cat.color).bg
    ]"
  >
    <i :class="['ph', cat.icon, 'text-base', getColorClasses(cat.color).text]"></i>
  </div>

  <!-- Category Label -->
  <span class="font-semibold text-slate-900 flex-1">
    {{ cat.label }}
  </span>

  <!-- Chevron Indicator (Optional) -->
  <i class="ph ph-caret-right text-slate-400"></i>
</label>
```

### 3.2 Checkbox States & Colors

**État Décochée (Default):**
- Background: `bg-white`
- Border: `border-2 border-slate-200/50` (Hairline subtile)
- Hover: `border-slate-300` (Bordure légèrement plus visible)
- Shadow: Ombre très douce `shadow-[0_2px_8px_rgba(0,0,0,0.04)]`

**État Cochée (Selected):**
- Background: Teinte claire de la couleur de la catégorie (ex: `bg-blue-50`)
- Border: Couleur saturée (ex: `border-2 border-blue-400`)
- Shadow: Ombre légèrement plus prononcée `shadow-[0_4px_12px_rgba(0,0,0,0.06)]`
- Checkbox accent: Automatiquement coloré via `accent-[color-600]`

**Exemple pour catégorie Informatique (Blue):**
```
Non coché:
┌──────────────────────────────────┐
│ ☐  [Blue dot]  Informatique      │
│ bg-white                         │
│ border-slate-200/50              │
└──────────────────────────────────┘

Coché:
┌──────────────────────────────────┐
│ ☑  [Blue dot]  Informatique      │
│ bg-blue-50                       │
│ border-blue-400                  │
└──────────────────────────────────┘
```

### 3.3 Color Badge (Indicator Circular)

**Dimensions:** `w-9 h-9` (36×36px)
**Shape:** `rounded-full` (cercle parfait)
**Background:** Couleur pâle de la catégorie (ex: `bg-blue-50`, `bg-green-50`)
**Icon:** Phosphor Icons en mode `regular`, taille `text-base` (16px)

**Color Mapping (12 catégories):**

| Catégorie | Color | Hex Accent | Icon | Tailwind |
|-----------|-------|-----------|------|----------|
| Informatique | Blue | #007AFF | `ph-code` | `accent-blue-600` |
| Mathématiques | Purple | #AF52DE | `ph-function` | `accent-purple-600` |
| Science | Green | #34C759 | `ph-flask` | `accent-green-600` |
| Philosophie | Indigo | #5856D6 | `ph-brain` | `accent-indigo-600` |
| Histoire | Orange | #FF9500 | `ph-book` | `accent-orange-600` |
| Géographie | Cyan | #00C7FF | `ph-map` | `accent-cyan-600` |
| Littérature | Pink | #FF375F | `ph-book-open` | `accent-pink-600` |
| Économie | Yellow | #FFD60A | `ph-chart-line` | `accent-yellow-600` |
| Chimie | Emerald | #00D084 | `ph-flask-flask` | `accent-emerald-600` |
| Biologie | Lime | #A2FF00 | `ph-leaf` | `accent-lime-600` |
| Technologie | Slate | #8E8E93 | `ph-gear` | `accent-slate-600` |
| Art | Red | #FF453A | `ph-palette` | `accent-red-600` |

### 3.4 Bouton "Valider la Sélection" (Fixed Bottom)

**Position:** Fixe en bas (`fixed bottom-0`)
**Layout:**
```
┌────────────────────────────────────┐
│ [Glassmorphic Background]          │
│                                    │
│   [Validate Button - Full Width]   │
│                                    │
└────────────────────────────────────┘
```

**Implémentation:**

```html
<!-- Container (Fixed) -->
<div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20 px-6 py-4">
  <div class="max-w-2xl mx-auto">

    <!-- Button -->
    <button
      @click="validateRandomSelection"
      :disabled="!canValidate"
      class="w-full rounded-full px-6 py-3.5 font-semibold text-white
             bg-blue-600 hover:bg-blue-700 active:scale-95
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-200
             shadow-[0_4px_12px_rgba(0,124,255,0.3)]"
    >
      <i class="ph ph-check mr-2"></i>
      Valider la sélection
    </button>

  </div>
</div>

<!-- Spacer (pour éviter que le contenu scrollable se cache sous le bouton) -->
<div class="h-24"></div>
```

**Caractéristiques:**
- Shape: `rounded-full` (bouton pilule)
- Background: `bg-blue-600` (System Blue Apple)
- Hover: `bg-blue-700` (blue foncé)
- Active: `scale-95` (press feedback)
- Disabled: `opacity-50 cursor-not-allowed`
- Shadow: Douce et diffuse `shadow-[0_4px_12px_rgba(0,124,255,0.3)]`
- Icon: Check (`ph-check`)

**État Désactivé (< 1 catégorie sélectionnée):**
```
[✓ Valider la sélection]  Opacity: 50%, Cursor: not-allowed
```

**État Activé (≥ 1 catégorie sélectionnée):**
```
[✓ Valider la sélection]  Full opacity, Cursor: pointer
```

---

## 4. Palette & Couleurs Sémantiques

### 4.1 Couleurs Système (Apple Design)

**Accent Colors (Catégories):**
```
System Blue:      #007AFF  (Standard iOS accent)
System Purple:    #AF52DE  (Vibrant)
System Green:     #34C759  (Success)
System Red:       #FF3B30  (Error/Important)
System Orange:    #FF9500  (Warning)
System Yellow:    #FFD60A  (Bright)
System Pink:      #FF375F  (Vibrant)
System Cyan:      #00C7FF  (Cool)
System Indigo:    #5856D6  (Deep)
System Teal:      #00B894  (Balanced)
System Lime:      #A2FF00  (Energetic)
System Brown:     #A2845E  (Warm)
```

**Background Colors:**
```
System Background:        #FFFFFF (White)
System Grouped Background: #F2F2F7 (Light Gray)
Separator:                #E5E5EA (Gray 200)
Tertiary Separator:       #D1D1D6 (Gray 300)
```

### 4.2 Couleurs par État

| Élément | État | Couleur | Hex |
|---------|------|---------|-----|
| Checkbox Item | Normal | `bg-white` | #FFFFFF |
| Checkbox Item | Hover | `border-slate-300` | #CED4DA |
| Checkbox Item | Selected | `bg-[color]-50` | Variable |
| Checkbox Badge | Default | `bg-[color]-50` | Variable (pale) |
| Checkbox Badge | Selected | `text-[color]-600` | Variable (saturée) |
| Button | Enabled | `bg-blue-600` | #007AFF |
| Button | Hover | `bg-blue-700` | #0051D5 |
| Button | Disabled | `opacity-50` | Gray-tinted |
| Text Primary | Label | `text-slate-900` | #0F172A |
| Text Secondary | Hint | `text-slate-500` | #64748B |

### 4.3 Shadow System (Apple Soft Shadows)

```css
/* Subtle shadow (cards) */
shadow-[0_2px_8px_rgba(0,0,0,0.04)]

/* Standard shadow (hover) */
shadow-[0_4px_12px_rgba(0,0,0,0.06)]

/* Button shadow */
shadow-[0_4px_12px_rgba(0,124,255,0.3)]  /* Blue glow */

/* NO heavy drop shadows (Material Design style forbidden) */
```

---

## 5. Contenu & Données

### 5.1 Données Affichées

**Source:** `categoriesDisponibles` (computed property)
- Filtre: Seulement les catégories qui ont des questions chargées
- Tri: Ordre défini dans `dataStore.allCategories`

**Champs par Catégorie:**
```typescript
interface Category {
  id: string           // "informatique"
  label: string        // "Informatique"
  color: string        // "blue"
  icon: string         // "ph-code"
}
```

### 5.2 Données Sélectionnées

**Binding:** `quizStore.randomCategoriesSelection` (Array<string>)
- Contient les `label` des catégories cochées
- Mis à jour en temps réel via `v-model` sur les checkboxes

**Validation:**
```typescript
const canValidate = computed(() =>
  quizStore.randomCategoriesSelection.length > 0
)
```

### 5.3 Icônes (Phosphor Icons)

**Style:** Regular weight, taille 16-18px
**Utilisation:**
- Category badges: Icons spécifiques par catégorie (cf. Color Mapping)
- Navigation: `ph-caret-left` (back), `ph-caret-right` (chevron)
- Button: `ph-check` (check mark)

**Chargement:** CDN unpkg.com (même que dans le projet existant)

---

## 6. États & Interactions (Physique)

### 6.1 Scroll Behavior

**Scrollable Area:** Entre nav bar et bouton fixe

```
┌────────────────────────┐
│   [Sticky Nav Bar]     │  ← Fixed top-0
├────────────────────────┤
│  [Scrollable Content]  │  ← overflow-y-auto
│   - Category 1         │
│   - Category 2         │
│   - Category 3         │  ← blur effect as it scrolls under nav
│   ...                  │
├────────────────────────┤
│ [Fixed Button at -30]  │  ← Fixed bottom-0
└────────────────────────┘
```

**Contenu scrollant:** Les catégories glissent sous la nav bar translucide (glassmorphique).

### 6.2 Checkbox Interaction (Selection)

**Timeline d'une sélection:**

```
User taps checkbox
         ↓
Checkbox animates (native browser behavior)
         ↓
Vue v-model updates instantly
         ↓
Background color of item transitions (300ms ease-out)
         ↓
Border color transitions (300ms ease-out)
         ↓
Button "Valider" transitions from disabled to enabled (150ms)
         ↓
State: Item is now selected (checked)
```

**CSS Transitions:**
```css
.checkbox-item {
  transition: all 0.3s ease-out;
  /* background-color, border-color, box-shadow */
}

.validate-button {
  transition: opacity 0.15s ease-out;
  /* opacity change when enabling/disabling */
}
```

### 6.3 Button Press Feedback

**On Click (Active State):**
- Scale down: `scale-95` (5% réduction de taille)
- Transition: `duration-150 ease-out` (fast spring effect)

**On Release:**
- Scale back to 100%
- Transition: `duration-200 ease-out`

**Result:** Effet "bounce" subtil et rapide (très Apple-esque).

```css
button:active {
  transform: scale(0.95);
  transition: transform 0.15s ease-out;
}

button:not(:active) {
  transform: scale(1);
  transition: transform 0.2s ease-out;
}
```

### 6.4 Hover Effects

**Checkbox Item on Hover:**
- Border color devient légèrement plus visible
- Shadow peut augmenter très légèrement
- Duration: `200ms ease-out`

```css
.checkbox-item:hover:not(:disabled) {
  border-color: /* lighter -> target color */;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
```

**Button on Hover:**
- Background color fonce légèrement
- Shadow peut augmenter
- Duration: `200ms ease-out`

```css
button:hover:not(:disabled) {
  background-color: /* darker shade */;
  box-shadow: 0 6px 16px rgba(0,124,255,0.4);
}
```

### 6.5 Disabled State

**Quand:** 0 catégories sélectionnées

**Visuel:**
- Button opacity: `50%`
- Button cursor: `not-allowed`
- No hover effects
- No click response

```css
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### 6.6 Page Transitions

**Entrée (Enter Random Config):**
- Slide up + fade in
- Duration: `500ms ease-out`

**Sortie (Validate Selection):**
- Slide down + fade out
- Duration: `300ms ease-in`

**Animation Keyframes:**
```css
@keyframes slideUpFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-enter {
  animation: slideUpFadeIn 0.5s ease-out forwards;
}
```

### 6.7 Touch & Accessibility

**Touch Targets:**
- Minimum 44×44px (iOS standard)
- Checkbox items: `p-4` (16px padding = ~48px target)
- Button: Full width, `py-3.5` (56px height)

**Focus States (Keyboard Navigation):**
- Visible focus ring (Tailwind `focus-ring`)
- Color: System accent (Blue-600)

```css
input:focus,
button:focus {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}
```

---

## 7. Flow Complet de Validation

```
┌─ User Arrives ─────────────┐
│ randomCategoriesSelection  │
│ = [] (empty)               │
│ canValidate = false        │
└────────────────────────────┘
         ↓
┌─ User Selects Category ────┐
│ Click checkbox             │
│ v-model updates            │
│ randomCategoriesSelection  │
│ = ["Informatique"]         │
│ canValidate = true         │
│ Button opacity: 100%       │
└────────────────────────────┘
         ↓
┌─ User Selects More ────────┐
│ Click more checkboxes      │
│ randomCategoriesSelection  │
│ = ["Informatique",         │
│    "Mathématiques",        │
│    "Science"]              │
│ Button still enabled       │
└────────────────────────────┘
         ↓
┌─ User Clicks Validate ─────┐
│ validateRandomSelection()  │
│ quizStore.validateRandom() │
│ router.push('/quiz/        │
│   difficulty')             │
│ Page slides down + fades   │
└────────────────────────────┘
         ↓
┌─ Difficulty Page Loads ────┐
│ Pre-selected categories    │
│ ready for next step        │
└────────────────────────────┘
```

---

## 8. Responsive Design

### 8.1 All Breakpoints

**Max Width:** `max-w-2xl` (896px max)
**Padding:** `px-6` (24px) sur tous les appareils
**Stack:** Vertical (single column) sur tous les écrans

### 8.2 Mobile (xs, sm: ≤ 640px)

- Full width avec `px-6`
- Categories en liste unique
- Bouton full-width au bas

### 8.3 Tablet (md: 641px - 1024px)

- Centré avec max-width constraint
- Même layout que mobile

### 8.4 Desktop (lg: ≥ 1025px)

- Centré, max-width respecté
- Jamais plus large que 896px

---

## 9. Validation Checklist

- [ ] Navigation bar sticky et glassmorphique
- [ ] Titre "Quelles catégories ?" visible et lisible
- [ ] Toutes les catégories avec questions affichées
- [ ] Checkbox state (cochée/décochée) fonctionne
- [ ] Couleur/badge de chaque catégorie correct
- [ ] Item hover effect visible
- [ ] Item click/selection transitions smoothly (300ms)
- [ ] Bouton "Valider" disabled quand 0 sélections
- [ ] Bouton "Valider" enabled quand ≥1 sélections
- [ ] Bouton press feedback (scale-95) fonctionne
- [ ] Bouton click navigue vers `/quiz/difficulty`
- [ ] Padding/spacing respecte les guidelines Apple
- [ ] Aucune ombre drop-shadow lourde (Material Design forbidden)
- [ ] Transitions fluides sur tous les states
- [ ] Page scroll ne glitche pas sous la nav
- [ ] Mobile responsive (375px min)
- [ ] Tablet responsive (768px)
- [ ] Desktop responsive (1024px)
- [ ] Accessibility: Focus rings visibles
- [ ] Accessibility: Touch targets ≥44×44px
- [ ] Performance: Page loads < 1 second
- [ ] Performance: Smooth 60fps animations

---

## Résumé Visuel Complet

```
╔═════════════════════════════════════════╗
║        [← Quelles catégories ?]         │ ← Sticky Nav (glassmorphic)
╠═════════════════════════════════════════╣
║                                         │
║  ☐ [🔵] Informatique              → │
║                                         │
║  ☐ [🟣] Mathématiques             → │
║                                         │
║  � ◆╌ [🟢] Science                 → │ ← Scrollable area
║  ☐ [🟡] Philosophie               → │
║                                         │
║  ☐ [🟠] Histoire                   → │
║                                         │
║  ... (more categories) ...              │
║                                         │
╠═════════════════════════════════════════╣
║                                         │
║    [✓ Valider la sélection]             │ ← Fixed bottom button
║                                         │
╚═════════════════════════════════════════╝
```

---

**End of UI_SPEC_RANDOMCONFIG_APPLE.md**
