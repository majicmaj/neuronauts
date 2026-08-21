import { Celebration } from "@/components/Celebration";
import { GuessInput } from "@/components/GuessInput";
import { GuessList } from "@/components/GuessList";
import { MissionGlyph } from "@/components/MissionGlyph";
import Neuronaut from "@/components/Neuronaut";
import { PlayerRoster } from "@/components/PlayerRoster";
import { PostGameRecap } from "@/components/PostGameRecap";
import { SemanticMap } from "@/components/SemanticMap";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WinBanner } from "@/components/WinBanner";
import {
  getPreferredPlayerName,
  savePreferredPlayerName,
  socket,
} from "@/lib/socket";
import { presentGuessSubmission } from "@/lib/guessSubmission";
import type {
  ActionError,
  GameState,
  GuessResult,
  GuessSubmissionResponse,
  LobbyPayload,
  Player,
  RematchState,
} from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EMPTY_GAME: GameState = {
  status: "loading",
  targetLength: 0,
  guessHistory: [],
  startedAt: null,
  solvedAt: null,
  winner: null,
  hintAvailableAt: null,
  error: null,
};

export function GamePage() {
  const { lobbyId: routeLobbyId } = useParams();
  const lobbyId = routeLobbyId?.toUpperCase();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>(EMPTY_GAME);
  const [players, setPlayers] = useState<Player[]>([]);
  const [typingPlayerIds, setTypingPlayerIds] = useState<string[]>([]);
  const [connected, setConnected] = useState(socket.connected);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState(Date.now());
  const [hoveredGuessId, setHoveredGuessId] = useState<string | null>(null);
  const [featuredGuessId, setFeaturedGuessId] = useState<string | null>(null);
  const [featuredGuessVersion, setFeaturedGuessVersion] = useState(0);
  const [featuredGuessNotice, setFeaturedGuessNotice] = useState<string | null>(null);
  const [postGameView, setPostGameView] = useState<"recap" | "flight-log">("recap");
  const [rematch, setRematch] = useState<RematchState | null>(null);
  const [playAgainBusy, setPlayAgainBusy] = useState(false);

  useEffect(() => {
    if (!lobbyId) return;

    const joinLobby = () => {
      setConnected(true);
      socket.emit("joinLobby", {
        lobbyId,
        preferredName: getPreferredPlayerName(),
      });
    };
    const onDisconnect = () => setConnected(false);
    const onLobbyJoined = (payload: LobbyPayload) => {
      setGameState(payload.gameState);
      setPlayers(payload.players);
      setTypingPlayerIds(payload.typingPlayerIds || []);
      setRematch(payload.rematch || null);
      setPlayAgainBusy(false);
      setFatalError(null);
      const self = payload.players.find((player) => player.id === socket.id);
      if (self) {
        savePreferredPlayerName(self.name);
        const latestOwnGuess = [...payload.gameState.guessHistory]
          .reverse()
          .find((guess) => guess.playerId === self.participantId);
        setFeaturedGuessId(latestOwnGuess?.id || null);
        setFeaturedGuessNotice(null);
      }
    };
    const onGameReady = (state: GameState) => setGameState(state);
    const onPlayersUpdated = (payload: { players: Player[] }) => {
      setPlayers(payload.players);
      const self = payload.players.find((player) => player.id === socket.id);
      if (self) savePreferredPlayerName(self.name);
    };
    const onTypingUpdated = (payload: { playerIds: string[] }) =>
      setTypingPlayerIds(payload.playerIds);
    const onRematchUpdated = (nextRematch: RematchState) =>
      setRematch(nextRematch);
    const onRematchReady = (payload: { lobbyId: string; rematch: RematchState }) => {
      setRematch(payload.rematch);
      navigate(`/game/${payload.lobbyId}`);
    };
    const onGuessResult = (result: GuessResult) => {
      setGameState((previous) => {
        if (previous.guessHistory.some((guess) => guess.id === result.id)) {
          return previous;
        }
        const next: GameState = {
          ...previous,
          guessHistory: [...previous.guessHistory, result],
          hintAvailableAt: result.hintAvailableAt || previous.hintAvailableAt,
        };
        if (result.correct) {
          next.status = "won";
          next.targetWord = result.targetWord;
          next.solvedAt = result.createdAt;
          next.winner = {
            playerId: result.playerId,
            playerName: result.playerName,
          };
        }
        return next;
      });
    };
    const onGameWon = (state: GameState) => {
      setGameState(state);
      setTypingPlayerIds([]);
      setCelebrating(true);
      setPostGameView("recap");
    };
    const onHintCooldown = (payload: { hintAvailableAt: string }) => {
      setGameState((previous) => ({
        ...previous,
        hintAvailableAt: payload.hintAvailableAt,
      }));
      setClock(Date.now());
    };
    const onActionError = (error: ActionError) => {
      setPlayAgainBusy(false);
      setActionError(error.message);
      if (error.hintAvailableAt) {
        setGameState((previous) => ({
          ...previous,
          hintAvailableAt: error.hintAvailableAt || null,
        }));
      }
    };
    const onLobbyError = (message: string) => setFatalError(message);
    const onNameChanged = ({ name }: { name: string }) =>
      savePreferredPlayerName(name);

    socket.on("connect", joinLobby);
    socket.on("disconnect", onDisconnect);
    socket.on("lobbyJoined", onLobbyJoined);
    socket.on("gameReady", onGameReady);
    socket.on("playersUpdated", onPlayersUpdated);
    socket.on("typingUpdated", onTypingUpdated);
    socket.on("rematchUpdated", onRematchUpdated);
    socket.on("rematchReady", onRematchReady);
    socket.on("guessResult", onGuessResult);
    socket.on("gameWon", onGameWon);
    socket.on("hintCooldown", onHintCooldown);
    socket.on("actionError", onActionError);
    socket.on("error", onLobbyError);
    socket.on("playerNameChanged", onNameChanged);
    if (socket.connected) joinLobby();

    return () => {
      socket.off("connect", joinLobby);
      socket.off("disconnect", onDisconnect);
      socket.off("lobbyJoined", onLobbyJoined);
      socket.off("gameReady", onGameReady);
      socket.off("playersUpdated", onPlayersUpdated);
      socket.off("typingUpdated", onTypingUpdated);
      socket.off("rematchUpdated", onRematchUpdated);
      socket.off("rematchReady", onRematchReady);
      socket.off("guessResult", onGuessResult);
      socket.off("gameWon", onGameWon);
      socket.off("hintCooldown", onHintCooldown);
      socket.off("actionError", onActionError);
      socket.off("error", onLobbyError);
      socket.off("playerNameChanged", onNameChanged);
    };
  }, [lobbyId, navigate]);

  useEffect(() => {
    if (!actionError) return;
    const timer = window.setTimeout(() => setActionError(null), 4_500);
    return () => window.clearTimeout(timer);
  }, [actionError]);

  useEffect(() => {
    if (!celebrating) return;
    const timer = window.setTimeout(() => setCelebrating(false), 6_000);
    return () => window.clearTimeout(timer);
  }, [celebrating]);

  useEffect(() => {
    const availableAt = gameState.hintAvailableAt
      ? Date.parse(gameState.hintAvailableAt)
      : 0;
    if (!availableAt || availableAt <= Date.now()) return;
    const timer = window.setInterval(() => setClock(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [gameState.hintAvailableAt]);

  const hintSeconds = gameState.hintAvailableAt
    ? Math.max(0, Math.ceil((Date.parse(gameState.hintAvailableAt) - clock) / 1_000))
    : 0;
  const bestGuess = useMemo(
    () =>
      gameState.guessHistory.reduce<GuessResult | null>(
        (best, guess) => {
          const isBetter = !best ||
            guess.similarity > best.similarity ||
            (
              guess.similarity === best.similarity &&
              (guess.cosineSimilarity ?? -1) > (best.cosineSimilarity ?? -1)
            );
          return isBetter ? guess : best;
        },
        null
      ),
    [gameState.guessHistory]
  );
  const canPlay = connected && gameState.status === "playing";
  const canHint = canPlay && Boolean(bestGuess) && hintSeconds === 0;
  const featuredGuess = useMemo(
    () => gameState.guessHistory.find((guess) => guess.id === featuredGuessId) || null,
    [featuredGuessId, gameState.guessHistory]
  );
  const selfParticipantId = players.find((player) => player.id === socket.id)?.participantId;
  const handleTypingChange = useCallback(
    (isTyping: boolean) => socket.emit("typing", { lobbyId, isTyping }),
    [lobbyId]
  );

  const copyCode = async () => {
    if (!lobbyId) return;
    await navigator.clipboard.writeText(lobbyId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  };

  const submitGuess = (rawGuess: string) => {
    const guess = rawGuess.trim().toLowerCase();
    setActionError(null);
    socket.timeout(5_000).emit(
      "guess",
      { lobbyId, guess },
      (timeoutError: Error | null, response?: GuessSubmissionResponse) => {
        if (timeoutError || !response) {
          setActionError("The signal timed out. Try that guess again.");
          return;
        }

        const presentation = presentGuessSubmission(response);
        const result = presentation.result;
        if (result) {
          setFeaturedGuessId(result.id);
          setFeaturedGuessVersion((version) => version + 1);
        }

        setFeaturedGuessNotice(presentation.notice);
        if (presentation.error) {
          setActionError(presentation.error);
          return;
        }
      }
    );
  };

  const playAgain = () => {
    if (!lobbyId || playAgainBusy || gameState.status !== "won") return;
    setActionError(null);
    setPlayAgainBusy(true);
    socket.emit("requestRematch", { lobbyId });
  };

  if (fatalError) {
    return (
      <div className="app-shell grid min-h-dvh place-items-center px-4 text-center">
        <div className="neuron-card max-w-md p-8">
          <Neuronaut className="mx-auto mb-4 h-16 w-16" />
          <h1 className="text-2xl font-black">Mission unavailable</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">{fatalError}</p>
          <button onClick={() => navigate("/")} className="neuron-primary-button mx-auto mt-6">Return home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-dvh overflow-hidden">
      <Celebration active={celebrating} />

      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-5">
        <header className="mission-header mb-5 flex items-center justify-between gap-3 pb-3">
          <button onClick={() => navigate("/")} className="flex min-w-0 items-center gap-2 text-left">
            <Neuronaut className="h-10 w-10 shrink-0" />
            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-lg font-extrabold leading-tight tracking-tight">Neuronauts</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span className={`mission-status-light ${connected ? "is-online" : "is-reconnecting"}`} aria-hidden="true" />
                {connected ? "live mission" : "reconnecting"}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:flex">
              <MissionGlyph name="crew" className="h-6 w-6" /> {players.length} online
            </div>
            {lobbyId && (
              <button onClick={copyCode} className="lobby-code-button" aria-label="Copy lobby code">
                {lobbyId} {copied ? <MissionGlyph name="confirm" className="h-6 w-6" /> : <MissionGlyph name="copy" className="h-6 w-6" />}
              </button>
            )}
            <ThemeToggle />
          </div>
        </header>

        {gameState.status === "loading" ? (
          <div className="grid min-h-[70vh] place-items-center">
            <div className="neuron-card flex flex-col items-center px-8 py-10 text-center">
              <MissionGlyph name="loader" className="mission-loader mb-4 h-12 w-12 text-teal-500" />
              <p className="font-bold">Calibrating semantic space</p>
              <p className="mt-1 text-sm text-zinc-500">Loading the navigator’s word map…</p>
            </div>
          </div>
        ) : gameState.status === "won" && gameState.recap && postGameView === "recap" ? (
          <main>
            <PostGameRecap
              gameState={gameState}
              selfParticipantId={selfParticipantId}
              rematch={rematch}
              playAgainBusy={playAgainBusy}
              playAgainDisabled={!connected}
              onPlayAgain={playAgain}
              onReviewFlightLog={() => setPostGameView("flight-log")}
            />
          </main>
        ) : (
          <main className="game-layout">
            <div className="game-primary">
              <div className="game-actions min-w-0 space-y-4">
              {gameState.status === "won" && gameState.recap && (
                <button
                  type="button"
                  onClick={() => setPostGameView("recap")}
                  className="debrief-return-button"
                >
                  <MissionGlyph name="award" className="h-6 w-6" /> Back to mission debrief
                </button>
              )}
              <WinBanner
                gameState={gameState}
                rematch={rematch}
                selfParticipantId={selfParticipantId}
                playAgainBusy={playAgainBusy}
                playAgainDisabled={!connected}
                onPlayAgain={playAgain}
              />

              {gameState.status !== "won" && (
                <section className="neuron-card p-4 sm:p-5">
                  <div className="mb-3 flex flex-col items-start gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span>
                      Target signal: <strong className="text-zinc-800 dark:text-zinc-200">{gameState.targetLength} letters</strong>
                    </span>
                    {bestGuess && (
                      <span className="max-w-full truncate sm:text-right">
                        Closest: <strong className="capitalize text-teal-600 dark:text-teal-300">
                          {bestGuess.guess} · {(bestGuess.similarity * 100).toFixed(1)}%
                          {bestGuess.rank && (
                            <span className="hidden normal-case sm:inline"> · #{bestGuess.rank.toLocaleString()}</span>
                          )}
                        </strong>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <GuessInput
                      onGuess={submitGuess}
                      onTypingChange={handleTypingChange}
                      disabled={!canPlay}
                    />
                    <button
                      onClick={() => socket.emit("requestHint", { lobbyId })}
                      disabled={!canHint}
                      className="hint-button"
                      title={bestGuess ? "Find the nearest word to the halfway point between your best guess and the target" : "Make a valid guess first"}
                    >
                      <MissionGlyph name="navigator" className="h-6 w-6" />
                      {hintSeconds > 0 ? `Hint in ${hintSeconds}s` : "Halfway hint"}
                    </button>
                  </div>
                </section>
              )}

              </div>

              <div className="game-log min-w-0">
                <GuessList
                  guesses={gameState.guessHistory}
                  players={players}
                  featuredGuess={featuredGuess}
                  featuredGuessVersion={featuredGuessVersion}
                  featuredGuessNotice={featuredGuessNotice}
                  onGuessHover={setHoveredGuessId}
                />
              </div>
            </div>

            <aside className="game-rail">
              <PlayerRoster
                players={players}
                guesses={gameState.guessHistory}
                typingPlayerIds={typingPlayerIds}
                selfId={socket.id}
                onRename={(name) =>
                  socket.emit("setPlayerName", { lobbyId, name })
                }
                onAvatarChange={(avatarId) =>
                  socket.emit("setPlayerAvatar", { lobbyId, avatarId })
                }
              />
              <SemanticMap
                guesses={gameState.guessHistory}
                targetWord={gameState.targetWord}
                hoveredGuessId={hoveredGuessId}
                onGuessHover={setHoveredGuessId}
              />
            </aside>
          </main>
        )}
      </div>

      {actionError && (
        <div className="alert-toast fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 text-center" role="alert">
          {actionError}
        </div>
      )}
    </div>
  );
}
