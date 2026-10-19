import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// One connection for the entire app. The previous page-level clients opened
// two sockets per browser because both route modules are imported by App.
export const socket = io(apiUrl, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionDelayMax: 5_000,
  timeout: 10_000,
});

const PLAYER_NAME_KEY = "neuronauts.playerName";

export function getPreferredPlayerName() {
  return localStorage.getItem(PLAYER_NAME_KEY) || "";
}

export function savePreferredPlayerName(name: string) {
  localStorage.setItem(PLAYER_NAME_KEY, name);
}

// Per-tab, per-lobby credentials never enter URLs or the public roster.
export function getLobbyResumeToken(lobbyId: string) {
  try { return sessionStorage.getItem(`neuronauts.resume.${lobbyId}`) || undefined; }
  catch { return undefined; }
}

export function saveLobbyResumeToken(payload: { lobbyId: string; resumeToken?: string }) {
  if (!payload.resumeToken) return;
  try { sessionStorage.setItem(`neuronauts.resume.${payload.lobbyId}`, payload.resumeToken); }
  catch { /* A blocked session store allows play, but cannot preserve a refresh. */ }
}
