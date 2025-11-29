# Spécification UI : Category Edit (Création/Édition de Catégorie)

**Route:** `/settings/categories/edit` (avec paramètre optionnel `?id=categoryId`)
**Composant:** `src/views/settings/CategoryEdit.vue`

---

## 1. Objectif & Contexte

### Quel est le but principal de cette page ?

La page **Category Edit** est un formulaire pour **créer une nouvelle catégorie** OU **éditer une catégorie existante**. Elle fonctionne en mode dual:

- **Mode Création** (aucun `?id` param): Formulaire vierge pour créer une nouvelle catégorie
- **Mode Édition** (avec `?id=categoryId`): Pré-remplissement des données existantes, modification

**Contexte:**
- Accessible depuis `/settings/categories` (click category ou FAB "+" button)
- Formulaire validé côté client (label requis, pas de doublon, icon + color requis)
- Soumission sauvegarde dans `dataStore` puis retour à la liste

### Quelle est l'action principale attendue ?

**Actions Primaires:**
1. **Remplir le formulaire** (label + icon + color selection)
2. **Valider** et soumettre (avec erreur inline si validation échoue)
3. **Annuler** pour retourner à la liste

**Workflow:**

```
CREATE MODE:
[Formulaire vierge] → Remplir + Soumettre → Créer catégorie → Liste

EDIT MODE:
[Formulaire pré-rempli] → Modifier + Soumettre → Mettre à jour → Liste

CANCEL:
[Anywhere] → Cliquer Annuler → Retour à liste (sans sauvegarde)
```

---

## 2. Structure & Layout (iOS/macOS Style)

### 2.1 Navigation Bar (Large Title)

**Position:** Scrolls with content (not sticky)

```
┌─────────────────────────────────────┐
│ Créer une catégorie                 │
│ Créez une nouvelle catégorie        │
└─────────────────────────────────────┘

OU (Edit mode):

┌─────────────────────────────────────┐
│ Modifier la catégorie               │
│ Modifiez les détails de la catégorie│
└─────────────────────────────────────┘
```

**Implémentation:**
```html
<div class="space-y-2 pt-6 px-6">
  <h1 class="text-3xl font-bold text-slate-900">
    {{ isEditMode ? 'Modifier la catégorie' : 'Créer une catégorie' }}
  </h1>
  <p class="text-base text-slate-600 leading-relaxed font-medium">
    {{ isEditMode ? 'Modifiez les détails...' : 'Créez une nouvelle...' }}
  </p>
</div>
```

**Caractéristiques:**
- Large Title: `text-3xl font-bold text-slate-900`
- Subtitle: `text-base text-slate-600`
- Padding: `pt-6 px-6`
- Dynamic based on mode (create vs edit)

### 2.2 Corps Principal (Form)

**Layout Vertical:**

```
┌─────────────────────────────────────┐
│  [Header Title]                     │
├─────────────────────────────────────┤
│                                     │
│  [Form Card]                        │ ← Scrollable form
│  ┌─────────────────────────────────┐│
│  │ Label                           ││
│  │ [Input field]                   ││
│  │ [Error message if validation]   ││
│  │                                 ││
│  │ Icône                           ││
│  │ [Icon picker - 6 columns]       ││
│  │ [Error if needed]               ││
│  │                                 ││
│  │ Couleur                         ││
│  │ [Color picker - 7 columns]      ││
│  │ [Error if needed]               ││
│  │                                 ││
│  │ [Submit] [Cancel]               ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Dimensions:**
- Max-width: `max-w-2xl` (896px)
- Padding horizontal: `px-6` (24px)
- Padding vertical: `space-y-6` (aération)
- Form card padding: `p-6` (24px)
- Form spacing: `space-y-6` between form groups

---

## 3. Composants Apple Design (Détail Critique)

### 3.1 Form Container

**Glassmorphic Card:**

```html
<form @submit.prevent="handleSubmit"
      class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6 space-y-6">
  <!-- Form fields -->
