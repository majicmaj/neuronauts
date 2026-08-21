---
version: 1
slug: "src-pages-gamepage-tsx"
primary_target: "src/pages/GamePage.tsx"
related_targets: ["src/components/SemanticMap.tsx","src/pages/LobbyPage.tsx"]
---

# VS Mission Surface

## Scope and mode

- Surface: `src/pages/GamePage.tsx` plus the VS setup, match, map, and result components it owns.
- Mode: Operate.
- Audience/job: friends split into two teams need to arrange sides, ready up, race toward one hidden word without leaking opponent guesses, and understand the final competitive result.
- Primary actions: choose/switch team, randomize teams as host, ready/unready, transmit guesses, request a team hint, and review the final grading.

## Chosen direction

- Direction: Airlock Arena, selected from the surface roll `e15a8fb1`.
- Approved comp: `.impeccable/mocks/decision/airlock-arena.webp`.
- Memorable moment: two facing team bays form the red/blue walls of the match; when one side finishes, its bay locks while the opposing bay and private search console remain active.
- Mobile translation: team bays stack as a red-versus-blue scoreboard above the private workspace; labels and side emblems preserve identity without relying on color.

## Component grammar

- Matte fields with one-pixel structural rules; 10–14px corners only on ordinary controls and incumbent cards.
- Team bays use squared outer edges, colored side rails, an inward notch, and ruled player rows. No floating tiles, glow, glass, or gradients.
- Headings use the incumbent heavy Avenir-like sans; team names and instrument labels are uppercase with restrained tracking. Ramp: 12px instrument labels, 14–16px working text, 20–24px team headings, 32–40px confrontation numerals.
- Elevation stays flat. Hierarchy comes from field scale, colored rails, line weight, and typography.
- Sampled comp fields: header interior `#2b322f`, red-bay interior `#131716`, semantic field `#0c1412`, lower workspace `#161d1c`. Production maps these relationships onto existing light/dark tokens rather than forcing dark mode.

## Inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Mission header | Existing logo, live state, mode, lobby code, theme control | Semantic HTML/CSS and incumbent assets |
| Red/blue airlock bays | Facing full-height team fields, colored rail, inward notch, aggregate metrics, progress, status | Semantic HTML/CSS with pseudo-elements |
| Player rows | Avatar, name, you/host markers, typing state, guesses, average, best | Existing `PlayerAvatar` raster sheet plus semantic HTML |
| Central confrontation | Large VS marker, match phase, target length, both progress values | Semantic HTML/CSS |
| Semantic field | Hundreds of small team-colored points; only own points disclose words | Existing responsive SVG component, extended with redacted points |
| Private console | Own latest/best state, guess input, team-only hint action | Existing form components, semantic HTML/CSS |
| Private flight log | Own team words only, newest/closest sorting and hover linkage | Existing flight-log components |
| Setup airlock | Same facing bays with switch controls, ready states, host randomize, launch readiness | Semantic HTML/CSS and existing avatar assets |
| Finished bay lock | Strong status bar and checkered edge; opposing controls remain enabled | CSS geometry; reduced-motion-safe state transition |
| Final result | Winner/loser hierarchy, transparent score equation, team/player stats, rematch | Semantic HTML/CSS and existing avatars/icons |

## Constraints

- Opponent guess strings, aliases, hint origins, and target disclosure never reach an unauthorized client.
- Red/blue identity is reinforced by side names, labels, emblems, placement, and status copy.
- All actions remain at least 44px, keyboard operable, touch operable, and usable at 320px.
- Classic mode retains its existing layout and behavior.
- No new shipping raster is required; all visible raster content comes from documented existing assets.

## Scoring

- Lowest adjusted time wins: elapsed seconds + 2 seconds per non-hint guess + 60 seconds per hint.
- Tie-break order: fewer hints, fewer guesses, faster raw time, then deterministic team order.
- Both teams receive a letter grade; the result explains every penalty rather than presenting an unexplained score.
