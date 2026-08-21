import type { PointerEvent as ReactPointerEvent } from "react";
import { playerColor } from "../lib/playerColors";
import type { GuessResult, OpponentGuessPoint, TeamId } from "../types";
import { MissionGlyph } from "./MissionGlyph";

interface SemanticMapProps {
  guesses: GuessResult[];
  targetWord?: string;
  hoveredGuessId?: string | null;
  onGuessHover?: (guessId: string | null) => void;
  opponentPoints?: OpponentGuessPoint[];
  teamId?: TeamId;
  versus?: boolean;
}

const SIZE = 320;
const pointX = (guess: GuessResult) => guess.position.x * SIZE;
const pointY = (guess: GuessResult) => guess.position.y * SIZE;

export function SemanticMap({
  guesses,
  targetWord,
  hoveredGuessId,
  onGuessHover,
  opponentPoints = [],
  teamId,
  versus = false,
}: SemanticMapProps) {
  const plotted = guesses.filter((guess) => guess.position);
  const hoveredGuess = plotted.find((guess) => guess.id === hoveredGuessId);
  const fullTooltipText = hoveredGuess
    ? `${hoveredGuess.isHint ? "hint: " : ""}${hoveredGuess.guess}`
    : "";
  const tooltipText = fullTooltipText.length > 28
    ? `${fullTooltipText.slice(0, 27)}…`
    : fullTooltipText;
  const tooltipWidth = Math.min(200, Math.max(48, tooltipText.length * 6.5 + 16));
  const tooltipX = hoveredGuess
    ? Math.max(tooltipWidth / 2 + 5, Math.min(SIZE - tooltipWidth / 2 - 5, pointX(hoveredGuess)))
    : 0;
  const tooltipY = hoveredGuess
    ? pointY(hoveredGuess) < 30
      ? pointY(hoveredGuess) + 22
      : pointY(hoveredGuess) - 12
    : 0;

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const cursorX = ((event.clientX - bounds.left) / bounds.width) * SIZE;
    const cursorY = ((event.clientY - bounds.top) / bounds.height) * SIZE;
    let nearest: GuessResult | undefined;
    let nearestDistance = 9 ** 2;

    for (const guess of plotted) {
      const distance = (pointX(guess) - cursorX) ** 2 + (pointY(guess) - cursorY) ** 2;
      if (distance <= nearestDistance) {
        nearest = guess;
        nearestDistance = distance;
      }
    }

    onGuessHover?.(nearest?.id ?? null);
  };

  const ownTeamColor = teamId === "red" ? "var(--team-red)" : "var(--team-blue)";
  const opponentTeamColor = teamId === "red" ? "var(--team-blue)" : "var(--team-red)";

  return (
    <section className={versus ? "semantic-map-shell is-versus" : "neuron-card semantic-map-shell overflow-hidden"} aria-labelledby="map-title">
      <div className="semantic-map-header flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <MissionGlyph name="orbit" className="h-6 w-6 text-teal-500" />
            <h2 id="map-title" className="font-semibold">Semantic space</h2>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {versus
              ? "Both teams share this space. Only your crew’s points reveal words."
              : "Stronger semantic matches sit closer. Colors track the crew."}
          </p>
        </div>
        <span className="semantic-map-live text-xs font-medium text-zinc-500 dark:text-zinc-400">Live</span>
      </div>

      <div className="p-3 pt-2">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="semantic-map"
          role="img"
          aria-label="Two-dimensional projection of guesses around the target word"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => onGuessHover?.(null)}
        >
          {versus ? (
            <g className="map-versus-target-field" aria-hidden="true">
              <circle cx="160" cy="160" r="28" className="map-ring" />
              <line x1="160" y1="122" x2="160" y2="144" className="map-axis" />
              <line x1="160" y1="176" x2="160" y2="198" className="map-axis" />
              <line x1="122" y1="160" x2="144" y2="160" className="map-axis" />
              <line x1="176" y1="160" x2="198" y2="160" className="map-axis" />
            </g>
          ) : (
            <>
              <rect x="1" y="1" width="318" height="318" rx="12" className="map-surface" />
              {[42, 84, 126].map((radius) => (
                <circle key={radius} cx="160" cy="160" r={radius} className="map-ring" />
              ))}
              <line x1="160" y1="25" x2="160" y2="295" className="map-axis" />
              <line x1="25" y1="160" x2="295" y2="160" className="map-axis" />
            </>
          )}

          {opponentPoints.map((point) => (
            <circle
              key={`opponent-${point.id}`}
              cx={point.position.x * SIZE}
              cy={point.position.y * SIZE}
              r={point.isHint ? 2.5 : 2}
              className="map-dot map-dot-opponent"
              style={{ fill: opponentTeamColor }}
              aria-hidden="true"
            />
          ))}

          {plotted.map((guess) => {
            const x = pointX(guess);
            const y = pointY(guess);
            return (
              <circle
                key={guess.id}
                cx={x}
                cy={y}
                r={guess.correct ? 4.5 : guess.isHint ? 2.75 : 2.25}
                className={guess.isHint ? "map-dot map-dot-hint" : "map-dot"}
                style={{ fill: versus ? ownTeamColor : playerColor(guess.colorIndex, guess.playerId) }}
              />
            );
          })}

          <g>
            <circle cx="160" cy="160" r="6" className="map-target" />
          </g>
          <text x="160" y="181" textAnchor="middle" className="map-target-label">
            {targetWord || "target"}
          </text>

          {hoveredGuess && (
            <g className="map-hover-detail" pointerEvents="none">
              <circle
                cx={pointX(hoveredGuess)}
                cy={pointY(hoveredGuess)}
                r="7"
                className="map-active-ring"
                style={{ stroke: versus ? ownTeamColor : playerColor(hoveredGuess.colorIndex, hoveredGuess.playerId) }}
              />
              <rect
                x={tooltipX - tooltipWidth / 2}
                y={tooltipY - 13}
                width={tooltipWidth}
                height="19"
                rx="4"
                className="map-tooltip-surface"
              />
              <text x={tooltipX} y={tooltipY} textAnchor="middle" className="map-label">
                {tooltipText}
              </text>
            </g>
          )}
        </svg>

        {plotted.length === 0 && (
          <div className="pointer-events-none -mt-28 mb-16 flex flex-col items-center text-center text-sm text-zinc-500 dark:text-zinc-400">
            <MissionGlyph name="target" className="mb-2 h-6 w-6" />
            Your flight path appears after the first guess.
          </div>
        )}
      </div>
    </section>
  );
}
