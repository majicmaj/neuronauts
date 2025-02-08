import { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { io } from "socket.io-client";
import { LobbyScreen } from "./components/LobbyScreen";
import { ThemeToggle } from "./components/ThemeToggle";

import { GamePage } from "./pages/GamePage";

// Create a Socket.IO client connection
const socket = io("https://semantle.hobbyhood.app/");

function LobbyPage() {
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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <ThemeToggle theme="light" onChange={() => {}} />
        <LobbyScreen
          onCreateLobby={handleCreateLobby}
          onJoinLobby={(lobbyId) => navigate(`/game/${lobbyId}`)}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
        <Route path="/game/:lobbyId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
