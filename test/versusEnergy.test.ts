import assert from "node:assert/strict";
import test from "node:test";
import {
  sortPlayerStats,
  versusCurrentStateText,
  versusElapsedSeconds,
} from "../src/lib/versusEnergy.ts";

test("elapsed time follows the shared match start and safely handles invalid input", () => {
  const startedAt = "2026-08-24T15:00:00.000Z";
  assert.equal(versusElapsedSeconds(startedAt, Date.parse("2026-08-24T15:02:03.900Z")), 123);
  assert.equal(versusElapsedSeconds(startedAt, Date.parse("2026-08-24T14:59:59.000Z")), 0);
  assert.equal(versusElapsedSeconds(null, Date.now()), null);
  assert.equal(versusElapsedSeconds("not-a-date", Date.now()), null);
});

test("reconnected scoreboards describe the teams' current finish state", () => {
  assert.equal(versusCurrentStateText(false, false), "Both teams are searching");
  assert.equal(versusCurrentStateText(true, false), "Red Shift locked the signal · Blue Orbit is still searching");
  assert.equal(versusCurrentStateText(false, true), "Blue Orbit locked the signal · Red Shift is still searching");
  assert.equal(versusCurrentStateText(true, true), "Both teams locked the signal");
});

test("players rank by best guess before average, volume, and name", () => {
  const ranked = sortPlayerStats([
    { playerId: "b", playerName: "Beta", avatarId: null, guessCount: 20, hintCount: 0, averageSimilarity: 0.6, bestSimilarity: 0.8 },
    { playerId: "a", playerName: "Alpha", avatarId: null, guessCount: 2, hintCount: 0, averageSimilarity: 0.5, bestSimilarity: 0.9 },
    { playerId: "c", playerName: "Gamma", avatarId: null, guessCount: 4, hintCount: 0, averageSimilarity: null, bestSimilarity: null },
  ]);

  assert.deepEqual(ranked.map((player) => player.playerId), ["a", "b", "c"]);
});
