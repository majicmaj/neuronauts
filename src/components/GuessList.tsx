import { ArrowDownUp, ListFilter } from "lucide-react";
import { useMemo, useState } from "react";
import type { GuessResult, Player } from "../types";
import GuessItem from "./GuessItem";

interface GuessListProps {
  guesses: GuessResult[];
  players: Player[];
}

type SortMode = "newest" | "similarity";

export function GuessList({ guesses, players }: GuessListProps) {
  const [sort, setSort] = useState<SortMode>("newest");
  const sorted = useMemo(() => {
    const copy = [...guesses];
    return sort === "similarity"
      ? copy.sort((a, b) => b.similarity - a.similarity)
      : copy.reverse();
  }, [guesses, sort]);

  return (
    <section className="neuron-card min-h-[22rem] overflow-hidden" aria-labelledby="guesses-title">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-teal-500" />
          <h2 id="guesses-title" className="font-semibold">Flight log</h2>
          <span className="text-xs text-zinc-500">{guesses.length}</span>
        </div>
        <div className="flex rounded-xl bg-zinc-100 p-1 text-xs dark:bg-zinc-900">
          <button
            onClick={() => setSort("newest")}
            className={`rounded-lg px-2.5 py-1.5 transition ${sort === "newest" ? "bg-white font-semibold shadow-sm dark:bg-zinc-800" : "text-zinc-500"}`}
          >
            Newest
          </button>
          <button
            onClick={() => setSort("similarity")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition ${sort === "similarity" ? "bg-white font-semibold shadow-sm dark:bg-zinc-800" : "text-zinc-500"}`}
          >
            <ArrowDownUp className="h-3 w-3" /> Closest
          </button>
        </div>
      </div>

      <div className="max-h-[34rem] space-y-2 overflow-y-auto p-3">
        {sorted.map((guess) => (
          <GuessItem
            key={guess.id}
            guess={guess}
            index={guesses.findIndex((entry) => entry.id === guess.id)}
            players={players}
            latest={guess.id === guesses[guesses.length - 1]?.id}
          />
        ))}

        {sorted.length === 0 && (
          <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-zinc-200 text-center dark:border-zinc-800">
            <div className="max-w-xs px-6">
              <div className="mx-auto mb-3 h-2 w-24 rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-teal-400 opacity-60" />
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
