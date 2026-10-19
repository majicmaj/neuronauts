---
name: Neuronauts
description: Quiet full-screen game surfaces with clear red and blue team signals.
colors:
  canvas: "#f3f4f6"
  surface: "#ffffff"
  surface-subtle: "#eceef1"
  ink: "#202228"
  muted: "#626773"
  line: "#e2e4e8"
  line-strong: "#c8ccd4"
  accent: "#287c70"
  accent-hover: "#20685e"
  accent-soft: "#dff1ed"
  accent-contrast: "#ffffff"
  hint: "#9a5b0a"
  hint-soft: "#fff4df"
  hint-line: "#e8c98f"
  danger: "#a63131"
  danger-soft: "#fff1f1"
  debrief: "#12312a"
  debrief-ink: "#effffb"
  debrief-muted: "#b8d8cf"
  debrief-line: "#3f6b60"
  team-red: "#c9474f"
  team-red-soft: "#fae9ea"
  team-blue: "#3f74bd"
  team-blue-soft: "#e8f0fb"
  dark-canvas: "#101113"
  dark-surface: "#191a1e"
  dark-surface-subtle: "#222429"
  dark-ink: "#eceef2"
  dark-muted: "#a4a9b3"
  dark-line: "#2c2e35"
  dark-line-strong: "#4a4e58"
  dark-accent: "#7ad3bf"
  dark-accent-hover: "#9adfce"
  dark-accent-soft: "#173b34"
  dark-accent-contrast: "#10201c"
  dark-hint: "#f0bb64"
  dark-hint-soft: "#332719"
  dark-hint-line: "#70542d"
  dark-danger: "#ff9b9b"
  dark-danger-soft: "#351f1f"
  dark-debrief: "#0c2923"
  dark-debrief-ink: "#effffb"
  dark-debrief-muted: "#b8d8cf"
  dark-debrief-line: "#416f63"
  dark-team-red: "#ff646d"
  dark-team-red-soft: "#321d20"
  dark-team-blue: "#6ca5f5"
  dark-team-blue-soft: "#18283d"
  game-canvas: "#f3f4f6"
  game-surface: "#ffffff"
  game-surface-subtle: "#eceef1"
  game-ink: "#202228"
  game-muted: "#626773"
  game-line: "#e2e4e8"
  game-line-strong: "#c8ccd4"
  game-accent: "#287c70"
  game-accent-hover: "#20685e"
  dark-game-canvas: "#101113"
  dark-game-surface: "#191a1e"
  dark-game-surface-subtle: "#222429"
  dark-game-ink: "#eceef2"
  dark-game-muted: "#a4a9b3"
  dark-game-line: "#2c2e35"
  dark-game-line-strong: "#4a4e58"
  dark-game-accent: "#7ad3bf"
  dark-game-accent-hover: "#9adfce"
typography:
  display:
    fontFamily: "Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.06em"
  game-heading:
    fontFamily: "Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  game-instrument:
    fontFamily: "Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 650
    letterSpacing: "normal"
rounded:
  game-surface: "12px"
  structural: "4px"
  compact: "7px"
  action: "10px"
  panel: "14px"
  pill: "999px"
spacing:
  micro: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-contrast}"
    rounded: "{rounded.action}"
    padding: "0.7rem 1.15rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-contrast}"
    rounded: "{rounded.action}"
  button-secondary:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.ink}"
    rounded: "{rounded.action}"
    padding: "0 1.25rem"
  button-hint:
    backgroundColor: "{colors.hint-soft}"
    textColor: "{colors.hint}"
    rounded: "{rounded.action}"
    padding: "0 1rem"
  input-mission:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.action}"
    padding: "0.7rem 0.9rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  game-team-surface:
    backgroundColor: "{colors.game-surface}"
    textColor: "{colors.game-ink}"
    rounded: "{rounded.game-surface}"
  game-progress-board:
    backgroundColor: "{colors.game-surface}"
    textColor: "{colors.game-ink}"
    rounded: "{rounded.game-surface}"
    padding: "1rem 1.25rem"
  game-guess-dock:
    backgroundColor: "{colors.game-surface}"
    textColor: "{colors.game-ink}"
    padding: "0.85rem 1.5rem"
---

# Design System: Neuronauts

## Overview

**Creative North Star: "The Quiet Match Workspace"**

Neuronauts uses concise mission-control language, custom Pixelarticons glyphs, and small 3D neuronaut avatars to support social semantic search. Home and lobby keep their incumbent mineral-green palette and rounded, ruled components.

