# Tailwind CSS v4 Setup

## Configuration pour Tailwind CSS v4

Ce projet utilise **Tailwind CSS v4** avec la nouvelle architecture basée sur `@tailwindcss/postcss`.

### Fichiers de configuration

1. **postcss.config.js**
   - Utilise `@tailwindcss/postcss` au lieu de `tailwindcss`
   - C'est le nouveau plugin PostCSS pour Tailwind v4

2. **tailwind.config.js**
   - Configuration avec content paths
   - Thème étendu avec couleurs personnalisées (primary, secondary, etc.)
   - Plugins vides (peuvent être étendus selon les besoins)

3. **src/style.css**
   - `@import "tailwindcss"` - importe tous les styles Tailwind
   - Utilise `@layer` pour ajouter des composants personnalisés
   - Utilise `@layer utilities` pour les animations

### Styles chargés depuis le CDN

- **Phosphor Icons** : Chargé depuis `unpkg.com` dans `index.html`
  - Utilisé pour les icônes `<i class="ph ph-*"></i>`

- **Styles globaux** : Définis dans `index.html`
  - Scrollbar personnalisée
  - Font family
  - Background color body

### Commandes

```bash
npm run dev        # Lancer le serveur de développement (Vite)
npm run build      # Build production
npm run lint       # Linter le code
npm run format     # Formater avec Prettier
```

### Build output

- CSS Tailwind compilé : **~32 kB** (gzip: ~6.3 kB)
- JavaScript bundlé : **~343 kB** (gzip: ~121 kB)

### Considérations

- Tailwind v4 utilise une approche simplifiée sans besoin de `@tailwind` directives
- Les styles sont générés automatiquement selon le `content` pattern
- Les classes personnalisées sont définies dans `src/style.css` avec `@layer`
