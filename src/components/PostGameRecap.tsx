import { AVATARS, assignUniqueAvatarIds, type AvatarId } from "@/lib/avatars";
import {
  positionFloatingDisclosure,
  type FloatingPosition,
} from "@/lib/floatingDisclosure";
import { calculateMissionGrade, type MissionGradeLetter } from "@/lib/missionGrade";
import { playerColor } from "@/lib/playerColors";
import type { GameState, PlayerRecap, RecapAward, RematchState } from "@/types";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { AwardIcon } from "./AwardIcon";
import { MissionGlyph } from "./MissionGlyph";
import { PlayAgainButton } from "./PlayAgainButton";
import { PlayerAvatar } from "./PlayerAvatar";

interface PostGameRecapProps {
  gameState: GameState;
  selfParticipantId?: string;
  rematch: RematchState | null;
  playAgainBusy: boolean;
  playAgainDisabled: boolean;
  onPlayAgain: () => void;
  onReviewFlightLog: () => void;
}

type Citation = Pick<RecapAward, "id" | "title" | "metricLabel" | "description">;

const GRADE_COLORS: Record<MissionGradeLetter, string> = {
  S: "#7de3cd",
  A: "#72b7e6",
  B: "#aaa0ff",
  C: "#f0bb64",
  D: "#f29a5b",
};

const AWARD_PRIORITY: Record<string, number> = {
  "signal-finder": 100,
  "closest-miss": 95,
  "biggest-leap": 90,
  "most-breakthroughs": 85,
  "best-average": 80,
  "first-contact": 70,
  "fewest-guesses": 65,
  "most-guesses": 60,
  "furthest-guess": 55,
  "most-hints": 50,
  "most-wrong": 45,
};

const FALLBACK_AWARD_IDS: Record<string, string> = {
  "Cosmic Wildcard": "fallback-cosmic-wildcard",
  "Backup Brain": "fallback-backup-brain",
  "Dark Matter Department": "fallback-dark-matter",
  "Moon-Shot Mechanic": "fallback-moon-shot",
};

