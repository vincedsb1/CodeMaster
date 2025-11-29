# Spécification UI : Statistics Dashboard (📈 Stats)

**Route:** `/stats`
**Composant:** `src/views/stats/Index.vue`

---

## 1. Objectif & Contexte

### Quel est le but principal de cette page ?

La page **Statistics Dashboard** affiche un **résumé complet des performances de l'utilisateur** avec:
- 4 KPI cards (Moyenne, Meilleur Score, Streak Actuel, Total Quizzes)
- 1 graphique d'évolution 30 jours (Chart.js)
- 1 grille de badges (6 achievements: unlocked/locked)

**Contexte:** Accessible depuis le **AppHeader** (icône stats avec badge du nombre de nouveaux badges) ou depuis le menu de navigation. C'est une page de **synthèse et de motivation**, permettant à l'utilisateur de voir son progrès au fil du temps.

### Quelle est l'action principale attendue ?

**Action Primaire:** Consulter les statistiques de performance (lecture seule, aucune action modifiante).

**Action Secondaire:** Cliquer sur un badge pour voir les détails de déblocage (modal ou alert).

**Navigation:**
- **Back:** Retour à la page précédente (Home ou depuis AppHeader)
- **Next:** Aucune navigation directe, sauf via Home ou AppHeader

---

## 2. Structure & Layout (iOS/macOS Style)

### 2.1 Navigation Bar (Large Title Style)

**Sticky en haut** avec titre + icônes de navigation:

```
┌─────────────────────────────────────────────┐
│  ← Statistiques                      🏠     │
└─────────────────────────────────────────────┘
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
    <h1 class="text-lg font-semibold text-slate-900">Statistiques</h1>

    <!-- Home Button -->
    <button @click="goHome" class="p-2 rounded-full hover:bg-slate-100/50 active:scale-95 transition">
      <i class="ph ph-house text-slate-900 text-xl"></i>
    </button>
  </div>
</div>
```

**Caractéristiques:**
- `bg-white/80 backdrop-blur-xl` (Glassmorphic)
- `border-b border-white/20` (Hairline subtle)
- `sticky top-0 z-50`
- `px-6 py-4` (Marges généreuses)

### 2.2 Corps Principal (Scrollable Content)

**Layout Vertical (single column):**

```
┌─────────────────────────────────────┐
│    [Sticky Navigation Bar]          │ ← top-0, z-50
├─────────────────────────────────────┤
│                                     │
│    [1. KPI Cards Section]           │ ← 2-column grid
│    ┌─────────┬─────────┐            │
│    │ Moyenne │ Meilleur│            │
│    ├─────────┼─────────┤            │
│    │ Streak  │  Total  │            │
│    └─────────┴─────────┘            │
│                                     │
│    [2. Evolution Chart Section]     │ ← 30-day trend
│    ┌─────────────────────────┐      │
│    │     [Line Chart]        │      │
│    └─────────────────────────┘      │
│                                     │
│    [3. Badges Section]              │ ← 3-column grid
│    ┌────┬────┬────┐                 │
│    │ B1 │ B2 │ B3 │                 │
│    ├────┼────┼────┤                 │
│    │ B4 │ B5 │ B6 │                 │
│    └────┴────┴────┘                 │
│                                     │
└─────────────────────────────────────┘
```

**Dimensions:**
- Max-width: `max-w-2xl` (896px)
- Padding horizontal: `px-6` (24px)
- Padding top: `pt-20` (compenser nav bar sticky)
- Padding bottom: `pb-12` (espace libre en bas)
- Spacing vertical: `space-y-6` (aération généreuse)

### 2.3 Safe Areas

