import type {
  GameState,
  GuessResult,
  Player,
  RematchState,
  TeamId,
  VersusState,
  VersusTeamSummary,
} from "@/types";
import type { CSSProperties } from "react";
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
  onJoin,
}: {
  team: VersusTeamSummary;
  players: Player[];
  typingPlayerIds: string[];
  selfSocketId?: string;
  setup?: boolean;
  onJoin?: () => void;
}) {
  const teamPlayers = players.filter((player) => player.teamId === team.id);
  const selfOnTeam = teamPlayers.some((player) => player.id === selfSocketId);
  const statsByPlayer = new Map(team.playerStats.map((stats) => [stats.playerId, stats]));
  const progress = Math.max(0, Math.min(100, (team.bestSimilarity || 0) * 100));

  return (
    <section
      className={`vs-team-bay is-${team.id} ${team.status === "finished" ? "is-finished" : ""}`}
      style={teamStyle(team.id)}
      aria-labelledby={`team-${team.id}-title`}
    >
      <div className="vs-team-rail" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
      </div>
      <div className="vs-team-jaw" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
      </div>
      <header className="vs-team-heading">
        <span className="vs-team-emblem" aria-hidden="true">{TEAM_COPY[team.id].emblem}</span>
        <div>
          <h2 id={`team-${team.id}-title`}>{TEAM_COPY[team.id].label}</h2>
          <p aria-live="polite">{setup ? `${team.readyCount}/${team.playerCount} ready` : team.status === "finished" ? "Signal locked" : `${team.playerCount} online`}</p>
        </div>
        {!setup && (
          <strong className="vs-team-best">
            <span>{team.guessCount}</span>
            <small>guesses</small>
          </strong>
        )}
      </header>

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
                <dl className="vs-member-stats">
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
            <div><dt>Guesses</dt><dd>{team.guessCount}</dd></div>
            <div><dt>Hints</dt><dd>{team.hintCount}</dd></div>
            <div><dt>Elapsed</dt><dd>{duration(team.elapsedSeconds)}</dd></div>
          </dl>
          <div className="vs-progress-heading"><span>Team progress</span><strong>{percent(team.bestSimilarity)}</strong></div>
          <progress
            className="vs-progress-track"
            max="100"
            value={progress}
            aria-label={`${TEAM_COPY[team.id].label} progress ${progress.toFixed(1)} percent`}
          />
          <div className="vs-team-state">
            {team.status === "finished" ? <><MissionGlyph name="confirm" className="h-5 w-5" /> Finished</> : "Still searching"}
          </div>
        </footer>
      )}
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
  const ownTeam = teams.get(versus.teamId)!;
  const opponentId: TeamId = versus.teamId === "red" ? "blue" : "red";
  const opponent = teams.get(opponentId)!;
  const ownFinished = ownTeam.status === "finished";
  const canGuess = connected && !ownFinished && versus.phase === "playing";
  const canHint = canGuess && gameState.guessHistory.length > 0 && hintSeconds === 0;
  const typingNames = players
    .filter((player) => typingPlayerIds.includes(player.id))
    .map((player) => player.name);

  return (
    <main className="vs-live-shell">
      <p className="sr-only" role="status" aria-live="polite">
        {typingNames.length ? `${typingNames.join(", ")} ${typingNames.length === 1 ? "is" : "are"} typing.` : "No one is typing."}
      </p>
      <div className="vs-arena-grid">
        <TeamBay team={teams.get("red")!} players={players} typingPlayerIds={typingPlayerIds} selfSocketId={selfSocketId} />

        <section className="vs-arena-center" aria-label="Head-to-head semantic space">
          <header className="vs-confrontation">
            <div className="is-red"><strong>{percent(teams.get("red")!.bestSimilarity)}</strong><span>Red</span></div>
            <div className="vs-mark"><i />VS<i /></div>
            <div className="is-blue"><strong>{percent(teams.get("blue")!.bestSimilarity)}</strong><span>Blue</span></div>
          </header>
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
        </section>

        <TeamBay team={teams.get("blue")!} players={players} typingPlayerIds={typingPlayerIds} selfSocketId={selfSocketId} />
      </div>

      <div className="vs-workspace">
        <section className="vs-transmit-console" aria-labelledby="transmit-title">
          <div className="vs-console-heading">
            <div>
              <h2 id="transmit-title">Your search console</h2>
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
              <div><strong>Signal locked</strong><span>You’re done. The rival airlock can keep searching.</span></div>
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
          <p className="vs-score-rule">Match score adds 2s per non-hint guess and 60s per hint. Lowest adjusted time wins.</p>
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