</form>
```

**Styling:**
- Shape: `rounded-3xl` (20px radius)
- Background: `bg-white/50` (translucent)
- Blur: `backdrop-blur-sm` (subtle blur)
- Border: `border-gray-100/50` (hairline)
- Padding: `p-6` (24px)
- Spacing: `space-y-6` (generous vertical space)

### 3.2 Label Input Field

**Container:**

```html
<div class="space-y-2">
  <!-- Label -->
  <label for="label" class="block text-sm font-semibold text-slate-900 uppercase tracking-wide">
    Nom
  </label>

  <!-- Input -->
  <input
    id="label"
    v-model="form.label"
    type="text"
    placeholder="Ex: TypeScript, React, Node.js"
    class="w-full px-4 py-3 rounded-2xl
           border border-gray-200/50 bg-white/80
           placeholder:text-slate-400
           focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20
           transition-all duration-200"
  />

  <!-- Error Message -->
  <p v-if="errors.label" class="text-sm text-red-600 font-medium flex items-center gap-1">
    <i class="ph ph-warning text-red-600"></i>
    {{ errors.label }}
  </p>
</div>
```

**Input Styling:**

**Normal State:**
- Border: `border-gray-200/50` (hairline subtle)
- Background: `bg-white/80` (translucent)
- Padding: `px-4 py-3` (generous)
- Shape: `rounded-2xl` (20px)
- Placeholder: Slate-400 (muted)

**Focus State:**
- Border: `border-blue-400` (blue border)
- Ring: `ring-2 ring-blue-500/20` (blue soft ring)
- Transition: `200ms ease-out`

**Error State:**
- Red error message below
- Icon: Warning (`ph-warning text-red-600`)
- Color: Red-600 (`text-red-600`)

### 3.3 Icon Picker

**Grid Layout:**

```html
<div class="space-y-3">
  <!-- Label -->
  <label class="block text-sm font-semibold text-slate-900 uppercase tracking-wide">
    Icône
  </label>

  <!-- Icon Grid (6 columns) -->
  <div class="grid grid-cols-6 gap-2">
    <button
      v-for="icon in availableIcons"
      :key="icon"
      type="button"
      @click="form.icon = icon"
      :class="[
        'aspect-square rounded-2xl border-2 transition-all duration-200 active:scale-95',
        'flex items-center justify-center',
        form.icon === icon
          ? 'border-blue-400 bg-blue-50/60 shadow-[0_4px_12px_rgba(59,130,246,0.1)]'
          : 'border-gray-100/50 bg-white/50 hover:border-gray-200'
      ]"
      :title="icon"
    >
      <i :class="['ph', `ph-${icon.toLowerCase()}`, 'text-lg', form.icon === icon ? 'text-blue-600' : 'text-slate-700']"></i>
    </button>
  </div>

  <!-- Error Message -->
  <p v-if="errors.icon" class="text-sm text-red-600 font-medium flex items-center gap-1">
    <i class="ph ph-warning text-red-600"></i>
    {{ errors.icon }}
  </p>
</div>
```

**Icon Button Styling:**

**Non-Selected:**
- Border: `border-gray-100/50` (subtle)
- Background: `bg-white/50` (translucent)
- Shadow: None
- Hover: `border-gray-200` (more visible)
- Active: `scale-95` (press feedback)

**Selected:**
- Border: `border-blue-400` (System blue)
- Background: `bg-blue-50/60` (blue tint)
- Shadow: `shadow-[0_4px_12px_rgba(59,130,246,0.1)]` (blue glow)
- Icon color: `text-blue-600` (matches border)
- Icon weight: Bold when selected

**Grid:**
- Layout: `grid-cols-6` (6 icons per row)
- Gap: `gap-2` (8px between)
- Items: Aspect square (`aspect-square`)

### 3.4 Color Picker

**Grid Layout:**

```html
<div class="space-y-3">
  <!-- Label -->
  <label class="block text-sm font-semibold text-slate-900 uppercase tracking-wide">
    Couleur
  </label>

  <!-- Color Grid (7 columns) -->
  <div class="grid grid-cols-7 gap-2">
    <button
      v-for="color in availableColors"
      :key="color"
      type="button"
      @click="form.color = color"
      :class="[
        'aspect-square rounded-2xl border-2 transition-all duration-200 active:scale-95',
        form.color === color
          ? 'border-slate-900 ring-1 ring-offset-1 ring-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
          : 'border-gray-100/50 opacity-75 hover:opacity-100',
        colorMap[color]
      ]"
      :title="color"
    ></button>
  </div>

  <!-- Error Message -->
  <p v-if="errors.color" class="text-sm text-red-600 font-medium flex items-center gap-1">
    <i class="ph ph-warning text-red-600"></i>
    {{ errors.color }}
  </p>
