import type { RematchState } from "@/types";
import { MissionGlyph } from "./MissionGlyph";

interface PlayAgainButtonProps {
  rematch: RematchState | null;
  totalPlayers: number;
  selfParticipantId?: string;
  busy: boolean;
  disabled?: boolean;
  className: string;
  onClick: () => void;
}

export function PlayAgainButton({
  rematch,
  totalPlayers,
  selfParticipantId,
  busy,
  disabled = false,
  className,
  onClick,
}: PlayAgainButtonProps) {
  const readyCount = rematch?.readyCount || 0;
  const totalCount = rematch?.totalCount || totalPlayers;
  const alreadyReady = Boolean(
    selfParticipantId && rematch?.readyParticipantIds.includes(selfParticipantId)
  );
  const actionLabel = busy
    ? "Joining next mission"
    : alreadyReady
      ? "Rejoin next mission"
      : "Play again";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className={`${className} play-again-button`}
      aria-label={`${actionLabel}. ${readyCount} of ${totalCount} crew ready.`}
    >
      <span>{actionLabel}</span>
      <span className="play-again-count" aria-live="polite">
        {readyCount} / {totalCount}
      </span>
      <MissionGlyph name={busy ? "loader" : "launch"} className={busy ? "mission-loader h-6 w-6" : "h-6 w-6"} />
    </button>
  );
}
