import { ArrowRight, Sparkles, Trophy } from "lucide-react";
import type { GameState } from "../types";

interface WinBannerProps {
  gameState: GameState;
  onNewGame: () => void;
}

function elapsedLabel(startedAt: string | null, solvedAt: string | null) {
  if (!startedAt || !solvedAt) return null;
  const seconds = Math.max(0, Math.round((Date.parse(solvedAt) - Date.parse(startedAt)) / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}m ${remainder}s` : `${remainder}s`;
}

export function WinBanner({ gameState, onNewGame }: WinBannerProps) {
  if (gameState.status !== "won" || !gameState.targetWord) return null;
  const elapsed = elapsedLabel(gameState.startedAt, gameState.solvedAt);

  return (
    <section className="win-banner" aria-live="polite">
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white/80 p-3 text-teal-700 shadow-sm dark:bg-black/30 dark:text-teal-200">
            <Trophy className="h-7 w-7" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-teal-800/70 dark:text-teal-100/70">
              <Sparkles className="h-3.5 w-3.5" /> Signal found
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{gameState.targetWord}</h2>
            <p className="mt-1 text-sm text-teal-950/70 dark:text-white/70">
              {gameState.winner?.playerName || "A neuronaut"} found it in {gameState.guessHistory.length} {gameState.guessHistory.length === 1 ? "guess" : "guesses"}
              {elapsed ? ` · ${elapsed}` : ""}.
            </p>
          </div>
        </div>
        <button onClick={onNewGame} className="neuron-primary-button shrink-0">
          New mission <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
