# Design System: Material Design 3 + Tailwind CSS v4
## Quiz Master PWA — Vue 3 TypeScript

---

## 1. Introduction

### 1.1. Objectif
Ce document définit un **Design System cohérent** pour Quiz Master PWA, adaptant les principes de **Material Design 3 (M3)** à Tailwind CSS v4. Il couvre:
- **Palette de couleurs** Material 3 en tokens Tailwind
- **Échelle typographique** simplifiée et cohérente
- **Système de spacing, radius et ombres** Material 3
- **6-7 composants de référence** Vue 3 + Tailwind

### 1.2. Périmètre
- **Framework**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 avec `@tailwindcss/postcss`
- **Icons**: Phosphor Icons (CDN)
- **Base de design**: Material Design 3 (Google)

### 1.3. Principes clés
1. **100% Tailwind** — Pas de UI library externe (daisyUI, shadcn), juste du Tailwind pur
2. **Material 3 tokens** — Palette couleur basée sur M3, exposée via `tailwind.config.js`
3. **Semantic naming** — Classes cohérentes : `bg-primary`, `text-on-surface`, `rounded-md`, `shadow-level-2`
4. **Mobile-first** — Responsive par défaut
5. **Accessibility** — Focus states, contrast, ARIA attributs

---

## 2. Palette de couleurs (Material 3 → Tailwind)

### 2.1. Rôles de couleurs Material 3

Material Design 3 définit des **rôles de couleur** plutôt que des couleurs absolues. Chaque rôle décrit un **usage** et non une teinte.

#### **Primary & On-Primary**
- **Couleur**: Purple (`#6750A4`) — Officiel Google Material Design 3
- **Tonal Palette**: 10 niveaux (10: `#FFFBFE` → 100: `#6750A4`)
- **Rôle**: Boutons principaux, accents forts, actions dominantes
- **On-Primary**: Texte/contenu SUR fond primary = Blanc (`#FFFFFF`)
- **Utilisation** : `bg-primary text-on-primary` ou `bg-primary-30 text-primary-100` pour les tonal variations
- **Exemple**: Bouton "Commencer le quiz" → `bg-primary-100 text-on-primary`

#### **Primary Container & On-Primary Container**
- **Couleur**: `#EADDFF` (light variant)
- **Rôle**: Fonds moins intenses pour secondary actions, messages informatifs
- **Utilisation** : `bg-primary-container text-on-primary-container`
- **Exemple**: Messages info, badges, conteneurs d'accent

#### **Secondary & On-Secondary**
- **Couleur**: Muted Purple (`#625B71`) — Officiel Google Material Design 3
- **Tonal Palette**: 10 niveaux de variations tonales
- **Rôle**: Accents secondaires, variante cohérente du primary
- **On-Secondary**: Blanc (`#FFFFFF`)
- **Utilisation** : `bg-secondary text-on-secondary` ou tonal variations `bg-secondary-30`

#### **Secondary Container & On-Secondary Container**
- **Couleur**: `#E8DEF8` (light variant)
- **Rôle**: Fonds légers avec accent secondaire
- **Utilisation** : `bg-secondary-container text-on-secondary-container`
- **Exemple**: Section secondaire, cartes alternatives

#### **Tertiary & On-Tertiary**
- **Couleur**: Rose (`#7D5260`) — Officiel Google Material Design 3
- **Tonal Palette**: 10 niveaux de variations tonales
- **Rôle**: Accent tertiaire, pour variation visuelle et catégorisations
- **On-Tertiary**: Blanc (`#FFFFFF`)
- **Utilisation** : `bg-tertiary text-on-tertiary` ou tonal variations

#### **Tertiary Container & On-Tertiary Container**
- **Couleur**: `#FFD8E4` (light variant)
- **Rôle**: Fonds d'accent tertiaire légers
- **Utilisation** : `bg-tertiary-container text-on-tertiary-container`

#### **Error & On-Error**
- **Couleur**: Red (`#B3261E`) — Officiel Google Material Design 3
- **Tonal Palette**: 10 niveaux de variations
- **Rôle**: États d'erreur, validations négatives, actions destructrices
- **On-Error**: Blanc (`#FFFFFF`)
- **Utilisation** : `bg-error text-on-error`

#### **Error Container & On-Error Container**
- **Couleur**: `#F9DEDC` (light variant)
- **Rôle**: Fonds d'erreur moins intenses, messages d'avertissement
- **Utilisation** : `bg-error-container text-on-error-container`
- **Exemple**: Alertes, message de validation échouée

#### **Background & On-Background**
- **Couleur**: `#FFFBFE` (très clair) / `#1C1B1F` (très foncé)
- **Rôle**: Fond global de l'app, fonds de page
- **Utilisation** : `bg-background text-on-background`

#### **Surface & On-Surface**
- **Couleur**: `#FFFBFE` (blanc cassé) / `#1C1B1F` (texte foncé)
- **Rôle**: Cartes, dialogues, surfaces surélevées
- **Utilisation** : `bg-surface text-on-surface`
- **Exemple**: Cards, surfaces élevées avec ombre

