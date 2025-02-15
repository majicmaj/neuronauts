// GamePage.tsx
import { LoaderIcon, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { GuessInput } from "../components/GuessInput";
import { GuessList } from "../components/GuessList";
import { ThemeToggle } from "../components/ThemeToggle";
import type { GameState, GuessResult } from "../types";

// Import shadcn dialog components.
// (Adjust the import path if your project structure differs)
import BackgroundPattern from "@/components/BackgroundPattern";
import Neuronaut from "@/components/Neuronaut";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Create a Socket.IO client connection.
const socket = io(import.meta.env.VITE_API_URL);

export function GamePage() {
  const { lobbyId } = useParams();
  const navigate = useNavigate();

  // Game state received from the server.
  const [gameState, setGameState] = useState<GameState>({
    targetLength: 0,
    guessHistory: [],
  });
  const [error, setError] = useState<string | null>(null);

  // Record when the game starts (i.e. when the target word is set).
  const [startTime, setStartTime] = useState<number | null>(null);

  // State for the win modal and statistics.
  const [winModalOpen, setWinModalOpen] = useState(false);
  const [winStats, setWinStats] = useState({ totalGuesses: 0, timeTaken: 0 });

  useEffect(() => {
    if (lobbyId) {
      // Auto-join the lobby.
      socket.emit("joinLobby", lobbyId);
    }

    // Update game state when joining a lobby.
    socket.on("lobbyJoined", ({ gameState }: { gameState: GameState }) => {
      setGameState(gameState);
      setError(null);
      if (gameState.targetLength !== 0 && !startTime) {
        setStartTime(Date.now());
      }
    });

    // Listen for when embeddings have loaded.
    socket.on("gameReady", (gameState: GameState) => {
      setGameState(gameState);
      if (gameState.targetLength !== 0 && !startTime) {
        setStartTime(Date.now());
      }
    });

    // Listen for guess results.
    socket.on("guessResult", (result: GuessResult) => {
      setGameState((prev) => {
        const newGuessHistory = [...prev.guessHistory, result];
        if (result.correct) {
          const endTime = Date.now();
          const timeTaken = startTime ? (endTime - startTime) / 1000 : 0;
          setWinStats({ totalGuesses: newGuessHistory.length, timeTaken });
          setWinModalOpen(true);
        }
        return { ...prev, guessHistory: newGuessHistory };
      });
    });

    socket.on("error", (message: string) => {
      setError(message);
    });

    return () => {
      socket.off("lobbyJoined");
      socket.off("gameReady");
      socket.off("guessResult");
      socket.off("error");
    };
  }, [lobbyId, startTime]);

  // Emit a guess event.
  const handleGuess = (guess: string) => {
    if (lobbyId) {
      socket.emit("guess", { lobbyId, guess });
    }
  };

  // For starting a new game – here we navigate back to the lobby screen.
  const handleNewGame = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen h-full grid bg-white dark:bg-black text-black dark:text-white transition-colors">
      <BackgroundPattern />

      <div className="relative flex flex-col container max-w-lg mx-auto px-4 py-2 h-full">
        <header className="absolute w-full flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {/* <Brain className="w-8 h-8" /> */}
            <Neuronaut className="w-10 h-10" />
            <h1 className="text-2xl font-bold">Neuronauts</h1>
            {lobbyId && (
              <span className="text-sm bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded">
                {lobbyId}
              </span>
            )}
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-col items-center justify-center h-full flex-grow">
          {error ? (
            <div className="grid place-items-center gap-4">
              <div className="text-zinc-700 dark:text-zinc-300 text-xl italic font-medium">
                {error}
              </div>
              <a
                href="/"
                className="text-teal-600 font-bold dark:text-teal-400 underline hover:no-underline"
              >
                Home
              </a>
            </div>
          ) : gameState.targetLength === 0 ? (
            // Show loading indicator while embeddings are loading.
            <div className="grid place-items-center gap-4">
              <p className="text-lg font-medium">Loading game...</p>
              <LoaderIcon className="animate-spin w-8 h-8" />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-8">
              <GuessInput onGuess={handleGuess} />
              <GuessList guesses={gameState.guessHistory} />
            </div>
          )}
        </main>
      </div>

      {/* WIN MODAL using shadcn Dialog */}
      <Dialog open={winModalOpen} onOpenChange={setWinModalOpen}>
        {/* We omit DialogTrigger since the modal opens programmatically */}
        <DialogContent className="max-w-md mx-auto bg-white border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 rounded-lg p-8 shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-teal-500" />
              Congratulations!
            </DialogTitle>
            <DialogDescription>
              <div>
                The word was{" "}
                <span className="font-medium text-lg">
                  {gameState.targetWord}
                </span>
                and you guessed it in{" "}
                <span className="font-medium text-lg">
                  {winStats.totalGuesses}
                </span>{" "}
                {winStats.totalGuesses === 1 ? "guess" : "guesses"}.
                <br />
                Time Taken: {winStats.timeTaken.toFixed(2)} seconds.
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <button
                onClick={handleNewGame}
                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
              >
                Play Again
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
