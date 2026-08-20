import { playerColor } from "@/lib/playerColors";
import type { GameState, PlayerRecap } from "@/types";
import type { CSSProperties } from "react";
import { MissionGlyph } from "./MissionGlyph";

interface PostGameRecapProps {
  gameState: GameState;
  selfParticipantId?: string;
  onNewGame: () => void;
  onReviewFlightLog: () => void;
}

function formatDuration(seconds: number | null) {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}m ${remainder}s` : `${remainder}s`;
}

function percent(value: number | null) {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

function PlayerStats({ player, isSelf }: { player: PlayerRecap; isSelf: boolean }) {
  const color = playerColor(player.colorIndex, player.playerId);

  return (
    <article className="debrief-player" style={{ "--crew-color": color } as CSSProperties}>
      <div className="debrief-player-identity">
        <span className="debrief-avatar" aria-hidden="true">
          {player.playerName.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate font-extrabold">{player.playerName}</h3>
            {isSelf && <span className="debrief-you">you</span>}
          </div>
          <p className="debrief-callsign">{player.title}</p>
        </div>
      </div>

      <dl className="debrief-player-numbers">
        <div>
          <dt>Guesses</dt>
          <dd>{player.guessCount}</dd>
        </div>
        <div>
          <dt>Best signal</dt>
          <dd>{percent(player.bestGuess?.similarity ?? null)}</dd>
          {player.bestGuess && <span>{player.bestGuess.word}</span>}
        </div>
        <div>
          <dt>Average</dt>
          <dd>{percent(player.averageSimilarity)}</dd>
        </div>
        <div>
          <dt>Hints</dt>
          <dd>{player.hintCount}</dd>
        </div>
      </dl>

      <p className="debrief-player-footnote">
        {player.wrongGuessCount} wrong {player.wrongGuessCount === 1 ? "turn" : "turns"}
        <span aria-hidden="true"> · </span>
        {player.breakthroughs} crew-best {player.breakthroughs === 1 ? "signal" : "signals"}
        {player.awardIds.length > 1 && (
          <>
            <span aria-hidden="true"> · </span>
            {player.awardIds.length} distinctions
          </>
        )}
      </p>
    </article>
  );
}

export function PostGameRecap({
  gameState,
  selfParticipantId,
  onNewGame,
  onReviewFlightLog,
}: PostGameRecapProps) {
  const recap = gameState.recap;
  if (!recap || !gameState.targetWord) return null;

  return (
    <div className="mission-debrief">
      <section className="debrief-hero" aria-labelledby="debrief-title" aria-live="polite">
        <div className="debrief-hero-main">
          <MissionGlyph name="target" className="debrief-target-icon h-14 w-14" />
          <div>
            <h1 id="debrief-title" className="debrief-title">
              Signal locked: <span className="debrief-target capitalize">{gameState.targetWord}</span>
            </h1>
            <p>
              {gameState.winner?.playerName || "A neuronaut"} found the word. The black box has opinions about everybody else.
            </p>
          </div>
        </div>

        <div className="debrief-actions">
          <button onClick={onNewGame} className="debrief-new-mission">
            New mission <MissionGlyph name="launch" className="h-6 w-6" />
          </button>
          <button onClick={onReviewFlightLog} className="debrief-review-button">
            Review flight log <MissionGlyph name="flight-log" className="h-6 w-6" />
          </button>
        </div>

        <dl className="debrief-summary">
          <div><dt>Mission time</dt><dd>{formatDuration(recap.elapsedSeconds)}</dd></div>
          <div><dt>Crew</dt><dd>{recap.playerCount}</dd></div>
          <div><dt>Guesses</dt><dd>{recap.totalGuesses}</dd></div>
          <div><dt>Navigator calls</dt><dd>{recap.totalHints}</dd></div>
        </dl>
      </section>

      <section className="debrief-section" aria-labelledby="crew-debrief-title">
        <div className="debrief-section-heading">
          <div>
            <h2 id="crew-debrief-title">Crew debrief</h2>
            <p>Every brain left a different trail through semantic space.</p>
          </div>
          <MissionGlyph name="stats" className="h-8 w-8" />
        </div>
        <div className="debrief-player-list">
          {recap.players.map((player) => (
            <PlayerStats
              key={player.playerId}
              player={player}
              isSelf={player.playerId === selfParticipantId}
            />
          ))}
        </div>
      </section>

      <section className="debrief-section" aria-labelledby="superlatives-title">
        <div className="debrief-section-heading">
          <div>
            <h2 id="superlatives-title">Mission superlatives</h2>
            <p>Officially unofficial honors from the ship’s black box.</p>
          </div>
          <MissionGlyph name="award" className="h-8 w-8" />
        </div>
        <div className="debrief-awards">
          {recap.awards.map((award) => (
            <article
              key={award.id}
              className="debrief-award"
              style={{ "--crew-color": playerColor(award.colorIndex, award.playerId) } as CSSProperties}
            >
              <span className="debrief-award-mark" aria-hidden="true" />
              <div className="min-w-0">
                <h3>{award.title}</h3>
                <p className="debrief-award-owner">{award.playerName} · {award.metricLabel}</p>
                <p>{award.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