#### **Surface Variant & On-Surface Variant**
- **Couleur**: Neutral variants (10-95 tonal range)
- **Rôle**: Contours, lignes de séparation, texte secondaire
- **Utilisation** : `border-outline` ou `text-on-surface-variant`
- **Exemple**: Texte secondaire, bordures légères

#### **Outline & Outline Variant**
- **Couleur**: `#79747E` (Outline) / `#CAC7D0` (Outline Variant)
- **Rôle**: Bordures, lignes de division, inputs
- **Utilisation** : `border border-outline` ou `border-outline-variant`
- **Exemple**: Bordures de cartes, séparateurs

#### **Neutral (Gray) Palette**
- **Base**: `#1C1B1F` — Palette de gris neutre pour subtilité
- **Tonal Palette**: 10 niveaux (10: `#FFFBFE` → 100: `#1C1B1F`)
- **Rôle**: Utilisé comme base pour les variantes surface et contours
- **Utilisation**: Référencé automatiquement par les rôles surface-* et outline

#### **Semantic Colors** (utilitaires complémentaires)
- **Success**: `#10B981` (vert Emerald)
- **Warning**: `#F59E0B` (ambre)
- **Info**: `#3B82F6` (bleu)

### 2.2. Mapping complet vers Tailwind

```
Classe Tailwind          | M3 Rôle                | Utilisation
=============================================================
bg-primary              | Primary                | Boutons principaux
text-on-primary         | On-Primary             | Texte sur primary
bg-primary-container    | Primary Container      | Messages info
text-on-primary-...     | On-Primary Container   | Texte sur primary-container

bg-secondary            | Secondary              | Accents secondaires
bg-secondary-container  | Secondary Container    | Fonds légers

bg-tertiary             | Tertiary               | Variation visuelle
bg-tertiary-container   | Tertiary Container     | Fonds légers

bg-error                | Error                  | États d'erreur
bg-error-container      | Error Container        | Fonds d'erreur

bg-surface              | Surface                | Cartes, dialogues
text-on-surface         | On-Surface             | Texte principal
bg-surface-variant      | Surface Variant        | Contours
text-on-surface-variant | On-Surface Variant     | Texte secondaire

bg-background           | Background             | Fond global
text-on-background      | On-Background          | Texte sur fond global

border-outline          | Outline                | Bordures
border-outline-variant  | Outline Variant        | Bordures légères

bg-success              | Success (sémantique)   | Confirmations
bg-warning              | Warning (sémantique)   | Avertissements
bg-info                 | Info (sémantique)      | Informations
```

### 2.3. Règles d'usage des couleurs

#### 🎯 **Boutons et actions**
- **Bouton principal** (dominante) → `bg-primary text-on-primary rounded-xl`
- **Bouton secondaire** (moins important) → `bg-secondary-container text-on-secondary-container`
- **Bouton de surface** (subtil) → `border border-outline text-on-surface`
- **Bouton d'erreur** (destructif) → `bg-error text-on-error`

#### 📦 **Cartes et conteneurs**
- **Carte normale** → `bg-surface text-on-surface border border-outline rounded-md shadow-level-1`
- **Carte secondaire** → `bg-surface-variant rounded-md p-4`
- **Conteneur info** → `bg-primary-container text-on-primary-container rounded-md p-4`
- **Conteneur d'avertissement** → `bg-error-container text-on-error-container rounded-md p-4`

#### 📝 **Texte et typo**
- **Texte principal** → `text-on-surface`
- **Texte secondaire** → `text-on-surface-variant`
- **Texte sur couleur** → Toujours utiliser le rôle `on-*` correspondant

#### 🎨 **Fonds et arrière-plans**
- **Fond global de l'app** → `bg-background`
- **Fonds de modal/overlay** → `bg-black/50` avec backdrop
- **Bordures** → `border border-outline` ou `border border-outline-variant`

#### ✋ **États interactifs**
- **Hover** → Variations naturelles (ex: `hover:bg-primary/90`)
- **Focus** → `focus:outline-none focus:ring-2 focus:ring-primary`
- **Disabled** → `disabled:opacity-50 disabled:cursor-not-allowed`
- **Active** → `active:scale-95` (press feedback)

---

## 3. Typographie (Échelle Material 3 → Tailwind)

### 3.1. Principes typographiques

Material 3 définit une **hiérarchie typographique** basée sur 5 rôles : Display, Headline, Title, Body, Label.

Chaque rôle combine :
- **Taille** (font-size)
- **Poids** (font-weight)
- **Hauteur de ligne** (line-height)
- **Espacement des lettres** (letter-spacing)

### 3.2. Tableau des rôles typographiques

