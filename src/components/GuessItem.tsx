import { CheckCircle2, Sparkles } from "lucide-react";
import type { GuessResult, Player } from "../types";

interface GuessItemProps {
  guess: GuessResult;
  index: number;
  players: Player[];
  latest?: boolean;
}

export default function GuessItem({ guess, index, players, latest }: GuessItemProps) {
  const liveName = players.find((player) => player.id === guess.playerId)?.name;
  const playerName = liveName || guess.playerName;
  const percentage = guess.similarity * 100;
  const barWidth = Math.max(0, Math.min(100, percentage));

  return (
    <article
      className={`guess-row ${latest ? "guess-row-latest" : ""} ${guess.isHint ? "guess-row-hint" : ""} ${guess.correct ? "guess-row-correct" : ""}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
          {guess.correct ? <CheckCircle2 className="h-4 w-4 text-teal-500" /> : index + 1}
        </span>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-base font-bold capitalize">{guess.guess}</span>
            {guess.isHint && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-500/12 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-violet-700 dark:text-violet-300">
                <Sparkles className="h-3 w-3" /> Hint
              </span>
            )}
          </div>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {guess.isHint ? `${playerName} called the navigator` : `guessed by ${playerName}`}
            {guess.hintFrom ? ` · halfway from “${guess.hintFrom}”` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-11 sm:pl-0">
        <div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 sm:w-28 sm:flex-none">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-teal-400 transition-[width] duration-500"
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <span className="w-14 text-right text-sm font-bold tabular-nums">
          {percentage.toFixed(1)}%
        </span>
      </div>
    </article>
  );
}
