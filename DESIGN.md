---
name: Neuronauts
description: Restrained matte mission control for a social semantic-search game.
colors:
  canvas: "#eef2f0"
  surface: "#ffffff"
  surface-subtle: "#f6f8f7"
  ink: "#17201d"
  muted: "#5d6a65"
  line: "#cfd8d4"
  line-strong: "#aebdb7"
  accent: "#087f70"
  accent-hover: "#06695e"
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
  dark-canvas: "#101613"
  dark-surface: "#171f1c"
  dark-surface-subtle: "#1c2622"
  dark-ink: "#edf4f1"
  dark-muted: "#a8b5b0"
  dark-line: "#33413b"
  dark-line-strong: "#52645c"
  dark-accent: "#65cdb9"
  dark-accent-hover: "#83dbc9"
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
  vs-display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5.4rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "0.005em"
  vs-heading:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(1.4rem, 2vw, 1.85rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "0.045em"
  vs-instrument:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
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
  vs-team-bay-red:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.structural}"
  vs-team-bay-blue:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.structural}"
  vs-transmit-console:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.structural}"
    padding: "1rem"
---

# Design System: Neuronauts

## Overview

**Creative North Star: "The Matte Flight Deck"**

Neuronauts is a restrained mission-control interface built for quick social play. Its world is practical rather than cinematic: pale mineral fields or deep green-black fields, compact information density, one-pixel rules, a heavy workhorse sans, crisp custom Pixelarticons glyphs, and small 3D neuronauts that carry the character. Copy is concise and playful, but state is never disguised by atmosphere.

The default system is calm, rounded, and cooperative. VS mode is a durable extension of that world, not a replacement: self-hosted Barlow Condensed turns team names, grades, percentages, and labels into instrumentation; Red Shift and Blue Orbit gain labeled emblems, opposing placement, asymmetric rails, and clipped airlock jaws; the semantic map becomes an open shared field. That Airlock Arena composition belongs to competitive match surfaces and must not become a universal layout for unrelated screens.

**Key Characteristics:**

- Matte light and dark themes driven by semantic CSS properties.
- Flat tonal layering with structural one-pixel rules and sparing overlay shadows.
- Avenir-like workhorse typography, with condensed instrumentation reserved for VS telemetry.
- Custom Pixelarticons glyphs and compact 3D neuronaut assets as identity anchors.
- Red/blue competition reinforced by names, initials, rails, side placement, and status language.
- Responsive layouts that preserve task order and 44px minimum interactive targets.

## Colors

The palette uses mineral green neutrals, a teal navigation signal, amber hint telemetry, and deliberately paired red/blue competitive channels; dark mode remaps every semantic role rather than inverting the page.

### Primary

- **Navigator Teal:** The default action, selection, focus, semantic target, online signal, and successful-state color. Its light and dark values are the `accent` tokens in the frontmatter.
- **Navigator Teal Soft:** The restrained selected-row and selected-control field. It supports the accent without turning whole screens teal.

### Secondary

- **Red Shift Signal:** The red team’s rail, emblem, heading, progress, points, and finished-state border. Pair it with the words “Red Shift” or “Red,” the `R` emblem, and the red-side geometry.
- **Blue Orbit Signal:** The blue team’s corresponding identity. Pair it with “Blue Orbit” or “Blue,” the `B` emblem, and the blue-side geometry.

### Tertiary

- **Halfway Amber:** Reserved for hints and their borders, labels, and actions. It communicates a special competitive cost, not a general secondary action.
- **Debrief Green:** A dark celebratory stage used by classic mission debriefs with its own ink, muted, and line roles.
- **Danger Red:** Used for actual error or destructive states, never as a substitute for Red Shift team identity.

### Neutral

- **Mineral Canvas:** The page field. It is slightly green in both themes, avoiding pure neutral gray.
- **Instrument Surface:** The main control and card plane.
- **Subtle Surface:** The lower-contrast field for secondary controls, avatar wells, selected contexts, and track backgrounds.
- **Flight Ink:** Primary copy and glyph color.
- **Telemetry Muted:** Supporting copy, labels, inactive controls, and timestamps.
- **Structural Line / Strong Structural Line:** One-pixel separation and control outlines. The stronger role frames actionable or major boundaries.

### Named Rules

**The Signal Has a Job Rule.** Teal means navigation, action, focus, or semantic success; amber means hints; red and blue mean team identity. Do not use these colors as decoration without that state relationship.

**The Two-Factor Team Rule.** Every red/blue distinction also needs a name, emblem, placement, geometry, or status phrase. Color alone never carries team identity.

## Typography

**Display Font:** Avenir Next (with Segoe UI and system sans fallbacks)

**Body Font:** Avenir Next (with Segoe UI and system sans fallbacks)
**VS Instrument Font:** Self-hosted Barlow Condensed (with Arial Narrow and sans-serif fallbacks)

**Character:** The base face is sturdy, friendly, and fast to scan. Barlow Condensed makes competitive numbers and labels feel calibrated and space-efficient without turning ordinary body copy into a themed prop.