function formatDuration(seconds: number | null) {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}m ${remainder}s` : `${remainder}s`;
}

function percent(value: number | null) {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

function timeAssessment(seconds: number | null) {
  if (seconds === null) return "Time unavailable";
  if (seconds <= 10 * 60) return "Blazing route";
  if (seconds <= 20 * 60) return "On course";
  if (seconds <= 30 * 60) return "Wide orbit";
  return "Long drift";
}

function guessAssessment(guesses: number) {
  if (guesses <= 100) return "Pinpoint search";
  if (guesses <= 250) return "Focused search";
  if (guesses <= 500) return "Scenic route";
  return "Deep search";
}

function hintAssessment(hints: number) {
  if (hints === 0) return "Unaided";
  if (hints === 1) return "One assist";
  return `${hints} assists`;
}

function coolestAwards(player: PlayerRecap, awards: RecapAward[]): Citation[] {
  const selected = awards
    .filter((award) => award.playerId === player.playerId)
    .sort(
      (a, b) =>
        (AWARD_PRIORITY[b.id] || 0) - (AWARD_PRIORITY[a.id] || 0)
    )
    .slice(0, 3);

  return selected.length
    ? selected
    : [{
        id: FALLBACK_AWARD_IDS[player.title] || "fallback",
        title: player.title,
        metricLabel: "Crew citation",
        description: player.titleDetail,
      }];
}

function AwardCitation({ award }: { award: Citation }) {
  const detailId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const detailRef = useRef<HTMLParagraphElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState<FloatingPosition | null>(null);
  const isOpen = isPinned || isHovered || isFocused;

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const anchor = button.getBoundingClientRect();
    const detail = detailRef.current?.getBoundingClientRect();
    setPosition(positionFloatingDisclosure(
      anchor,
      { width: detail?.width || 256, height: detail?.height || 0 },
      { width: window.innerWidth, height: window.innerHeight }
    ));
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }
    updatePosition();
  }, [isOpen, position?.width, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const reposition = () => updatePosition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isPinned) return;
    const dismiss = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        detailRef.current?.contains(target)
      ) return;
      setIsPinned(false);
      setIsFocused(false);
    };
    document.addEventListener("pointerdown", dismiss, true);
    return () => document.removeEventListener("pointerdown", dismiss, true);
  }, [isPinned]);

  const closeDisclosure = () => {
    setIsPinned(false);
    setIsHovered(false);
    setIsFocused(false);
  };

  return (
    <div
      className="debrief-card-award"
      data-open={isOpen}
      onPointerEnter={(event) => event.pointerType === "mouse" && setIsHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-controls={detailId}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? detailId : undefined}
        onClick={() => {
          setIsPinned((open) => {
            if (open) setIsFocused(false);
            return !open;
          });
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          closeDisclosure();
        }}
      >
        <AwardIcon awardId={award.id} />
        <span>
          <strong>{award.title}</strong>
          <small>{award.metricLabel}</small>
        </span>
      </button>
      {isOpen && typeof document !== "undefined" && createPortal(
        <p
          ref={detailRef}
          id={detailId}
          role="tooltip"
          className="debrief-card-award-detail"
          data-placement={position?.placement || "below"}
          style={position ? {
            left: position.left,
            top: position.top,
            width: position.width,
          } : undefined}
        >
          {award.description}
        </p>,
        document.body
      )}
    </div>
  );
}

function PlayerResultCard({
  player,
  avatarId,
  awards,
  isSelf,
}: {
  player: PlayerRecap;
  avatarId: AvatarId;
  awards: Citation[];
  isSelf: boolean;
}) {
  const color = playerColor(player.colorIndex, player.playerId);

  return (
    <article
      className={`debrief-player-card ${player.foundTarget ? "is-winner" : ""}`}
      style={{ "--crew-color": color } as CSSProperties}
    >
      <div className="debrief-player-stage">
        <span className="debrief-player-result">
          {player.foundTarget ? "Target finder" : `${player.guessCount} transmissions`}
        </span>
        <PlayerAvatar avatarId={avatarId} className="debrief-card-avatar" decorative />
      </div>

      <header className="debrief-player-heading">
        <h3>{player.playerName}</h3>
        {isSelf && <span className="debrief-you">you</span>}
      </header>

      <div className="debrief-card-awards" aria-label={`${player.playerName} distinctions`}>
        {awards.map((award) => (
          <AwardCitation key={`${award.title}-${award.metricLabel}`} award={award} />
        ))}
      </div>

      <dl className="debrief-card-stats">
        <div>
          <dt>Guesses</dt>
          <dd>{player.guessCount}</dd>
        </div>
        <div>
          <dt>Average</dt>
          <dd>{percent(player.averageSimilarity)}</dd>
        </div>
        <div>
          <dt>Best signal</dt>
          <dd>{percent(player.bestGuess?.similarity ?? null)}</dd>
          {player.bestGuess && <span>{player.bestGuess.word}</span>}
        </div>
        <div>
          <dt>Hints</dt>
          <dd>{player.hintCount}</dd>
        </div>
      </dl>

      <p className="debrief-card-footnote">
        {player.breakthroughs} crew-best {player.breakthroughs === 1 ? "signal" : "signals"}
        <span aria-hidden="true"> · </span>
        {player.wrongGuessCount} wrong {player.wrongGuessCount === 1 ? "turn" : "turns"}
      </p>
    </article>
  );
}

export function PostGameRecap({
  gameState,
  selfParticipantId,
  rematch,
  playAgainBusy,
  playAgainDisabled,
  onPlayAgain,
  onReviewFlightLog,
}: PostGameRecapProps) {
  const recap = gameState.recap;
  if (!recap || !gameState.targetWord) return null;

  const grade = calculateMissionGrade({
    elapsedSeconds: recap.elapsedSeconds,
    totalGuesses: recap.totalGuesses,
    totalHints: recap.totalHints,
  });
  const avatarAssignments = assignUniqueAvatarIds(
    recap.players.map((player) => ({
      key: player.playerId,
      avatarId: player.avatarId,
    }))
  );
  const gradeStyle = {
    "--grade-color": GRADE_COLORS[grade.letter],
  } as CSSProperties;

  return (
    <div className="mission-debrief" style={gradeStyle}>
      <section className="debrief-stage" aria-labelledby="debrief-title" aria-live="polite">
        <div className="debrief-grade-lock">
          <div className="debrief-grade-column">
            <div
              className="debrief-grade-mark"
              aria-label={`Mission grade ${grade.letter}, ${grade.score} out of 100.`}
            >
              <span>Mission grade</span>
              <strong>{grade.letter}</strong>
              <small>{grade.score} / 100</small>
            </div>
            <details className="debrief-grade-help">
              <summary>How grading works</summary>
              <p>
                Guesses count for 45%, time 35%, and navigator calls 20%.
                The S benchmark is 10 minutes, 100 guesses, and no hints.
              </p>
            </details>
          </div>

          <div className="debrief-lock-copy">
            <MissionGlyph name="target" className="debrief-target-icon h-10 w-10" />
            <h1 id="debrief-title" className="debrief-title">
              Signal locked: <span className="debrief-target capitalize">{gameState.targetWord}</span>
            </h1>
            <p className="debrief-winner-line">
              <strong>{gameState.winner?.playerName || "A neuronaut"}</strong> landed the final signal for a crew of {recap.playerCount}.
            </p>
            <p className="debrief-grade-verdict">
              <strong>{grade.label}.</strong> {grade.summary}
            </p>
          </div>
        </div>

        <dl className="debrief-grade-factors">
          <div>
            <dt>Mission time</dt>
            <dd>{formatDuration(recap.elapsedSeconds)}</dd>
            <span>{timeAssessment(recap.elapsedSeconds)}</span>
          </div>
          <div>
            <dt>Guesses</dt>
            <dd>{recap.totalGuesses}</dd>
            <span>{guessAssessment(recap.totalGuesses)}</span>
          </div>
          <div>
            <dt>Navigator calls</dt>
            <dd>{recap.totalHints}</dd>
            <span>{hintAssessment(recap.totalHints)}</span>
          </div>
        </dl>

        <div className="debrief-actions">
          <PlayAgainButton
            rematch={rematch}
            totalPlayers={recap.playerCount}
            selfParticipantId={selfParticipantId}
            busy={playAgainBusy}
            disabled={playAgainDisabled}
            className="debrief-new-mission"
            onClick={onPlayAgain}
          />
          <button onClick={onReviewFlightLog} className="debrief-review-button">
            Review flight log <MissionGlyph name="flight-log" className="h-6 w-6" />
          </button>
        </div>
      </section>

      <section className="debrief-roster" aria-labelledby="crew-results-title">
        <header className="debrief-roster-heading">
          <div>
            <h2 id="crew-results-title">Crew results</h2>
            <p>Each neuronaut’s sharpest distinctions and mission stats.</p>
          </div>
          <MissionGlyph name="crew" className="h-8 w-8" />
        </header>

        <div className="debrief-player-grid">
          {recap.players.map((player) => (
            <PlayerResultCard
              key={player.playerId}
              player={player}
              avatarId={avatarAssignments.get(player.playerId) || AVATARS[0].id}
              awards={coolestAwards(player, recap.awards)}
              isSelf={player.playerId === selfParticipantId}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
