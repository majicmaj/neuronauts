export interface VectorPosition {
  x: number;
  y: number;
}

export interface GuessResult {
  id: string;
  guess: string;
  similarity: number;
  cosineSimilarity?: number;
  rank?: number;
  rankedWordCount?: number;
  correct: boolean;
  isHint: boolean;
  hintFrom: string | null;
  playerId: string;
  playerName: string;
  colorIndex?: number;
  createdAt: string;
  position: VectorPosition;
  targetWord?: string;
  hintAvailableAt?: string;
}

export interface Player {
  id: string;
  name: string;
  joinedAt: string;
  colorIndex?: number;
}

export interface Winner {
  playerId: string;
  playerName: string;
}

export type GameStatus = "loading" | "playing" | "won" | "error";

export interface GameState {
  status: GameStatus;
  targetLength: number;
  targetWord?: string;
  guessHistory: GuessResult[];
  startedAt: string | null;
  solvedAt: string | null;
  winner: Winner | null;
  hintAvailableAt: string | null;
  error: string | null;
}

export interface LobbyPayload {
  lobbyId: string;
  gameState: GameState;
  players: Player[];
  playerCount: number;
}

export interface ActionError {
  message: string;
  code: string;
  hintAvailableAt?: string | null;
}

export type GameScreen = "lobby" | "game";