</div>
```

**Color Button Styling:**

**Non-Selected:**
- Border: `border-gray-100/50` (subtle hairline)
- Opacity: `opacity-75` (slightly muted)
- Hover: `opacity-100` (become more visible)
- No ring or shadow

**Selected:**
- Border: `border-slate-900` (dark border for contrast)
- Ring: `ring-1 ring-offset-1 ring-slate-900` (thin ring with offset)
- Shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.15)]` (dark shadow)
- Opacity: 100% (fully visible)

**Grid:**
- Layout: `grid-cols-7` (7 colors per row)
- Gap: `gap-2` (8px between)
- Items: Aspect square (`aspect-square`)
- Total colors: 14 (slate, red, orange, amber, yellow, lime, green, emerald, teal, cyan, blue, indigo, purple, pink)

### 3.5 Action Buttons

**Container:**

```html
<div class="flex gap-3 pt-6 border-t border-gray-100/50">
  <!-- Submit Button (Primary) -->
  <button
    type="submit"
    class="flex-1 rounded-full px-6 py-3.5 font-semibold text-white
           bg-blue-600 hover:bg-blue-700 active:scale-95
           transition-all duration-200
           shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
  >
    <i class="ph mr-2" :class="isEditMode ? 'ph-check' : 'ph-plus'"></i>
    {{ isEditMode ? 'Mettre à jour' : 'Créer la catégorie' }}
  </button>

  <!-- Cancel Button (Secondary) -->
  <button
    type="button"
    @click="handleCancel"
    class="flex-1 rounded-full px-6 py-3.5 font-semibold
           bg-slate-100/60 text-slate-700 border border-slate-200/50
           hover:bg-slate-100 active:scale-95
           transition-all duration-200"
  >
    <i class="ph ph-x mr-2"></i>
    Annuler
  </button>
</div>
```

**Button Styling:**

**Submit (Primary):**
- Shape: `rounded-full` (pilule)
- Background: `bg-blue-600`
- Hover: `bg-blue-700` (darker)
- Text: `text-white`
- Shadow: Blue glow `shadow-[0_4px_12px_rgba(37,99,235,0.3)]`
- Icon: Plus (`ph-plus`) for create, Check (`ph-check`) for edit
- Active: `scale-95` (press feedback)

**Cancel (Secondary):**
- Shape: `rounded-full` (pilule)
- Background: `bg-slate-100/60`
- Text: `text-slate-700`
- Border: `border-slate-200/50` (hairline)
- Hover: `bg-slate-100`
- Icon: X (`ph-x`)
- Active: `scale-95` (press feedback)

**Container:**
- Layout: `flex gap-3` (3 icons wide gap)
- Split width: `flex-1` (equal width buttons)
- Top border: `border-t border-gray-100/50` (hairline separator)
- Top padding: `pt-6` (24px)

---

## 4. Palette & Couleurs Sémantiques

### 4.1 Système Colors (Apple)

```css
/* Primary Accent (Form focus, Submit) */
--system-blue: #007AFF;           /* Input focus, buttons, icons */
--blue-400: #60A5FA;              /* Icon picker selected border */
--blue-50: #EFF6FF;               /* Icon picker selected background */

/* Secondary (Form) */
--system-white: #FFFFFF;          /* Input field background */
--system-gray: #F2F2F7;           /* Page background */

/* Text */
--text-primary: #000000;          /* Headlines, labels */
--text-secondary: #3C3C43;        /* Body text */
--text-tertiary: #8E8E93;         /* Hints, placeholders */

/* Error */
--system-red: #FF3B30;            /* Error messages and icons */

/* Separators */
--separator: #E5E5EA;             /* Hairlines */
```

### 4.2 Category Colors (14 Total)

| Color | Tailwind Class | Hex Value |
|-------|-----------------|-----------|
| Slate | `bg-slate-500` | #64748B |
| Red | `bg-red-500` | #EF4444 |
| Orange | `bg-orange-500` | #F97316 |
| Amber | `bg-amber-500` | #F59E0B |
| Yellow | `bg-yellow-500` | #EAB308 |
| Lime | `bg-lime-500` | #84CC16 |
| Green | `bg-green-500` | #22C55E |
| Emerald | `bg-emerald-500` | #10B981 |
| Teal | `bg-teal-500` | #14B8A6 |
| Cyan | `bg-cyan-500` | #06B6D4 |
| Blue | `bg-blue-500` | #3B82F6 |
| Indigo | `bg-indigo-500` | #6366F1 |
| Purple | `bg-purple-500` | #A855F7 |
| Pink | `bg-pink-500` | #EC4899 |

