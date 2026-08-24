# VS Mission Surface

## Scope and mode

- Surface: `src/pages/GamePage.tsx` plus the VS setup, match, map, and result components it owns.
- Mode: Operate.
- Audience/job: friends split into two teams need to arrange sides, ready up, race toward one hidden word without leaking opponent guesses, and understand the final competitive result.
- Primary actions: choose/switch team, randomize teams as host, ready/unready, transmit guesses, request a team hint, and review the final grading.

## Chosen direction

- Direction: Energy Clash Flight Deck, a user-directed evolution of the earlier Airlock Arena roll `e15a8fb1`.
- Build path: code-led. The earlier `.impeccable/mocks/decision/airlock-arena.webp` remains historical exploration, not an approved comp for the simplified live match.
- Memorable moment: dominant Red Shift and Blue Orbit best-signal scores drive a single solid-color energy clash. The collision point moves with the relative best guesses, crackles faster as guesses accumulate, and emits stronger feedback for gains, breakthroughs, and an exact solve.
- Mobile translation: the score clash remains first, followed by the semantic field, private search console, latest guess, and flight log. Team rosters stack afterward so the active task remains immediate.

## Component grammar

- Matte fields with one-pixel structural rules; 10–14px corners only on ordinary controls and incumbent cards.
- Live team bays are narrow, quiet, full-height roster rails with a two-pixel team signal and ruled player rows. Setup may retain restrained airlock geometry where choosing sides is the task. No floating tiles, glass, or gradients.
- Headings use the incumbent heavy Avenir-like sans; team names and instrument labels are uppercase with restrained tracking. Ramp: 12px instrument labels, 14–16px working text, 20–24px team headings, 32–40px confrontation numerals.
- Elevation stays flat. Hierarchy comes from field scale, colored rails, line weight, and typography.
- Sampled comp fields: header interior `#2b322f`, red-bay interior `#131716`, semantic field `#0c1412`, lower workspace `#161d1c`. Production maps these relationships onto existing light/dark tokens rather than forcing dark mode.

## Inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Mission header | Existing logo, live state, mode, lobby code, theme control | Semantic HTML/CSS and incumbent assets |
| Red/blue live roster rails | Narrow full-height team fields, ranked player contributions, aggregate telemetry, and status | Semantic HTML/CSS with a restrained two-pixel signal |
| Energy clash scoreboard | Dominant best-signal scores, centered live elapsed timer, bounded relative beam, artist-made opposing laser textures, animated collision burst, activity heat, and event feedback | Semantic HTML/CSS plus Wenrexa and Luis Zuno/Ansimuz CC0 raster VFX documented in `public/vfx/README.md` |
| Player rows | Avatar, name, you/host markers, typing state, guesses, average, best | Existing `PlayerAvatar` raster sheet plus semantic HTML |
| Central task lane | Semantic map, phase status, private search console, latest guess, and flight log in task order | Semantic HTML/CSS and existing components |
| Semantic field | Hundreds of small team-colored points; only own points disclose words | Existing responsive SVG component, extended with redacted points |
| Private console | Own latest/best state, guess input, team-only hint action | Existing form components, semantic HTML/CSS |
| Private flight log | Own team words only, newest/closest sorting and hover linkage | Existing flight-log components |
| Setup airlock | Same facing bays with switch controls, ready states, host randomize, launch readiness | Semantic HTML/CSS and existing avatar assets |
| Finished state | Exact solver may own 100% of the beam while the collision marker remains clamped inside the meter; opposing controls remain enabled | CSS geometry; reduced-motion-safe state transition |
| Final result | Winner/loser hierarchy, transparent score equation, team/player stats, rematch | Semantic HTML/CSS and existing avatars/icons |

## Constraints

- Opponent guess strings, aliases, hint origins, and target disclosure never reach an unauthorized client.
- Red/blue identity is reinforced by side names, labels, emblems, placement, and status copy.
- All actions remain at least 44px, keyboard operable, touch operable, and usable at 320px.
- Classic mode retains its existing layout and behavior.
- New VS raster VFX must come from documented artist-made sources with clear shipping rights. The current laser and collision assets are CC0, credited in `public/vfx/README.md`, and carry embedded origin metadata or a sidecar; reduced motion swaps the animated GIF for a derived still.

## Scoring

- Lowest adjusted time wins: elapsed seconds + 2 seconds per non-hint guess + 60 seconds per hint.
- Tie-break order: fewer hints, fewer guesses, faster raw time, then deterministic team order.
- Both teams receive a letter grade; the result explains every penalty rather than presenting an unexplained score.