The game route follows the user-pinned Linear direction: a quiet, full-width workspace with neutral light/dark surfaces, one workhorse sans, compact red/blue denoters, and a persistent bottom guess input. Setup, live play, and results share this calmer grammar. Team names, emblems, and progress communicate competition while the map and private log carry the active task.

**Key Characteristics:**

- Neutral light/dark tokens scoped to `.game-shell`; incumbent home/lobby styling remains separate.
- Borderless 12px game surfaces, compact spacing, and one workhorse sans.
- Red/blue team names, R/B emblems, small progress bars, and explicit statuses.
- Full-width game content with responsive roster disclosures and desktop map/log columns.
- Measured, keyboard-aware bottom guess controls in both cooperative and VS play.
- Existing Pixelarticons glyphs and neuronaut avatars preserve product identity.

## Colors

Frontmatter tokens without a `game-` prefix describe incumbent home/lobby and shared semantic colors. The `game-*` and `dark-game-*` tokens document the local overrides in `.game-shell`; they are not global replacements. The game field is cool neutral gray, with white or charcoal working surfaces and a slightly stronger subordinate surface. Text hierarchy uses ink and muted roles.

Navigator Teal remains the action, focus, and semantic-target signal. Amber denotes hints; danger color denotes actual errors. Red Shift and Blue Orbit retain the incumbent `team-red` / `team-blue` light and dark tokens, used sparingly in emblems, team labels, progress, and map points. Tokenized line colors remain available for functional details such as focus or scrollbars; they do not authorize decorative game frames.

**The Two-Factor Team Rule.** Pair team color with a name, emblem, placement, or status. Color alone never carries team identity.

## Typography

**Display and Body Font:** Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif.

Home and lobby retain the frontmatter's incumbent display/body hierarchy. The game route uses the same workhorse face throughout. Setup headings are `clamp(1.6rem, 3vw, 2rem)` at weight 650; team headings are 0.9rem with restrained negative tracking; progress labels are 0.8rem; supporting telemetry is approximately 0.6–0.75rem. The input remains 1rem. Results can use a larger `clamp(2rem, 5vw, 4rem)` statement without changing font family. Metrics and the elapsed clock use tabular numerals.

**The Workhorse Rule.** Use Avenir Next and its system sans fallbacks throughout the game route, including VS names, scores, grades, and labels.

## Layout

The game route fills the available screen width with 12px mobile gutters and 24px gutters from 640px. Its `.game-shell` scope covers cooperative play, VS setup, live VS, and results. Setup content caps at 1000px for readable team selection; it uses two surface columns from 720px and stacks them below that width. Ready/launch actions remain near the setup content and wrap on mobile.

Live VS begins with two compact independent best-similarity progress bars and the elapsed clock. Below 720px the clock occupies a small centered row beneath the bars. The semantic map and private log precede the two roster disclosures in the central flow. From 1100px, 11–14rem roster columns flank the flexible central workspace; from 1280px, the center splits into a map and a minimum 19rem private log. Map height follows viewport space rather than a fixed square. Rosters use native `details` / `summary` disclosures with explicit expand/collapse signs.

Both cooperative and VS play pin `GuessDock` across the bottom of the screen. A ResizeObserver measures its height for page and toast clearance; VisualViewport resize/scroll events position it above the software keyboard. Safe-area padding protects touch controls. The dock uses a two-column desktop layout and a single mobile column; the mobile submit action retains its 44px target. Content must remain usable at 320px.

**The Dock Clearance Rule.** Reserve the measured guess dock height in page flow and keep the dock above the visual viewport keyboard. Neither content nor feedback may disappear behind it.

## Elevation & Depth

Game hierarchy comes from canvas/surface/subtle-surface tones and whitespace. Game cards, inputs, team panels, results, and header frames have no decorative borders or resting card shadows. The bottom dock has a subtle functional separation shadow, `0 -8px 24px rgb(0 0 0 / 0.04)`. Keyboard focus uses an explicit two-pixel accent outline with offset rather than a decorative glow.

Outside the game-route restyle, incumbent home/lobby controls can retain one-pixel rules and established overlay shadows. Theme menus use `0 8px 22px rgb(17 24 21 / 0.14)`; alert toasts use `0 8px 22px rgb(17 24 21 / 0.16)`. Classic debrief behavior and its existing stage/player-card hierarchy remain supported.

