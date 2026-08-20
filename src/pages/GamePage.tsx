import { Celebration } from "@/components/Celebration";
import { GuessInput } from "@/components/GuessInput";
import { GuessList } from "@/components/GuessList";
import Neuronaut from "@/components/Neuronaut";
import { PlayerRoster } from "@/components/PlayerRoster";
import { SemanticMap } from "@/components/SemanticMap";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WinBanner } from "@/components/WinBanner";
import {
  getPreferredPlayerName,
  savePreferredPlayerName,
  socket,
} from "@/lib/socket";
import type {
  ActionError,
  GameState,
  GuessResult,
  LobbyPayload,
  Player,
} from "@/types";
import {
  Check,
  Copy,
  LoaderCircle,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  const [connected, setConnected] = useState(socket.connected);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState(Date.now());

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
      setFatalError(null);
      const self = payload.players.find((player) => player.id === socket.id);
      if (self) savePreferredPlayerName(self.name);
    };
    const onGameReady = (state: GameState) => setGameState(state);
    const onPlayersUpdated = (payload: { players: Player[] }) => {
      setPlayers(payload.players);
      const self = payload.players.find((player) => player.id === socket.id);
      if (self) savePreferredPlayerName(self.name);
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
      setCelebrating(true);
    };
    const onHintCooldown = (payload: { hintAvailableAt: string }) => {
      setGameState((previous) => ({
        ...previous,
        hintAvailableAt: payload.hintAvailableAt,
      }));
      setClock(Date.now());
    };
    const onActionError = (error: ActionError) => {
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
      socket.off("guessResult", onGuessResult);
      socket.off("gameWon", onGameWon);
      socket.off("hintCooldown", onHintCooldown);
      socket.off("actionError", onActionError);
      socket.off("error", onLobbyError);
      socket.off("playerNameChanged", onNameChanged);
    };
  }, [lobbyId]);

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
        (best, guess) =>
          !best || guess.similarity > best.similarity ? guess : best,
        null
      ),
    [gameState.guessHistory]
  );
  const canPlay = connected && gameState.status === "playing";
  const canHint = canPlay && Boolean(bestGuess) && hintSeconds === 0;

  const copyCode = async () => {
    if (!lobbyId) return;
    await navigator.clipboard.writeText(lobbyId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
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
                <Radio className={`h-2.5 w-2.5 ${connected ? "text-emerald-500" : "text-amber-500"}`} />
                {connected ? "live mission" : "reconnecting"}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:flex">
              <Users className="h-4 w-4" /> {players.length} online
            </div>
            {lobbyId && (
              <button onClick={copyCode} className="lobby-code-button" aria-label="Copy lobby code">
                {lobbyId} {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
            <ThemeToggle />
          </div>
        </header>

        {gameState.status === "loading" ? (
          <div className="grid min-h-[70vh] place-items-center">
            <div className="neuron-card flex flex-col items-center px-8 py-10 text-center">
              <LoaderCircle className="mb-4 h-8 w-8 animate-spin text-teal-500" />
              <p className="font-bold">Calibrating semantic space</p>
              <p className="mt-1 text-sm text-zinc-500">Loading the navigator’s word map…</p>
            </div>
          </div>
        ) : (
          <main className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_23rem]">
            <div className="min-w-0 space-y-4">
              <WinBanner gameState={gameState} onNewGame={() => navigate("/")} />

              {gameState.status !== "won" && (
                <section className="neuron-card p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>
                      Target signal: <strong className="text-zinc-800 dark:text-zinc-200">{gameState.targetLength} letters</strong>
                    </span>
                    {bestGuess && (
                      <span className="truncate text-right">
                        Closest: <strong className="capitalize text-teal-600 dark:text-teal-300">{bestGuess.guess} · {(bestGuess.similarity * 100).toFixed(1)}%</strong>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <GuessInput
                      onGuess={(guess) => socket.emit("guess", { lobbyId, guess })}
                      disabled={!canPlay}
                    />
                    <button
                      onClick={() => socket.emit("requestHint", { lobbyId })}
                      disabled={!canHint}
                      className="hint-button"
                      title={bestGuess ? "Find the nearest word to the halfway point between your best guess and the target" : "Make a valid guess first"}
                    >
                      <Sparkles className="h-4 w-4" />
                      {hintSeconds > 0 ? `Hint in ${hintSeconds}s` : "Halfway hint"}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Hints are shared with the crew and recharge for 60 seconds.
                  </p>
                </section>
              )}

              <GuessList guesses={gameState.guessHistory} players={players} />
            </div>

            <aside className="space-y-4 lg:sticky lg:top-5">
              <SemanticMap
                guesses={gameState.guessHistory}
                targetWord={gameState.targetWord}
              />
              <PlayerRoster
                players={players}
                selfId={socket.id}
                onRename={(name) =>
                  socket.emit("setPlayerName", { lobbyId, name })
                }
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
