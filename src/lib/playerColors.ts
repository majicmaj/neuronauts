const PLAYER_COLOR_COUNT = 12;

function fallbackColorIndex(playerId: string) {
  let hash = 0;
  for (const character of playerId) {
    hash = (hash * 31 + character.charCodeAt(0)) | 0;
  }
  return Math.abs(hash) % PLAYER_COLOR_COUNT;
}

export function playerColor(colorIndex: number | undefined, playerId: string) {
  const index = Number.isInteger(colorIndex)
    ? Math.abs(colorIndex as number) % PLAYER_COLOR_COUNT
    : fallbackColorIndex(playerId);
  return `var(--player-${index})`;
}
