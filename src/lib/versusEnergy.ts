import type { TeamId, VersusPlayerStats } from "../types";

const MIN_UNSOLVED_SHARE = 8;

export function versusEnergyShare(redBest: number | null, blueBest: number | null) {
  const red = Math.max(0, Math.min(1, redBest ?? 0));
  const blue = Math.max(0, Math.min(1, blueBest ?? 0));

  if (red === 1 && blue < 1) return 100;
  if (blue === 1 && red < 1) return 0;
  if (red === 1 && blue === 1) return 50;
  if (red + blue === 0) return 50;

  const relativeShare = (red / (red + blue)) * 100;
  return Math.max(MIN_UNSOLVED_SHARE, Math.min(100 - MIN_UNSOLVED_SHARE, relativeShare));
}

export function versusEnergyLevel(totalGuesses: number) {
  if (totalGuesses >= 120) return 4;
  if (totalGuesses >= 60) return 3;
  if (totalGuesses >= 24) return 2;
  if (totalGuesses >= 8) return 1;
  return 0;
}

export function versusElapsedSeconds(startedAt: string | null, now: number) {
  if (!startedAt) return null;
  const startedAtMs = Date.parse(startedAt);
  if (!Number.isFinite(startedAtMs)) return null;
  return Math.max(0, Math.floor((now - startedAtMs) / 1_000));
}

export function versusCurrentStateText(redFinished: boolean, blueFinished: boolean) {
  if (redFinished && blueFinished) return "Both teams locked the signal";
  if (redFinished) return "Red Shift locked the signal · Blue Orbit is still searching";
  if (blueFinished) return "Blue Orbit locked the signal · Red Shift is still searching";
  return "Both teams are searching";
}

export type VersusImpactIntensity = "guess" | "gain" | "breakthrough" | "solve";

export interface VersusImpact {
  id: number;
  teamId: TeamId;
  intensity: VersusImpactIntensity;
  gain: number;
}

export function impactIntensity(previousBest: number | null, nextBest: number | null): VersusImpactIntensity {
  const previous = previousBest ?? 0;
  const next = nextBest ?? 0;
  const gain = Math.max(0, next - previous);

  if (next === 1 && previous < 1) return "solve";
  if (gain >= 0.1 || (next >= 0.85 && gain >= 0.035)) return "breakthrough";
  if (gain >= 0.002) return "gain";
  return "guess";
}

export function sortPlayerStats(stats: VersusPlayerStats[]) {
  return [...stats].sort((a, b) =>
    (b.bestSimilarity ?? -1) - (a.bestSimilarity ?? -1) ||
    (b.averageSimilarity ?? -1) - (a.averageSimilarity ?? -1) ||
    b.guessCount - a.guessCount ||
    a.playerName.localeCompare(b.playerName)
  );
}
