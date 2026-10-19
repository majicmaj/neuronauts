import type { ConnectionPhase } from "@/hooks/useConnection";
import { MissionGlyph } from "./MissionGlyph";

export function ConnectionBanner({ phase, onRetry, autoRetry = true, restoring = false, slow = false }: { phase: ConnectionPhase; onRetry: () => void; autoRetry?: boolean; restoring?: boolean; slow?: boolean }) {
  if (phase === "connected" && !restoring) return null;
  const title = restoring ? slow ? "The mission is taking longer to respond" : "Restoring your mission…" : phase === "offline" ? "You’re offline" : phase === "unavailable" ? "Can’t reach the navigator" : phase === "reconnecting" ? "Connection lost. Reconnecting…" : "Connecting to the navigator…";
  return (
    <section className="connection-banner" aria-label="Connection status" aria-live="polite">
      <MissionGlyph name="signal" className="h-5 w-5" />
      <div><strong>{title}</strong><p>{restoring ? "Your mission and draft stay here. Retry to restore your crew if it’s taking too long." : phase === "offline" ? "Check your internet connection. We’ll reconnect when you’re back online." : autoRetry ? "We’ll retry automatically. Your mission and draft stay here." : "Your mission and draft stay here. Try reconnecting when you’re ready."}</p></div>
      <button type="button" onClick={onRetry} className="neuron-secondary-button">Retry connection</button>
    </section>
  );
}
