import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MissionGlyph, type MissionGlyphName } from "./MissionGlyph";
import Neuronaut from "./Neuronaut";
import { ThemeToggle } from "./ThemeToggle";

export function StatusPanel({ title, description, busy = false, icon = "signal", children }: {
  title: string; description: string; busy?: boolean; icon?: MissionGlyphName; children?: ReactNode;
}) {
  return (
    <section className="status-panel" aria-labelledby="status-title">
      <MissionGlyph name={busy ? "loader" : icon} className={`status-icon ${busy ? "mission-loader" : ""}`} />
      <h1 id="status-title">{title}</h1>
      <p className="status-description" role="status">{description}</p>
      {children && <div className="status-actions">{children}</div>}
    </section>
  );
}

export function StatusScreen(props: Parameters<typeof StatusPanel>[0]) {
  return (
    <div className="app-shell game-shell status-shell">
      <header className="site-header"><Link to="/" className="site-brand"><Neuronaut className="h-9 w-9" /><span>Neuronauts</span></Link><ThemeToggle /></header>
      <main className="status-content"><StatusPanel {...props} /></main>
    </div>
  );
}