### Hierarchy

- **Display** (800, fluid 2.25–3.75rem, 1 line-height): Product-name moments and major entry headings.
- **Headline** (900, 1.5rem, 1.2 line-height): Mission errors, debrief headings, and prominent section statements.
- **Title** (700, 1.25rem, 1.25 line-height): Card and workflow headings.
- **Body** (400, 1rem, 1.75 line-height): Instructions and explanatory copy; use compact 0.7–0.875rem supporting text where the implementation is telemetry-dense.
- **Label** (700, 0.75rem, 0.06em tracking): Statuses, compact labels, and instrument captions; uppercase only where the interface is explicitly labeling a measurement or state.
- **VS Display** (900, fluid 2.5–5.4rem, 0.88 line-height): Winner statements and dominant competitive readouts.
- **VS Heading** (900, fluid 1.4–1.85rem, 1.05 line-height, 0.045em tracking): Uppercase team names and result headings.
- **VS Instrument** (600 or 900, usually 0.62–0.92rem): Tabular metrics, grades, progress, and confrontation labels. Use the two shipped font files—SemiBold 600 and Black 900—as the durable weight anchors.

### Named Rules

**The Workhorse First Rule.** Keep navigation, instructions, forms, player names, and normal card copy in the base sans. Introduce Barlow Condensed only when content is functioning as VS instrumentation or a competitive headline.

**The Numbers Lock Rule.** Metrics, timers, counts, ranks, grades, and percentages use tabular numerals and compact alignment so live updates do not destabilize the layout.

## Layout

The application begins at a 320px minimum width. Global mission content sits in a centered `max-w-7xl` shell with 12px mobile gutters and 20px gutters from the small breakpoint. The ordinary game is a single ordered flow on narrow screens, then becomes a main workspace plus a sticky 23rem rail at 1024px. Cards and controls generally follow an 8px sub-rhythm inside a 16px section rhythm, with 20–32px reserved for page-level separation.

VS setup and play add explicit responsive stages. Below 720px, the central confrontation or setup status appears before stacked team bays and the private console stacks its actions. At 720px, setup becomes bay–seam–bay, the private workspace becomes a 0.7fr/1.3fr two-column grid, and result teams compare side by side. Between 720px and 1179px, the live semantic field spans above two team bays. At 1180px, the full arena becomes red bay–semantic field–blue bay and may widen to `min(1505px, calc(100vw - 1rem))`; this wide arena exception is specific to VS.

Mobile setup keeps the ready controls sticky near the top, uses the full available width, and retains 44px targets. Mobile result metrics collapse from three to two columns. The semantic map stays square in ordinary play, while the wide VS map becomes a fixed 31.5rem-tall open field.

**The Task-Order Rule.** Responsive changes may reorder regions, but must preserve the current decision sequence: match state before private input, and setup readiness before long team rosters on mobile.

## Elevation & Depth

Neuronauts is flat by default. Depth comes from canvas-to-surface tone changes, one-pixel rules, colored rails, progress fills, and scale—not gradients, glass, or decorative glow. Ordinary cards carry no shadow. Compact temporary overlays use restrained shadows: theme menus use `0 8px 22px rgb(17 24 21 / 0.14)`, alert toasts use `0 8px 22px rgb(17 24 21 / 0.16)`, and the classic debrief reserves `0 18px 44px rgb(7 26 22 / 0.18)` for its stage and `0 12px 28px rgb(17 24 21 / 0.1)` for player cards. The input’s mixed-color focus halo is functional focus feedback, not ambient glow.

### Shadow Vocabulary

- **Compact Overlay:** `0 8px 22px rgb(17 24 21 / 0.14)` for menus that must sit above the active mission.
- **Urgent Overlay:** `0 8px 22px rgb(17 24 21 / 0.16)` for temporary alert toasts.
- **Debrief Stage:** `0 18px 44px rgb(7 26 22 / 0.18)` for the celebratory classic recap plane only.
- **Debrief Card:** `0 12px 28px rgb(17 24 21 / 0.1)` for classic recap player cards only.

### Named Rules

**The Flat Flight Deck Rule.** Resting application surfaces and all VS arena structures remain shadowless. Use shadows only for temporary overlays or the established classic debrief hierarchy.

## Shapes

Ordinary controls use gently rounded 10px corners and incumbent cards use 14px corners. Smaller interactive details use 7–8px corners, while avatars and compact statuses may use circles or pills. Borders are almost always one pixel.

Competitive structures tighten to 4px corners. At wide VS breakpoints, opposing bays use clipped inward jaws and asymmetric rails: red’s diagonal rail and `R` hexagonal emblem contrast with blue’s segmented rail and `B` emblem. Finished bays turn the inner jaw into a checkered lock. These silhouettes are specific to team confrontation and should not square every card in the product.

**The Soft Utility, Hard Competition Rule.** Use 10–14px rounding for general product UI; use 4px edges, clipping, and squared progress geometry for VS bays, consoles, logs, and results.

## Components

### Buttons

