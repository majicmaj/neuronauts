import { playerColor } from "../lib/playerColors";
import type { GuessResult, Player } from "../types";
import { MissionGlyph } from "./MissionGlyph";

interface GuessItemProps {
  guess: GuessResult;
  index: number;
  players: Player[];
  latest?: boolean;
  onHoverChange?: (guessId: string | null) => void;
}

export default function GuessItem({
  guess,
  index,
  players,
  latest,
  onHoverChange,
}: GuessItemProps) {
  const liveName = players.find((player) => player.id === guess.playerId)?.name;
  const playerName = liveName || guess.playerName;
  const color = playerColor(guess.colorIndex, guess.playerId);
  const percentage = guess.similarity * 100;
  const barWidth = Math.max(0, Math.min(100, percentage));
  const hasRank = Number.isInteger(guess.rank) && Number.isInteger(guess.rankedWordCount);
  const rankLabel = hasRank
    ? `#${guess.rank!.toLocaleString()} / ${guess.rankedWordCount!.toLocaleString()}`
    : null;

  return (
    <article
      className={`guess-row ${latest ? "guess-row-latest" : ""} ${guess.isHint ? "guess-row-hint" : ""} ${guess.correct ? "guess-row-correct" : ""}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid w-7 shrink-0 place-items-center text-xs font-semibold tabular-nums text-zinc-500 dark:text-zinc-400">
          {guess.correct ? <MissionGlyph name="confirm" className="h-6 w-6 text-teal-500" /> : index + 1}
        </span>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="guess-word truncate text-base font-bold capitalize"
              onPointerEnter={() => onHoverChange?.(guess.id)}
              onPointerLeave={() => onHoverChange?.(null)}
            >
              {guess.guess}
            </span>
            {guess.isHint && (
              <span className="hint-label inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold">
                Nav hint
              </span>
            )}
          </div>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            <span
              className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            {guess.isHint ? `${playerName} called the navigator` : `guessed by ${playerName}`}
            {guess.hintFrom ? ` · halfway from “${guess.hintFrom}”` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-11 sm:pl-0">
        <div className="h-1.5 min-w-20 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700 sm:w-28 sm:flex-none">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${barWidth}%`, backgroundColor: color }}
          />
        </div>
        <span className="w-24 shrink-0 text-right tabular-nums">
          <span className="block text-sm font-bold">{percentage.toFixed(1)}%</span>
          {rankLabel && (
            <span
              className="mt-0.5 block whitespace-nowrap text-[10px] font-medium text-zinc-500 dark:text-zinc-400"
              title={`Rank ${guess.rank!.toLocaleString()} of ${guess.rankedWordCount!.toLocaleString()} reference words`}
            >
              {rankLabel}
            </span>
          )}
        </span>
      </div>
    </article>
  );
}
