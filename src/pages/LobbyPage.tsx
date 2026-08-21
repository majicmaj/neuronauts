import { LobbyScreen } from "@/components/LobbyScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { savePreferredPlayerName, socket } from "@/lib/socket";
import type { GameMode, LobbyPayload } from "@/types";
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

  const createLobby = (preferredName: string, mode: GameMode) => {
    setBusy(true);
    setError(null);
    socket.emit("createLobby", { preferredName, mode });
  };

  const joinLobby = (lobbyId: string, preferredName: string) => {
    if (preferredName) savePreferredPlayerName(preferredName);
    navigate(`/game/${lobbyId}`);
  };

  return (
    <div className="app-shell relative min-h-dvh overflow-hidden">
      <div className="absolute right-4 top-4 z-20"><ThemeToggle /></div>
      <main className="grid min-h-dvh place-items-center px-4 py-10 sm:px-6 sm:py-16">
        <LobbyScreen
          connected={connected}
          busy={busy}
          onCreateLobby={createLobby}
          onJoinLobby={joinLobby}
        />
        {error && (
          <div className="alert-toast fixed bottom-5 left-1/2 z-30 -translate-x-1/2" role="alert">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
