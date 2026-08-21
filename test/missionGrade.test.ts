import assert from "node:assert/strict";
import test from "node:test";
import { calculateMissionGrade } from "../src/lib/missionGrade.ts";

test("awards an S for the excellent ten-minute benchmark", () => {
  const grade = calculateMissionGrade({
    elapsedSeconds: 10 * 60,
    totalGuesses: 100,
    totalHints: 0,
  });

  assert.equal(grade.letter, "S");
  assert.equal(grade.score, 100);
});

test("rates a thirty-minute, five-hundred-guess mission as a poor run", () => {
  const grade = calculateMissionGrade({
    elapsedSeconds: 30 * 60,
    totalGuesses: 500,
    totalHints: 2,
  });

  assert.equal(grade.letter, "D");
  assert.equal(grade.score, 32);
});

test("grades a middle-of-the-road mission between the benchmark extremes", () => {
  const grade = calculateMissionGrade({
    elapsedSeconds: 20 * 60,
    totalGuesses: 300,
    totalHints: 1,
  });

  assert.equal(grade.letter, "B");
  assert.equal(grade.score, 66);
});

test("renormalizes the grade when an old recap has no elapsed time", () => {
  const grade = calculateMissionGrade({
    elapsedSeconds: null,
    totalGuesses: 100,
    totalHints: 0,
  });

  assert.equal(grade.letter, "S");
  assert.equal(grade.score, 100);
  assert.equal(grade.factorScores.time, null);
});