| Rôle | Taille | Poids | Hauteur | Espacement | Exemples d'usage |
|------|--------|-------|---------|-----------|------------------|
| **Display Large** | 57px | 400 | 64px | -0.25px | Hero, titre de page principal |
| **Display Medium** | 45px | 400 | 52px | 0px | Grand titre section |
| **Display Small** | 36px | 400 | 44px | 0px | Titre principal |
| **Headline Large** | 32px | 400 | 40px | 0px | Titre section majeure |
| **Headline Medium** | 28px | 400 | 36px | 0px | Sous-titre section |
| **Headline Small** | 24px | 400 | 32px | 0px | Titre de card |
| **Title Large** | 22px | 500 | 28px | 0px | Titre de modal/dialogue |
| **Title Medium** | 16px | 500 | 24px | 0.15px | Titre secondaire |
| **Title Small** | 14px | 500 | 20px | 0.10px | Label de card/chip |
| **Body Large** | 16px | 400 | 24px | 0.15px | Texte courant principal |
| **Body Medium** | 14px | 400 | 20px | 0.25px | Texte courant secondaire |
| **Body Small** | 12px | 400 | 16px | 0.40px | Texte très petit |
| **Label Large** | 14px | 500 | 20px | 0.10px | Boutons, chips, actions |
| **Label Medium** | 12px | 500 | 16px | 0.50px | Label petit |
| **Label Small** | 11px | 500 | 16px | 0.50px | Tag, badge très petit |

### 3.3. Mapping Tailwind (classes personnalisées)

Dans `tailwind.config.js`, les tailles suivantes sont exposées :

```javascript
fontSize: {
  'display-lg': ['57px', { lineHeight: '64px', letterSpacing: '-0.25px', fontWeight: '400' }],
  'display-md': ['45px', { lineHeight: '52px', letterSpacing: '0px', fontWeight: '400' }],
  'display-sm': ['36px', { lineHeight: '44px', letterSpacing: '0px', fontWeight: '400' }],

  'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '0px', fontWeight: '400' }],
  'headline-md': ['28px', { lineHeight: '36px', letterSpacing: '0px', fontWeight: '400' }],
  'headline-sm': ['24px', { lineHeight: '32px', letterSpacing: '0px', fontWeight: '400' }],

  'title-lg': ['22px', { lineHeight: '28px', letterSpacing: '0px', fontWeight: '500' }],
  'title-md': ['16px', { lineHeight: '24px', letterSpacing: '0.15px', fontWeight: '500' }],
  'title-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.10px', fontWeight: '500' }],

  'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0.15px', fontWeight: '400' }],
  'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0.25px', fontWeight: '400' }],
  'body-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.40px', fontWeight: '400' }],

  'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.10px', fontWeight: '500' }],
  'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.50px', fontWeight: '500' }],
  'label-sm': ['11px', { lineHeight: '16px', letterSpacing: '0.50px', fontWeight: '500' }],
}
```

### 3.4. Utilisation en composants

```vue
<!-- Titre de page -->
<h1 class="text-headline-lg">Mes Statistiques</h1>

<!-- Titre de carte -->
<h2 class="text-title-lg">Score moyen</h2>

<!-- Texte courant -->
<p class="text-body-md text-on-surface-variant">Vous avez complété 5 quiz aujourd'hui</p>

<!-- Label de bouton -->
<button class="text-label-lg">Commencer</button>

<!-- Texte très petit -->
<span class="text-label-sm">Créé il y a 2 jours</span>
```

### 3.5. Contraintes typographiques

🚫 **À ne pas faire** :
- Utiliser des tailles arbitraires hors de l'échelle M3 (ex: `text-13px` custom)
- Mélanger poids et tailles sans cohérence (ex: `text-xl font-light` pour un titre)
- Ignorer la hiérarchie (ex: utiliser `body-lg` pour un titre)

✅ **À faire** :
- Suivre l'échelle M3 pour tous les textes
- Combiner rôle typographique + couleur pour créer hiérarchie
- Utiliser `text-on-surface-variant` pour texte secondaire

---

## 4. Radius, Shadows, Spacing

### 4.1. Border Radius (Material 3 Scale)

Material 3 définit une **échelle de radius progressive** : 0→4px→8px→12px→16px→20px→full

```
Classe Tailwind  | Valeur | Utilisation
===========================================
rounded-xs       | 4px    | Inputs, petit composant
rounded-sm       | 8px    | Chips, badges, small buttons
rounded-md       | 12px   | Cartes de contenu, dialogues
rounded-lg       | 16px   | Dialogues, modals
rounded-xl       | 20px   | Boutons principaux, FAB
rounded-full     | 9999px | Totalement arrondi (avatar, chip circular)
```

**Exemples d'usage** :
```html
<!-- Petit input -->
<input class="rounded-xs">

<!-- Chip/badge -->
<span class="rounded-sm">Python</span>

<!-- Carte standard -->
<div class="bg-surface rounded-md shadow-level-1">...</div>

<!-- Bouton principal -->
<button class="bg-primary rounded-xl">Action</button>

<!-- Avatar -->
<img class="rounded-full w-10 h-10">
```

### 4.2. Elevation / Box Shadows (Material 3 Scale)

Material 3 utilise un **système d'élévation** pour créer profondeur. Plus l'élévation est élevée, plus l'ombre est prononcée.

```
Classe Tailwind | Élévation | Utilisation
=====================================================
shadow-level-0  | Aucun     | Éléments plats
shadow-level-1  | +1        | Cartes, surfaces élevées
shadow-level-2  | +2        | Menus, toasts
shadow-level-3  | +3        | Dialogues, drawers
shadow-level-4  | +4        | Modals floats
shadow-level-5  | +5        | Modals critiques, FAB

-- Aliases
shadow-sm       | = level-1 | Cartes basiques
shadow-md       | = level-2 | Modals, menus
shadow-lg       | = level-3 | Drawers surélevés
```

