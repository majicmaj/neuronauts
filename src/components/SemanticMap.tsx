import { Crosshair, Orbit } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { GuessResult } from "../types";

interface SemanticMapProps {
  guesses: GuessResult[];
  targetWord?: string;
  hoveredGuessId?: string | null;
  onGuessHover?: (guessId: string | null) => void;
}

const SIZE = 320;
const pointX = (guess: GuessResult) => guess.position.x * SIZE;
const pointY = (guess: GuessResult) => guess.position.y * SIZE;

export function SemanticMap({
  guesses,
  targetWord,
  hoveredGuessId,
  onGuessHover,
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

  return (
    <section className="neuron-card overflow-hidden" aria-labelledby="map-title">
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <Orbit className="h-4 w-4 text-teal-500" />
            <h2 id="map-title" className="font-semibold">Semantic space</h2>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Closer to the center means closer in meaning.
          </p>
        </div>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Live</span>
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
          <rect x="1" y="1" width="318" height="318" rx="12" className="map-surface" />
          {[42, 84, 126].map((radius) => (
            <circle key={radius} cx="160" cy="160" r={radius} className="map-ring" />
          ))}
          <line x1="160" y1="25" x2="160" y2="295" className="map-axis" />
          <line x1="25" y1="160" x2="295" y2="160" className="map-axis" />

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
            <Crosshair className="mb-2 h-5 w-5" />
            Your flight path appears after the first guess.
          </div>
        )}
      </div>
    </section>
  );
}