- **Top:** Navigation bar + status bar (~80px)
- **Bottom:** Aucune bar fixe (scroll libre jusqu'au bout)
- Content scrolls underneath sticky nav (blur effect)

---

## 3. Composants Apple Design (Détail Critique)

### 3.1 KPI Cards (Metriques de Performance)

**2-Column Grid Layout:**

```
┌──────────────────┬──────────────────┐
│     Moyenne      │   Meilleur Score │
│       85%        │        92%       │
└──────────────────┴──────────────────┘

┌──────────────────┬──────────────────┐
│   Streak Actuel  │   Total Quizzes  │
│       🔥 7j      │        24        │
└──────────────────┴──────────────────┘
```

**Implémentation Vue:**

```vue
<div class="grid grid-cols-2 gap-3">
  <StatCard
    label="Moyenne"
    :value="`${Math.round(statsStore.globalStats.moyenneGlobale)}%`"
    color="primary"
  />
  <StatCard
    label="Meilleur Score"
    :value="`${Math.round(statsStore.globalStats.meilleurScore)}%`"
    color="green"
  />
  <StatCard
    label="Streak Actuel"
    :value="`${statsStore.globalStats.streakActuel}j`"
    icon="ph-fire"
    color="orange"
  />
  <StatCard
    label="Quiz Totaux"
    :value="statsStore.globalStats.totalSessions"
    color="slate"
  />
</div>
```

**Styling de chaque Card:**

```html
<div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-4
            flex flex-col items-center justify-center gap-2 min-h-[140px]
            shadow-[0_4px_12px_rgba(0,0,0,0.05)]">

  <!-- Label (uppercase, petit) -->
  <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
    {{ label }}
  </div>

  <!-- Value (grand, coloré) -->
  <div class="text-3xl font-bold flex items-center gap-1" :class="colorClasses[color]">
    <i v-if="icon" :class="['ph', icon]"></i>
    {{ value }}
  </div>
</div>
```

**Styles des Cards:**
- Shape: `rounded-3xl` (20px radius)
- Background: `bg-white/50 backdrop-blur-sm` (Translucent + blur)
- Border: `border border-gray-100/50` (Hairline ultra-fine)
- Padding: `p-4` (16px, généreux)
- Shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.05)]` (Very soft)
- Min height: `min-h-[140px]` (Vertical centering)

**Variantes Couleur:**

| KPI | Color Class | Hex | Icon |
|-----|-------------|-----|------|
| Moyenne | `text-blue-600` | #2563EB | none |
| Meilleur | `text-green-600` | #16A34A | none |
| Streak | `text-orange-600` | #EA580C | `ph-fire` 🔥 |
| Total | `text-slate-700` | #334155 | none |

### 3.2 Evolution Chart (30-Day Trend)

**Container:**

```html
<div class="rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100/50 p-6 space-y-4">

  <!-- Title -->
  <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide">
    Évolution (30 derniers jours)
  </h2>

  <!-- Chart Canvas -->
  <div class="w-full h-48 bg-gradient-to-b from-blue-50/20 to-transparent rounded-2xl p-4">
    <canvas id="evolutionChart" style="height: 100%; width: 100%"></canvas>
  </div>

  <!-- Empty State (si pas assez de données) -->
  <div v-if="sessions.length === 0" class="text-center py-6">
    <p class="text-sm text-slate-500">
      Pas encore assez de données. Complétez un quiz! 📊
    </p>
  </div>
</div>
```

**Chart.js Configuration (Apple Style):**

```javascript
{
  type: 'line',
  data: {
    labels: labels,  // ['01-15', '01-16', ..., '02-14']
    datasets: [{
      label: 'Score Moyen (%)',
      data: points,

      // Line styling
      borderColor: '#2563EB',                    // Blue-600
      borderWidth: 3,
      fill: true,
      backgroundColor: 'rgba(37, 99, 235, 0.08)',  // Soft blue tint
      tension: 0.4,                              // Smooth curve
      pointRadius: 0,                            // Hide points
      pointHoverRadius: 6,
      pointBackgroundColor: '#2563EB',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#94a3b8', font: { size: 11 } }
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#94a3b8', font: { size: 11 }, stepSize: 20 },
        grid: { color: 'rgba(148, 163, 184, 0.1)', drawBorder: false }
      }
    }
  }
}
```

**Caractéristiques:**
- Courbe lisse (`tension: 0.4`)
- Points cachés par défaut, visibles au hover
- Grille très subtile (gridlines à peine visibles)
- Tooltip au clic/hover
- Pas de drop shadow lourd (Apple style)

### 3.3 Badges Grid (Achievements)

**3-Column Grid:**

```
┌──────────┬──────────┬──────────┐
│  Badge 1 │  Badge 2 │  Badge 3 │
├──────────┼──────────┼──────────┤
│  Badge 4 │  Badge 5 │  Badge 6 │
└──────────┴──────────┴──────────┘
```

**Badge Item (Unlocked):**

```html
<button
  v-for="badge in badges"
  :key="badge.id"
  @click="showBadgeDetails(badge)"
  class="aspect-square rounded-2xl p-3 flex flex-col items-center justify-center text-center
         border transition-all duration-200 active:scale-95"
  :class="badge.statut === 'debloque'
    ? 'bg-white/60 backdrop-blur-sm border-yellow-200/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]'
    : 'bg-slate-100/50 border-slate-200/50 opacity-50 grayscale'"
