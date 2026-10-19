import { useCallback, useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export type ConnectionPhase = "connecting" | "connected" | "reconnecting" | "offline" | "unavailable";

export function useConnection() {
  const [phase, setPhase] = useState<ConnectionPhase>(() =>
    !navigator.onLine ? "offline" : socket.connected ? "connected" : "connecting"
  );
  const [autoRetry, setAutoRetry] = useState(socket.active);
  useEffect(() => {
    const connect = () => { setAutoRetry(true); setPhase("connected"); };
    const disconnect = () => { setAutoRetry(socket.active); setPhase(!navigator.onLine ? "offline" : socket.active ? "reconnecting" : "unavailable"); };
    const unavailable = () => { setAutoRetry(socket.active); setPhase(navigator.onLine ? "unavailable" : "offline"); };
    const online = () => { if (socket.connected) connect(); else { setPhase("reconnecting"); socket.connect(); } };
    const offline = () => setPhase("offline");
    if (socket.connected) connect();
    socket.on("connect", connect);
    socket.on("disconnect", disconnect);
    socket.on("connect_error", unavailable);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      socket.off("connect", connect);
      socket.off("disconnect", disconnect);
      socket.off("connect_error", unavailable);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);
  const retry = useCallback(() => {
    if (socket.connected) { setPhase("connected"); return; }
    if (!navigator.onLine) { setPhase("offline"); return; }
    setPhase("connecting");
    socket.connect();
    setAutoRetry(socket.active);
  }, []);
  return { phase, connected: phase === "connected", autoRetry, retry };
}