---

## 5. Contenu & Données

### 5.1 Form Fields

**Label Input:**
- Type: Text input
- Placeholder: "Ex: TypeScript, React, Node.js"
- Required: Yes
- Validation: Not empty, no duplicates
- Error message: "Le label est requis" or "Une catégorie avec ce label existe déjà"

**Icon Picker:**
- Type: 24 icon options in 6-column grid
- Default (create mode): "Code"
- Default (edit mode): Loaded from category
- Required: Yes
- Validation: Icon must be selected
- Error message: "L'icône est requise"

**Color Picker:**
- Type: 14 color options in 7-column grid
- Default (create mode): "blue"
- Default (edit mode): Loaded from category
- Required: Yes
- Validation: Color must be selected
- Error message: "La couleur est requise"

### 5.2 Mode Detection

**Create Mode** (no `?id` param):
- Header: "Créer une catégorie"
- Subtitle: "Créez une nouvelle catégorie"
- Submit button: "Créer la catégorie"
- Form pre-filled with: empty label, "Code" icon, "blue" color

**Edit Mode** (with `?id=categoryId`):
- Header: "Modifier la catégorie"
- Subtitle: "Modifiez les détails de la catégorie"
- Submit button: "Mettre à jour"
- Form pre-filled with: existing category data

### 5.3 Icons (24 Total)

```
Code, Rocket, Cpu, Palette, Database, Chat,
Calculator, Microscope, Globe, Lightning, Book, Moon,
Bug, Wine, Sparkle, Lightbulb, Gear, Wrench,
Hammer, Square, Star, Heart, Flag, Target
```

---

## 6. États & Interactions (Physique)

### 6.1 Form Validation

**Validation Rules:**

1. **Label:**
   - Must not be empty (trim whitespace)
   - Must not duplicate existing categories (except if editing same category)
   - Show error: `errors.label = "Le label est requis"` or `"Une catégorie... existe déjà"`

2. **Icon:**
   - Must be selected (never empty, has default)
   - Show error: `errors.icon = "L'icône est requise"` (if somehow missing)

3. **Color:**
   - Must be selected (never empty, has default)
   - Show error: `errors.color = "La couleur est requise"` (if somehow missing)

**On Submit:**
1. `validate()` is called
2. If errors exist: Display inline error messages, don't submit
3. If valid: Create/Update category, navigate back to list

### 6.2 Input Focus States

**Label Input Focus:**
```
User clicks input
         ↓
Border animates to blue: border-blue-400
Ring appears: ring-2 ring-blue-500/20
Transition: 200ms ease-out
         ↓
User types, validates in real-time
         ↓
If error: Show red error message below
```

**CSS:**
```css
input:focus {
  border-color: #60A5FA;           /* blue-400 */
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);  /* ring-blue-500/20 */
  outline: none;
  transition: all 0.2s ease-out;
}

.error {
  color: #DC2626;                  /* red-600 */
}
```

### 6.3 Icon Picker Selection

**Interaction:**
```
User clicks icon button
         ↓
Button scales down: scale-95 (150ms)
         ↓
Border animates to blue
Background animates to blue tint
Icon weight changes to bold
         ↓
form.icon = icon
         ↓
Selected state visible (blue styling)
```

**Transition:** `200ms ease-out` for color/bg changes, `150ms ease-out` for scale

### 6.4 Color Picker Selection

**Interaction:**
```
User clicks color square
         ↓
Button scales down: scale-95 (150ms)
         ↓
Border animates to slate-900
Ring and shadow appear
Opacity becomes 100%
         ↓
form.color = color
         ↓
Selected state visible (dark styling with ring)
```

**Transition:** `200ms ease-out`

### 6.5 Button Press Feedback

**Submit & Cancel Buttons:**
```
User presses button
         ↓
Active state: scale-95
Transition: 150ms ease-out
         ↓
User releases
         ↓
Scale back to 100%
Transition: 200ms ease-out
```

### 6.6 Form Submission

**Timeline:**

