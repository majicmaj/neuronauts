import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { StatusScreen } from "./components/StatusScreen";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";

import LobbyPage from "./pages/LobbyPage";

const GamePage = lazy(() =>
  import("./pages/GamePage").then((module) => ({ default: module.GamePage }))
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppErrorBoundary>
        <Suspense
          fallback={
            <StatusScreen title="Opening mission…" description="Getting your workspace ready." busy />
          }
        >
          <Routes>
            <Route path="/" element={<LobbyPage />} />
            <Route path="/game/:lobbyId" element={<GamePage />} />
            <Route path="*" element={<StatusScreen title="Page not found" description="This link doesn’t lead to a mission. Start a new one or enter a lobby code from home."><Link to="/" className="neuron-primary-button">Return home</Link></StatusScreen>} />
          </Routes>
        </Suspense>
        </AppErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