**Formule M3** (pour comprendre) :
```
Level 0: none
Level 1: 0 1px 3px 1px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)
Level 2: 0 3px 6px 3px rgba(0,0,0,0.15), 0 2px 4px 0 rgba(0,0,0,0.30)
...
```

**Exemples d'usage** :
```html
<!-- Carte standard -->
<div class="bg-surface rounded-md shadow-level-1">...</div>

<!-- Dialogue surélevé -->
<div class="bg-surface rounded-lg shadow-level-3">...</div>

<!-- Menu flottant -->
<div class="shadow-level-2">...</div>
```

### 4.3. Spacing Scale (Material 3 + Tailwind)

```
Classe Tailwind | Valeur | Utilisation
========================================
p-xs / gap-xs   | 4px    | Micro-spacing (petit composant)
p-sm / gap-sm   | 8px    | Padding internal, small gap
p-md / gap-md   | 12px   | Padding standard, medium gap
p-lg / gap-lg   | 16px   | Padding comfortable, large gap
p-xl / gap-xl   | 24px   | Padding section, generous gap
p-2xl / gap-2xl | 32px   | Padding entre sections majeures
```

**Patterns récurrents** :

| Élément | Padding recommandé | Exemple |
|---------|-------------------|---------|
| **Small Button** | `px-md py-sm` | `<button class="px-md py-sm">` |
| **Standard Button** | `px-lg py-md` | `<button class="px-lg py-md">` |
| **Large Button** | `px-xl py-lg` | `<button class="px-xl py-lg">` |
| **Card** | `p-lg` | `<div class="p-lg">` |
| **Modal/Dialogue** | `p-lg` | `<div class="p-lg">` |
| **Input** | `px-md py-sm` | `<input class="px-md py-sm">` |
| **Section padding** | `px-lg py-xl` | `<section class="px-lg py-xl">` |
| **Gap dans stack** | `space-y-md` ou `gap-md` | `<div class="space-y-md">` |

**Exemples d'usage** :
```html
<!-- Card avec padding standard -->
<div class="bg-surface p-lg rounded-md shadow-level-1">
  <h2 class="text-title-md mb-md">Titre</h2>
  <p class="text-body-md text-on-surface-variant">Contenu</p>
</div>

<!-- Grille avec espacement -->
<div class="grid grid-cols-2 gap-md">
  <div>Card 1</div>
  <div>Card 2</div>
</div>

<!-- Stack vertical -->
<div class="space-y-lg">
  <input class="px-md py-sm">
  <input class="px-md py-sm">
</div>
```

---

## 5. Composants de Référence (6-7 Composants Tailwind)

Chaque composant ci-dessous est **100% Tailwind**, respecte la palette M3, et peut être copié-collé directement dans ton projet.

---

### 5.1. PrimaryButton (Bouton principal)

**Rôle** : Bouton d'action principale, CTA (call-to-action), interactions dominantes.

**Variantes** : Regular, Small, Large, avec icône, loading, disabled.

```vue
<template>
  <button
    :class="[
      // Base
      'font-semibold rounded-xl transition active:scale-95',
      'flex items-center justify-center gap-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Taille
      sizeClasses[size],
      // Variant
      variantClasses[variant],
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="inline-block animate-spin">⌛</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'error' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

const sizeClasses = {
  sm: 'px-md py-sm text-label-md',
  md: 'px-lg py-md text-label-lg',
  lg: 'px-xl py-lg text-label-lg',
}

const variantClasses = {
  primary: 'bg-primary text-on-primary hover:bg-primary/90 shadow-level-1',
  secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90',
  error: 'bg-error text-on-error hover:bg-error/90 shadow-level-1',
  tertiary: 'bg-tertiary text-on-tertiary hover:bg-tertiary/90',
}
</script>
```

**Utilisation** :
```vue
<!-- Primary CTA -->
<PrimaryButton variant="primary" size="md">
  Commencer le quiz
</PrimaryButton>

<!-- Secondary action -->
<PrimaryButton variant="secondary">Annuler</PrimaryButton>

<!-- Danger action -->
<PrimaryButton variant="error">Supprimer</PrimaryButton>

<!-- Loading state -->
<PrimaryButton :loading="isSubmitting">Sauvegarder...</PrimaryButton>
```

---

### 5.2. Card (Conteneur Surface M3)

**Rôle** : Conteneur de contenu surface, cartes de liste, sections.

**Variantes** : Default (white surface), Light (surface-variant), Elevated.

```vue
<template>
  <div
    :class="[
      'rounded-md p-lg',
      variantClasses[variant],
      borderClass,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'light' | 'elevated' | 'tonal'
  border?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  border: true,
})

const variantClasses = {
  default: 'bg-surface text-on-surface shadow-level-1',
  light: 'bg-surface-variant text-on-surface',
  elevated: 'bg-surface text-on-surface shadow-level-3',
  tonal: 'bg-primary-container text-on-primary-container',
}

const borderClass = props.border ? 'border border-outline' : ''
</script>
```

