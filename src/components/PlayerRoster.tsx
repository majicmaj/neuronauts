import { AVATARS, assignUniqueAvatarIds } from "@/lib/avatars";
import type { GuessResult, Player } from "@/types";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { MissionGlyph } from "./MissionGlyph";
import { PlayerAvatar } from "./PlayerAvatar";

interface PlayerRosterProps {
  players: Player[];
  guesses: GuessResult[];
  typingPlayerIds: string[];
  selfId?: string;
  onRename: (name: string) => void;
  onAvatarChange: (avatarId: string) => void;
}

interface LiveStats {
  count: number;
  average: number | null;
}

function formatAverage(value: number | null) {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

export function PlayerRoster({
  players,
  guesses,
  typingPlayerIds,
  selfId,
  onRename,
  onAvatarChange,
}: PlayerRosterProps) {
  const self = players.find((player) => player.id === selfId);
  const [editing, setEditing] = useState(false);
  const [choosingAvatar, setChoosingAvatar] = useState(false);
  const [name, setName] = useState(self?.name || "");
  const avatarAssignments = useMemo(
    () => assignUniqueAvatarIds(
      players.map((player) => ({ key: player.id, avatarId: player.avatarId }))
    ),
    [players]
  );
  const takenAvatars = useMemo(
    () => new Map(
      players.map((player) => [avatarAssignments.get(player.id), player])
    ),
    [avatarAssignments, players]
  );
  const stats = useMemo(() => {
    const byPlayer = new Map<string, { count: number; total: number }>();
    for (const guess of guesses) {
      if (guess.isHint) continue;
      const current = byPlayer.get(guess.playerId) || { count: 0, total: 0 };
      current.count += 1;
      current.total += guess.similarity;
      byPlayer.set(guess.playerId, current);
    }
    return new Map(
      players.map((player) => {
        const current = byPlayer.get(player.participantId || player.id);
        const liveStats: LiveStats = current
          ? { count: current.count, average: current.total / current.count }
          : { count: 0, average: null };
        return [player.id, liveStats];
      })
    );
  }, [guesses, players]);

  useEffect(() => {
    if (!editing) setName(self?.name || "");
  }, [editing, self?.name]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onRename(name.trim());
    setEditing(false);
  };

  const chooseAvatar = (avatarId: string) => {
    onAvatarChange(avatarId);
    setChoosingAvatar(false);
  };

  return (
    <section className="neuron-card crew-manifest" aria-labelledby="crew-title">
      <div className="crew-manifest-heading">
        <div className="flex items-center gap-2">
          <MissionGlyph name="crew" className="h-6 w-6 text-teal-700 dark:text-teal-300" />
          <h2 id="crew-title" className="font-semibold">Crew manifest</h2>
        </div>
        <span>{players.length} online</span>
      </div>

      <div className="crew-list">
        {players.map((player) => {
          const isSelf = player.id === selfId;
          const avatarId = avatarAssignments.get(player.id) || AVATARS[0].id;
          const isTyping = typingPlayerIds.includes(player.id);
          const playerStats = stats.get(player.id) || { count: 0, average: null };
          return (
            <div key={player.id} className="crew-member">
              <button
                type="button"
                className="crew-avatar-button"
                onClick={() => isSelf && setChoosingAvatar((open) => !open)}
                disabled={!isSelf}
                aria-label={isSelf ? "Choose your avatar" : `${player.name}'s avatar`}
                aria-expanded={isSelf ? choosingAvatar : undefined}
                title={isSelf ? "Choose your avatar" : player.name}
              >
                <PlayerAvatar avatarId={avatarId} decorative />
                {isSelf && <MissionGlyph name="callsign" className="crew-avatar-edit h-5 w-5" />}
              </button>

              <div className="crew-identity">
                {isSelf && editing ? (
                  <form onSubmit={submit} className="crew-name-form">
                    <input
                      autoFocus
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      maxLength={24}
                      aria-label="Your player name"
                      className="mission-input"
                    />
                    <button type="submit" aria-label="Save name">
                      <MissionGlyph name="confirm" className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => setEditing(false)} aria-label="Cancel">
                      <MissionGlyph name="cancel" className="h-5 w-5" />
                    </button>
                  </form>
                ) : (
                  <div className="crew-name-line">
                    <span className="crew-name">{player.name}</span>
                    {isSelf && <span className="crew-you">you</span>}
                    {isSelf && (
                      <button onClick={() => setEditing(true)} aria-label="Change your name">
                        <MissionGlyph name="callsign" className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}
                <div className="crew-activity" aria-live="polite">
                  {isTyping ? (
                    <span className="crew-typing">
                      plotting a guess
                      <span className="typing-pips" aria-hidden="true"><i /><i /><i /></span>
                    </span>
                  ) : (
                    <span>{isSelf ? "ready to transmit" : "ready on comms"}</span>
                  )}
                </div>
              </div>

              <dl className="crew-live-stats">
                <div>
                  <dd>{playerStats.count}</dd>
                  <dt>{playerStats.count === 1 ? "guess" : "guesses"}</dt>
                </div>
                <div>
                  <dd>{formatAverage(playerStats.average)}</dd>
                  <dt>average</dt>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      {self && choosingAvatar && (
        <div className="avatar-picker" aria-label="Choose your avatar">
          <div className="avatar-picker-heading">
            <div>
              <h3>Choose your neuronaut</h3>
              <p>Claimed avatars are reserved for your crewmates.</p>
            </div>
            <button type="button" onClick={() => setChoosingAvatar(false)} aria-label="Close avatar picker">
              <MissionGlyph name="cancel" className="h-5 w-5" />
            </button>
          </div>
          <div className="avatar-grid">
            {AVATARS.map((avatar) => {
              const owner = takenAvatars.get(avatar.id);
              const isCurrent = avatarAssignments.get(self.id) === avatar.id;
              const isTaken = Boolean(owner && owner.id !== self.id);
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => chooseAvatar(avatar.id)}
                  disabled={isTaken || isCurrent}
                  aria-label={
                    isTaken
                      ? `${avatar.name}, claimed by ${owner?.name}`
                      : isCurrent
                        ? `${avatar.name}, your current avatar`
                        : `Choose ${avatar.name}`
                  }
                  aria-pressed={isCurrent}
                  title={isTaken ? `Claimed by ${owner?.name}` : avatar.name}
                >
                  <PlayerAvatar avatarId={avatar.id} decorative />
                  {isTaken && <span className="avatar-claimed" aria-hidden="true">taken</span>}
                  {isCurrent && <MissionGlyph name="confirm" className="avatar-current h-5 w-5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
