import usePatternBg from "@/hooks/usePatternBg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { LobbyScreen } from "../components/LobbyScreen";
import { ThemeToggle } from "../components/ThemeToggle";

// Create a Socket.IO client connection
const socket = io("https://semantle.hobbyhood.app");

export default function LobbyPage() {
  const navigate = useNavigate();

  // Emit event to create a lobby
  const handleCreateLobby = () => {
    socket.emit("createLobby");
  };

  useEffect(() => {
    // When a lobby is created, update the URL
    socket.on("lobbyCreated", ({ lobbyId }: { lobbyId: string }) => {
      navigate(`/game/${lobbyId}`); // Redirect to the new game URL
    });

    return () => {
      socket.off("lobbyCreated");
    };
  }, [navigate]);

  const style = usePatternBg();

  return (
    <div
      className="grid place-items-center p-2 min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors"
      style={style}
    >
      <div className="absolute top-0 p-2 flex justify-end w-full">
        <ThemeToggle />
      </div>
      <div className="p-8 rounded-lg dark:border dark:border-zinc-800 shadow-xl grid place-items-center bg-white dark:bg-black text-black dark:text-white transition-colors">
        <LobbyScreen
          onCreateLobby={handleCreateLobby}
          onJoinLobby={(lobbyId) => navigate(`/game/${lobbyId}`)}
        />
      </div>
    </div>
  );
}
