import { ArrowRight, Radio, Route, Users } from "lucide-react";
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
    <div className="grid w-full max-w-4xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
      <div>
        <Neuronaut className="mb-3 h-16 w-16 sm:mb-5 sm:h-20 sm:w-20" />
        <h1 className="text-4xl font-extrabold tracking-[-0.035em] sm:text-6xl">Neuronauts</h1>
        <p className="mt-3 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:mt-4 sm:text-lg">
          Chart word space with your crew and close in on one hidden signal.
        </p>

        <ul className="mt-5 grid gap-2.5 text-sm text-zinc-700 dark:text-zinc-200 sm:mt-8 sm:gap-3">
          <li className="flex items-center gap-3"><Users className="h-4 w-4 text-teal-700 dark:text-teal-300" /> Play in one shared lobby</li>
          <li className="flex items-center gap-3"><Radio className="h-4 w-4 text-teal-700 dark:text-teal-300" /> See every guess as it lands</li>
          <li className="flex items-center gap-3"><Route className="h-4 w-4 text-amber-700 dark:text-amber-300" /> Share one halfway hint per minute</li>
        </ul>
      </div>

      <div>
        <div className="neuron-card p-5 sm:p-6">
          <h2 className="mb-5 text-xl font-bold tracking-tight">Start or join a mission</h2>
          <label htmlFor="player-name" className="mb-2 block text-sm font-semibold">
          Call sign <span className="font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
        </label>
        <input
          id="player-name"
          value={preferredName}
          onChange={(event) => setPreferredName(event.target.value)}
          maxLength={24}
          placeholder="We’ll assign one if you leave this blank"
          className="mission-input mb-3 w-full"
        />

        <button
          onClick={handleCreate}
          disabled={!connected || busy}
          className="neuron-primary-button w-full justify-center py-3.5"
        >
          {busy ? "Launching…" : "Create a mission"} <ArrowRight className="h-4 w-4" />
        </button>

        <div className="my-5 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" /> Have a lobby code? <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
        </div>

        <form onSubmit={handleJoin} className="flex gap-2">
          <label htmlFor="lobby-code" className="sr-only">Lobby code</label>
          <input
            id="lobby-code"
            value={lobbyId}
            onChange={(event) => setLobbyId(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
            placeholder="Lobby code"
            className="mission-input min-w-0 flex-1 font-mono font-bold uppercase tracking-[0.16em] placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal"
            maxLength={6}
          />
          <button
            type="submit"
            disabled={!connected || busy || lobbyId.length !== 6}
            className="neuron-secondary-button px-5"
          >
            Join
          </button>
        </form>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-600" : "bg-amber-500"}`} />
          {connected ? "Navigator online" : "Connecting to navigator…"}
        </div>
      </div>
    </div>
  );
}