**Utilisation** :
```vue
<!-- Carte standard -->
<Card>
  <h3 class="text-title-md mb-md">Score moyen</h3>
  <p class="text-body-md text-on-surface-variant">85%</p>
</Card>

<!-- Carte légère (surface-variant) -->
<Card variant="light">Contenu secondaire</Card>

<!-- Carte surélevée (avec shadow) -->
<Card variant="elevated">Important!</Card>

<!-- Carte tonale (info) -->
<Card variant="tonal">Info message</Card>
```

---

### 5.3. Modal / Dialog

**Rôle** : Dialogue modal, confirmations, formulaires.

**Structure** : Backdrop + Contenu centré + Actions.

```vue
<template>
  <div v-if="show" class="fixed inset-0 z-50">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <!-- Modal -->
    <div class="absolute inset-0 flex items-center justify-center p-lg">
      <div class="bg-surface text-on-surface rounded-lg shadow-level-4 w-full max-w-sm">
        <!-- Header -->
        <div class="p-lg border-b border-outline">
          <h2 class="text-title-lg">{{ title }}</h2>
          <p v-if="subtitle" class="text-body-md text-on-surface-variant mt-sm">
            {{ subtitle }}
          </p>
        </div>

        <!-- Body -->
        <div class="p-lg">
          <slot />
        </div>

        <!-- Actions -->
        <div class="p-lg border-t border-outline flex gap-md justify-end">
          <button
            @click="$emit('cancel')"
            class="px-lg py-md text-label-lg text-on-surface hover:bg-surface-variant rounded-lg transition"
          >
            Annuler
          </button>
          <button
            @click="$emit('confirm')"
            class="px-lg py-md text-label-lg bg-primary text-on-primary rounded-lg hover:bg-primary/90 shadow-level-1 transition"
          >
            {{ actionLabel || 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title: string
  subtitle?: string
  actionLabel?: string
}

defineProps<Props>()
defineEmits<{
  confirm: []
  cancel: []
}>()
</script>
```

**Utilisation** :
```vue
<Modal
  :show="showDialog"
  title="Confirmer l'action"
  subtitle="Êtes-vous sûr ?"
  actionLabel="Oui, continuer"
  @confirm="handleConfirm"
  @cancel="showDialog = false"
>
  <p class="text-body-md">Vous allez supprimer ce quiz.</p>
</Modal>
```

---

### 5.4. TextField / Input

**Rôle** : Champ de saisie texte, formulaires.

**Variantes** : Default, Error, Disabled, With label.

```vue
<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-label-md text-on-surface font-medium mb-sm">
      {{ label }}
    </label>

    <!-- Input -->
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        // Base
        'w-full px-md py-sm rounded-xs',
        'text-body-md text-on-surface',
        'placeholder-on-surface-variant',
        'transition',
        // Border & Focus
        'border border-outline',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
        // States
        error ? 'border-error bg-error-container/30' : '',
        disabled ? 'opacity-50 cursor-not-allowed bg-surface-variant' : '',
      ]"
    />

    <!-- Error message -->
    <p v-if="error" class="text-label-sm text-error mt-xs">
      {{ error }}
    </p>

    <!-- Helper text -->
    <p v-if="helperText && !error" class="text-label-sm text-on-surface-variant mt-xs">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  type?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
```

**Utilisation** :
```vue
<TextField
  v-model="category.label"
  label="Nom de la catégorie"
  placeholder="Ex: Python, React..."
  :error="errors.label"
  helperText="Le label doit être unique"
/>

<TextField
  v-model="email"
  type="email"
  label="Email"
  placeholder="user@example.com"
  :disabled="isLoading"
/>
```

---

### 5.5. ListItem / Row

**Rôle** : Élément d'une liste cliquable, avec icon, titre, sous-titre, actions.

**Variantes** : Default, Selected, Disabled, With avatar.

```vue
<template>
  <button
    @click="$emit('click')"
    :disabled="disabled"
    :class="[
      // Base
      'w-full px-lg py-md rounded-md transition',
      'flex items-center gap-md',
      'text-left text-on-surface',
      // States
      selected ? 'bg-primary/10 border-2 border-primary' : 'border border-outline hover:bg-surface-variant',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
  >
    <!-- Icon / Avatar -->
    <div
      v-if="icon || avatar"
      :class="[
        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
        iconBgClass,
      ]"
    >
      <img v-if="avatar" :src="avatar" :alt="title" class="w-full h-full rounded-full object-cover" />
      <span v-else-if="icon" class="text-lg">{{ icon }}</span>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p class="text-body-md font-medium truncate">{{ title }}</p>
      <p v-if="subtitle" class="text-body-sm text-on-surface-variant truncate">
        {{ subtitle }}
      </p>
    </div>

    <!-- Trailing action -->
    <div v-if="$slots.trailing" class="flex-shrink-0">
      <slot name="trailing" />
    </div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  icon?: string
  avatar?: string
  selected?: boolean
  disabled?: boolean
  iconBgClass?: string
}

withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false,
  iconBgClass: 'bg-primary-container text-primary',
})

defineEmits<{
  click: []
}>()
</script>
```

