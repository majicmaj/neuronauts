import assert from "node:assert/strict";
import test from "node:test";
import { presentGuessSubmission } from "../src/lib/guessSubmission.ts";
import type { GuessResult } from "../src/types.ts";

const RESULT: GuessResult = {
  id: "guess-1",
  guess: "jewelry",
  similarity: 0.8,
  correct: false,
  isHint: false,
  hintFrom: null,
  playerId: "player-1",
  playerName: "Variant Voyager",
  createdAt: "2026-08-21T00:00:00.000Z",
  position: { x: 0.5, y: 0.5 },
};

test("explains an accepted spelling normalization", () => {
  const presentation = presentGuessSubmission({
    ok: true,
    result: {
      ...RESULT,
      submittedGuess: "jewellery",
      transformation: "spelling-variant",
    },
  });

  assert.equal(presentation.result?.id, RESULT.id);
  assert.equal(
    presentation.notice,
    "Spelling matched · “jewellery” → “jewelry”"
  );
  assert.equal(presentation.error, null);
});

test("recalls the canonical row for a duplicate variant", () => {
  const presentation = presentGuessSubmission({
    ok: false,
    code: "duplicate_guess",
    submittedGuess: "jewellery",
    resolvedGuess: "jewelry",
    transformed: true,
    transformation: "spelling-variant",
    existingResult: RESULT,
  });

  assert.equal(presentation.result?.id, RESULT.id);
  assert.equal(
    presentation.notice,
    "Already charted · “jewellery” maps to “jewelry”"
  );
  assert.equal(presentation.error, null);
});
