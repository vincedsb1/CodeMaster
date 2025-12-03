# GEMINI.md

## Project Overview

**Quiz Master PWA** is a modular, progressive web application built with Vue 3, TypeScript, and Vite. It functions as an interactive quiz platform featuring session persistence, comprehensive statistics tracking, a gamified badge system, and a responsive, mobile-first design.

### Core Architecture
*   **Frontend Framework:** Vue 3 (Composition API) with `<script setup>`.
*   **Build Tool:** Vite 7.x.
*   **Language:** TypeScript 5.x (Strict Mode).
*   **State Management:** Pinia (3 stores: `useDataStore`, `useQuizStore`, `useStatsStore`).
*   **Styling:** Tailwind CSS v4 with `@tailwindcss/postcss`.
*   **Routing:** Vue Router 4.x (8 named routes).
*   **Persistence:** Native IndexedDB implementation (wrapper in `src/db/`) storing questions, sessions, categories, and metadata.
*   **Icons:** Phosphor Icons (via CDN).
*   **Visualization:** Chart.js for statistics.

## Building and Running

The project uses `npm` for dependency management and script execution.

### Key Commands
*   **Install Dependencies:**
    ```bash
    npm install
    ```
*   **Development Server:**
    ```bash
    npm run dev
    ```
    Starts the local development server at `http://localhost:5174` with Hot Module Replacement (HMR).
*   **Production Build:**
    ```bash
    npm run build
    ```
    Performs a full type-check (`vue-tsc`) and builds the optimized production assets to `dist/`.
*   **Preview Build:**
    ```bash
    npm run preview
    ```
    Preview the production build locally.

### Testing & Quality
*   **Unit Tests (Vitest):**
    ```bash
    npm run test:unit
    ```
*   **End-to-End Tests (Playwright):**
    ```bash
    npm run test:e2e
    ```
    (Requires `npx playwright install` for first run).
*   **Linting:**
    ```bash
    npm run lint
    ```
    Runs Oxlint and ESLint with auto-fix capabilities.
*   **Formatting:**
    ```bash
    npm run format
    ```
    Formats code using Prettier.

## Development Conventions

### Directory Structure
*   `src/components/`: UI components organized by domain (`common`, `layout`, `quiz`, `stats`, `settings`).
*   `src/views/`: Page-level components mapping to routes.
*   `src/stores/`: Pinia stores for global state logic.
*   `src/db/`: IndexedDB configuration and repository pattern implementation.
*   `src/types/`: Shared TypeScript interfaces (`models.ts`) and constants (`constants.ts`).

### Coding Standards
*   **Vue Components:** Use the Composition API with `<script setup lang="ts">`.
*   **Typing:** Strict TypeScript usage. All data models (Question, QuizSession, Badge) are defined in `src/types/models.ts`.
*   **Styling:** Use Tailwind CSS utility classes. Custom styles are minimal and defined in `src/style.css` or via Tailwind configuration.
*   **State Management:** Logic for data manipulation (CRUD, game logic) resides in Pinia stores, not components. Components should trigger store actions.
*   **Asynchronous Operations:** Use `async/await` for all DB interactions and data loading.

### Key Patterns
*   **Session Management:** Quiz sessions are deeply copied before saving to DB to ensure immutability of historical data.
*   **Resume Capability:** The app checks for incomplete sessions on mount and prompts the user via `BaseModal`.
*   **Repositories:** Database operations are abstracted in `src/db/repositories.ts` rather than accessing `indexedDB` directly in components.
