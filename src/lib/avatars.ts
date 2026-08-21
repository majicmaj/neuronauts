import coreAvatarSheet from "@/assets/neuronaut-avatars.webp";

export const AVATAR_SHEETS = {
  core: { source: coreAvatarSheet, columns: 4, rows: 4 },
} as const;

export const AVATARS = [
  { id: "aqua-cadet", name: "Aqua Cadet", sheet: "core", column: 0, row: 0 },
  { id: "solar-shades", name: "Solar Shades", sheet: "core", column: 1, row: 0 },
  { id: "cosmic-crown", name: "Cosmic Crown", sheet: "core", column: 2, row: 0 },
  { id: "heart-hopper", name: "Heart Hopper", sheet: "core", column: 3, row: 0 },
  { id: "blue-scout", name: "Blue Scout", sheet: "core", column: 0, row: 1 },
  { id: "tech-ranger", name: "Tech Ranger", sheet: "core", column: 1, row: 1 },
  { id: "shark-suit", name: "Shark Suit", sheet: "core", column: 2, row: 1 },
  { id: "space-sheriff", name: "Space Sheriff", sheet: "core", column: 3, row: 1 },
  { id: "disco-pilot", name: "Disco Pilot", sheet: "core", column: 0, row: 2 },
  { id: "pizza-runner", name: "Pizza Runner", sheet: "core", column: 1, row: 2 },
  { id: "star-mage", name: "Star Mage", sheet: "core", column: 2, row: 2 },
  { id: "mission-coder", name: "Mission Coder", sheet: "core", column: 3, row: 2 },
  { id: "arctic-explorer", name: "Arctic Explorer", sheet: "core", column: 0, row: 3 },
  { id: "dino-cadet", name: "Dino Cadet", sheet: "core", column: 1, row: 3 },
  { id: "shadow-cat", name: "Shadow Cat", sheet: "core", column: 2, row: 3 },
  { id: "halo-heart", name: "Halo Heart", sheet: "core", column: 3, row: 3 },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function isAvatarId(value: string | null | undefined): value is AvatarId {
  return AVATARS.some((avatar) => avatar.id === value);
}

export function assignUniqueAvatarIds(
  players: ReadonlyArray<{ key: string; avatarId?: string | null }>
) {
  const assignments = new Map<string, AvatarId>();
  const claimed = new Set<AvatarId>();
  const needsFallback: string[] = [];

  for (const player of players) {
    if (isAvatarId(player.avatarId) && !claimed.has(player.avatarId)) {
      assignments.set(player.key, player.avatarId);
      claimed.add(player.avatarId);
    } else {
      needsFallback.push(player.key);
    }
  }

  for (const key of needsFallback) {
    const available = AVATARS.find((avatar) => !claimed.has(avatar.id));
    if (!available) break;
    assignments.set(key, available.id);
    claimed.add(available.id);
  }

  return assignments;
}

export function avatarName(avatarId: AvatarId) {
  return AVATARS.find((avatar) => avatar.id === avatarId)?.name || "Neuronaut";
}

export function avatarDefinition(avatarId: AvatarId) {
  return AVATARS.find((avatar) => avatar.id === avatarId) || AVATARS[0];
}
