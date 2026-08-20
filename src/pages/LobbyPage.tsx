import BackgroundPattern from "@/components/BackgroundPattern";
import { LobbyScreen } from "@/components/LobbyScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { savePreferredPlayerName, socket } from "@/lib/socket";
import type { LobbyPayload } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LobbyPage() {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(socket.connected);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setError(null);
    };
    const onDisconnect = () => {
      setConnected(false);
      setBusy(false);
    };
    const onCreated = (payload: LobbyPayload) => {
      const self = payload.players.find((player) => player.id === socket.id);
      if (self) savePreferredPlayerName(self.name);
      navigate(`/game/${payload.lobbyId}`);
    };
    const onError = (message: string) => {
      setBusy(false);
      setError(message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("lobbyCreated", onCreated);
    socket.on("error", onError);
    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("lobbyCreated", onCreated);
      socket.off("error", onError);
    };
  }, [navigate]);

  const createLobby = (preferredName: string) => {
    setBusy(true);
    setError(null);
    socket.emit("createLobby", { preferredName });
  };

  const joinLobby = (lobbyId: string, preferredName: string) => {
    if (preferredName) savePreferredPlayerName(preferredName);
    navigate(`/game/${lobbyId}`);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-zinc-50 text-zinc-950 transition-colors dark:bg-black dark:text-white">
      <BackgroundPattern />
      <div className="absolute right-4 top-4 z-20"><ThemeToggle /></div>
      <main className="relative z-10 grid min-h-dvh place-items-center px-4 py-16">
        <LobbyScreen
          connected={connected}
          busy={busy}
          onCreateLobby={createLobby}
          onJoinLobby={joinLobby}
        />
        {error && (
          <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-700 shadow-xl dark:border-red-900 dark:bg-zinc-950 dark:text-red-300" role="alert">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