**Utilisation** :
```vue
<!-- Simple list item -->
<ListItem
  title="Python"
  subtitle="5 questions"
  @click="selectCategory('python')"
/>

<!-- With icon -->
<ListItem
  title="TypeScript"
  icon="⚙️"
  subtitle="Avancé"
  @click="selectCategory('ts')"
/>

<!-- Selected state -->
<ListItem
  title="React"
  :selected="selectedCat === 'react'"
  @click="selectCategory('react')"
/>

<!-- With trailing action -->
<ListItem title="Vue 3" subtitle="10 questions">
  <template #trailing>
    <button class="p-sm hover:bg-surface-variant rounded-lg">
      ⋮
    </button>
  </template>
</ListItem>
```

---

### 5.6. Chip / Badge

**Rôle** : Petit élément label, catégorie, filtre, tag.

**Variantes** : Default, Filled, Outlined, Success/Error.

```vue
<template>
  <button
    @click="$emit('click')"
    :class="[
      // Base
      'px-md py-sm rounded-sm text-label-sm font-medium',
      'inline-flex items-center gap-xs',
      'transition',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Variant
      variantClasses[variant],
    ]"
    :disabled="disabled"
  >
    <!-- Icon (optional) -->
    <span v-if="icon" class="text-sm">{{ icon }}</span>

    <!-- Label -->
    {{ label }}

    <!-- Removable (optional) -->
    <button
      v-if="removable"
      @click.stop="$emit('remove')"
      class="ml-xs hover:opacity-60 transition"
      type="button"
    >
      ✕
    </button>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label: string
  icon?: string
  variant?: 'filled' | 'outlined' | 'success' | 'error' | 'info'
  removable?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  removable: false,
  disabled: false,
})

const variantClasses = {
  filled: 'bg-primary-container text-on-primary-container hover:bg-primary-container/80',
  outlined: 'border border-outline text-on-surface hover:bg-surface-variant',
  success: 'bg-success/20 text-success font-semibold',
  error: 'bg-error/20 text-error font-semibold',
  info: 'bg-info/20 text-info font-semibold',
}

defineEmits<{
  click: []
  remove: []
}>()
</script>
```

**Utilisation** :
```vue
<!-- Simple chip -->
<Chip label="Python" variant="filled" @click="selectTag" />

<!-- With icon -->
<Chip label="React" icon="⚛️" variant="outlined" />

<!-- Removable (filter) -->
<div class="flex gap-sm flex-wrap">
  <Chip
    v-for="tag in selectedTags"
    :key="tag"
    :label="tag"
    removable
    @remove="removeTag(tag)"
  />
</div>

<!-- Status chips -->
<Chip label="✓ Complété" variant="success" />
<Chip label="✕ Échoué" variant="error" />
```

---

### 5.7. StatCard (KPI Display)

**Rôle** : Affichage de statique/métrique KPI, avec icon et valeur.

**Variantes** : Default, Large, Colored.

```vue
<template>
  <div
    :class="[
      // Base
      'bg-surface rounded-md p-lg',
      'border border-outline',
      'shadow-level-1',
      'flex flex-col items-center justify-center gap-md',
      'text-center',
    ]"
  >
    <!-- Icon -->
    <div
      v-if="icon"
      :class="[
        'text-3xl',
        iconColorClass,
      ]"
    >
      {{ icon }}
    </div>

    <!-- Label -->
    <p class="text-label-sm text-on-surface-variant uppercase font-semibold tracking-wide">
      {{ label }}
    </p>

    <!-- Value -->
    <div
      :class="[
        'text-3xl font-bold',
        valueColorClass,
      ]"
    >
      {{ value }}
    </div>

    <!-- Trend (optional) -->
    <p v-if="trend" :class="['text-label-md', trend.direction === 'up' ? 'text-success' : 'text-error']">
      {{ trend.direction === 'up' ? '↑' : '↓' }} {{ trend.percentage }}%
    </p>
  </div>
</template>

<script setup lang="ts">
interface Trend {
  direction: 'up' | 'down'
  percentage: number
}

interface Props {
  label: string
  value: string | number
  icon?: string
  trend?: Trend
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'default',
})

const iconColorClass = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  error: 'text-error',
  default: 'text-on-surface-variant',
}[props.color]

const valueColorClass = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  error: 'text-error',
  default: 'text-on-surface',
}[props.color]
</script>
```

**Utilisation** :
```vue
<!-- Score moyen -->
<StatCard
  label="Score moyen"
  value="85%"
  icon="📊"
  color="primary"
  :trend="{ direction: 'up', percentage: 12 }"
/>

<!-- Questions répondues -->
<StatCard
  label="Questions répondues"
  value="42"
  icon="✓"
  color="success"
/>

<!-- Best score -->
<StatCard
  label="Meilleur score"
  value="100%"
  icon="⭐"
  color="primary"
/>

<!-- Streak -->
<StatCard
  label="Streak actuelle"
  value="7 jours"
  icon="🔥"
  color="secondary"
/>
```

---

## 6. Instructions d'usage pour les futurs prompts IA

