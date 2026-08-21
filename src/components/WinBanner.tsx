import type { GameState, RematchState } from "../types";
import { MissionGlyph } from "./MissionGlyph";
import { PlayAgainButton } from "./PlayAgainButton";

interface WinBannerProps {
  gameState: GameState;
  rematch: RematchState | null;
  selfParticipantId?: string;
  playAgainBusy: boolean;
  playAgainDisabled: boolean;
  onPlayAgain: () => void;
}

function elapsedLabel(startedAt: string | null, solvedAt: string | null) {
  if (!startedAt || !solvedAt) return null;
  const seconds = Math.max(0, Math.round((Date.parse(solvedAt) - Date.parse(startedAt)) / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}m ${remainder}s` : `${remainder}s`;
}

export function WinBanner({
  gameState,
  rematch,
  selfParticipantId,
  playAgainBusy,
  playAgainDisabled,
  onPlayAgain,
}: WinBannerProps) {
  if (gameState.status !== "won" || !gameState.targetWord) return null;
  const elapsed = elapsedLabel(gameState.startedAt, gameState.solvedAt);

  return (
    <section className="win-banner" aria-live="polite">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <MissionGlyph name="target" className="mt-1 h-12 w-12 shrink-0 text-teal-800 dark:text-teal-200" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Signal found: <span className="capitalize">{gameState.targetWord}</span></h2>
            <p className="mt-1 text-sm text-teal-950/70 dark:text-white/70">
              {gameState.winner?.playerName || "A neuronaut"} found it in {gameState.guessHistory.length} {gameState.guessHistory.length === 1 ? "guess" : "guesses"}
              {elapsed ? ` · ${elapsed}` : ""}.
            </p>
          </div>
        </div>
        <PlayAgainButton
          rematch={rematch}
          totalPlayers={gameState.recap?.playerCount || 1}
          selfParticipantId={selfParticipantId}
          busy={playAgainBusy}
          disabled={playAgainDisabled}
          className="neuron-primary-button shrink-0"
          onClick={onPlayAgain}
        />
      </div>
    </section>
  );
}
