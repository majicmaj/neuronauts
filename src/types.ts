export interface VectorPosition {
  x: number;
  y: number;
}

export interface GuessResult {
  id: string;
  guess: string;
  conceptKey?: string;
  submittedGuess?: string;
  transformation?: GuessTransformation | null;
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
  avatarId?: string | null;
  createdAt: string;
  position: VectorPosition;
  targetWord?: string;
  hintAvailableAt?: string;
}

export type GuessTransformation =
  | "spelling-variant"
  | "plural"
  | "participle"
  | "past"
  | "agreement"
  | "comparison"
  | "irregular"
  | "inflection";

export interface GuessSubmissionResponse {
  ok: boolean;
  result?: GuessResult;
  error?: string;
  code?: string;
  submittedGuess?: string;
  resolvedGuess?: string;
  transformed?: boolean;
  transformation?: GuessTransformation | null;
  existingResult?: GuessResult | null;
}

export interface Player {
  id: string;
  participantId?: string;
  name: string;
  joinedAt: string;
  colorIndex?: number;
  avatarId?: string | null;
  teamId?: TeamId | null;
  ready?: boolean;
}

export interface Winner {
  playerId: string;
  playerName: string;
}

export interface RecapGuess {
  word: string;
  similarity: number;
  rank: number | null;
}

export interface RecapAward {
  id: string;
  title: string;
  description: string;
  metricLabel: string;
  playerId: string;
  playerName: string;
  colorIndex: number;
}

export interface PlayerRecap {
  playerId: string;
  playerName: string;
  colorIndex: number;
  avatarId: string | null;
  guessCount: number;
  wrongGuessCount: number;
  hintCount: number;
  averageSimilarity: number | null;
  bestGuess: RecapGuess | null;
  furthestGuess: RecapGuess | null;
  breakthroughs: number;
  biggestLeap: number;
  foundTarget: boolean;
  title: string;
  titleDetail: string;
  awardIds: string[];
}

export interface GameRecap {
  totalGuesses: number;
  totalHints: number;
  elapsedSeconds: number | null;
  playerCount: number;
  awards: RecapAward[];
  players: PlayerRecap[];
}

export interface RematchState {
  lobbyId: string | null;
  readyCount: number;
  totalCount: number;
  readyParticipantIds: string[];
}

export type GameStatus = "loading" | "setup" | "playing" | "team-finished" | "won" | "error";

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
  recap?: GameRecap | null;
}

export interface LobbyPayload {
  lobbyId: string;
  mode?: GameMode;
  gameState: GameState;
  players: Player[];
  playerCount: number;
  typingPlayerIds?: string[];
  rematch?: RematchState | null;
  versus?: VersusState | null;
}

export type GameMode = "classic" | "versus";
export type TeamId = "red" | "blue";
export type VersusPhase = "setup" | "playing" | "complete";

export interface VersusPlayerStats {
  playerId: string;
  playerName: string;
  avatarId: string | null;
  guessCount: number;
  hintCount: number;
  averageSimilarity: number | null;
  bestSimilarity: number | null;
}

export interface VersusTeamSummary {
  id: TeamId;
  label: string;
  status: "setup" | "playing" | "finished";
  readyCount: number;
  playerCount: number;
  guessCount: number;
  hintCount: number;
  averageSimilarity: number | null;
  bestSimilarity: number | null;
  elapsedSeconds: number | null;
  finishedAt: string | null;
  foundBy: Winner | null;
  score: number | null;
  grade: "S" | "A" | "B" | "C" | "D" | null;
  playerStats: VersusPlayerStats[];
}

export interface OpponentGuessPoint {
  id: string;
  teamId: TeamId;
  similarity: number;
  position: VectorPosition;
  isHint: boolean;
  createdAt: string;
}

export interface VersusScoring {
  guessPenaltySeconds: number;
  hintPenaltySeconds: number;
}

export interface VersusResult {
  winnerTeamId: TeamId;
  loserTeamId: TeamId;
  standings: VersusTeamSummary[];
  targetWord: string;
  scoring: VersusScoring;
}

export interface VersusState {
  phase: VersusPhase;
  teamId: TeamId;
  hostParticipantId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  firstFinishTeamId: TeamId | null;
  canStart: boolean;
  readyCount: number;
  totalCount: number;
  teams: VersusTeamSummary[];
  opponentPoints: OpponentGuessPoint[];
  result: VersusResult | null;
  scoring: VersusScoring;
}

export interface ActionError {
  message: string;
  code: string;
  hintAvailableAt?: string | null;
}

export type GameScreen = "lobby" | "game";
