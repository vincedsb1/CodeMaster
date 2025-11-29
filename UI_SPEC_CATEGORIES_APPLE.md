# Spécification UI : Categories Management (Gestion des Catégories)

**Route:** `/settings/categories`
**Composants:** `src/views/settings/Categories.vue` + `src/components/settings/ListeCategories.vue`

---

## 1. Objectif & Contexte

### Quel est le but principal de cette page ?

La page **Categories Management** permet à l'utilisateur de **gérer complètement ses catégories de questions**: voir la liste, éditer les détails, créer de nouvelles catégories, et supprimer des catégories existantes.

**Contexte:**
- Accessible depuis `/settings/import` ou via navigation menu
- Affiche toutes les catégories créées + nombre de questions par catégorie
- Permet CRUD complet (Create, Read, Update, Delete)

### Quelle est l'action principale attendue ?

**Actions Primaires:**
1. **Voir la liste** de toutes les catégories (avec icône, couleur, label, question count)
2. **Cliquer pour éditer** une catégorie existante (navigation vers `/settings/categories/edit?id=...`)
3. **Swiper à gauche** pour supprimer une catégorie (Apple-style gesture)
4. **Cliquer FAB** pour créer une nouvelle catégorie

**Workflow:**
```
Categories List
    ↓
[Click category] → Edit page
    ↓
[Swipe left] → Delete confirm → Remove
    ↓
[Click FAB] → Edit page (new)
```

---

## 2. Structure & Layout (iOS/macOS Style)

### 2.1 Navigation Bar (Large Title)

**Position:** Scrolls with content (not sticky)

```
┌─────────────────────────────────────┐
│ Gestion des catégories              │
│ Gérez vos catégories de questions   │
└─────────────────────────────────────┘
```

**Implémentation:**
```html
<div class="space-y-2 pt-6 px-6">
  <h1 class="text-3xl font-bold text-slate-900">Gestion des catégories</h1>
  <p class="text-base text-slate-600 leading-relaxed font-medium">
    Gérez vos catégories de questions
  </p>
</div>
```

**Caractéristiques:**
- Large Title: `text-3xl font-bold text-slate-900`
- Subtitle: `text-base text-slate-600`
- Padding: `pt-6 px-6`
- Scrolls with content (no sticky positioning)

### 2.2 Corps Principal (Scrollable Content)

**Layout Vertical:**

```
┌─────────────────────────────────────┐
│    [Header: Large Title]            │
├─────────────────────────────────────┤
│                                     │
│  [Scrollable Categories List]       │ ← overflow-y-auto
│  ┌─────────────────────────────────┐│
│  │ [Icon] Informatique     (20q) →││
│  │ [Icon] Mathématiques    (15q) →││
│  │ [Icon] Science          (12q) →││
│  │ ...                             ││
│  │                                 ││
│  │ [Swipe hint on mobile]          ││
│  └─────────────────────────────────┘│
│                                     │
│                                     │
└─────────────────────────────────────┘
                    ↘
              [FAB Button]  ← fixed bottom-right
```

**Dimensions:**
- Max-width: `max-w-2xl` (896px)
- Padding horizontal: `px-6` (24px)
- Padding vertical: `space-y-6` (aération)
- Padding bottom: `pb-20` (espace pour FAB)
- Categories spacing: `space-y-3` (12px entre items)

### 2.3 Safe Areas

- **Top:** Header scrolls naturally
- **Bottom:** FAB floating at `bottom-6 right-6` (floating action)
- **Left/Right:** Safe padding with `px-6`

---

## 3. Composants Apple Design (Détail Critique)

### 3.1 Category Item (Swipeable List Cell)

**Container (Wrapper with Overflow Hidden):**

```html
<div
  class="relative overflow-hidden rounded-3xl border border-gray-100/50
         bg-white/50 backdrop-blur-sm"
  @touchstart="handleTouchStart($event, category.id)"
  @touchmove="handleTouchMove($event, category.id)"
  @touchend="handleTouchEnd(category.id)"
>
  <!-- [Swipe Delete Background Layer] -->
  <!-- [Main Content Layer (Swipeable)] -->
</div>
```

### 3.2 Swipe Delete Background Layer

**Position:** Absolute background that reveals on swipe

```html
<div class="absolute inset-0 bg-red-500 flex items-center justify-end pr-6 z-0
           rounded-3xl">
  <!-- Delete Button -->
  <button
    @click="$emit('delete', category.id)"
    class="text-white hover:opacity-80 transition active:scale-95"
    title="Supprimer"
  >
    <i class="ph ph-trash text-2xl"></i>
  </button>
</div>
```