>
  <!-- Badge Icon (Emoji) -->
  <div class="text-3xl mb-1.5">{{ badge.icon }}</div>

  <!-- Badge Name -->
  <div class="text-[11px] font-semibold text-slate-900 leading-snug line-clamp-2">
    {{ badge.nom }}
  </div>

  <!-- Lock Indicator (for locked) -->
  <div v-if="badge.statut === 'verrouille'" class="absolute top-1 right-1">
    <i class="ph ph-lock text-slate-400 text-lg"></i>
  </div>
</button>
```

**Badge Unlocked Style:**
- Background: `bg-white/60 backdrop-blur-sm`
- Border: `border-yellow-200/50` (Gold accent)
- Shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.05)]`
- Hover: Enhanced shadow `shadow-[0_6px_16px_rgba(0,0,0,0.08)]`
- Cursor: `pointer`
- Opacity: 100%
- Grayscale: None (colors visible)

**Badge Locked Style:**
- Background: `bg-slate-100/50`
- Border: `border-slate-200/50`
- Shadow: None
- Cursor: `default`
- Opacity: `opacity-50`
- Grayscale: `grayscale` (desaturated)
- Icon: Lock `ph-lock` top-right corner

**Grid Configuration:**
- Columns: `grid-cols-3` (3 badges par ligne)
- Gap: `gap-3` (12px between)
- Aspect Ratio: `aspect-square` (carrés parfaits)

---

## 4. Palette & Couleurs Sémantiques

### 4.1 Système Colors (Apple)

```css
/* Primary Accent */
--system-blue: #007AFF;        /* Stats badge main color */

/* Secondary Accents (KPI) */
--system-green: #34C759;        /* Best Score */
--system-orange: #FF9500;       /* Streak (fire emoji) */
--system-red: #FF3B30;          /* Error states */

/* Backgrounds */
--system-white: #FFFFFF;
--system-gray: #F2F2F7;         /* Page background */

/* Text */
--text-primary: #000000;        /* Headlines */
--text-secondary: #3C3C43;      /* Body */
--text-tertiary: #8E8E93;       /* Hints */
--text-quaternary: #D1D1D6;     /* Disabled */

/* Separators */
--separator: #C6C6C8;           /* Light separator */
--separator-opaque: #E5E5EA;    /* Full opacity */
```

### 4.2 Color Mapping (KPI Cards)

| Element | Role | Tailwind | Hex |
|---------|------|----------|-----|
| Moyenne | Primary Stat | `text-blue-600` | #2563EB |
| Meilleur | Success Stat | `text-green-600` | #16A34A |
| Streak | Energy Stat | `text-orange-600` | #EA580C |
| Total | Neutral Stat | `text-slate-700` | #334155 |
| Chart Line | Trend | `#2563EB` | #2563EB |
| Chart Fill | Accent | `rgba(37, 99, 235, 0.08)` | Blue soft |
| Badge (unlocked) | Gold Accent | `border-yellow-200/50` | Light gold |
| Badge (locked) | Neutral | `grayscale` | B&W |

### 4.3 Shadow System (Soft Shadows Only)

