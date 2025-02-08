import { Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { GuessInput } from "../components/GuessInput";
import { GuessList } from "../components/GuessList";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../hooks/useTheme";
import type { GameState, GuessResult } from "../types";

// Create a Socket.IO client connection
const socket = io("https://semantle.hobbyhood.app");

export function GamePage() {
  const { theme, setTheme } = useTheme();

  const { lobbyId } = useParams(); // Extract lobby ID from the URL
  const [gameState, setGameState] = useState<GameState>({
    targetLength: 0,
    guessHistory: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lobbyId) {
      // Auto-join lobby if ID is in the URL
      socket.emit("joinLobby", lobbyId);
    }

    // When joining a lobby, update state
    socket.on("lobbyJoined", ({ gameState }: { gameState: GameState }) => {
      setGameState(gameState);
      setError(null);
    });

    // When a guess result is received, update the guess history
    socket.on("guessResult", (result: GuessResult) => {
      setGameState((prev) => ({
        ...prev,
        guessHistory: [...prev.guessHistory, result],
      }));

      if (result.correct) {
        alert("Congratulations! You found the word!");
      }
    });

    socket.on("error", (message: string) => {
      setError(message);
    });

    return () => {
      socket.off("lobbyJoined");
      socket.off("guessResult");
      socket.off("error");
    };
  }, [lobbyId]);

  // Emit a guess event
  const handleGuess = (guess: string) => {
    if (lobbyId) {
      socket.emit("guess", { lobbyId, guess });
    }
  };

  return (
    <div className="overflow-auto grid max-h-screen min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <div className="overflow-auto h-full grid container mx-auto px-4 py-2">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Semantle</h1>
            {lobbyId && (
              <span className="text-sm bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded">
                {lobbyId}
              </span>
            )}
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} />
        </header>

        <main className="overflow-auto h-full flex flex-col items-center gap-8">
          {error ? (
            <div className="text-red-500 font-medium">{error}</div>
          ) : (
            <div className="h-full place-items-center w-full overflow-auto grid grid-rows-[1fr,auto]">
              <GuessList guesses={gameState.guessHistory} />
              <GuessInput onGuess={handleGuess} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
