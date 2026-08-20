import { Crosshair, Orbit } from "lucide-react";
import type { GuessResult } from "../types";

interface SemanticMapProps {
  guesses: GuessResult[];
  targetWord?: string;
}

const SIZE = 320;
const pointX = (guess: GuessResult) => guess.position.x * SIZE;
const pointY = (guess: GuessResult) => guess.position.y * SIZE;

export function SemanticMap({ guesses, targetWord }: SemanticMapProps) {
  const plotted = guesses.filter((guess) => guess.position);
  const labeled = new Set(plotted.slice(-7).map((guess) => guess.id));
  const path = plotted
    .map((guess) => `${pointX(guess)},${pointY(guess)}`)
    .join(" ");

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
        <span className="rounded-full bg-teal-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
          live map
        </span>
      </div>

      <div className="p-3 pt-2">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="semantic-map"
          role="img"
          aria-label="Two-dimensional projection of guesses around the target word"
        >
          <defs>
            <radialGradient id="mapGlow">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.18" />
              <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
            <filter id="targetGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect x="1" y="1" width="318" height="318" rx="20" className="map-surface" />
          <circle cx="160" cy="160" r="138" fill="url(#mapGlow)" />
          {[42, 84, 126].map((radius) => (
            <circle key={radius} cx="160" cy="160" r={radius} className="map-ring" />
          ))}
          <line x1="160" y1="25" x2="160" y2="295" className="map-axis" />
          <line x1="25" y1="160" x2="295" y2="160" className="map-axis" />

          {plotted.length > 1 && (
            <polyline points={path} className="map-path" pathLength="1" />
          )}

          {plotted.map((guess, index) => {
            const x = pointX(guess);
            const y = pointY(guess);
            const latest = index === plotted.length - 1;
            return (
              <g key={guess.id}>
                {latest && <circle cx={x} cy={y} r="12" className="map-latest-ring" />}
                <circle
                  cx={x}
                  cy={y}
                  r={guess.correct ? 7 : guess.isHint ? 6 : 5}
                  className={guess.isHint ? "map-dot map-dot-hint" : "map-dot"}
                />
                {labeled.has(guess.id) && !guess.correct && (
                  <text
                    x={Math.max(10, Math.min(280, x + 8))}
                    y={Math.max(16, y - 11)}
                    className="map-label"
                  >
                    {guess.isHint ? `✦ ${guess.guess}` : guess.guess}
                  </text>
                )}
              </g>
            );
          })}

          <g filter="url(#targetGlow)">
            <circle cx="160" cy="160" r="11" className="map-target-glow" />
            <circle cx="160" cy="160" r="6" className="map-target" />
          </g>
          <text x="160" y="181" textAnchor="middle" className="map-target-label">
            {targetWord ? `★ ${targetWord}` : "TARGET"}
          </text>
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