**The Surface Rule.** Game-route grouping uses tonal surfaces, spacing, and typography. Do not add decorative borders, airlock geometry, or collision effects.

## Shapes

Game surfaces use 12px corners. Team emblems are compact 1.6rem squares with 6px corners; setup join actions use 8px corners. Progress tracks are slim 0.3rem bars with 3px corners. The full-width bottom dock has no enclosing rounded frame. Existing home/lobby controls retain 10px corners and incumbent cards retain 14px corners. Do not derive a new competition shape language from earlier clipped bays.

## Components

### Buttons and inputs

Maintain at least 44px action targets and a 48px, 1rem guess field. Game inputs use Subtle Surface with no border; focus uses a two-pixel accent outline and two-pixel offset. Hint and secondary actions keep semantic color and readable disabled states while removing their game-route outlines. Home/lobby retain existing button variants. Guess submission still accepts a trimmed single word with the existing 40-character limit.

### Navigation and identity

The game header is a compact borderless row with existing logo, lobby code/copy control, presence, and theme menu. Responsive hiding may simplify text while preserving usable controls. Keep the existing Pixelarticons family and 4×4 neuronaut sprite sheet; avatars remain raster assets. Player names use the workhorse sans.

### Team setup and rosters

Setup has two simple team surfaces with small colored R/B emblems, names, avatar rows, readiness, and side-switch actions. Randomize and launch controls preserve current host/readiness rules. Live team rosters use expandable summaries with team name and player count. Expanded content exposes contribution and team telemetry without decorative rails or row rules. A team's finish locks its own controls while the opposing team continues.

### Compact progress board

Two independent red/blue best-similarity bars sit in one neutral surface with explicit team labels, percentages, and supporting status. The ticking elapsed clock remains separate. There is no relative-energy beam, collision, laser artwork, or impact animation in the match UI.

### Semantic field and private log

The VS map is a borderless neutral surface with a compact target marker and small red/blue points. Own-team words can be disclosed using pointer, keyboard, and touch interaction; opponent points remain anonymized and non-interactive. Pointer coordinates use inverse SVG screenCTM so hover agrees with visible points when the map is stretched responsively. The private log keeps own-team words, sorting, and map linkage. The cooperative map and shared crew log retain their established game meaning.

### Bottom guess dock

One fixed measured dock holds the active guess form and hint action. Team labeling identifies the private VS console; cooperative mode uses the same anchored action pattern. Locked/finished states retain meaningful copy. The scoring explanation remains visible in VS, and alert toasts clear the measured dock height.

### Results

Classic and VS share the rich per-player cards, existing award artwork and interactive citations. VS groups cards under explicit team names after the team score comparison. Award comparisons are within each crew. Own-team cards may include guess words; rival cards show only numeric signals and word-free citations, including after completion. Team groups stack on mobile.

Preserve winner/runner-up language, grades, the adjusted-time equation, raw time, guess and hint penalties, team/player contributions, and rematch. Present these in borderless 12px surfaces with the same workhorse typography and explicit red/blue team identity.

## Do's and Don'ts

### Do:

- Do use the scoped neutral game tokens in both light and dark themes.
- Do group game content with tonal surfaces, spacing, and 12px corners.
- Do pair red/blue team color with names, R/B emblems, and clear status language.
- Do keep the compact independent team progress bars readable at 320px.
- Do preserve measured bottom input clearance, safe-area padding, and visible keyboard focus.
- Do preserve existing neuronaut avatars, Pixelarticons glyphs, cooperative mechanics, and result scoring.

### Don't:

- Don't add decorative borders, clipped airlock jaws, confrontation seams, beams, or collision animation to the game route.
- Don't reintroduce condensed competitive typography into the game route.
- Don't expose opposing words, aliases, hint origins, or interactive opponent tooltips.
- Don't make team identity depend on color alone.
- Don't apply game-route palette changes to home and lobby without a separate scoped request.
- Don't place a fixed guess input over scrollable content without measured clearance.

## Entry and recovery

Home uses the same neutral palette and surface hierarchy as game routes. Classic places the map and shared log first, with a native crew disclosure that adapts to smaller screens. Offline and reconnect banners preserve mission context and input drafts; initial connection, map loading, host approval, invalid/expired missions, route failures and missing pages share one recovery surface. Every failure offers a meaningful retry or return path. No new decorative motion or frame borders are introduced.
