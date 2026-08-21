import { useMemo, useState } from "react";
import type { GuessResult, Player } from "../types";
import GuessItem from "./GuessItem";
import { MissionGlyph } from "./MissionGlyph";

interface GuessListProps {
  guesses: GuessResult[];
  players: Player[];
  featuredGuess?: GuessResult | null;
  featuredGuessVersion?: number;
  featuredGuessIsRecall?: boolean;
  onGuessHover?: (guessId: string | null) => void;
}

type SortMode = "newest" | "similarity";

export function GuessList({
  guesses,
  players,
  featuredGuess,
  featuredGuessVersion = 0,
  featuredGuessIsRecall = false,
  onGuessHover,
}: GuessListProps) {
  const [sort, setSort] = useState<SortMode>("similarity");
  const sorted = useMemo(() => {
    const copy = [...guesses];
    return sort === "similarity"
      ? copy.sort((a, b) =>
          b.similarity - a.similarity ||
          (b.cosineSimilarity ?? -1) - (a.cosineSimilarity ?? -1)
        )
      : copy.reverse();
  }, [guesses, sort]);

  const guessIndexById = useMemo(
    () => new Map(guesses.map((guess, index) => [guess.id, index])),
    [guesses]
  );
  const featuredIndex = featuredGuess
    ? (guessIndexById.get(featuredGuess.id) ?? -1)
    : -1;

  return (
    <div className="space-y-3">
      {featuredGuess && featuredIndex >= 0 && (
        <section
          key={`${featuredGuess.id}-${featuredGuessVersion}`}
          className="latest-guess neuron-card overflow-hidden"
          aria-labelledby="latest-guess-title"
          aria-live="polite"
        >
          <div className="latest-guess-heading">
            <div className="flex items-center gap-2">
              <MissionGlyph name="signal" className="h-6 w-6 text-teal-700 dark:text-teal-300" />
              <h2 id="latest-guess-title" className="font-semibold">Latest guess</h2>
            </div>
            {featuredGuessIsRecall && (
              <span className="latest-guess-recall">Already guessed</span>
            )}
          </div>
          <GuessItem
            guess={featuredGuess}
            index={featuredIndex}
            players={players}
            latest
            onHoverChange={onGuessHover}
          />
        </section>
      )}

      <section className="neuron-card min-h-[22rem] overflow-hidden" aria-labelledby="guesses-title">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3.5 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <MissionGlyph name="flight-log" className="h-6 w-6 text-teal-700 dark:text-teal-300" />
            <h2 id="guesses-title" className="font-semibold">Flight log</h2>
            <span className="text-xs text-zinc-500">{guesses.length}</span>
          </div>
          <div className="sort-control flex text-xs" aria-label="Sort flight log">
            <button
              type="button"
              onClick={() => setSort("newest")}
              aria-pressed={sort === "newest"}
              className={`rounded-md px-2.5 py-1.5 transition ${sort === "newest" ? "bg-white font-semibold text-zinc-900 dark:bg-zinc-700 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}
            >
              Newest
            </button>
            <button
              type="button"
              onClick={() => setSort("similarity")}
              aria-pressed={sort === "similarity"}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 transition ${sort === "similarity" ? "bg-white font-semibold text-zinc-900 dark:bg-zinc-700 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}
            >
              Closest
            </button>
          </div>
        </div>

        <div className="guess-scroll max-h-[34rem] overflow-y-auto">
          {sorted.map((guess) => (
            <GuessItem
              key={guess.id}
              guess={guess}
              index={guessIndexById.get(guess.id) ?? -1}
              players={players}
              latest={guess.id === guesses[guesses.length - 1]?.id}
              onHoverChange={onGuessHover}
            />
          ))}

          {sorted.length === 0 && (
            <div className="grid min-h-64 place-items-center text-center">
              <div className="max-w-xs px-6">
                <p className="font-semibold">No signals yet</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Guess a word to measure its semantic distance from the target.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