- **Shape:** Strong, compact controls with a 10px radius and at least 44px height.
- **Primary:** Solid Navigator Teal with white light-theme contrast ink, a one-pixel matching border, 0.7rem × 1.15rem padding, and a bold label. Hover shifts to the dedicated darker/lighter theme hover token.
- **Secondary:** Subtle Surface with Flight Ink and a Strong Structural Line. Hover turns the border and label teal without filling the control.
- **Hint:** A 48px amber-tinted action with matching hint border and icon. Disabled actions keep their geometry and reduce opacity to 0.45.
- **Focus:** A visible two-pixel teal outline with three-pixel offset. Keep focus independent from hover.
- **Icons:** Use the incumbent crisp Pixelarticons glyph wrapper, normally at 24px. Avoid generic smooth-stroke icon sets.

### Cards / Containers

- **Corner Style:** 14px for incumbent cards; 4px for VS structural containers.
- **Background:** Instrument Surface on the Mineral Canvas; selected or subordinate areas use Subtle Surface or semantic soft colors.
- **Shadow Strategy:** None at rest; follow the explicit exceptions in Elevation & Depth.
- **Border:** One-pixel Structural Line, promoted to Strong Structural Line for major controls and workspace frames.
- **Internal Padding:** Usually 16px, increasing to 20–24px for larger incumbent cards.

### Inputs / Fields

- **Style:** A 48px-high Instrument Surface with a one-pixel Strong Structural Line, 10px corners, and 0.7rem × 0.9rem padding.
- **Focus:** Border shifts to Navigator Teal and receives a three-pixel 16%-mixed teal halo; keyboard focus also retains the global two-pixel outline.
- **Disabled:** Keep the field readable and reduce opacity to 0.55.
- **Behavior:** Guess submission accepts one trimmed word, uses a 40-character limit, and pairs the field with a Pixelarticons transmit glyph.

### Navigation

- **Mission Header:** A flat flex row separated from content by a one-pixel Strong Structural Line. The compact neuronaut mark and product name sit left; live count, monospaced six-character lobby code, copy action, and 44px theme menu sit right.
- **Responsive Treatment:** Product text and live-count copy may hide on small screens; the identity asset, lobby code, copy affordance, and theme control remain.
- **Theme Menu:** A compact floating menu with 10px corners, a one-pixel strong border, and the Compact Overlay shadow. It supports Light, Dark, and System and closes on outside click or Escape.

### Player Identity

Compact 3D neuronauts come from the existing 4×4 sprite sheet and remain raster identity assets, not emoji substitutes. The default avatar well uses Subtle Surface; player names stay in the workhorse sans. In lists, avatar, name/state, and tabular contribution metrics form a stable row separated by rules.

### Team Bays

Red Shift and Blue Orbit are mirrored structural bays. Each carries a side-specific rail, inward jaw, labeled emblem, uppercase condensed team name, player rows, tabular telemetry, a square progress track, and explicit state text. Setup bays end in a team-switch action; live bays end in aggregate telemetry and “Still searching” or “Finished.” When a team finishes, only that team’s bay and private controls lock—the opposing search remains operable.

### Semantic Field

The ordinary map is a rounded 320-unit SVG surface with three dashed rings and full axes. The VS field is open and transparent, keeps only a compact target ring and short axes, and plots small red/blue points. Own points may expose their words on hover; opposing points are anonymized, slightly dimmer, and non-interactive. The target remains a teal outlined center marker, with a workhorse-sans label.

### Result Comparison

Results lead with the winner’s team emblem, condensed win statement, and oversized grade. A ruled equation shows raw time plus guess and hint penalties before paired team panels compare adjusted time, raw time, guesses, hints, average, best, and player contributions. Winner/runner-up language and team structure remain explicit beyond color.

## Do's and Don'ts

### Do:

- **Do** use semantic light/dark tokens so the same hierarchy survives both themes.
- **Do** build hierarchy with matte field changes, one-pixel rules, size, and typography before considering elevation.
- **Do** keep interactive controls at least 44px and preserve visible keyboard focus and reduced-motion behavior.
- **Do** use custom Pixelarticons glyphs and the existing neuronaut sprite sheet or award artwork when those identities are called for.
- **Do** pair every team color with Red Shift/Blue Orbit naming, the `R`/`B` emblem, mirrored placement, geometry, or explicit status copy.
- **Do** reserve the Airlock Arena’s facing bays and open semantic field for VS competition surfaces.

### Don't:

- **Don't** use gradients, glass effects, decorative glow, or floating-card depth in the mission-control world.
- **Don't** replace the crisp custom glyph family with Lucide-style generic line icons, emoji, or unrelated iconography.
- **Don't** apply Barlow Condensed to normal body copy, forms, navigation, or cooperative content.
- **Don't** promote clipped airlock bays, confrontation seams, or red/blue symmetry into a universal composition for unrelated screens.
- **Don't** reveal opponent words, aliases, hint origins, or interactive tooltips in the VS semantic field.
- **Don't** use Red Shift color for danger states or Navigator Teal as decoration; semantic color roles remain distinct.
