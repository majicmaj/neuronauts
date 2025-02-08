import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { LobbyScreen } from "../components/LobbyScreen";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../hooks/useTheme";

const BG_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};
// Create a Socket.IO client connection
const socket = io("https://semantle.hobbyhood.app");

export default function LobbyPage() {
  const { theme, setTheme } = useTheme();

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
    <div
      className="grid place-items-center p-2 min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors"
      style={BG_STYLE}
    >
      <div className="absolute top-0 p-2 flex justify-end w-full">
        <ThemeToggle theme={theme} onChange={setTheme} />
      </div>
      <div className="p-8 rounded-lg shadow-xl grid place-items-center bg-white dark:bg-black text-black dark:text-white transition-colors">
        <LobbyScreen
          onCreateLobby={handleCreateLobby}
          onJoinLobby={(lobbyId) => navigate(`/game/${lobbyId}`)}
        />
      </div>
    </div>
  );
}
