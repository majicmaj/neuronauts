import BackgroundPattern from "@/components/BackgroundPattern";
import { GlowEffect } from "@/components/ui/glow";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { LobbyScreen } from "../components/LobbyScreen";
import { ThemeToggle } from "../components/ThemeToggle";

// Create a Socket.IO client connection
const socket = io(import.meta.env.VITE_API_URL);

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

  return (
    <div className="grid place-items-center p-2 min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <BackgroundPattern />
      <div className="absolute top-0 p-2 flex justify-end w-full">
        <ThemeToggle />
      </div>
      <div className="absolute rounded-lg grid place-items-center">
        <GlowEffect
          // colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
          colors={["rgba(180,0,255,0.4)", "rgba(0,255,255, 0.35)"]}
          mode="colorShift"
          blur="strong"
          scale={1}
        />
        <div className="relative p-8 rounded-lg dark:border dark:border-zinc-800 grid place-items-center bg-white dark:bg-black text-black dark:text-white transition-colors">
          <LobbyScreen
            onCreateLobby={handleCreateLobby}
            onJoinLobby={(lobbyId) => navigate(`/game/${lobbyId}`)}
          />
        </div>
      </div>
    </div>
  );
}
