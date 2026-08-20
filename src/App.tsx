import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
        <Suspense
          fallback={
            <div className="app-shell grid min-h-dvh place-items-center text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              Opening mission…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LobbyPage />} />
            <Route path="/game/:lobbyId" element={<GamePage />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