**Characteristics:**
- Background: `bg-red-500` (destructive action)
- Layout: Flexbox, items right-aligned
- Padding right: `pr-6` (24px)
- Icon: Trash (`ph-trash`)
- Hidden until swipe

### 3.3 Main Category Row (Swipeable Button)

**Primary Content Layer:**

```html
<button
  :style="{ transform: `translateX(${swipeOffsets[category.id] || 0}px)` }"
  @click="$emit('category-click', category.id)"
  type="button"
  class="relative w-full bg-white/80 backdrop-blur-sm p-4
         flex items-center gap-4
         transition-transform duration-150 ease-out
         cursor-pointer
         hover:bg-slate-50/50 active:bg-slate-100/50
         rounded-3xl"
>

  <!-- Category Icon Badge -->
  <div :class="[
    'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
    'border border-gray-100/50',
    colorLightMap[category.color]
  ]">
    <i :class="['ph', `ph-${category.icon.toLowerCase()}`, 'text-lg', colorTextMap[category.color]]"></i>
  </div>

  <!-- Category Info (Label + Question Count) -->
  <div class="flex-1 min-w-0 text-left space-y-0.5">
    <p class="font-semibold text-slate-900 truncate">
      {{ category.label }}
    </p>
    <p class="text-xs text-slate-500 font-medium">
      {{ questionCount }} question<span v-if="questionCount !== 1">s</span>
    </p>
  </div>

  <!-- Chevron Indicator -->
  <div class="flex-shrink-0">
    <i class="ph ph-caret-right text-slate-400 text-lg"></i>
  </div>
</button>
```

**Styling Details:**

**Normal State:**
- Background: `bg-white/80 backdrop-blur-sm` (translucent)
- Border: None (implicit in parent container)
- Shadow: None (parent has `border-gray-100/50`)
- Text: Slate-900 (label), Slate-500 (subtext)

**Hover State:**
- Background: `bg-slate-50/50` (slightly visible)
- Transition: `200ms ease-out`

**Active State:**
- Background: `bg-slate-100/50` (more visible)
- Scale: No scale (swipe handles this)

**Swipe State (via transform):**
- Max translation: `-80px` (reveals delete button)
- Smooth animation: `transition-transform duration-150`
- Touch events: `@touchstart`, `@touchmove`, `@touchend`

### 3.4 Icon Badge

**Styling:**
- Shape: `rounded-full` (perfect circle)
- Size: `w-12 h-12` (48×48px)
- Background: Color-light variant (e.g., `bg-blue-100` for blue category)
- Border: `border-gray-100/50` (hairline)
- Icon: Phosphor Icons, color-matched (e.g., `text-blue-700`)

**Color Mapping (14 Colors):**

| Color | Light BG | Icon Color |
|-------|----------|-----------|
| slate | `bg-slate-100` | `text-slate-700` |
| red | `bg-red-100` | `text-red-700` |
| orange | `bg-orange-100` | `text-orange-700` |
| amber | `bg-amber-100` | `text-amber-700` |
| yellow | `bg-yellow-100` | `text-yellow-700` |
| lime | `bg-lime-100` | `text-lime-700` |
| green | `bg-green-100` | `text-green-700` |
| emerald | `bg-emerald-100` | `text-emerald-700` |
| teal | `bg-teal-100` | `text-teal-700` |
| cyan | `bg-cyan-100` | `text-cyan-700` |
| blue | `bg-blue-100` | `text-blue-700` |
| indigo | `bg-indigo-100` | `text-indigo-700` |
| purple | `bg-purple-100` | `text-purple-700` |
| pink | `bg-pink-100` | `text-pink-700` |

### 3.5 Empty State

**When no categories exist:**

```html
<div v-if="categories.length === 0" class="text-center py-12 space-y-4">
  <i class="ph ph-folder-open text-4xl text-slate-400 block"></i>
  <p class="text-slate-500 font-medium">Aucune catégorie créée.</p>
  <p class="text-sm text-slate-400">Cliquez sur le bouton "+" pour en créer une.</p>
</div>
```

**Characteristics:**
- Icon: Folder-open (`ph-folder-open`)
- Icon size: `text-4xl`
- Icon color: Slate-400 (muted)
- Text: Slate-500 (secondary)
- Centered layout with padding

### 3.6 Swipe Hint (Mobile Only)

**Appears below list:**

```html
<p class="text-xs text-slate-500 text-center md:hidden mt-4 font-medium">
  Swipe à gauche pour supprimer
</p>
```

**Characteristics:**
- Visible only on mobile: `md:hidden`
- Hidden on tablet+
- Text: Slate-500
- Size: `text-xs`
- Centered

