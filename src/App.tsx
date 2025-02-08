import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { GamePage } from "./pages/GamePage";
import LobbyPage from "./pages/LobbyPage";

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
