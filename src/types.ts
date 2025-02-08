export interface GuessResult {
  guess: string;
  similarity: number | null;
  correct?: boolean;
  error?: string;
}

export interface GameState {
  targetLength: number;
  guessHistory: GuessResult[];
}

export type GameScreen = "lobby" | "game";
