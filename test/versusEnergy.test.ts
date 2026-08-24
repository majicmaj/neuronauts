import assert from "node:assert/strict";
import test from "node:test";
import {
  impactIntensity,
  sortPlayerStats,
  versusCurrentStateText,
  versusElapsedSeconds,
  versusEnergyLevel,
  versusEnergyShare,
} from "../src/lib/versusEnergy.ts";

test("energy share stays competitive until a team solves", () => {
  assert.equal(versusEnergyShare(0.95, 0.02), 92);
  assert.ok(Math.abs(versusEnergyShare(0.95, 0.9) - 51.35135135135135) < 0.0001);
  assert.equal(versusEnergyShare(1, 0.9), 100);
  assert.equal(versusEnergyShare(0.9, 1), 0);
  assert.equal(versusEnergyShare(0, 0), 50);
});

test("energy level rises with match activity", () => {
  assert.deepEqual([0, 7, 8, 24, 60, 120].map(versusEnergyLevel), [0, 0, 1, 2, 3, 4]);
});

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

test("impact intensity distinguishes ordinary guesses, gains, breakthroughs, and solves", () => {
  assert.equal(impactIntensity(0.4, 0.4), "guess");
  assert.equal(impactIntensity(0.4, 0.43), "gain");
  assert.equal(impactIntensity(0.4, 0.56), "breakthrough");
  assert.equal(impactIntensity(0.98, 1), "solve");
});

test("players rank by best guess before average, volume, and name", () => {
  const ranked = sortPlayerStats([
    { playerId: "b", playerName: "Beta", avatarId: null, guessCount: 20, hintCount: 0, averageSimilarity: 0.6, bestSimilarity: 0.8 },
    { playerId: "a", playerName: "Alpha", avatarId: null, guessCount: 2, hintCount: 0, averageSimilarity: 0.5, bestSimilarity: 0.9 },
    { playerId: "c", playerName: "Gamma", avatarId: null, guessCount: 4, hintCount: 0, averageSimilarity: null, bestSimilarity: null },
  ]);

  assert.deepEqual(ranked.map((player) => player.playerId), ["a", "b", "c"]);
});
