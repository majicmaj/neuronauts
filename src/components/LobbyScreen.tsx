import { DIFFICULTY_LABELS, groupMissionCategories, resolveMissionCategory } from "../lib/missionCategory";
import { FormEvent, useState } from "react";
import { getPreferredPlayerName, savePreferredPlayerName } from "../lib/socket";
import { MissionGlyph } from "./MissionGlyph";
import Neuronaut from "./Neuronaut";
import type { GameMode, MissionCategory } from "../types";

interface LobbyScreenProps {
  categories: MissionCategory[];
  connected: boolean;
  busy: boolean;
  error: string | null;
  onCreateLobby: (preferredName: string, mode: GameMode, categoryId: string) => void;
  onJoinLobby: (lobbyId: string, preferredName: string) => void;
}

export function LobbyScreen({ categories, connected, busy, error, onCreateLobby, onJoinLobby }: LobbyScreenProps) {
  const [lobbyId, setLobbyId] = useState("");
  const [preferredName, setPreferredName] = useState(getPreferredPlayerName);
  const [categoryId, setCategoryId] = useState("all");
  const [mode, setMode] = useState<GameMode>("classic");
  const selectedCategory = resolveMissionCategory(categories, categoryId);
  const allCategory = resolveMissionCategory(categories, "all");
  const categoryGroups = groupMissionCategories(categories);

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
    onCreateLobby(preferredName.trim(), mode, selectedCategory.id);
  };

  return (
    <div className="lobby-workspace">
      <div className="lobby-intro">
        <Neuronaut className="mb-3 h-16 w-16 sm:mb-5 sm:h-20 sm:w-20" />
        <h1 className="text-4xl font-extrabold tracking-[-0.035em] sm:text-6xl">Find the hidden word.</h1>
        <p className="mt-3 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:mt-4 sm:text-lg">
          Follow semantic clues with your crew, or split into red and blue teams.
        </p>

        <ul className="mt-5 grid gap-2.5 text-sm text-zinc-700 dark:text-zinc-200 sm:mt-8 sm:gap-3">
          <li className="flex items-center gap-3"><MissionGlyph name="crew" className="h-6 w-6 text-teal-700 dark:text-teal-300" /> Play in one shared lobby</li>
          <li className="flex items-center gap-3"><MissionGlyph name="signal" className="h-6 w-6 text-teal-700 dark:text-teal-300" /> See every guess as it lands</li>
          <li className="flex items-center gap-3"><MissionGlyph name="navigator" className="h-6 w-6 text-amber-700 dark:text-amber-300" /> Share one halfway hint per minute</li>
        </ul>
      </div>

      <div className="lobby-form-column">
        <div className="neuron-card lobby-form">
          <h2 className="mb-5 text-xl font-bold tracking-tight">Start a mission</h2>
          <label htmlFor="player-name" className="mb-2 block text-sm font-semibold">
          Call sign <span className="font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
        </label>
        <input
          id="player-name"
          value={preferredName}
          onChange={(event) => setPreferredName(event.target.value)}
          maxLength={24}
          placeholder="We’ll assign one if you leave this blank"
          autoComplete="nickname"
          className="mission-input mb-3 w-full"
        />

        <fieldset className="mission-mode-picker">
          <legend>Mission mode</legend>
          <button
            type="button"
            className={mode === "classic" ? "is-selected" : ""}
            aria-pressed={mode === "classic"}
            onClick={() => setMode("classic")}
          >
            <MissionGlyph name="crew" className="h-6 w-6" />
            <span><strong>Classic</strong><small>One crew, one shared search</small></span>
          </button>
          <button
            type="button"
            className={mode === "versus" ? "is-selected is-versus" : "is-versus"}
            aria-pressed={mode === "versus"}
            onClick={() => setMode("versus")}
          >
            <span className="mode-versus-mark" aria-hidden="true"><i />VS<i /></span>
            <span><strong>VS mode</strong><small>Red vs blue, private flight logs</small></span>
          </button>
        </fieldset>

        <div className="mission-category-picker">
          <label htmlFor="mission-category" className="mb-2 block text-sm font-semibold">
            Category <span className="font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
          </label>
          <select
            id="mission-category"
            value={selectedCategory.id}
            onChange={(event) => setCategoryId(event.target.value)}
            disabled={busy || !categories.length}
            aria-describedby="category-description"
            className="mission-input w-full"
          >
            <option value="all">{allCategory.label} · {DIFFICULTY_LABELS[allCategory.difficulty]}</option>
            {categoryGroups.map((group) => (
              <optgroup key={group.difficulty} label={group.label}>
                {group.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.label} · {DIFFICULTY_LABELS[category.difficulty]}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <p id="category-description" className="mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
            {selectedCategory.description}
            {selectedCategory.id !== "all" && " Any dictionary word still counts as a guess."}
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{categories.length ? "New missions only. Joining follows the host’s category." : "Topic choices aren’t available yet. You can still play All words."}</p>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={!connected || busy}
          className="neuron-primary-button w-full justify-center py-3.5"
        >
          {busy ? "Launching…" : mode === "versus" ? "Create VS mission" : "Create a mission"} <MissionGlyph name="launch" className="h-6 w-6" />
        </button>

        <div className="lobby-join-label">
          Have a lobby code?
        </div>

        <form onSubmit={handleJoin} className="lobby-join-form">
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
          {connected ? "Navigator online" : "Waiting for a connection"}
        </div>
      </div>
    </div>
  );
}
