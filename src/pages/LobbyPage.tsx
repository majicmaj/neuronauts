import { ConnectionBanner } from "@/components/ConnectionBanner";
import { LobbyScreen } from "@/components/LobbyScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useConnection } from "@/hooks/useConnection";
import { saveLobbyResumeToken, savePreferredPlayerName, socket } from "@/lib/socket";
import type { GameMode, LobbyPayload, MissionCategory } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LobbyPage() {
  const navigate = useNavigate();
  const connection = useConnection();
  const [categories, setCategories] = useState<MissionCategory[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socket.emit("leaveLobby");
    const onConnect = () => { socket.emit("getCategories"); setError(null); };
    const onDisconnect = () => setBusy(false);
    const onCreated = (payload: LobbyPayload) => {
      setBusy(false);
      saveLobbyResumeToken(payload);
      const self = payload.players.find((player) => player.id === socket.id);
      if (self) savePreferredPlayerName(self.name);
      navigate(`/game/${payload.lobbyId}`);
    };
    const onError = (message: string) => { setBusy(false); setError(message); };
    const onCategories = (catalog: MissionCategory[]) => setCategories(catalog);
    socket.on("categoryCatalog", onCategories);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onDisconnect);
    socket.on("lobbyCreated", onCreated);
    socket.on("error", onError);
    if (socket.connected) onConnect();
    return () => {
      socket.off("categoryCatalog", onCategories);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onDisconnect);
      socket.off("lobbyCreated", onCreated);
      socket.off("error", onError);
    };
  }, [navigate]);

  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => {
      setBusy(false);
      setError("The mission didn’t open in time. Your choices are saved here; try creating it again.");
    }, 10_000);
    return () => window.clearTimeout(timer);
  }, [busy]);

  const createLobby = (preferredName: string, mode: GameMode, categoryId: string) => {
    if (!connection.connected || busy) return;
    setBusy(true);
    setError(null);
    socket.emit("createLobby", { preferredName, mode, categoryId });
  };
  const joinLobby = (lobbyId: string, preferredName: string) => {
    if (preferredName) savePreferredPlayerName(preferredName);
    navigate(`/game/${lobbyId}`);
  };

  return (
    <div className="app-shell game-shell lobby-shell min-h-dvh">
      <header className="site-header"><span className="site-wordmark">Neuronauts</span><ThemeToggle /></header>
      <div className="lobby-connection"><ConnectionBanner phase={connection.phase} onRetry={connection.retry} /></div>
      <main className="lobby-content">
        <LobbyScreen categories={categories} connected={connection.connected} busy={busy} error={error} onCreateLobby={createLobby} onJoinLobby={joinLobby} />
      </main>
    </div>
  );
}