### 3.7 Floating Action Button (FAB)

**Fixed Position (Bottom-Right):**

```html
<button
  @click="handleCreateCategory"
  class="fixed bottom-6 right-6 z-40
         w-14 h-14 rounded-full
         bg-blue-600 hover:bg-blue-700
         text-white font-bold
         shadow-[0_6px_20px_rgba(37,99,235,0.3)]
         active:scale-95
         transition-all duration-200
         flex items-center justify-center"
  title="Créer une catégorie"
>
  <i class="ph ph-plus text-2xl"></i>
</button>
```

**Styling:**

**Normal State:**
- Position: `fixed bottom-6 right-6` (24px from edges)
- Shape: `rounded-full` (circle)
- Size: `w-14 h-14` (56×56px, iOS standard)
- Background: `bg-blue-600` (System Blue)
- Shadow: `shadow-[0_6px_20px_rgba(37,99,235,0.3)]` (blue glow)
- Icon: Plus (`ph-plus`)
- Z-index: `z-40` (above content)

**Hover State:**
- Background: `bg-blue-700` (darker blue)
- Shadow: Slightly enhanced
- Transition: `200ms ease-out`

**Active State (Press):**
- Scale: `scale-95` (press feedback)
- Transition: `150ms ease-out`

---

## 4. Palette & Couleurs Sémantiques

### 4.1 Système Colors (Apple)

```css
/* Primary Accent */
--system-blue: #007AFF;           /* FAB button */
--system-white: #FFFFFF;          /* Card backgrounds */
--system-gray: #F2F2F7;           /* Page background */

/* Destructive */
--system-red: #FF3B30;            /* Swipe delete background */

/* Text */
--text-primary: #000000;          /* Headlines */
--text-secondary: #3C3C43;        /* Body text */
--text-tertiary: #8E8E93;         /* Hints */

/* Separators */
--separator: #E5E5EA;             /* Hairlines */
```

### 4.2 Category Colors (14 Total)

Same as SelectCategory (slate, red, orange, amber, yellow, lime, green, emerald, teal, cyan, blue, indigo, purple, pink)

---

## 5. Contenu & Données

### 5.1 Categories List

**Source:** `dataStore.allCategories`

```typescript
interface Category {
  id: string           // "cat_12345"
  label: string        // "Informatique"
  icon: string         // "Code", "Rocket"
  color: string        // "blue", "orange"
}
```

**Display per Category:**
- Icon badge (color-matched circle)
- Label (truncated if too long)
- Question count (dynamic from dataStore.questions)
- Chevron indicator (right)

### 5.2 Question Count

**Calculation:**
```typescript
const getQuestionCountForCategory = (categoryId: string): number => {
  return dataStore.questions.filter((q) => q.categorie === categoryId).length
}
```

**Display:**
- Format: "X questions" or "1 question" (singular/plural)
- Color: `text-slate-500` (secondary text)
- Size: `text-xs` (small subtext)

### 5.3 Icons (Phosphor Icons)

**Available Icons (24):**
Same as SelectCategory page (Code, Rocket, Cpu, Palette, Database, Chat, Calculator, Microscope, Globe, Lightning, Book, Moon, Bug, Wine, Sparkle, Lightbulb, Gear, Wrench, Hammer, Square, Star, Heart, Flag, Target)

**Styling:**
- Weight: Regular
- Size: `text-lg` (18px) in badge
- Color: Category color (e.g., `text-blue-700`)

---

## 6. États & Interactions (Physique)

### 6.1 Swipe-to-Delete Gesture

**Timeline:**

```
User presses on category item
         ↓
handleTouchStart: Record initial X position
         ↓
User drags left (swipMove events)
         ↓
handleTouchMove: Calculate offset (diff from start)
- Allow only negative values (swiping left)
- Cap at -80px (max swipe distance)
         ↓
transform: `translateX(${offset}px)` animates smoothly
         ↓
Delete button becomes visible in background
         ↓
User releases
         ↓
handleTouchEnd: Check if offset < -60px (SWIPE_THRESHOLD)
- If true: Snap to open (-80px) → Delete button fully visible
- If false: Snap back to closed (0px) → Snap animation
```

**Physics:**

**Swipe Threshold:** 60px
- User must swipe at least 60px to trigger delete
- Below 60px: Snaps back closed
- Above 60px: Snaps fully open

**Snap Animation:**
- Duration: `150ms` (fast snap)
- Easing: `ease-out` (spring-like)

**CSS:**
```css
.category-button {
  transform: translateX(0px);  /* Initial */
  transition: transform 0.15s ease-out;
}

/* During touch: no transition (follow finger) */
/* After touchend: transition to snap position */
```

