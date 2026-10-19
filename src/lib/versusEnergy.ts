import type { VersusPlayerStats } from "../types";

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

export function sortPlayerStats(stats: VersusPlayerStats[]) {
  return [...stats].sort((a, b) =>
    (b.bestSimilarity ?? -1) - (a.bestSimilarity ?? -1) ||
    (b.averageSimilarity ?? -1) - (a.averageSimilarity ?? -1) ||
    b.guessCount - a.guessCount ||
    a.playerName.localeCompare(b.playerName)
  );
}
