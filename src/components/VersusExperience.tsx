import type {
  GameState,
  GuessResult,
  Player,
  RematchState,
  TeamId,
  VersusState,
  VersusTeamSummary,
} from "@/types";
import {
  impactIntensity,
  sortPlayerStats,
  versusCurrentStateText,
  versusElapsedSeconds,
  versusEnergyLevel,
  versusEnergyShare,
  type VersusImpact,
} from "@/lib/versusEnergy";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { GuessInput } from "./GuessInput";
import { GuessList } from "./GuessList";
import { MissionGlyph } from "./MissionGlyph";
import { PlayAgainButton } from "./PlayAgainButton";
import { PlayerAvatar } from "./PlayerAvatar";
import { SemanticMap } from "./SemanticMap";

interface VersusExperienceProps {
  gameState: GameState;
  versus: VersusState;
  players: Player[];
  typingPlayerIds: string[];
  selfSocketId?: string;
  selfParticipantId?: string;
  connected: boolean;
  featuredGuess: GuessResult | null;
  featuredGuessVersion: number;
  featuredGuessNotice: string | null;
  hoveredGuessId: string | null;
  hintSeconds: number;
  rematch: RematchState | null;
  playAgainBusy: boolean;
  onSetTeam: (teamId: TeamId) => void;
  onRandomizeTeams: () => void;
  onToggleReady: () => void;
  onGuess: (guess: string) => void;
  onTypingChange: (isTyping: boolean) => void;
  onRequestHint: () => void;
  onGuessHover: (guessId: string | null) => void;
  onPlayAgain: () => void;
}

const TEAM_COPY = {
  red: { label: "Red Shift", short: "Red", emblem: "R" },
  blue: { label: "Blue Orbit", short: "Blue", emblem: "B" },
} as const;