```css
/* Card shadows */
--shadow-card: 0 4px 12px rgba(0, 0, 0, 0.05);      /* Subtle */
--shadow-card-hover: 0 6px 16px rgba(0, 0, 0, 0.08); /* Elevated */
--shadow-badge: 0 4px 12px rgba(0, 0, 0, 0.05);     /* Same as card */
--shadow-badge-hover: 0 6px 16px rgba(0, 0, 0, 0.08);

/* NO drop shadows (forbidden - Material Design) */
```

---

## 5. Contenu & Données

### 5.1 Données KPI Cards

**Source:** `statsStore.globalStats` (Pinia store)

```typescript
interface GlobalStats {
  moyenneGlobale: number        // Average score (0-100)
  meilleurScore: number         // Best score (0-100)
  streakActuel: number          // Current streak (days)
  totalSessions: number         // Total quizzes completed
  historiqueSessions: QuizSession[]  // All sessions for chart
}
```

**Affichage:**
- Moyenne: `Math.round(moyenneGlobale) + '%'` (ex: 85%)
- Meilleur: `Math.round(meilleurScore) + '%'` (ex: 92%)
- Streak: `streakActuel + 'j'` (ex: 7j)
- Total: `totalSessions` (ex: 24)

### 5.2 Données Graphique (30 Jours)

**Agrégation:**
1. Grouper les sessions par date (`dateJour`)
2. Calculer la moyenne par date: `sum(scores) / count(sessions)`
3. Initialiser tous les 30 derniers jours (même sans données)
4. Afficher avec gaps où aucun quiz n'a eu lieu

**Calcul:**
```typescript
const dataMap = {};
const today = new Date();

// Initialize 30 days
for (let i = 29; i >= 0; i--) {
  const d = new Date();
  d.setDate(today.getDate() - i);
  const key = d.toISOString().split('T')[0];
  dataMap[key] = { sum: 0, count: 0 };
}

// Aggregate
sessions.forEach((s) => {
  if (dataMap[s.dateJour]) {
    dataMap[s.dateJour].sum += s.notePourcentage;
    dataMap[s.dateJour].count++;
  }
});

// Calculate averages
const points = Object.values(dataMap).map((v) =>
  v.count > 0 ? v.sum / v.count : null
);
```

### 5.3 Données Badges

**Source:** `dataStore.badges` (6 badges total)

```typescript
interface Badge {
  id: string
  nom: string            // "Perfect Score"
  description: string    // "Score 100% on a quiz"
  icon: string          // Emoji: "⭐", "🏆", "🔥", etc.
  statut: 'debloque' | 'verrouille'
}
```

**Badges (6 Achievements):**
1. `first_quiz` - ⭐ (First quiz completed)
2. `perfect_score` - 🎯 (Score 100%)
3. `streak_3` - 🔥 (3-day streak)
4. `streak_7` - 🔥🔥 (7-day streak)
5. `marathon` - 💪 (10+ quizzes in month)
6. `math_expert` - 🧮 (Best category mastery)

### 5.4 Icônes (Phosphor Icons)

**Style:** Regular weight, size 20px (sauf badges emoji)

```
Back button:    ph-caret-left
Home button:    ph-house
Fire icon:      ph-fire (orange-600)
Lock icon:      ph-lock (slate-400, badge locked)
```

**Badges:** Emojis (not Phosphor) - visually distinctive

---

## 6. États & Interactions (Physique)

### 6.1 Page Load

**Entrance Animation:**
- Fade-in + slide-up: `translateY(20px) → translateY(0)`
- Duration: `500ms ease-out`
- Applied to entire page on mount

```css
@keyframes pageEnter {
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
  animation: pageEnter 0.5s ease-out forwards;
}
```

### 6.2 Chart Animation

**On Mount:**
- Chart animates in (Chart.js native animation: 750ms)
- Gridlines → line strokes → points appear sequentially
- Smooth easing (easeInOutQuart)

### 6.3 KPI Cards (Hover & Click)

**Hover State:**
- Shadow increases slightly: `shadow-[0_2px_8px...] → shadow-[0_4px_12px...]`
- Background might lighten imperceptibly
- Transition: `200ms ease-out`

**Click/Active State:**
- Scale down: `active:scale-95` (5% reduction)
- Transition: `150ms ease-out` (spring feel)

