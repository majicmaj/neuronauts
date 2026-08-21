import type { GuessResult, GuessSubmissionResponse } from "../types";

export interface GuessSubmissionPresentation {
  result: GuessResult | null;
  notice: string | null;
  error: string | null;
}

export function presentGuessSubmission(
  response: GuessSubmissionResponse
): GuessSubmissionPresentation {
  const result = response.result || response.existingResult || null;
  const submitted = response.submittedGuess || response.result?.submittedGuess;
  const resolved = response.resolvedGuess || response.result?.guess;
  const transformed = response.transformed || Boolean(response.result?.submittedGuess);

  if (response.code === "duplicate_guess" && result) {
    return {
      result,
      notice:
        transformed && submitted && resolved
          ? `Already charted · “${submitted}” maps to “${resolved}”`
          : "Already guessed",
      error: null,
    };
  }

  if (!response.ok) {
    return {
      result,
      notice: null,
      error: response.error || "That signal could not be plotted.",
    };
  }

  return {
    result,
    notice:
      transformed && submitted && resolved
        ? `${response.result?.transformation === "spelling-variant" ? "Spelling matched" : "Base form matched"} · “${submitted}” → “${resolved}”`
        : null,
    error: null,
  };
}
