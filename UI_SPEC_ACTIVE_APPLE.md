# Spécification UI : Active (Apple Design System - Quiz en cours)

**Version:** 1.0
**Page:** `/quiz/active`
**Composant:** `src/views/quiz/Active.vue`
**Design System:** Apple Human Interface Guidelines (iOS/macOS)
**Aesthetic:** Premium, Minimaliste, Glassmorphism, Translucidité
**Importance:** 🔴 CRITIQUE - Interface principale de jeu
**Statut:** À implémenter

---

## 1. Objectif & Contexte

### Objectif principal
La page **Active** est l'interface de **quiz en cours**. L'utilisateur :
1. Lit la question (peut contenir du Markdown)
2. Voit 4 réponses mélangées aléatoirement
3. Sélectionne une réponse (tap sur bouton)
4. Voit le feedback (correct/incorrect)
5. Lit l'explication (optionnel, après réponse)
6. Passe à la question suivante (ou termine le quiz)

**C'est le cœur de l'expérience utilisateur.** Doit être fluide, claire, sans distraction.

### Action primaire attendue
- **Tap sur une réponse** → Enregistrer, afficher feedback, afficher explication
- **Tap "Suivant"** → Aller à la question suivante ou finir quiz
- **Tap "Passer"** → Sauter la question, incrémenter compteur, aller à la suivante

### Secondary actions
- **Tap back/close** → Abandon du quiz (confirmation modale)
- **Swipe left/right** (optionnel) → Navigation questions

### Feeling attendu
**Calme, focalisée, fluide.** Zéro distraction. L'utilisateur se concentre uniquement sur la question. Feedback immédiat et doux sur les réponses. Progression visible mais discrète (barre de progression en haut).

---

## 2. Structure & Layout (iOS/macOS Style)

### Vue générale

```
┌─────────────────────────────────┐
│ [Progress bar 25%]              │  ← Très mince, en haut, collée
├─────────────────────────────────┤
│                                 │
│ [Category & Difficulty badges]  │  ← Info question (petit, top)
│                                 │
│ [Question text (Markdown)]      │  ← Corps question (scrollable)
│                                 │
│ [4 answer buttons]              │  ← Réponses empilées
│                                 │
│ [Explication (si answered)]     │  ← Panel d'explication fluide
│                                 │
│ [Skip + Next buttons]           │  ← Actions en bas (stickies)
│                                 │
└─────────────────────────────────┘
```

### Progress Bar (Top)

**Position:** Absolument collée en haut, au-dessus de tout

**Spécifications:**
- Height: `h-1.5` (~6px, très mince)
- Width: Dynamique selon progression (25%, 50%, 75%, 100%)
- Background: `bg-blue-600` (système blue)
- Animation: Smooth width change `transition-all duration-300`
- No border, no shadow
- Z-index: `z-50` (toujours au-dessus)

```html
<div class="fixed top-0 left-0 h-1.5 bg-blue-600 transition-all duration-300 z-50"
     :style="{ width: progressPercent + '%' }"></div>
```

### Navigation Bar (Compact, translucide)

```
┌──────────────────────────────────┐
│ ← Quiz                        ✕ │
└──────────────────────────────────┘
```

**Spécifications:**
- Height: `h-14` (56px, compact)
- Background: `bg-white/80 backdrop-blur-xl border-b border-white/20` (glassmorphic)
- Padding: `px-6 py-4`
- Position: `sticky top-1.5` (juste sous progress bar)
- Z-index: `z-40` (sous progress bar)

**Contenu:**
1. **Back button (gauche):**
   - Icon: Phosphor "CaretLeft", weight='light', size=20
   - Color: `text-blue-600`
   - Tap: Ouvre modal "Abandonner quiz ?" (confirmation)

2. **Titre "Quiz" (centre):**
   - Text: "Quiz"
   - Classes: `text-base font-semibold text-slate-900`
   - Flex: `flex-1 text-center`

3. **Close button (droite):**
   - Icon: Phosphor "X", weight='light', size=20
   - Color: `text-slate-400`
   - Tap: Ouvre modal "Abandonner quiz ?"

### Body (Contenu scrollable)

**Container principal:**
- Classes: `px-6 py-6 space-y-6 pb-24`
- Padding: `px-6` (marge généreuse), `py-6` (top spacing après nav)
- Spacing: `space-y-6` (24px entre sections)
- Padding-bottom: `pb-24` (espace pour boutons stickies en bas)
- Scroll: Vertical scroll `overflow-y-auto` implicite

