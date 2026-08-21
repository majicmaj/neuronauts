# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Friends playing together in a live browser lobby. Players may cooperate as one crew or compete as two teams while sharing the same hidden target.

## Product Purpose

Neuronauts turns semantic word similarity into a social search game. Players transmit guesses, see how close those concepts are to a hidden target, and navigate word space until the target is found. Success means the scoring feels semantically trustworthy, multiplayer state is immediate, and every result gives the group a story worth comparing.

## Positioning

The game combines calibrated semantic closeness, a spatial map of the search, shared live presence, and playful mission debriefs. VS mode keeps the opposing team visible as competitive telemetry while protecting their words, so both teams solve the same semantic problem independently in one synchronized lobby.

## Operating Context

- A host creates a six-character browser lobby and shares its code.
- Players choose call signs and avatars and may reconnect with the same identity.
- Classic missions are cooperative and expose the crew's complete flight log.
- VS missions begin in a team-setup room where players can switch sides, randomize teams, and ready up.
- During VS play, teammates share guesses; opponents reveal only roster presence, typing, guess count, average closeness, best closeness, and anonymized map points.
- The first team to find the target records its finish but does not end the other team's run. Final standings are decided after both teams finish.

## Capabilities and Constraints

- React, TypeScript, Vite, Tailwind CSS, and Socket.IO are established implementation constraints.
- Target embeddings and opposing guess words must never be sent to clients that are not authorized to see them.
- The same canonical concept lexicon governs targets, spellings, inflections, duplicate guesses, rankings, and hints.
- VS grading must combine elapsed time, guess efficiency, and hint restraint. Hints carry an explicit competitive cost so a nearly tied zero-hint run defeats an otherwise equivalent five-hint run.
- Setup and live-match controls must work with keyboard, touch, mobile layouts, reconnects, and players joining or leaving before launch.
- Classic mode behavior remains supported.
- Production backend lobbies are held in memory and are cleared by a container restart.

## Brand Commitments

- Product name: Neuronauts.
- Voice: concise, playful mission-control language without obscuring game state.
- Existing Neuronaut avatars, custom Pixelarticons glyphs, and unique 3D award artwork remain part of the identity.
- The interface uses a restrained mission-control system; VS mode extends it with clearly differentiated red and blue team identities.

## Evidence on Hand

- Existing cooperative game, setup, live roster, semantic map, flight log, and post-game recap in `src/`.
- Existing avatar sheet at `src/assets/neuronaut-avatars.webp` and award artwork in `public/awards/`.
- Server-owned semantic scoring, lexicon, lobby, presence, hint, recap, and rematch logic in the backend repository.
- Production topology and verified release procedure in the workspace `DEPLOYMENT.md`.
- No commercial claims, benchmarks, testimonials, or player research are present and none should be fabricated.

## Product Principles

- Show useful competitive pressure without leaking the opponent's thinking.
- Make team state and individual contribution readable at a glance.
- Reward clean navigation, not merely the fastest lucky answer.
- Preserve the losing team's agency after the first solve.
- Keep social setup playful and reversible until everyone commits.

## Accessibility & Inclusion

Team identity must not rely on red and blue alone: labels, side names, symbols, and layout reinforce color. Interactive disclosures and controls support pointer, keyboard, and touch, with visible focus and reduced-motion behavior.