**CSS:**
```css
.stat-card {
  transition: all 0.2s ease-out;
}

.stat-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.stat-card:active {
  transform: scale(0.95);
  transition: transform 0.15s ease-out;
}
```

### 6.4 Badge Interaction

**Hover State:**
- Unlocked badges: Shadow increases (same as cards)
- Locked badges: No hover effect

**Click State:**
- `active:scale-95` (press feedback)
- Shows badge details in alert/modal

**On Click Handler:**
```typescript
function showBadgeDetails(badge: Badge) {
  if (badge.statut === 'verrouille') {
    alert(`🔒 Badge verrouillé : ${badge.nom}\nObjectif : ${badge.description}`);
  } else {
    alert(`🏆 Bravo ! Badge ${badge.nom} obtenu.\n${badge.description}`);
  }
}
```

### 6.5 Scroll Behavior

**Navigation Bar:** Remains sticky as content scrolls underneath
- Content blur effect: Subtle when passing under glass nav
- No parallax (too complex, not Apple-like)

**Smooth Momentum:** Native browser momentum scroll on iOS

### 6.6 Responsive Transitions

**Mobile (xs, sm):**
- 2-column KPI grid
- Full-width chart
- 3-column badge grid
- `px-6` padding on all breakpoints

**Tablet (md+):**
- Same layout (constrained by `max-w-2xl`)
- Slightly larger text
- More breathing room

---

## 7. Responsive Design

### 7.1 All Breakpoints

**Max Width:** `max-w-2xl` (896px maximum)
**Padding:** `px-6` (24px) across all screen sizes
**Stack:** Vertical single-column (never multi-column grid layout)

### 7.2 Grid Configurations

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| KPI Cards | `grid-cols-2` | `grid-cols-2` | `grid-cols-2` |
| Badges | `grid-cols-3` | `grid-cols-3` | `grid-cols-3` |
| Chart | Full width | Full width | Full width |
| Page Layout | Vertical | Vertical | Vertical |

### 7.3 Font Sizes

| Element | Size | Weight |
|---------|------|--------|
| Nav Title | `text-lg` | `font-semibold` |
| Card Label | `text-xs` | `font-semibold` |
| Card Value | `text-3xl` | `font-bold` |
| Chart Title | `text-sm` | `font-semibold` |
| Badge Name | `text-[11px]` | `font-semibold` |

---

## 8. Résumé Visuel Complet

```
╔════════════════════════════════════════════════╗
║   ← Statistiques                          🏠  │ ← Sticky Nav (glassmorphic)
╠════════════════════════════════════════════════╣
║                                                │
║  ┌──────────────────┬──────────────────┐      │
║  │    Moyenne       │  Meilleur Score  │      │
║  │      85%         │       92%        │      │
║  ├──────────────────┼──────────────────┤      │
║  │ Streak Actuel    │  Quiz Totaux     │      │
║  │    🔥 7j         │       24         │      │ ← KPI Cards
║  └──────────────────┴──────────────────┘      │ (soft shadow)
║                                                │
║  ┌────────────────────────────────────────┐   │
║  │ Évolution (30 derniers jours)          │   │
║  │                                        │   │
║  │  [Line Chart with Blue Curve]          │   │ ← Chart Container
║  │  ▰▰▰▰▰▰▯▯▯▯▯▯▰▰▰▰▰▰...              │   │ (glassmorphic)
║  │                                        │   │
║  │  01-15  01-18  01-21   01-24  02-14   │   │
║  └────────────────────────────────────────┘   │
║                                                │
║  ┌──────────┬──────────┬──────────┐           │
║  │  ⭐     │   🎯     │   🔥     │           │
║  │ 1st Quiz│Perfect   │Streak 3  │           │ ← Badges Grid
║  ├──────────┼──────────┼──────────┤           │ (3-column)
║  │  🔥🔥   │   💪     │   🧮     │           │
║  │Streak 7 │Marathon  │ Mastery  │           │
║  └──────────┴──────────┴──────────┘           │
║                                                │
║  [Scroll continues below for more content]   │
║                                                │
╚════════════════════════════════════════════════╝
```

---

**End of Spécification UI: Statistics Dashboard**
