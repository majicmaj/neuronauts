---
version: 1
slug: "src-pages-gamepage-tsx"
primary_target: "src/pages/GamePage.tsx"
related_targets: ["src/components/GuessDock.tsx", "src/components/SemanticMap.tsx", "src/components/VersusExperience.tsx"]
---

# Game Workspace Surface

## Scope and mode

- Surface: game-route cooperative play, VS team setup, live competition, and results.
- Mode: Operate.
- Audience/job: friends cooperate or race toward one hidden word, understand progress, and submit the next guess without fighting the layout.
- Primary actions: choose/switch team, host randomize, ready/unready, guess, request a hint, inspect the authorized log/map, review grading, and rematch.
- Home and lobby retain their established product and visual behavior.

## Chosen direction

The user explicitly replaced the earlier Airlock Arena / Energy Clash direction with: “Linear style. No borders, only surfaces. Simpler UI/UX, cleaner, maybe some red/blue accents, and some clear red/blue denoters. Both team view and ingame. Use entire screen. Compact two progress bars, remove collision animation. Mobile. Pin input bottom.”

This is the controlling direction; earlier surface rolls and comps are superseded for this route. No new comp was selected. The user's private reference screenshot stays outside the repository. The implementation source is the final block beginning “The match workspace” in `src/index.css`, plus the current game components.

The memorable interaction is a calm full-width search workspace with two small team progress bars and a guess input that stays available at the bottom, including above the mobile keyboard. Team names and R/B emblems supply explicit red/blue identity without a cinematic confrontation frame.

## Component grammar

- Neutral `.game-shell` light/dark palette; preserve global home/lobby tokens.
- Borderless 12px working surfaces; spacing and tone create hierarchy.
- One Avenir Next / Segoe UI / system sans stack for VS headings, scores, results, body, and labels.
- Small red/blue emblems, names, independent best-similarity progress bars, and semantic points.
- Existing neuronaut avatar sprite sheet and custom Pixelarticons family.
- No airlock jaws, decorative frame lines, opposing energy beams, lasers, collision artwork, or impact animation in the game route.
- Keep visible keyboard focus, safe-area padding, readable disabled states, and reduced-motion support.

## Inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Game header | Compact existing identity, lobby code/copy, presence, theme controls without frame lines | Existing assets and semantic HTML/CSS |
| Team setup | Two simple surfaces, team emblems, names, avatar/readiness rows, side switch | Existing avatars and semantic HTML/CSS |
| Ready/launch | Preserve host, team, and readiness rules; wrap actions on mobile | Existing controls |
| Progress board | Two slim independent best-similarity bars, clear team labels and percentages, separate ticking clock | Native progress and semantic HTML/CSS |
| Semantic field | Neutral borderless surface, responsive SVG, own-team disclosure, anonymous opponent points | Existing SVG component |
| Team rosters | Native expandable details/summary with player counts, contribution, and explicit team status | Semantic HTML/CSS and existing avatars |
| Private/shared log | VS own-team words only; cooperative shared crew log; retain sorting and map linkage | Existing log components |
| GuessDock | One bottom-fixed input/hint surface in each active mode, measured content clearance, VisualViewport keyboard positioning | React, ResizeObserver, VisualViewport, CSS safe-area padding |
| Results | Winner/runner-up, grades, transparent score equation, contributions, rematch | Existing mechanics in borderless surfaces |

## Responsive behavior

- Game content uses the full available width with 12px mobile and 24px desktop gutters. Setup caps at 1000px for readability.
- Setup uses two team columns at 720px and above, stacking below; launch controls wrap.
- Below 720px the progress clock sits beneath the two compact bars; roster disclosures follow the active map/log task.
- From 1100px, 11–14rem roster columns flank the flexible workspace. From 1280px, the center splits into map and private-log columns.
- The map uses viewport-responsive height. Pointer hover uses inverse SVG screenCTM so hit coordinates agree with the displayed SVG at every aspect ratio.
- GuessDock changes from a desktop two-column arrangement to one mobile column. Its measured height reserves page/toast clearance, and its visual-viewport offset keeps it above the keyboard.
- Preserve usable 44px controls and 1rem input text at the 320px minimum width.

## Product constraints

- Opponent guess strings, aliases, hint origins, and target disclosure never reach an unauthorized client.
- Red/blue identity is reinforced with names, emblems, placement, and status language.
- First solve locks only the finished team's private controls; the other team keeps playing.
- Cooperative behavior, avatars, icon family, results, and rematch remain supported.
- No new shipping raster is required for this direction.

## Scoring

- Lowest adjusted time wins: elapsed seconds + 2 seconds per non-hint guess + 60 seconds per hint.
- Tie-break order: fewer hints, fewer guesses, faster raw time, then deterministic team order.
- Both teams receive a letter grade and explicit penalties.

## Review evidence

Current QA captures may be inspected at `.impeccable/review/{desktop,mobile,small-desktop,mobile-small,wide,setup-desktop,setup-mobile}.png`. They are review evidence, not a replacement visual authority or a new comp commitment.