**Sections (dans l'ordre):**

1. **Question Info (Category + Difficulty badges)**
2. **Question Text (Markdown)**
3. **Answer Options (4 boutons)**
4. **Explanation Panel (optionnel, après réponse)**
5. **Action Buttons (Skip + Next, stickies en bas)**

---

## 3. Composants Apple Design (Détail Critique)

### 3.1 Progress Bar

**Composant Apple:** `Progress Indicator` (linear)

**Spécifications:**
```html
<div class="fixed top-0 left-0 h-1.5 bg-blue-600 transition-all duration-300 z-50"
     :style="{ width: progressPercent + '%' }"></div>
```

- Très mince, pas de rounded corners
- Couleur bleu système
- Animation douce au scroll
- Indique progression visuelle du quiz (question 2/10, question 5/10, etc.)

---

### 3.2 Question Info Section

**Composant Apple:** `Labels / Badges` en ligne

**Layout:**
```
TypeScript · Moyen
```

**Spécifications:**
```html
<div class="flex items-center gap-2 flex-wrap">
  <!-- Category Badge -->
  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
               bg-blue-100/60 text-blue-700 text-xs font-medium">
    <PhosphorIcon weight="light" size="14">Code</PhosphorIcon>
    TypeScript
  </span>

  <!-- Difficulty Badge -->
  <span class="inline-flex items-center px-3 py-1.5 rounded-full
               text-xs font-medium"
        :class="difficultyBadgeClass">
    Moyen
  </span>
</div>
```

**Spécifications:**

1. **Category badge:**
   - Background: `bg-blue-100/60` (bleu très clair, translucide)
   - Text: `text-blue-700` (bleu foncé)
   - Rounding: `rounded-full` (pilule)
   - Padding: `px-3 py-1.5` (petit)
   - Icon: Phosphor icon de la catégorie, light weight, size=14
   - Font: `text-xs font-medium`

2. **Difficulty badge:**
   - Dynamique selon difficulté
   - **Facile:** `bg-green-100/60 text-green-700`
   - **Moyen:** `bg-amber-100/60 text-amber-700`
   - **Difficile:** `bg-red-100/60 text-red-700`
   - **Random:** `bg-purple-100/60 text-purple-700`
   - Rounding: `rounded-full`
   - Padding: `px-3 py-1.5`
   - Font: `text-xs font-medium`

3. **Container:**
   - Flex: `flex items-center gap-2 flex-wrap`
   - Permet wrapping si trop long

---

### 3.3 Question Text Section

**Composant Apple:** `Label / Text` (dynamique Markdown)

**Layout:**
```
Qu'est-ce que TypeScript ?

TypeScript est un sur-ensemble de JavaScript qui ajoute une couche
de typage statique. Il aide à détecter les erreurs à la compilation
plutôt qu'à la runtime.
```

**Spécifications:**
```html
<div class="flex flex-col gap-3">
  <h2 class="text-2xl font-bold text-slate-900 leading-snug">
    <MarkdownText :text="currentQuestion.intitule" />
  </h2>
</div>
```

- **Titre:** `text-2xl font-bold text-slate-900 leading-snug`
- **Markdown rendering:** Via composant `MarkdownText`
  - Support: **bold**, *italic*, `code`, # headers, listes, liens
  - Pas d'ombres lourdes sur code blocks
  - Code inline: petit fond gris clair
- **Spacing:** `gap-3` avec autres éléments
- **Lisibilité:** `leading-snug` pour meilleure lecture

---

### 3.4 Answer Options Section

**Composant Apple:** `Interactive Buttons` avec états

**Layout (vertical stack):**
```
┌──────────────────────────────────┐
│  A) Réponse 1                    │  ← Non sélectionnée
├──────────────────────────────────┤
│  B) Réponse 2 ✓                  │  ← Sélectionnée + correcte
├──────────────────────────────────┤
│  C) Réponse 3 ✗                  │  ← Sélectionnée + incorrecte
├──────────────────────────────────┤
│  D) Réponse 4                    │  ← Non sélectionnée
└──────────────────────────────────┘
```

**Container:**
- Classes: `space-y-3`
- Gap: 12px entre réponses

**Button réponse:**

```html
<button @click="selectAnswer(answerIndex)"
        :disabled="hasAnswered"
        class="group w-full rounded-3xl p-4 border transition-all duration-200
               flex items-start gap-4"
        :class="getAnswerButtonClasses(answerIndex)">

  <!-- Answer Letter Badge -->
  <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              font-bold text-sm"
       :class="getAnswerBadgeClasses(answerIndex)">
    {{ String.fromCharCode(65 + answerIndex) }}
  </div>

  <!-- Answer Text -->
  <div class="flex-1 text-left">
    <p class="text-base font-medium">
      <MarkdownText :text="answer" />
    </p>
  </div>

  <!-- Feedback Icon (après réponse) -->
  <div class="flex-shrink-0 flex items-center justify-center"
       v-if="hasAnswered">
    <PhosphorIcon v-if="isCorrect"
                   weight="regular" size="24"
                   class="text-green-600">
      CheckCircle
    </PhosphorIcon>
    <PhosphorIcon v-else-if="!isCorrect"
                   weight="regular" size="24"
                   class="text-red-600">
      XCircle
    </PhosphorIcon>
  </div>
</button>
```

**Spécifications complètes:**

#### États de réponse

**État 1: Avant réponse (normal)**
- Classes: `border-gray-100/50 bg-white hover:bg-gray-50/50 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.05)]`
- Background: `bg-white`
- Border: `border-gray-100/50` (hairline)
- Shadow: Douce `shadow-[0_4px_12px_rgba(0,0,0,0.05)]`
- Hover: `hover:bg-gray-50/50` (teinte très légère) + shadow augmente
- Active: `active:scale-95` (feedback scale)
- Cursor: `cursor-pointer`

**État 2: Sélectionnée + Correcte**
- Classes: `border-green-200/50 bg-green-50/30 shadow-[0_4px_12px_rgba(16,185,129,0.08)]`
- Background: `bg-green-50/30` (très clair, translucide)
- Border: `border-green-200/50` (hairline verte)
- Shadow: Verte douce
- Icon: CheckCircle `text-green-600`
- Disabled: `disabled:opacity-75`

**État 3: Sélectionnée + Incorrecte**
- Classes: `border-red-200/50 bg-red-50/30 shadow-[0_4px_12px_rgba(239,68,68,0.08)]`
- Background: `bg-red-50/30`
- Border: `border-red-200/50`
- Shadow: Rouges douce
- Icon: XCircle `text-red-600`
- Disabled: `disabled:opacity-75`

**État 4: Non sélectionnée mais bonne réponse (après réponse)**
- Identique à État 1 mais avec teinte verte très légère si jamais l'utilisateur veut voir la réponse
- OU simplement État 1 (gris)

#### Contenu du bouton

1. **Answer Letter Badge:**
   - Container: `w-8 h-8 rounded-full flex items-center justify-center`
   - Content: "A", "B", "C", "D" (via `String.fromCharCode(65 + index)`)
   - Font: `font-bold text-sm`
   - Background (dynamique selon état):
     - **Normal:** `bg-blue-100/60 text-blue-700`
     - **Correcte:** `bg-green-100/60 text-green-700`
     - **Incorrecte:** `bg-red-100/60 text-red-700`
   - Flex-shrink: `flex-shrink-0` (taille constante)

2. **Answer Text:**
   - Container: `flex-1 text-left`
   - Text: `text-base font-medium text-slate-900`
   - Markdown support: Via MarkdownText
   - Can be multi-line

3. **Feedback Icon (après réponse):**
   - Visible seulement si `hasAnswered`
   - Correct: CheckCircle `text-green-600`
   - Incorrect: XCircle `text-red-600`
   - Size: 24px
   - Weight: regular
   - Flex-shrink: `flex-shrink-0`

#### Interactions

- **Tap avant réponse:** Sélectionne, enregistre, affiche feedback
- **Disabled après réponse:** `disabled:opacity-75 disabled:cursor-not-allowed`
- **Transition:** `transition-all duration-200` (smooth color/shadow change)
- **No multiselect:** Une seule réponse sélectionnée

---

### 3.5 Explanation Panel (Optionnel)

**Composant Apple:** `Text Panel` avec border fine

**Condition:** Affichée seulement si `hasAnswered && !skipped`

**Layout:**
```
┌─────────────────────────────────┐
│ 💡 Explication                  │
├─────────────────────────────────┤
│ TypeScript a été créé par        │
│ Microsoft en 2012 pour ajouter   │
│ une couche de typage à           │
│ JavaScript...                    │
└─────────────────────────────────┘
```

**Spécifications:**
```html
<div v-if="hasAnswered && !currentQuestion.estSkippe"
     class="rounded-3xl bg-blue-50/40 border border-blue-200/50
            p-4 space-y-2 animate-fade-in">

  <!-- Title -->
  <div class="flex items-center gap-2">
    <PhosphorIcon weight="regular" size="20" class="text-blue-600">
      Info
    </PhosphorIcon>
    <h4 class="font-semibold text-blue-900">Explication</h4>
  </div>

  <!-- Text -->
  <p class="text-sm text-blue-800 leading-relaxed">
    <MarkdownText :text="currentQuestion.explication" />
  </p>
</div>
```

**Spécifications complètes:**

- **Container:**
  - Rounding: `rounded-3xl` (~20px)
  - Background: `bg-blue-50/40` (très clair bleu, translucide)
  - Border: `border border-blue-200/50` (hairline bleue)
  - Padding: `p-4` (16px)
  - Spacing: `space-y-2` (8px entre titre et texte)

- **Titre:**
  - Icon: Phosphor "Info", weight='regular', size=20, color=`text-blue-600`
  - Text: "Explication", `font-semibold text-blue-900`
  - Flex: `flex items-center gap-2`

- **Texte:**
  - Classes: `text-sm text-blue-800 leading-relaxed`
  - Markdown support: Via MarkdownText
  - Multi-line support
  - Good contrast (AA+)

- **Animation:**
  - Classes: `animate-fade-in` (opacity 0 → 1, duration 300ms)

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
```

---

### 3.6 Action Buttons (Bottom, Sticky)

**Composant Apple:** `Buttons` en ligne fixe

**Position:** Sticky en bas, au-dessus du clavier (si présent)

**Layout:**
```
┌──────────────────────────────────┐
│ [Passer]  [Suivant]              │
└──────────────────────────────────┘
```

**Spécifications:**
```html
<div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl
            border-t border-white/20 px-6 py-4 flex gap-3">

  <!-- Skip Button (Secondary) -->
  <button @click="skipQuestion()"
          :disabled="hasAnswered"
          class="flex-1 rounded-full px-4 py-3 font-semibold
                 bg-gray-100 text-gray-700
                 hover:bg-gray-200 active:scale-95
                 transition-all duration-200
                 disabled:opacity-50">
    Passer
  </button>

  <!-- Next Button (Primary) -->
  <button @click="nextQuestion()"
          :disabled="!hasAnswered && !skipped"
          class="flex-1 rounded-full px-4 py-3 font-semibold
                 bg-blue-600 text-white
                 hover:bg-blue-700 active:scale-95
                 shadow-[0_4px_12px_rgba(37,99,235,0.3)]
                 transition-all duration-200
                 disabled:opacity-50">
    {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
  </button>
</div>
```

**Spécifications complètes:**

- **Container wrapper:**
  - Position: `fixed bottom-0 left-0 right-0` (sticky en bas)
  - Background: `bg-white/80 backdrop-blur-xl border-t border-white/20` (glassmorphic)
  - Padding: `px-6 py-4` (24px horizontal, 16px vertical)
  - Z-index: `z-30` (au-dessus du contenu, sous nav)
  - Flex: `flex gap-3` (deux boutons côte à côte, 12px gap)

- **Skip Button (Secondary):**
  - Type: Secondary Button
  - Classes: `flex-1 rounded-full px-4 py-3 font-semibold`
  - Background: `bg-gray-100 text-gray-700`
  - Hover: `hover:bg-gray-200`
  - Active: `active:scale-95`
  - Disabled: `disabled:opacity-50` (si réponse sélectionnée)
  - Transition: `transition-all duration-200`
  - Click: `skipQuestion()` → Saute la question, va à la suivante

- **Next Button (Primary):**
  - Type: Primary Button (système blue)
  - Classes: `flex-1 rounded-full px-4 py-3 font-semibold`
  - Background: `bg-blue-600 text-white`
  - Hover: `hover:bg-blue-700`
  - Active: `active:scale-95`
  - Shadow: `shadow-[0_4px_12px_rgba(37,99,235,0.3)]` (douce bleue)
  - Disabled: `disabled:opacity-50` (si pas encore répondu/passé)
  - Transition: `transition-all duration-200`
  - Dynamic label: "Suivant" ou "Terminer" (si last question)
  - Click: `nextQuestion()` → Va à la question suivante ou termine quiz

---

## 4. Palette & Couleurs Sémantiques (Apple System)

### Couleurs principales

| Utilisation | Variable | Valeur | Explication |
|-------------|----------|--------|-------------|
| **Progress bar** | `bg-blue-600` | #2563EB | Système blue |
| **Text primaire** | `text-slate-900` | #0F172A | Presque noir |
| **Text secondaire** | `text-slate-500` | #64748B | Gris moyen |
| **Text tertiaire** | `text-slate-400` | #94A3B8 | Gris clair |
| **Accent (Links)** | `text-blue-600` | #2563EB | Bleu système |
| **Success (Correct)** | `text-green-600` | #16A34A | Vert menthe |
| **Error (Incorrect)** | `text-red-600` | #DC2626 | Rouge corail |
| **Backgrounds** | `bg-white` | #FFFFFF | Pur blanc |
| **Backgrounds-bg** | `bg-slate-50` | #F8F8F8 | Gris très clair |
| **Borders/Separators** | `border-gray-100/50` | Hairline | Ultra fine |
| **Glass background** | `bg-white/80` | rgba(255,255,255,0.8) | Translucide + blur |

### Couleurs Difficulté (dans les badges)

- **Facile:** `bg-green-100/60 text-green-700`
- **Moyen:** `bg-amber-100/60 text-amber-700`
- **Difficile:** `bg-red-100/60 text-red-700`
- **Random:** `bg-purple-100/60 text-purple-700`

### Shadows (Apple style)

```css
/* Subtle (buttons, cards) */
shadow-[0_4px_12px_rgba(0,0,0,0.05)]

/* Blue glow (primary button) */
shadow-[0_4px_12px_rgba(37,99,235,0.3)]

/* Green glow (correct answer) */
shadow-[0_4px_12px_rgba(16,185,129,0.08)]

/* Red glow (incorrect answer) */
shadow-[0_4px_12px_rgba(239,68,68,0.08)]
```

---

## 5. Contenu & Données

### Données dynamiques

| Item | Source | Type | Exemple |
|------|--------|------|---------|
| **Question text** | `currentQuestion.intitule` | string (Markdown) | "Qu'est-ce que TypeScript ?" |
| **Reponses** | `currentQuestion.reponses` | string[] (4 items) | ["Un langage", "Une lib", ...] |
| **Ordre réponses** | `currentQuestion.ordreReponses` | number[] (shuffled) | [2, 0, 3, 1] |
| **Bonne réponse index** | `currentQuestion.indexBonneReponse` | number (0-3) | 0 |
| **Explication** | `currentQuestion.explication` | string (Markdown) | "TypeScript a été créé par..." |
| **Catégorie** | `currentQuestion.categorie` | string | "TypeScript" |
| **Difficulté** | `currentQuestion.difficulte` | "facile" \| "moyen" \| "difficile" | "moyen" |
| **Question number** | `currentQuestionIndex + 1` | number | 3 (question 3/10) |
| **Total questions** | `activeSession.nbQuestions` | number | 10 |
| **Progress percent** | `progressPercent` | number (0-100) | 25 |
| **Réponse sélectionnée** | `selectedAnswerIndex` | number \| null | 1 |
| **État répondu** | `hasAnswered` | boolean | true/false |
| **État passé** | `estSkippe` | boolean | true/false |
| **Last question** | `isLastQuestion` | computed boolean | true/false |

### Icônes Phosphor

| Localisation | Icône | Weight | Size | Color |
|-------------|-------|--------|------|-------|
| **Nav back** | CaretLeft | light | 20 | blue-600 |
| **Nav close** | X | light | 20 | slate-400 |
| **Category badge** | Dynamique (Code, Rocket, etc.) | light | 14 | category-color |
| **Answer correct** | CheckCircle | regular | 24 | green-600 |
| **Answer incorrect** | XCircle | regular | 24 | red-600 |
| **Explication** | Info | regular | 20 | blue-600 |
| **Emoji** | (emoji texte, pas icône) | N/A | N/A | N/A |

---

## 6. États & Interactions (Physique Apple)

### 6.1 États principaux

#### **État 1: Avant réponse**
- Utilisateur lit la question
- 4 réponses affichées normalement (bg blanc)
- Skip button activé
- Next button désactivé
- Pas d'explication
- No feedback icons

#### **État 2: Réponse sélectionnée**
```
User tap sur réponse → Enregistrement immédiat
```
- Réponse cliquée change de couleur
- Background change selon correct/incorrect
- Feedback icons apparaissent
- Explication apparaît (fade in animation)
- Skip button désactivé
- Next button activé
- All answers désactivés (disabled)

#### **État 3: Explication affichée**
- Explication panel visible
- Fade-in animation (opacity 0 → 1, 300ms)
- User peut lire l'explication
- Boutons prêts pour action suivante

#### **État 4: Question suivante prête**
- User tap "Suivant"
- Réinitialisation de tous les états
- Nouvelle question chargée
- Progress bar augmente
- Animation slide (optionnel)

#### **État 5: Dernière question terminée**
- Réponse donnée
- Explication affichée
- Bouton "Suivant" change en "Terminer"
- Tap "Terminer" → Quiz terminé, vers `/quiz/summary`

### 6.2 Interactions & Feedback (Timing)

#### **Tap sur réponse (avant réponse)**

```typescript
function selectAnswer(answerIndex: number) {
  selectedAnswerIndex.value = answerIndex
  hasAnswered.value = true

  // Enregistrer en DB
  submitAnswer(answerIndex)

  // Feedback immédiat : changement de couleur instantané
  // Explication fade-in après 300ms (optionnel)
}
```

**Feedback visuel:**
- Instant: Couleur de réponse change (correct → green, incorrect → red)
- Feedback icon apparaît
- Explication fade-in avec `duration-300`
- Sound (optionnel): Soft beep

#### **Tap skip (avant réponse)**

```typescript
function skipQuestion() {
  currentQuestion.estSkippe = true
  hasAnswered.value = true
  skipQuestion() // Mark as skipped

  // No explication shown
  // Next button becomes enabled
}
```

**Feedback:**
- Bouton "Passer" change d'état (disabled opacity)
- Next button devient activé

#### **Tap next/terminer (après réponse)**

```typescript
function nextQuestion() {
  if (isLastQuestion) {
    finishQuiz()
    router.push('/quiz/summary')
  } else {
    nextQuestion()
    // Reset states
    selectedAnswerIndex = null
    hasAnswered = false
  }
}
```

**Feedback:**
- Transition slide (optionnel): Page sorts à gauche, nouvelle page entre à droite
- Progress bar augmente doucement
- Nouvelle question chargée

#### **Tap back/close (abandon)**

```typescript
function abandonQuiz() {
  // Ouvre modal confirmation
  showAbandonModal = true
}

function confirmAbandon() {
  sessionRepository.delete(sessionId)
  router.push('/home')
}
```

**Modal confirmation:**
- Title: "Abandonner le quiz ?"
- Text: "Tu perdras ta progression..."
- Buttons: "Continuer" (secondaire), "Abandonner" (rouge danger)

### 6.3 Transitions & Animations

#### **Page Entry (première question)**
- Fade in: opacity 0 → 1, duration-300
- Slide from right: translateX(10) → translateX(0)

#### **Page Exit (dernière question)**
- Slide to left: translateX(0) → translateX(-10)
- Fade out: opacity 1 → 0

#### **Explication Fade-In**
- Keyframe animation: translateY(4px) + opacity 0 → 0px + opacity 1
- Duration: 300ms
- Easing: ease-out

#### **Progress Bar Animation**
- Width change smooth: transition-all duration-300
- Appears instantaneous but smooth visually

#### **Button Feedback (Active)**
- Scale down: scale(1) → scale(0.95)
- Duration: 200ms
- Easing: ease-out (spring-like)

---

## 7. Empty/Error/Loading States

### Loading State

**Condition:** Lors du chargement initial de la session ou si DB lente

```html
<div v-if="isLoading" class="fixed inset-0 flex items-center justify-center">
  <LoadingSpinner />
</div>
```

- Spinner centré
- Background transparent (content visible derrière)
- Z-index: z-50

### Error State

**Condition:** Si création session échouée ou question manquante

```html
<div v-if="error" class="px-6 py-4 space-y-3">
  <div class="rounded-3xl bg-red-50/40 border border-red-200/50 p-4">
    <h3 class="font-semibold text-red-900">Erreur</h3>
    <p class="text-sm text-red-800">{{ error }}</p>
    <button @click="retry" class="mt-3 text-blue-600 font-medium">
      Réessayer
    </button>
  </div>
</div>
```

- Alert panel rouge clair
- Message clair
- Bouton "Réessayer" ou "Retourner à l'accueil"

### No Session State

**Condition:** Utilisateur navigue directement à `/quiz/active` sans session

```javascript
if (!activeSession.value) {
  router.push('/home')
}
```

- Redirection automatique vers `/home`

---

## 8. Safe Areas & Responsive

### Mobile (default)

- Full width, max available height
- Safe areas: `px-6` (horizontal padding pour notch, Dynamic Island)
- Bottom safe area: `pb-24` pour action buttons (stickies)

### iPad/Landscape

- Max width optionnel: `max-w-2xl mx-auto`
- Question larger: `text-3xl` au lieu de `text-2xl`
- Answer buttons: Peut passer 2 colonnes (optionnel)
- More breathing room

### Safe Areas iOS

- Utilisées implicitement via Tailwind safe area classes (si définies)
- Progress bar, nav, buttons: padding automatiquement
- Contenu: pas de chevauchement avec notch

---

## 9. Checklist de validation

### Structure

- [ ] Progress bar au top (h-1.5, fixed)
- [ ] Navigation bar sticky (glassmorphic)
- [ ] Back button + close button dans nav
- [ ] Body scrollable (px-6, py-6, pb-24)
- [ ] Action buttons sticky en bas

### Question Section

- [ ] Category + Difficulty badges affichées
- [ ] Question text avec Markdown rendering
- [ ] Lisibilité bonne (text-2xl, leading-snug)

### Answer Options

- [ ] 4 réponses affichées (ordonnées aléatoirement)
- [ ] Answer letter badges (A, B, C, D)
- [ ] Réponses fullwidth (w-full)
- [ ] Border hairline (border-gray-100/50)
- [ ] Hover: bg-gray-50/50, shadow augmente
- [ ] Active: scale-95 feedback
- [ ] Après réponse: couleur change (green/red)
- [ ] Après réponse: icons CheckCircle/XCircle apparaissent
- [ ] Disabled après réponse

### Explanation Panel

- [ ] Affichée seulement après réponse
- [ ] Fade-in animation (duration-300)
- [ ] Blue background translucide
- [ ] Hairline border bleu
- [ ] Icon Info + "Explication" titre
- [ ] Text Markdown support
- [ ] Good contrast (blue-800 text)

### Action Buttons

- [ ] Sticky en bas (fixed bottom-0)
- [ ] Glassmorphic background
- [ ] Skip button (secondaire, gray)
- [ ] Next button (primaire, blue)
- [ ] Label change: "Suivant" → "Terminer" (last question)
- [ ] Skip disabled après réponse
- [ ] Next enabled après réponse/skip
- [ ] Active: scale-95 feedback
- [ ] Transitions smooth (duration-200)

### Colors & Styling

- [ ] Text contrast AA+ (black on white, etc.)
- [ ] No hard drop shadows (Apple style)
- [ ] Hairlines pour borders
- [ ] Soft shadows pour elevation
- [ ] Glassmorphism correct (80% opacity + blur)
- [ ] Difficulty colors correct (green, amber, red, purple)
- [ ] Success green (#16A34A)
- [ ] Error red (#DC2626)
- [ ] Accent blue (#2563EB)

### Interactions

- [ ] Tap réponse → feedback immédiat
- [ ] Tap skip → question sautée
- [ ] Tap next → question suivante (ou terminer)
- [ ] Tap back/close → confirmation modal
- [ ] Transitions fluides (duration-200/300)
- [ ] No lag or jank
- [ ] Loading state affichée si nécessaire
- [ ] Error state affichée si nécessaire

### Responsive

- [ ] Works on iPhone (small)
- [ ] Works on iPad (large)
- [ ] Works on landscape
- [ ] Safe areas respectées
- [ ] Buttons accessible (taille min 44x44px)
- [ ] Text readable on small screens

### Accessibility

- [ ] Text contrast WCAG AA+
- [ ] Buttons have clear labels
- [ ] Icons have aria-label (Phosphor handle)
- [ ] Focus states visible (optionnel ring-2)
- [ ] No keyboard traps
- [ ] Semantic HTML (button, not div)

---

## 10. Notes pour développeur

### Vue.js Implementation

```vue
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore'
import { useStatsStore } from '@/stores/useStatsStore'
import QuestionCard from '@/components/quiz/QuestionCard.vue'
import ProgressBar from '@/components/quiz/ProgressBar.vue'

const router = useRouter()
const quizStore = useQuizStore()
const statsStore = useStatsStore()

const selectedAnswerIndex = ref<number | null>(null)
const hasAnswered = ref(false)

const currentQuestion = computed(() => quizStore.currentQuestion)
const currentQuestionIndex = computed(() => quizStore.currentQuestionIndex)
const progressPercent = computed(() => quizStore.progressPercent)
const isLastQuestion = computed(() => quizStore.isLastQuestion)
const isQuizFinished = computed(() => quizStore.isQuizFinished)

onMounted(async () => {
  if (!quizStore.activeSession) {
    router.push('/home')
  }
})

watch(() => quizStore.currentQuestionIndex, () => {
  selectedAnswerIndex.value = null
  hasAnswered.value = false
})

async function selectAnswer(index: number) {
  if (hasAnswered.value) return

  selectedAnswerIndex.value = index
  hasAnswered.value = true

  await quizStore.submitAnswer(index)
}

function skipQuestion() {
  quizStore.skipQuestion()
}

async function nextQuestion() {
  await quizStore.nextQuestion()
}

function abandonQuiz() {
  // Show confirmation modal
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Progress Bar -->
    <ProgressBar :progress="progressPercent" />

    <!-- Navigation Bar -->
    <nav class="sticky top-1.5 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20">
      <div class="px-6 py-4 flex items-center justify-between">
        <button @click="abandonQuiz" class="text-blue-600 hover:text-blue-700">
          <PhosphorIcon weight="light" size="20">CaretLeft</PhosphorIcon>
        </button>
        <h1 class="text-base font-semibold text-slate-900">Quiz</h1>
        <button @click="abandonQuiz" class="text-slate-400 hover:text-slate-600">
          <PhosphorIcon weight="light" size="20">X</PhosphorIcon>
        </button>
      </div>
    </nav>

    <!-- Content -->
    <main class="px-6 py-6 space-y-6 pb-24">
      <!-- Question Card -->
      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :question-number="currentQuestionIndex + 1"
        :total-questions="quizStore.activeSession!.nbQuestions"
        :selected-answer-index="selectedAnswerIndex"
        :has-answered="hasAnswered"
        @answer-selected="selectAnswer"
      />
    </main>

    <!-- Action Buttons -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20 px-6 py-4 flex gap-3 z-30">
      <button @click="skipQuestion"
              :disabled="hasAnswered"
              class="flex-1 rounded-full px-4 py-3 font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition-all duration-200 disabled:opacity-50">
        Passer
      </button>
      <button @click="nextQuestion"
              :disabled="!hasAnswered"
              class="flex-1 rounded-full px-4 py-3 font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all duration-200 disabled:opacity-50">
        {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
      </button>
    </div>
  </div>
</template>
```

### Performance Considerations

- Pas de lazy loading critique (question déjà en mémoire)
- Markdown parsing: delegué à composant MarkdownText (cached)
- Animations: hardware-accelerated (transform, opacity)
- Minimal re-renders: computed properties + watchers

### Accessibility Enhancements

```vue
<!-- Add ARIA labels where needed -->
<button
  :aria-label="`Sélectionner réponse ${answerLabel}`"
  :aria-pressed="isSelected"
  @click="selectAnswer">
  {{ answerText }}
</button>
```

### Browser Compatibility

- Glassmorphism: Works on modern browsers (iOS 15+, Chrome 76+)
- Backdrop-blur: Fallback à background opaque si non supporté
- Smooth animations: Use `prefers-reduced-motion` if needed

### Testing

- Unit tests:
  - selectAnswer() enregistre correctement
  - skipQuestion() marque question comme skipped
  - nextQuestion() avance ou termine
  - abandonQuiz() affiche confirmation

- E2E tests:
  - Parcours complet: question → réponse → suivant → quiz terminé
  - Tap back → confirmation modal
  - Keyboard navigation (optionnel)

---

## 11. Ressources & Références

- **Apple HIG:** https://developer.apple.com/design/human-interface-guidelines/
- **Phosphor Icons:** https://phosphoricons.com/
- **Glassmorphism:** https://www.uxdesigninstitute.com/blog/glassmorphism/
- **Tailwind CSS v4:** https://tailwindcss.com/
- **Vue 3 Composition:** https://vuejs.org/guide/introduction.html
- **Markdown rendering:** marked.js (https://marked.js.org/)

---

**Version:** 1.0 | **Design System:** Apple HIG | **Aesthetic:** Premium Minimaliste Glassmorphism | **Importance:** 🔴 CRITIQUE | **Statut:** Prêt pour implémentation