### 6.1. Principes à respecter

Chaque **nouveau composant** ou **modification** doit :

1. ✅ **Utiliser UNIQUEMENT les couleurs M3 définies** dans `tailwind.config.js`
   - `bg-primary`, `text-on-surface`, `border-outline`, etc.
   - Pas de couleurs arbitraires comme `bg-blue-500`

2. ✅ **Respecter l'échelle typographique**
   - Titres : `text-headline-lg`, `text-headline-md`, etc.
   - Corps : `text-body-md`, `text-body-sm`
   - Labels : `text-label-lg`, `text-label-md`

3. ✅ **Respecter les radius standards**
   - Inputs/chips : `rounded-xs`, `rounded-sm`
   - Cartes : `rounded-md`
   - Boutons/dialogues : `rounded-lg`, `rounded-xl`

4. ✅ **Utiliser l'échelle d'ombre (elevation)**
   - Cartes : `shadow-level-1`
   - Dialogues : `shadow-level-3`
   - Modals : `shadow-level-4`

5. ✅ **Utiliser l'échelle de spacing**
   - Padding interne : `p-md`, `p-lg`
   - Gaps : `gap-md`, `gap-lg`
   - Marges : `mb-md`, `mt-lg`

6. ✅ **Respecter les états**
   - Hover : `hover:opacity-90` ou variant du rôle
   - Focus : `focus:ring-2 focus:ring-primary`
   - Disabled : `disabled:opacity-50 disabled:cursor-not-allowed`
   - Active : `active:scale-95`

### 6.2. Exemple de prompt pour refactorer un composant

> **Prompt type** :
>
> "Voici mon `FormCategorie.vue` qui a besoin d'un refactoring Material Design 3.
>
> En utilisant le design system fourni (voir `DESIGN_SYSTEM_MATERIAL3_TAILWIND.md`), refactor ce composant pour respecter:
> - La palette M3 : utilise `bg-primary-container`, `text-on-primary-container`, `border-outline`
> - La typographie : les labels en `text-label-lg`, erreurs en `text-label-sm text-error`
> - Les radius : inputs en `rounded-xs`, boutons en `rounded-xl`
> - Le spacing : padding de form en `p-lg`, gaps en `gap-md`
> - Les ombres : cartes en `shadow-level-1`
>
> Suis strictement les patterns du composant `Card` et `TextField` définis dans le design system."

### 6.3. Processus de validation

Avant de soumettre un composant refactorisé, vérifie :

- [ ] Aucune couleur arbitraire (pas de `bg-red-500`, utilise `bg-error`)
- [ ] Typographie cohérente avec l'échelle M3
- [ ] Radius dans `{xs, sm, md, lg, xl, full}`
- [ ] Ombre en `shadow-level-{0,1,2,3,4,5}`
- [ ] Spacing avec `p-{xs,sm,md,lg,xl,2xl}`, `gap-{...}`, `space-y-{...}`
- [ ] États (hover, focus, active, disabled) présents
- [ ] Responsivité correcte (mobile-first)
- [ ] Accessibilité (labels, ARIA, contrast)

### 6.4. Ressources

- **Tailwind Config** : `/tailwind.config.js` — tous les tokens M3
- **Composants de référence** : Cette section (5.1 à 5.7)
- **Palette M3** : Section 2 de ce document
- **Typographie** : Section 3 de ce document
- **Spacing** : Section 4.3 de ce document

---

## 7. Checklist Cohérence Design System

Utilise cette checklist pour vérifier que tous les composants du projet respectent le design system :

### Audit Couleurs
- [ ] Tous les `bg-*` utilisent les rôles M3 (primary, secondary, surface, etc.)
- [ ] Pas de classes comme `bg-red-500`, `bg-blue-400` (→ utiliser error, primary, etc.)
- [ ] Les textes sur couleur utilisent le rôle `on-*` correspondant
- [ ] Les bordures utilisent `border-outline` ou `border-outline-variant`

### Audit Typographie
- [ ] Titres de page : `text-headline-lg` ou `text-display-*`
- [ ] Titres de section : `text-headline-md`
- [ ] Titres de card : `text-title-lg`
- [ ] Texte courant : `text-body-md` ou `text-body-lg`
- [ ] Labels petits : `text-label-md`, `text-label-sm`
- [ ] Pas de tailles arbitraires (`text-15px`, `text-17px`, etc.)

### Audit Radius
- [ ] Inputs : `rounded-xs` ou `rounded-sm`
- [ ] Cartes : `rounded-md`
- [ ] Boutons : `rounded-lg` ou `rounded-xl`
- [ ] Dialogs : `rounded-lg`
- [ ] Avatars : `rounded-full`

### Audit Ombres
- [ ] Cartes de contenu : `shadow-level-1` (ou `shadow-sm`)
- [ ] Menus, toasts : `shadow-level-2` (ou `shadow-md`)
- [ ] Dialogues, drawers : `shadow-level-3` (ou `shadow-lg`)
- [ ] Modals flottants : `shadow-level-4`
- [ ] Éléments plats : `shadow-level-0` (ou aucune ombre)

