import { Check, Pencil, Users, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { Player } from "../types";

interface PlayerRosterProps {
  players: Player[];
  selfId?: string;
  onRename: (name: string) => void;
}

function hueFor(value: string) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return Math.abs(hash) % 360;
}

export function PlayerRoster({ players, selfId, onRename }: PlayerRosterProps) {
  const self = players.find((player) => player.id === selfId);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(self?.name || "");

  useEffect(() => {
    if (!editing) setName(self?.name || "");
  }, [editing, self?.name]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onRename(name.trim());
    setEditing(false);
  };

  return (
    <section className="neuron-card overflow-hidden" aria-labelledby="crew-title">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3.5 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-teal-700 dark:text-teal-300" />
          <h2 id="crew-title" className="font-semibold">Crew</h2>
        </div>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {players.length} connected
        </span>
      </div>

      <div className="divide-y divide-zinc-200 px-4 dark:divide-zinc-700">
        {players.map((player) => {
          const isSelf = player.id === selfId;
          return (
            <div key={player.id} className="flex min-h-12 items-center gap-2 py-2.5">
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: `hsl(${hueFor(player.id)} 65% 48%)` }}
              >
                {player.name.slice(0, 1).toUpperCase()}
              </span>

              {isSelf && editing ? (
                <form onSubmit={submit} className="flex min-w-0 flex-1 items-center gap-1">
                  <input
                    autoFocus
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={24}
                    aria-label="Your player name"
                    className="mission-input min-w-0 flex-1 px-2.5 py-1.5 text-sm"
                  />
                  <button type="submit" className="rounded-md p-1 text-teal-600" aria-label="Save name">
                    <Check className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="rounded-md p-1 text-zinc-500" aria-label="Cancel">
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {player.name} {isSelf && <span className="font-normal text-zinc-500">(you)</span>}
                  </span>
                  {isSelf && (
                    <button onClick={() => setEditing(true)} className="rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white" aria-label="Change your name">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