function percent(value: number | null) {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

function duration(seconds: number | null) {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function scoreDuration(seconds: number | null) {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}m ${remainder}s` : `${remainder}s`;
}

function teamStyle(teamId: TeamId) {
  return { "--team-color": `var(--team-${teamId})` } as CSSProperties;
}

function TeamBay({
  team,
  players,
  typingPlayerIds,
  selfSocketId,
  setup = false,
  impact = null,
  onJoin,
}: {
  team: VersusTeamSummary;
  players: Player[];
  typingPlayerIds: string[];
  selfSocketId?: string;
  setup?: boolean;
  impact?: VersusImpact | null;
  onJoin?: () => void;
}) {
  const unsortedTeamPlayers = players.filter((player) => player.teamId === team.id);
  const statsByPlayer = new Map(team.playerStats.map((stats) => [stats.playerId, stats]));
  const rankByPlayer = new Map(sortPlayerStats(team.playerStats).map((stats, index) => [stats.playerId, index + 1]));
  const teamPlayers = setup
    ? unsortedTeamPlayers
    : [...unsortedTeamPlayers].sort((a, b) => {
        const aRank = rankByPlayer.get(a.participantId || a.id) ?? Number.MAX_SAFE_INTEGER;
        const bRank = rankByPlayer.get(b.participantId || b.id) ?? Number.MAX_SAFE_INTEGER;
        return aRank - bRank;
      });
  const selfOnTeam = teamPlayers.some((player) => player.id === selfSocketId);

  return (
    <section
      className={`vs-team-bay is-${team.id} ${team.status === "finished" ? "is-finished" : ""}`}
      style={teamStyle(team.id)}
      aria-labelledby={`team-${team.id}-title`}
    >
      {setup && (
        <>
          <div className="vs-team-rail" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
          </div>
          <div className="vs-team-jaw" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
          </div>
        </>
      )}
      <header className="vs-team-heading">
        <span className="vs-team-emblem" aria-hidden="true">{TEAM_COPY[team.id].emblem}</span>
        <div>
          <h2 id={`team-${team.id}-title`}>{TEAM_COPY[team.id].label}</h2>
          <p aria-live="polite">{setup ? `${team.readyCount}/${team.playerCount} ready` : team.status === "finished" ? "Signal locked" : `${team.playerCount} online`}</p>
        </div>
        {!setup && (
          <strong className="vs-team-best">
            <span>{team.guessCount}</span>
            <small>signals</small>
          </strong>
        )}
      </header>

      {!setup && impact?.teamId === team.id && (
        <div key={impact.id} className={`vs-team-contribution is-${impact.intensity}`} aria-hidden="true">
          <i />
          <span>{impact.intensity === "solve" ? "Target locked" : impact.intensity === "breakthrough" ? "Major advance" : impact.intensity === "gain" ? "Signal gained" : "Guess plotted"}</span>
        </div>
      )}

      <div className="vs-team-members">
        {teamPlayers.map((player) => {
          const stats = statsByPlayer.get(player.participantId || player.id);
          const isSelf = player.id === selfSocketId;
          const isTyping = typingPlayerIds.includes(player.id);
          return (
            <div className="vs-team-member" key={player.id}>
              <PlayerAvatar avatarId={player.avatarId} decorative />
              <div className="vs-team-member-name">
                <strong>{player.name}</strong>
                <span role="status" aria-live="polite">
                  {isSelf && "you · "}
                  {setup
                    ? player.ready ? "ready" : "choosing side"
                    : isTyping ? "plotting a guess" : team.status === "finished" ? "signal locked" : "on comms"}
                </span>
              </div>
              {setup ? (
                <span className={`vs-ready-mark ${player.ready ? "is-ready" : ""}`}>
                  {player.ready ? <MissionGlyph name="confirm" className="h-5 w-5" /> : "—"}
                </span>
              ) : (
                <dl className="vs-member-stats" aria-label={`${player.name} contribution, rank ${rankByPlayer.get(player.participantId || player.id) ?? teamPlayers.length}`}>
                  <div className="vs-player-rank"><dt>Rank</dt><dd>#{rankByPlayer.get(player.participantId || player.id) ?? "—"}</dd></div>
                  <div><dt>G</dt><dd>{stats?.guessCount || 0}</dd></div>
                  <div><dt>Avg</dt><dd>{percent(stats?.averageSimilarity ?? null)}</dd></div>
                  <div><dt>Best</dt><dd>{percent(stats?.bestSimilarity ?? null)}</dd></div>
                </dl>
              )}
            </div>
          );
        })}

        {teamPlayers.length === 0 && (
          <div className="vs-empty-bay">
            <span className="vs-empty-seat" aria-hidden="true" />
            <p>Open airlock</p>
            <span>Waiting for a neuronaut</span>
          </div>
        )}
      </div>

      {setup ? (
        <button
          type="button"
          className="vs-join-team"
          onClick={onJoin}
          disabled={selfOnTeam}
        >
          {selfOnTeam ? `You’re on ${TEAM_COPY[team.id].short}` : `Move to ${TEAM_COPY[team.id].label}`}
        </button>
      ) : (
        <footer className="vs-team-telemetry">
          <dl>
            <div><dt>Average</dt><dd>{percent(team.averageSimilarity)}</dd></div>
            <div><dt>Hints</dt><dd>{team.hintCount}</dd></div>
            <div><dt>Elapsed</dt><dd>{duration(team.elapsedSeconds)}</dd></div>
          </dl>
          <div className="vs-team-state">
            {team.status === "finished" ? <><MissionGlyph name="confirm" className="h-5 w-5" /> Finished</> : "Still searching"}
          </div>
        </footer>
      )}
    </section>
  );
}

function VersusPowerMeter({
  red,
  blue,
  startedAt,
  impact,
}: {
  red: VersusTeamSummary;
  blue: VersusTeamSummary;
  startedAt: string | null;
  impact: VersusImpact | null;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!startedAt) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  const elapsedSeconds = versusElapsedSeconds(startedAt, now);
  const redShare = versusEnergyShare(red.bestSimilarity, blue.bestSimilarity);
  const heat = versusEnergyLevel(red.guessCount + blue.guessCount);
  const gainText = impact && impact.gain > 0
    ? `+${(impact.gain * 100).toFixed(1)}`
    : null;
  const currentStateText = versusCurrentStateText(red.status === "finished", blue.status === "finished");
  const eventText = impact
    ? impact.intensity === "solve"
      ? `${TEAM_COPY[impact.teamId].label} found the target`
      : impact.intensity === "breakthrough"
        ? `${TEAM_COPY[impact.teamId].label} made a major advance${gainText ? `, ${gainText} points` : ""}`
        : impact.intensity === "gain"
          ? `${TEAM_COPY[impact.teamId].label} gained${gainText ? ` ${gainText} points` : " ground"}`
          : `${TEAM_COPY[impact.teamId].label} plotted a guess`
    : currentStateText;
  const style = {
    "--red-share": `${redShare}%`,
    "--clash-speed": `${Math.max(0.7, 2.25 - heat * 0.3)}s`,
  } as CSSProperties;

  return (
    <section className={`vs-power-board heat-${heat}`} style={style} aria-label="Team semantic progress">
      <div className="vs-scoreboard-row">
        <div className="vs-power-score is-red">
          <span>Red Shift</span>
          <strong>{percent(red.bestSimilarity)}</strong>
          <small>{red.status === "finished" ? "target locked" : `${red.guessCount} guesses`}</small>
        </div>
        <div className="vs-match-clock">
          <span>Elapsed</span>
          <time dateTime={elapsedSeconds === null ? undefined : `PT${elapsedSeconds}S`}>
            {duration(elapsedSeconds)}
          </time>
        </div>
        <div className="vs-power-score is-blue">
          <span>Blue Orbit</span>
          <strong>{percent(blue.bestSimilarity)}</strong>
          <small>{blue.status === "finished" ? "target locked" : `${blue.guessCount} guesses`}</small>
        </div>
      </div>

      <div
        className="vs-energy-meter"
        role="img"
        aria-label={`Red Shift controls ${redShare.toFixed(1)} percent of the energy field. Blue Orbit controls ${(100 - redShare).toFixed(1)} percent.`}
      >
        <div className="vs-energy-beam is-red"><i /></div>
        <div className="vs-energy-beam is-blue"><i /></div>
        <span className="vs-energy-laser is-red" aria-hidden="true">
          <img src="/vfx/wenrexa-laser-red.png" alt="" />
        </span>
        <span className="vs-energy-laser is-blue" aria-hidden="true">
          <img src="/vfx/wenrexa-laser-red.png" alt="" />
        </span>
        <span
          key={impact?.id ?? "idle"}
          className={`vs-energy-clash${impact ? ` is-${impact.teamId} is-${impact.intensity}` : ""}`}
          aria-hidden="true"
        >
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet="/vfx/luis-zuno-charged-still.png" />
            <img src="/vfx/luis-zuno-charged.gif" alt="" />
          </picture>
          <b>VS</b>
        </span>
      </div>
      <p className="vs-power-event" aria-live="polite">{eventText}</p>
    </section>
  );
}

function LaunchConsole({
  className,
  versus,
  selfReady,
  isHost,
  canReady,
  onRandomizeTeams,
  onToggleReady,
}: {
  className: string;
  versus: VersusState;
  selfReady: boolean;
  isHost: boolean;
  canReady: boolean;
  onRandomizeTeams: () => void;
  onToggleReady: () => void;
}) {
  return (
    <div className={`${className}${isHost ? " has-randomize" : ""}`}>
      <div className="vs-launch-status">
        <span>{versus.readyCount} / {versus.totalCount} ready</span>
        <p>{versus.canStart ? "Launches automatically when every neuronaut is ready." : "Place at least one neuronaut in each airlock."}</p>
      </div>
      {isHost && (
        <button type="button" className="neuron-secondary-button px-4" onClick={onRandomizeTeams}>
          Randomize teams
        </button>
      )}
      <button
        type="button"
        className="neuron-primary-button vs-ready-button"
        disabled={!canReady}
        onClick={onToggleReady}
      >
        <MissionGlyph name={selfReady ? "cancel" : "confirm"} className="h-6 w-6" />
        {selfReady ? "Not ready" : "Ready for launch"}
      </button>
    </div>
  );
}

function VersusSetup({
  versus,
  players,
  typingPlayerIds,
  selfSocketId,
  selfParticipantId,
  connected,
  onSetTeam,
  onRandomizeTeams,
  onToggleReady,
}: Pick<VersusExperienceProps,
  "versus" | "players" | "typingPlayerIds" | "selfSocketId" | "selfParticipantId" |
  "connected" | "onSetTeam" | "onRandomizeTeams" | "onToggleReady"
>) {
  const self = players.find((player) => player.id === selfSocketId);
  const isHost = selfParticipantId === versus.hostParticipantId;
  const teams = new Map(versus.teams.map((team) => [team.id, team]));
  const canReady = connected && (versus.canStart || Boolean(self?.ready));

  return (
    <main className="vs-setup-shell">
      <div className="vs-setup-intro">
        <div>
          <h1>Choose your airlock</h1>
          <p>Teams share one target. Your words stay inside your bay.</p>
        </div>
        <div className="vs-privacy-note">
          <MissionGlyph name="signal" className="h-6 w-6" />
          Opponents see your progress—not your guesses.
        </div>
      </div>

      <LaunchConsole
        className="vs-launch-console vs-launch-console-mobile"
        versus={versus}
        selfReady={Boolean(self?.ready)}
        isHost={isHost}
        canReady={canReady}
        onRandomizeTeams={onRandomizeTeams}
        onToggleReady={onToggleReady}
      />

      <div className="vs-setup-arena">
        <TeamBay
          team={teams.get("red")!}
          players={players}
          typingPlayerIds={typingPlayerIds}
          selfSocketId={selfSocketId}
          setup
          onJoin={() => onSetTeam("red")}
        />
        <div className="vs-setup-seam" aria-label="Versus">
          <span>VS</span>
          <i />
        </div>
        <TeamBay
          team={teams.get("blue")!}
          players={players}
          typingPlayerIds={typingPlayerIds}
          selfSocketId={selfSocketId}
          setup
          onJoin={() => onSetTeam("blue")}
        />
      </div>

      <LaunchConsole
        className="vs-launch-console vs-launch-console-desktop"
        versus={versus}
        selfReady={Boolean(self?.ready)}
        isHost={isHost}
        canReady={canReady}
        onRandomizeTeams={onRandomizeTeams}
        onToggleReady={onToggleReady}
      />
    </main>
  );
}

function VersusLive(props: VersusExperienceProps) {
  const {
    gameState, versus, players, typingPlayerIds, selfSocketId, connected,
    featuredGuess, featuredGuessVersion, featuredGuessNotice, hoveredGuessId,
    hintSeconds, onSetTeam: _onSetTeam, onRandomizeTeams: _onRandomizeTeams,
    onToggleReady: _onToggleReady, onGuess, onTypingChange, onRequestHint,
    onGuessHover,
  } = props;
  void _onSetTeam;
  void _onRandomizeTeams;
  void _onToggleReady;
  const teams = new Map(versus.teams.map((team) => [team.id, team]));
  const redTeam = teams.get("red")!;
  const blueTeam = teams.get("blue")!;
  const ownTeam = teams.get(versus.teamId)!;
  const opponentId: TeamId = versus.teamId === "red" ? "blue" : "red";
  const opponent = teams.get(opponentId)!;
  const ownFinished = ownTeam.status === "finished";
  const canGuess = connected && !ownFinished && versus.phase === "playing";
  const canHint = canGuess && gameState.guessHistory.length > 0 && hintSeconds === 0;
  const typingNames = players
    .filter((player) => typingPlayerIds.includes(player.id))
    .map((player) => player.name);
  const impactSequence = useRef(0);
  const previousTeams = useRef({
    redGuesses: redTeam.guessCount,
    blueGuesses: blueTeam.guessCount,
    redBest: redTeam.bestSimilarity,
    blueBest: blueTeam.bestSimilarity,
  });
  const [impact, setImpact] = useState<VersusImpact | null>(null);

  useEffect(() => {
    const previous = previousTeams.current;
    const candidates = ([
      {
        teamId: "red" as const,
        guessDelta: redTeam.guessCount - previous.redGuesses,
        previousBest: previous.redBest,
        nextBest: redTeam.bestSimilarity,
      },
      {
        teamId: "blue" as const,
        guessDelta: blueTeam.guessCount - previous.blueGuesses,
        previousBest: previous.blueBest,
        nextBest: blueTeam.bestSimilarity,
      },
    ]).filter((candidate) => candidate.guessDelta > 0);

    if (candidates.length) {
      const candidate = candidates.sort((a, b) =>
        ((b.nextBest ?? 0) - (b.previousBest ?? 0)) - ((a.nextBest ?? 0) - (a.previousBest ?? 0))
      )[0];
      impactSequence.current += 1;
      setImpact({
        id: impactSequence.current,
        teamId: candidate.teamId,
        intensity: impactIntensity(candidate.previousBest, candidate.nextBest),
        gain: Math.max(0, (candidate.nextBest ?? 0) - (candidate.previousBest ?? 0)),
      });
    }

    previousTeams.current = {
      redGuesses: redTeam.guessCount,
      blueGuesses: blueTeam.guessCount,
      redBest: redTeam.bestSimilarity,
      blueBest: blueTeam.bestSimilarity,
    };
  }, [redTeam.guessCount, redTeam.bestSimilarity, blueTeam.guessCount, blueTeam.bestSimilarity]);

  return (
    <main className="vs-live-shell">
      <p className="sr-only" role="status" aria-live="polite">
        {typingNames.length ? `${typingNames.join(", ")} ${typingNames.length === 1 ? "is" : "are"} typing.` : "No one is typing."}
      </p>
      <VersusPowerMeter red={redTeam} blue={blueTeam} startedAt={versus.startedAt} impact={impact} />
      <div className="vs-arena-grid">
        <TeamBay team={redTeam} players={players} typingPlayerIds={typingPlayerIds} selfSocketId={selfSocketId} impact={impact} />

        <section className="vs-arena-center" aria-label="Head-to-head semantic space">
          <SemanticMap
            guesses={gameState.guessHistory}
            opponentPoints={versus.opponentPoints}
            teamId={versus.teamId}
            versus
            targetWord={gameState.targetWord}
            hoveredGuessId={hoveredGuessId}
            onGuessHover={onGuessHover}
          />
          <div className="vs-phase-strip" role="status">
            {ownFinished
              ? `${TEAM_COPY[ownTeam.id].label} locked the signal. ${TEAM_COPY[opponent.id].label} is still searching.`
              : opponent.status === "finished"
                ? `${TEAM_COPY[opponent.id].label} finished first. Your airlock stays open.`
                : `Same ${gameState.targetLength}-letter target · private flight logs`}
          </div>
          <section className="vs-transmit-console" aria-labelledby="transmit-title">
            <div className="vs-console-heading">
              <div>
                <h2 id="transmit-title">Search console</h2>
                <p>{TEAM_COPY[versus.teamId].label} · your words stay private</p>
              </div>
              <dl>
                <div><dt>Best</dt><dd>{percent(ownTeam.bestSimilarity)}</dd></div>
                <div><dt>Guesses</dt><dd>{ownTeam.guessCount}</dd></div>
              </dl>
            </div>
            {ownFinished ? (
              <div className="vs-console-locked">
                <MissionGlyph name="confirm" className="h-7 w-7" />
                <div><strong>Signal locked</strong><span>You’re done. The rival team can keep searching.</span></div>
              </div>
            ) : (
              <div className="vs-console-actions">
                <GuessInput
                  onGuess={onGuess}
                  onTypingChange={onTypingChange}
                  disabled={!canGuess}
                  submitLabel="Transmit guess"
                />
                <button type="button" className="hint-button" onClick={onRequestHint} disabled={!canHint}>
                  <MissionGlyph name="navigator" className="h-6 w-6" />
                  {hintSeconds > 0 ? `Hint in ${hintSeconds}s` : "Halfway hint"}
                </button>
              </div>
            )}
            <p className="vs-score-rule">2s per guess · 60s per hint · lowest adjusted time wins</p>
          </section>

          <div className="vs-private-log">
            <GuessList
              guesses={gameState.guessHistory}
              players={players.filter((player) => player.teamId === versus.teamId)}
              featuredGuess={featuredGuess}
              featuredGuessVersion={featuredGuessVersion}
              featuredGuessNotice={featuredGuessNotice}
              onGuessHover={onGuessHover}
            />
          </div>
        </section>

        <TeamBay team={blueTeam} players={players} typingPlayerIds={typingPlayerIds} selfSocketId={selfSocketId} impact={impact} />
      </div>
    </main>
  );
}

function ResultTeam({ team, winner }: { team: VersusTeamSummary; winner: boolean }) {
  return (
    <article className={`vs-result-team is-${team.id} ${winner ? "is-winner" : "is-runner-up"}`} style={teamStyle(team.id)}>
      <header>
        <div>
          <h2>{TEAM_COPY[team.id].label}</h2>
          <span className="vs-result-place">{winner ? "Mission winner" : "Second signal"}</span>
        </div>
        <strong className="vs-result-grade">{team.grade}</strong>
      </header>
      <dl className="vs-result-metrics">
        <div><dt>Adjusted time</dt><dd>{scoreDuration(team.score)}</dd></div>
        <div><dt>Raw time</dt><dd>{scoreDuration(team.elapsedSeconds)}</dd></div>
        <div><dt>Guesses</dt><dd>{team.guessCount}</dd></div>
        <div><dt>Hints</dt><dd>{team.hintCount}</dd></div>
        <div><dt>Average</dt><dd>{percent(team.averageSimilarity)}</dd></div>
        <div><dt>Best</dt><dd>{percent(team.bestSimilarity)}</dd></div>
      </dl>
      <div className="vs-result-roster">
        {team.playerStats.map((player) => (
          <div key={player.playerId}>
            <PlayerAvatar avatarId={player.avatarId} decorative />
            <span><strong>{player.playerName}</strong><small>{player.guessCount} guesses · {percent(player.bestSimilarity)} best · {player.hintCount} hints</small></span>
          </div>
        ))}
      </div>
    </article>
  );
}

function VersusResults(props: VersusExperienceProps) {
  const { versus, rematch, selfParticipantId, playAgainBusy, connected, onPlayAgain } = props;
  const result = versus.result!;
  const winner = result.standings.find((team) => team.id === result.winnerTeamId)!;
  const loser = result.standings.find((team) => team.id === result.loserTeamId)!;
  const margin = Math.abs((loser.score || 0) - (winner.score || 0));

  return (
    <main className="vs-results-shell">
      <header className="vs-results-hero" style={teamStyle(winner.id)}>
        <span className="vs-results-emblem" aria-hidden="true">{TEAM_COPY[winner.id].emblem}</span>
        <div>
          <h1>{TEAM_COPY[winner.id].label} wins</h1>
          <p className="vs-results-meta">
            Both signals found · target: <strong>{result.targetWord}</strong> · {margin ? `${scoreDuration(margin)} ahead on adjusted time` : "won on the tie-break"}
          </p>
        </div>
        <div className="vs-winning-grade"><small>Final grade</small><strong>{winner.grade}</strong></div>
      </header>

      <section className="vs-score-explainer" aria-labelledby="score-title">
        <div>
          <h2 id="score-title">How the match was graded</h2>
          <p>Raw time + {result.scoring.guessPenaltySeconds}s per non-hint guess + {result.scoring.hintPenaltySeconds}s per hint. Lowest total wins.</p>
        </div>
        <div className="vs-score-equation" aria-label="Winning score calculation">
          <span>{scoreDuration(winner.elapsedSeconds)} time</span><b>+</b>
          <span>{winner.guessCount * result.scoring.guessPenaltySeconds}s non-hint guesses</span><b>+</b>
          <span>{winner.hintCount * result.scoring.hintPenaltySeconds}s hints</span><b>=</b>
          <strong>{scoreDuration(winner.score)}</strong>
        </div>
      </section>

      <div className="vs-result-comparison">
        <ResultTeam team={winner} winner />
        <div className="vs-result-divider" aria-hidden="true">VS</div>
        <ResultTeam team={loser} winner={false} />
      </div>

      <footer className="vs-result-actions">
        <p>Same crew, fresh target, one shared rematch lobby.</p>
        <PlayAgainButton
          rematch={rematch}
          totalPlayers={versus.totalCount}
          selfParticipantId={selfParticipantId}
          busy={playAgainBusy}
          disabled={!connected}
          className="neuron-primary-button"
          onClick={onPlayAgain}
        />
      </footer>
    </main>
  );
}

export function VersusExperience(props: VersusExperienceProps) {
  if (props.versus.phase === "setup") return <VersusSetup {...props} />;
  if (props.versus.phase === "complete" && props.versus.result) return <VersusResults {...props} />;
  return <VersusLive {...props} />;
}
