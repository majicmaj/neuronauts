import React, { useState } from "react";
import Neuronaut from "./Neuronaut";

interface LobbyScreenProps {
  onCreateLobby: () => void;
  onJoinLobby: (lobbyId: string) => void;
}

export function LobbyScreen({ onCreateLobby, onJoinLobby }: LobbyScreenProps) {
  const [lobbyId, setLobbyId] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lobbyId.trim()) {
      onJoinLobby(lobbyId.trim().toUpperCase());
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      <div className="flex items-center gap-3">
        {/* <Brain className="w-12 h-12" /> */}
        <Neuronaut className="w-16 h-16" />
        <h1 className="text-4xl font-bold">Neuronauts</h1>
      </div>

      <button
        onClick={onCreateLobby}
        className="w-full py-4 px-6 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
      >
        Create New Game
      </button>

      <div className="w-full text-center">
        <div className="relative">
          <hr className="border-gray-300 dark:border-gray-700" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black px-4 text-gray-500">
            or
          </span>
        </div>
      </div>

      <form onSubmit={handleJoin} className="w-full space-y-4">
        <input
          type="text"
          value={lobbyId}
          onChange={(e) => setLobbyId(e.target.value.toUpperCase())}
          placeholder="Enter Lobby Code"
          className="w-full px-4 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 focus:outline-none"
          maxLength={6}
        />
        <button
          type="submit"
          disabled={!lobbyId.trim()}
          className="w-full py-4 px-6 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Join Game
        </button>
      </form>
    </div>
  );
}
