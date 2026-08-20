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