### 6.2 Click Interactions

**Category Row Click:**
```
User taps category row
         ↓
Hover effect visible (bg-slate-50/50)
         ↓
Click event emits
         ↓
Navigation to edit page: /settings/categories/edit?id=categoryId
```

**Delete Button Click:**
```
User taps delete (after swipe)
         ↓
Delete event emits
         ↓
Parent component (Categories.vue) handles:
  - Confirmation dialog: "Êtes-vous sûr?"
  - If OK: dataStore.deleteCategory(categoryId)
  - Category removed from list
```

**FAB Click:**
```
User taps "+" button
         ↓
Button scales to 95% and back (150ms)
         ↓
Navigation to create page: /settings/categories/edit (no ?id)
```

### 6.3 Hover Effects (Desktop)

**Category Row Hover:**
- Background: Transitions to `bg-slate-50/50`
- Duration: `200ms ease-out`
- Cursor: `pointer`

**FAB Hover:**
- Background: Transitions to `bg-blue-700`
- Duration: `200ms ease-out`

### 6.4 Active States (Press Feedback)

**Category Row Active:**
- Background: `bg-slate-100/50` (more visible)
- No scale (swipe handles motion)

**FAB Active:**
- Scale: `scale-95` (press down effect)
- Duration: `150ms ease-out` down, `200ms ease-out` up

### 6.5 Loading State

**During deletion:**
- Opacity might reduce (future enhancement)
- Confirmation dialog blocks interaction

---

## 7. Responsive Design

### 7.1 All Breakpoints

**Max Width:** `max-w-2xl` (896px)
**Padding:** `px-6` (24px) horizontal
**Column Layout:** Single column (always vertical)

### 7.2 Mobile (xs, sm: ≤640px)

- Full width with side padding
- Swipe-to-delete enabled
- "Swipe à gauche" hint visible
- FAB visible at bottom-right

### 7.3 Tablet (md: 641px-1024px)

- Centered with max-width
- Swipe-to-delete still enabled
- "Swipe" hint hidden (`md:hidden`)

### 7.4 Desktop (lg: ≥1025px)

- Centered, max-width respected
- Swipe-to-delete still functional (if touch capable)
- FAB always visible

---

## 8. Résumé Visuel Complet

```
╔══════════════════════════════════════════════╗
║ Gestion des catégories                       │
║ Gérez vos catégories de questions            │
║                                              │
╠══════════════════════════════════════════════╣
║                                              │
║  ┌────────────────────────────────────────┐ │
║  │ [🔵] Informatique            (20q) → │ │
║  │ swipe left ←                          │ │
║  │ [🟠] Mathématiques           (15q) → │ │
║  │                                      │ │
║  │ [🟢] Science                 (12q) → │ │
║  │                                      │ │
║  │ [🟣] Philosophie              (8q) → │ │
║  │                                      │ │
║  │ Swipe à gauche pour supprimer        │ │
║  └────────────────────────────────────────┘ │
║                                              │
║                            [+] ← FAB Button  │
╚══════════════════════════════════════════════╝


Swipe State (Swiped Left):
╔══════════════════════════════════════════════╗
║ [🔵] Informatique    (20q) → [🗑️]          │
║ ◄──────────── Delete button revealed       │
╚══════════════════════════════════════════════╝
```

---

## 9. Validation Checklist

- [ ] Header displays "Gestion des catégories" + subtitle
- [ ] Categories list shows all categories from store
- [ ] Each item displays icon badge with color
- [ ] Each item displays category label (truncated if needed)
- [ ] Each item displays question count (singular/plural correct)
- [ ] Each item displays chevron indicator
- [ ] Click category navigates to edit page with ?id param
- [ ] Swipe left reveals delete button (red background)
- [ ] Swipe threshold working (60px minimum)
- [ ] Snap animation smooth (150ms)
- [ ] Delete button click triggers confirmation dialog
- [ ] After delete confirm, category removed from list
- [ ] FAB button visible at fixed position (bottom-right)
- [ ] FAB click navigates to create page (no ?id param)
- [ ] FAB press feedback (scale-95) working
- [ ] Empty state shown when no categories
- [ ] Swipe hint visible on mobile only
- [ ] Swipe hint hidden on tablet+ (`md:hidden`)
- [ ] All colors matching Apple design system
- [ ] Shadows are soft (no drop shadows)
- [ ] Rounded corners match Apple style (rounded-3xl)
- [ ] Transitions smooth (200-150ms)
- [ ] Mobile responsive (full width)
- [ ] Tablet responsive (centered, max-width)
- [ ] Desktop responsive (max-width respected)

---

**End of Spécification UI: Categories Management**