### Audit Spacing
- [ ] Padding de card : `p-lg`
- [ ] Padding de form : `p-lg`
- [ ] Gaps entre éléments : `gap-md` ou `gap-lg`
- [ ] Marges verticales : `space-y-md`, `space-y-lg`
- [ ] Padding de bouton : `px-md py-sm` ou `px-lg py-md`

---

## 8. Prochaines étapes

1. ✅ **Config Tailwind mise à jour** — Material 3 tokens prêts (Officiel Google M3)
2. ✅ **Composants de référence définis** — 7 composants clés
3. ✅ **Home.vue refactorisée** — Démontre l'application du design system avec palette officielle M3
4. 📝 **Refactorer progressivement** :
   - Commencer par les composants `common/` (BaseButton, BaseModal, TextField)
   - Puis les `layout/` (AppHeader, AppLayout)
   - Puis les domaines métier (quiz/, stats/, settings/)
5. 🎨 **Valider visuellement** — vérifier cohérence couleurs/typo/spacing (en développement local)
6. 📚 **Documenter les cas spéciaux** — patterns récurrents, exceptions

---

## Annexe A : Référence rapide des classes les plus utilisées

```
-- Couleurs (les plus importantes)
bg-primary, text-on-primary, bg-primary-container
bg-secondary, bg-secondary-container
bg-surface, text-on-surface, bg-surface-variant, text-on-surface-variant
bg-background, text-on-background
border-outline
bg-error, text-on-error, bg-error-container
bg-success, bg-warning, bg-info

-- Typographie (les plus courantes)
text-headline-lg, text-headline-md, text-headline-sm
text-title-lg, text-title-md
text-body-lg, text-body-md, text-body-sm
text-label-lg, text-label-md, text-label-sm

-- Radius
rounded-xs, rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-full

-- Ombres
shadow-level-1, shadow-level-2, shadow-level-3, shadow-level-4

-- Spacing (padding/gap/margin)
p-xs, p-sm, p-md, p-lg, p-xl, p-2xl
gap-xs, gap-sm, gap-md, gap-lg, gap-xl
space-y-sm, space-y-md, space-y-lg
```

---

## Annexe B : Migration depuis les anciennes palettes

### B.1. Migration depuis les couleurs arbitraires (Tailwind standard)

Si tu as des composants qui utilisent les couleurs Tailwind standards, remplace-les par les rôles M3 officiels :

| Ancienne classe Tailwind | Nouvelle classe M3 | Explication |
|-------------------------|-------------------|-------------|
| `bg-indigo-600` | `bg-primary` | Purple officiel (#6750A4) |
| `text-white` (sur primary) | `text-on-primary` | Blanc sur primary |
| `bg-slate-100` | `bg-surface-variant` | Surface légère |
| `text-slate-700` | `text-on-surface` | Texte principal |
| `text-slate-500` | `text-on-surface-variant` | Texte secondaire |
| `border-slate-200` | `border-outline-variant` | Bordure subtile |
| `border-slate-300` | `border-outline` | Bordure standard |
| `bg-slate-50` | `bg-background` | Fond global |
| `bg-red-500` | `bg-error` | Red officiel (#B3261E) |
| `bg-green-500` | `bg-success` | Vert Emerald |
| `bg-amber-600` | `bg-warning` | Ambre |
| `bg-blue-500` | `bg-info` | Bleu |
| `bg-emerald-600` | `bg-secondary` | Muted Purple secondary (#625B71) |
| `bg-amber-500` | `bg-tertiary` | Rose tertiary (#7D5260) |

### B.2. Utilisation des tonal variations

Le design system M3 inclut des niveaux tonals (10 à 100) pour chaque rôle de couleur. Si tu dois des variations subtiles d'une couleur, utilise :

```html
<!-- Variantes tonales du primary (Purple) -->
<div class="bg-primary-30">Très clair</div>
<div class="bg-primary-50">Clair</div>
<div class="bg-primary-100">Couleur base</div>

<!-- Variantes tonales du secondary (Muted Purple) -->
<span class="bg-secondary-30 text-secondary-100">Category badge</span>

<!-- Variantes tonales du tertiary (Rose) -->
<button class="bg-tertiary-30 text-tertiary-100">Tertiary action</button>
```

### B.3. Contrastes et accessibilité

Les variantes tonales sont calibrées pour garantir **contraste WCAG AA** :
- Sur `bg-*-30` → utilise `text-*-100` (contraste fort)
- Sur `bg-surface` → utilise `text-on-surface` ou `text-on-surface-variant`
- Sur `bg-*-container` → utilise `text-on-*-container`

Exemple dans Home.vue (m3ColorMap) :
```typescript
blue: { containerBg: 'bg-primary-30', text: 'text-primary-100' },
cyan: { containerBg: 'bg-secondary-30', text: 'text-secondary-100' },
```

---

**Version**: 1.1 (Official Google Material Design 3)
**Dernière mise à jour**: 2025-11-27
**Auteur**: Claude Code (Design System Generator)
**Stack**: Vue 3 + TypeScript + Tailwind CSS v4 + Material Design 3 (Official Google)
**M3 Palette Source**: https://m3.material.io/
