import { ArrowDownUp, ListFilter } from "lucide-react";
import { useMemo, useState } from "react";
import type { GuessResult, Player } from "../types";
import GuessItem from "./GuessItem";

interface GuessListProps {
  guesses: GuessResult[];
  players: Player[];
  onGuessHover?: (guessId: string | null) => void;
}

type SortMode = "newest" | "similarity";

export function GuessList({ guesses, players, onGuessHover }: GuessListProps) {
  const [sort, setSort] = useState<SortMode>("newest");
  const sorted = useMemo(() => {
    const copy = [...guesses];
    return sort === "similarity"
      ? copy.sort((a, b) => b.similarity - a.similarity)
      : copy.reverse();
  }, [guesses, sort]);

  return (
    <section className="neuron-card min-h-[22rem] overflow-hidden" aria-labelledby="guesses-title">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3.5 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-teal-700 dark:text-teal-300" />
          <h2 id="guesses-title" className="font-semibold">Flight log</h2>
          <span className="text-xs text-zinc-500">{guesses.length}</span>
        </div>
        <div className="sort-control flex text-xs">
          <button
            onClick={() => setSort("newest")}
            className={`rounded-md px-2.5 py-1.5 transition ${sort === "newest" ? "bg-white font-semibold text-zinc-900 dark:bg-zinc-700 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}
          >
            Newest
          </button>
          <button
            onClick={() => setSort("similarity")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 transition ${sort === "similarity" ? "bg-white font-semibold text-zinc-900 dark:bg-zinc-700 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}
          >
            <ArrowDownUp className="h-3 w-3" /> Closest
          </button>
        </div>
      </div>

      <div className="guess-scroll max-h-[34rem] overflow-y-auto px-4">
        {sorted.map((guess) => (
          <GuessItem
            key={guess.id}
            guess={guess}
            index={guesses.findIndex((entry) => entry.id === guess.id)}
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
  );
}
