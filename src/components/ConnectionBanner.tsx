import type { ConnectionPhase } from "@/hooks/useConnection";
import { MissionGlyph } from "./MissionGlyph";

export function ConnectionBanner({ phase, onRetry }: { phase: ConnectionPhase; onRetry: () => void }) {
  if (phase === "connected") return null;
  const title = phase === "offline" ? "You’re offline" : phase === "unavailable" ? "Can’t reach the navigator" : phase === "reconnecting" ? "Connection lost. Reconnecting…" : "Connecting to the navigator…";
  return (
    <section className="connection-banner" aria-label="Connection status" aria-live="polite">
      <MissionGlyph name="signal" className="h-5 w-5" />
      <div><strong>{title}</strong><p>{phase === "offline" ? "Check your internet connection. We’ll reconnect when you’re back online." : phase === "unavailable" ? "Your mission and draft stay here. Try reconnecting when you’re ready." : "We’ll retry automatically. Your mission and draft stay here."}</p></div>
      <button type="button" onClick={onRetry} className="neuron-secondary-button">Retry connection</button>
    </section>
  );
}