```
User clicks Submit
         ↓
handleSubmit() triggered
         ↓
validate() checks all fields
         ↓
If errors: Display inline error messages, stop
         ↓
If valid:
  - isEditMode=true → dataStore.updateCategory(category)
  - isEditMode=false → dataStore.addCategory(category)
         ↓
Success → router.push({ name: 'categories' })
Return to categories list
```

**Error Handling:**
- Client-side validation errors: Inline display (red text + icon)
- Server errors: Could show alert (implementation detail)

### 6.7 Cancel Button

```
User clicks Cancel
         ↓
handleCancel() → router.push({ name: 'categories' })
         ↓
Return to categories list (no save, data discarded)
```

---

## 7. Responsive Design

### 7.1 All Breakpoints

**Max Width:** `max-w-2xl` (896px)
**Padding:** `px-6` (24px) horizontal
**Column Layout:** Single column (always vertical)

### 7.2 Mobile (xs, sm: ≤640px)

- Full width with side padding
- Form card: Full-width form container
- Icon grid: `grid-cols-6` (6 per row)
- Color grid: `grid-cols-7` (7 per row)
- Buttons: Two equal-width buttons stacked horizontally

### 7.3 Tablet (md: 641px-1024px)

- Centered with max-width
- Same layout as mobile

### 7.4 Desktop (lg: ≥1025px)

- Centered, max-width respected
- More breathing room around form

---

## 8. Résumé Visuel Complet

```
╔════════════════════════════════════════════╗
║ Créer une catégorie                        │
║ Créez une nouvelle catégorie               │
║                                            │
╠════════════════════════════════════════════╣
║                                            │
║  ┌──────────────────────────────────────┐ │
║  │ Nom                                  │ │
║  │ [Input: TypeScript________]          │ │
║  │                                      │ │
║  │ Icône                                │ │
║  │ [Code][Rocket][CPU][Palette][DB][C] │ │
║  │ [Chat][Calculator][Microscope]...   │ │
║  │                                      │ │
║  │ Couleur                              │ │
║  │ [■][■][■][■][✓■][■][■]             │ │
║  │ (Selected color: Blue with ring)     │ │
║  │                                      │ │
║  │ [Créer la catégorie]  [Annuler]     │ │
║  └──────────────────────────────────────┘ │
║                                            │
╚════════════════════════════════════════════╝


EDIT MODE:
┌────────────────────────────────────────┐
│ Modifier la catégorie                  │
│ Modifiez les détails de la catégorie   │
│                                        │
│ [Form with pre-filled values]          │
│ Label: "JavaScript"                    │
│ Icon: Rocket (selected, blue)          │
│ Color: Orange (selected, with ring)    │
│                                        │
│ [Mettre à jour]  [Annuler]            │
└────────────────────────────────────────┘


ERROR STATE:
┌────────────────────────────────────────┐
│ Nom                                    │
│ [Input with blue focus ring]           │
│ ⚠️ Une catégorie avec ce label existe  │
└────────────────────────────────────────┘
```

---

## 9. Validation Checklist

- [ ] Header displays "Créer une catégorie" (create mode) or "Modifier..." (edit mode)
- [ ] Subtitle matches mode
- [ ] Submit button text matches mode ("Créer la catégorie" or "Mettre à jour")
- [ ] Label input has placeholder text
- [ ] Label input shows focus ring (blue) on focus
- [ ] Icon picker grid displays 24 icons in 6 columns
- [ ] Selected icon has blue border + background + shadow
- [ ] Icon weight changes to bold when selected
- [ ] Color picker grid displays 14 colors in 7 columns
- [ ] Selected color has dark border + ring + shadow
- [ ] Form validates on submit
- [ ] Error messages display inline (red) for invalid fields
- [ ] Error messages have warning icons
- [ ] Submit button disabled if form invalid (future enhancement)
- [ ] Submit button submits form correctly
- [ ] Cancel button returns to categories list
- [ ] Edit mode pre-fills form with existing data
- [ ] Edit mode prevents duplicate label (allows same category)
- [ ] Create mode allows any unique label
- [ ] Form styling matches Apple design (rounded-3xl, soft shadows)
- [ ] Transitions are smooth (200-150ms)
- [ ] Buttons have press feedback (scale-95)
- [ ] Mobile responsive (full width)
- [ ] Tablet responsive (centered, max-width)
- [ ] Desktop responsive (max-width respected)
- [ ] No drop shadows (Apple style, only soft shadows)
- [ ] Hairline borders throughout

---

**End of Spécification UI: Category Edit**
