# Audit & Plan de Gamification - CodeMaster

Ce plan vise à augmenter l'engagement utilisateur ("time spent on app") en intégrant des mécaniques de jeu, de la rétroaction sensorielle ("Juice") et des systèmes de progression à long terme.

---

## 🧠 Analyse Psychologique & Audit

### Forces Actuelles
*   **Base solide :** Les quiz fonctionnent, les stats sont claires.
*   **Feedback immédiat :** On sait tout de suite si on a bon ou faux.
*   **Collection :** Les badges existent (mais sont statiques).

### Faiblesses & Opportunités
1.  **Manque de "Juice" (Feedback Visuel/Haptique) :** L'interaction est trop "sèche". Il manque le plaisir viscéral d'appuyer sur un bouton et de réussir.
    *   *Solution :* Vibrations, animations de réussite, sons.
2.  **Progression bornée :** Une fois les 6 badges obtenus, il n'y a plus de but.
    *   *Solution :* Système d'XP infini et Niveaux.
3.  **Manque de Rétention (Habitude) :** Rien ne pousse à revenir demain spécifiquement.
    *   *Solution :* Challenge Quotidien (seedé par la date).
4.  **Identité :** L'utilisateur est anonyme et n'a pas de sentiment d'évolution personnelle.
    *   *Solution :* Titres/Rangs basés sur le niveau (ex: "Junior", "Senior", "Architect").

---

## 🗓️ Plan d'Implémentation par Phases

### Phase 1 : "Game Juice" & Feedback Sensoriel (L'expérience immédiate)
*Objectif : Rendre chaque clic satisfaisant.*

1.  **Haptics (Vibrations) :**
    *   Utiliser `navigator.vibrate()` pour le feedback.
    *   Vibration légère au clic.
    *   Double vibration rapide pour une bonne réponse.
    *   Vibration lourde pour une erreur.
2.  **Feedback Visuel "Crunchy" :**
    *   Secousse de l'écran (screen shake) léger sur erreur.
    *   Particules/Confetti localisés sur le bouton de la bonne réponse.
3.  **Effets Sonores (Optionnel mais recommandé) :**
    *   Sons courts et satisfaisants pour : succès, erreur, niveau supérieur.
    *   Toggle "Mute" dans les réglages.

### Phase 2 : Progression RPG (Le Long Terme)
*Objectif : Donner une raison de jouer 1000 fois.*

1.  **Système d'XP :**
    *   Calculer l'XP par question (Facile=10xp, Moyen=20xp, Difficile=30xp).
    *   Bonus de combo (suite de bonnes réponses).
2.  **Niveaux & Courbe de progression :**
    *   Formule de niveau (ex: `XP = Level^2 * 100`).
    *   Affichage du niveau et barre d'XP dans le Header.
3.  **Rangs / Titres :**
    *   Associer des titres aux paliers de niveaux (Lvl 1: "Stagiaire", Lvl 10: "Développeur Junior", ..., Lvl 100: "Dieu du Code").

### Phase 3 : Rétention & Habitude (Le "Hook")
*Objectif : Créer une boucle d'habitude quotidienne.*

1.  **Challenge Quotidien :**
    *   Générer un quiz unique par jour (même seed pour tout le monde basé sur `YYYY-MM-DD`).
    *   Bonus d'XP x2 pour ce quiz.
    *   Badge spécial "Daily Streak".
2.  **Protection de Série (Streak Freeze) :**
    *   Permettre "d'acheter" un gel de série avec de l'XP ou une monnaie virtuelle pour ne pas perdre son streak en cas d'oubli.

### Phase 4 : Identité & Visuels
*Objectif : Renforcer l'appartenance.*

1.  **Profil Utilisateur :**
    *   Page profil montrant l'avatar (généré ou choisi), le titre, et les stats détaillées.
2.  **Thèmes Visuels :**
    *   Débloquer des thèmes (Dark, Cyberpunk, Retro) avec les niveaux.

---

## 🧪 Exemple Technique : Système d'XP (Phase 2)

**Dans `src/logic/gamification.ts` :**

```typescript
export const XP_TABLE = {
  EASY: 10,
  MEDIUM: 20,
  HARD: 30,
  COMBO_MULTIPLIER: 1.5 // x1.5 si combo > 3
};

export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

export function getTitleForLevel(level: number): string {
  if (level < 5) return "Script Kiddie";
  if (level < 10) return "Hello Worlder";
  if (level < 20) return "Junior Dev";
  // ...
  return "Tech Lead";
}
```

**Dans `useStatsStore.ts` :**

```typescript
// À la fin d'un quiz
function processQuizRewards(session: QuizSession) {
  const baseXp = calculateBaseXp(session);
  const comboBonus = calculateComboBonus(session);
  
  const totalGain = baseXp + comboBonus;
  
  userProfile.value.xp += totalGain;
  // Check level up
  const newLevel = calculateLevel(userProfile.value.xp);
  if (newLevel > userProfile.value.level) {
    // Trigger Level Up Modal!
  }
}
```
