import { ArrowRight, Radio, Rocket, Users } from "lucide-react";
import { FormEvent, useState } from "react";
import { getPreferredPlayerName, savePreferredPlayerName } from "../lib/socket";
import Neuronaut from "./Neuronaut";

interface LobbyScreenProps {
  connected: boolean;
  busy: boolean;
  onCreateLobby: (preferredName: string) => void;
  onJoinLobby: (lobbyId: string, preferredName: string) => void;
}

export function LobbyScreen({ connected, busy, onCreateLobby, onJoinLobby }: LobbyScreenProps) {
  const [lobbyId, setLobbyId] = useState("");
  const [preferredName, setPreferredName] = useState(getPreferredPlayerName);

  const rememberName = () => {
    if (preferredName.trim()) savePreferredPlayerName(preferredName.trim());
  };

  const handleJoin = (event: FormEvent) => {
    event.preventDefault();
    if (!lobbyId.trim() || !connected || busy) return;
    rememberName();
    onJoinLobby(lobbyId.trim().toUpperCase(), preferredName.trim());
  };

  const handleCreate = () => {
    if (!connected || busy) return;
    rememberName();
    onCreateLobby(preferredName.trim());
  };

  return (
    <div className="relative z-10 w-full max-w-xl">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-teal-400 blur-2xl opacity-35" />
          <Neuronaut className="relative h-24 w-24 drop-shadow-xl" />
        </div>
        <p className="mb-2 text-xs font-black uppercase tracking-[0.32em] text-teal-600 dark:text-teal-300">
          Cooperative semantic search
        </p>
        <h1 className="text-5xl font-black tracking-[-0.05em] sm:text-6xl">Neuronauts</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          Chart word space together. Every guess moves your crew closer to one hidden signal.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="rounded-2xl border border-zinc-200/80 bg-white/70 px-2 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
          <Users className="mx-auto mb-1.5 h-4 w-4 text-violet-500" /> Multiplayer
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white/70 px-2 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
          <Radio className="mx-auto mb-1.5 h-4 w-4 text-cyan-500" /> Live signals
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white/70 px-2 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
          <Rocket className="mx-auto mb-1.5 h-4 w-4 text-teal-500" /> Shared hints
        </div>
      </div>

      <div className="neuron-card p-4 sm:p-5">
        <label htmlFor="player-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500">
          Your call sign <span className="font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="player-name"
          value={preferredName}
          onChange={(event) => setPreferredName(event.target.value)}
          maxLength={24}
          placeholder="We'll assign a cosmic name"
          className="mb-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-800 dark:bg-zinc-950"
        />

        <button
          onClick={handleCreate}
          disabled={!connected || busy}
          className="neuron-primary-button w-full justify-center py-3.5"
        >
          {busy ? "Launching…" : "Create a mission"} <ArrowRight className="h-4 w-4" />
        </button>

        <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-400">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" /> or join a crew <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <form onSubmit={handleJoin} className="flex gap-2">
          <label htmlFor="lobby-code" className="sr-only">Lobby code</label>
          <input
            id="lobby-code"
            value={lobbyId}
            onChange={(event) => setLobbyId(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
            placeholder="LOBBY CODE"
            className="min-w-0 flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-mono font-bold tracking-[0.18em] outline-none transition placeholder:font-sans placeholder:tracking-normal focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-800 dark:bg-zinc-950"
            maxLength={6}
          />
          <button
            type="submit"
            disabled={!connected || busy || lobbyId.length !== 6}
            className="rounded-2xl border border-zinc-200 bg-zinc-100 px-5 font-bold transition hover:border-violet-400 hover:bg-violet-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900"
          >
            Join
          </button>
        </form>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
        <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "animate-pulse bg-amber-500"}`} />
        {connected ? "Navigator online" : "Connecting to navigator…"}
      </div>
    </div>
  );
}
