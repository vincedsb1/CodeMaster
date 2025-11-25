# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Quiz Master PWA** is a fully-featured progressive web application built with Vue 3 + TypeScript + Vite. It's a quiz application with session persistence (IndexedDB), statistics tracking, badge system, and responsive mobile-first design.

**Architecture**: Monolithic prototype (1447 lines HTML) → Modular production app
- 3 Pinia stores for state management (data, quiz, stats)
- IndexedDB for persistence (questions, sessions, badges)
- Chart.js for statistics visualization
- Vue Router for navigation (8 routes)
- Tailwind CSS v4 for styling
- Phosphor Icons for UI

## Build and Development Commands

### Development
- `npm run dev` - Start Vite dev server with hot module reloading (http://localhost:5174)
- `npm run build` - Full build: type-check + optimize + minify for production
- `npm run build-only` - Skip type checking, build only
- `npm run preview` - Preview production build locally

### Testing
- `npm run test:unit` - Run unit tests with Vitest
- `npm run test:unit -- src/stores/useQuizStore.spec.ts` - Run specific test
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e -- --project=chromium` - Test on specific browser

### Code Quality
- `npm run lint` - Run all linters (Oxlint + ESLint with auto-fix)
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── main.ts                         # App entry point, loads CSS + initializes Vue/Pinia/Router
├── style.css                       # Tailwind CSS v4 + custom components & animations
├── App.vue                         # Root component with <router-view> + transitions
├── types/
│   ├── models.ts                   # 8 TypeScript interfaces (Question, QuizSession, Badge, etc.)
│   └── constants.ts                # Enums, color mappings, default data (10 questions + 6 badges)
├── db/
│   ├── config.ts                   # IndexedDB initialization (3 stores: questions, sessions, meta)
│   └── repositories.ts             # CRUD operations (questionRepository, sessionRepository, metaRepository)
├── stores/
│   ├── useDataStore.ts             # Questions + Badges loading & import logic
│   ├── useQuizStore.ts             # Active session, question navigation, answer submission
│   └── useStatsStore.ts            # Stats calculation, badge unlocking, streak logic
├── router/
│   └── index.ts                    # 8 routes (home, difficulty, count, randomconfig, active, summary, stats, import)
├── views/
│   ├── quiz/
│   │   ├── Home.vue                # Category selection + random mode
│   │   ├── Difficulty.vue          # Difficulty picker (facile, moyen, difficile, random)
│   │   ├── Count.vue               # Question count selector (5, 10, 20)
│   │   ├── RandomConfig.vue        # Multi-select categories
│   │   ├── Active.vue              # Quiz gameplay (progress bar + question + answers)
│   │   └── Summary.vue             # Score display + badge notifications
│   ├── stats/
│   │   └── Index.vue               # KPIs + 30-day evolution chart + badges grid
│   └── settings/
│       └── Import.vue              # JSON import + reset stats
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue           # Logo + stats button with badge indicator
│   │   └── AppLayout.vue           # Header + router-view + resume modal
│   ├── quiz/
│   │   ├── QuestionCard.vue        # Question text + difficulty + explanation
│   │   ├── AnswerOption.vue        # Answer button with correct/incorrect states
│   │   └── ProgressBar.vue         # Question progress visualization
│   ├── stats/
│   │   ├── StatCard.vue            # KPI display (average, best score, streak, total)
│   │   ├── EvolutionChart.vue      # Chart.js wrapper for 30-day trend
│   │   └── BadgesGrid.vue          # 3-column badges grid (locked/unlocked)
│   └── common/
│       ├── BaseButton.vue          # Reusable button (primary, secondary, danger, ghost)
│       ├── BaseModal.vue           # Resume quiz modal
│       └── LoadingSpinner.vue      # Loading indicator
├── fixtures/
│   └── questions.ts                # 30 additional test questions (5 per category)
└── __tests__/
    └── App.spec.ts                 # Unit tests
```

## Architecture Notes

### Styling (Tailwind CSS v4)
- **Version**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **Entry point**: `src/style.css` with `@import "tailwindcss"`
- **Configuration**: `tailwind.config.js` with content paths + extended theme
- **Icons**: Phosphor Icons loaded from CDN (unpkg.com)
- **Output**: ~32 kB CSS (gzip: ~6.3 kB), fully tree-shaken
- **Custom utilities**: Defined with `@layer` in `src/style.css`

### State Management (Pinia) - 3 Stores
1. **useDataStore**: Questions (CRUD) + Badges (unlock/reset) + JSON import validation
2. **useQuizStore**: Active session lifecycle, answer submission, question navigation, skip logic
3. **useStatsStore**: Global stats aggregation, streak calculation, badge unlock rules, chart data

### Persistence (IndexedDB)
- **3 Object Stores**: questions, sessions, meta
- **Repositories**: `questionRepository`, `sessionRepository`, `metaRepository` for clean CRUD
- **Session Resume**: Check pending session on app mount (modal prompt)
- **Data Integrity**: Deep copy sessions before DB save to prevent reference mutations

### Routing (Vue Router)
- 8 named routes organized by feature (quiz/* , stats, settings/*)
- Transitions handled at `App.vue` level with `<Transition name="slide">`
- No route guards—navigate via `router.push()` from stores or components

### Build Configuration
- **Vite**: Vue 3 + JSX + Vue DevTools plugins
- **TypeScript**: Strict mode, target ES2020
- **ESLint**: Flat config (Vue + TypeScript + Oxlint + Vitest + Playwright)
- **PostCSS**: `@tailwindcss/postcss` + autoprefixer
- **Type checking**: `vue-tsc --build` via npm run build

## Key Patterns

### Session Lifecycle
1. Select categories → Pick difficulty → Choose count → Create session → Store in DB
2. Answer question → Calculate points → Save session
3. Finish quiz → Calculate stats → Check badges → Reload stats
4. Can resume incomplete session on app mount

### Badge System
- 6 badges with different unlock conditions
- `first_quiz`, `perfect_score`, `streak_3`, `streak_7`, `marathon`, `math_expert`
- Unlocked after quiz completion, stored in meta store

### Streak Calculation
- Counts consecutive days with completed quizzes
- Resets if > 1 day without a quiz
- Used for streak badges and display in stats

### Points System
- Facile (easy): 1 point per question
- Moyen (medium): 2 points per question
- Difficile (hard): 3 points per question
- Score percentage: (correct answers / total questions) × 100

## Development Workflow

1. Start dev server: `npm run dev` → Navigate to http://localhost:5174
2. Edit files in `src/` with hot module reloading
3. Add stores for state, components for UI, views for pages
4. Run linting before commits: `npm run lint`
5. Build for production: `npm run build`
6. Test thoroughly: `npm run test:unit && npm run test:e2e`

## Key Dependencies

Core libraries:
- **vue@3.5.22**, **pinia@3.0.3**, **vue-router@4.6.3**: Application framework
- **vite@7.1.11**, **typescript@5.9**: Build & type checking
- **@tailwindcss/postcss@4**: Styling with Tailwind v4
- **chart.js@4**: Statistics visualization
- **postcss@8**, **autoprefixer**: CSS processing

Development tools:
- **oxlint@1.23**, **eslint@9.37**: Code linting
- **prettier@3.6**: Code formatting
- **vitest@3.2.4**, **@vue/test-utils@2.4.6**: Unit testing
- **playwright@1.56.1**: E2E testing
