// Faction types
export type FactionType = 'Fire' | 'Water' | 'Earth' | 'Air';

export type ActionType = 'Attack' | 'Defend' | 'Train';

export interface FactionStats {
  hp: number;
  score: number;
}

export interface PlayerData {
  username: string;
  faction: FactionType;
  hasVoted: boolean;
}

export interface Vote {
  username: string;
  faction: FactionType;
  action: ActionType;
  target?: FactionType | undefined; // Only for Attack actions
}

export interface TurnResult {
  faction: FactionType;
  action: ActionType;
  target?: FactionType;
  damage?: number;
  scoreGain?: number;
  result: string;
}

export interface GameState {
  factions: Record<FactionType, FactionStats>;
  players: Record<string, PlayerData>;
  currentTurn: number;
  lastTurnResults: TurnResult[];
  gameActive: boolean;
}

// API Response types
export type InitResponse = {
  type: 'init';
  postId: string;
  username: string;
  gameState: GameState;
  playerFaction?: FactionType | undefined;
  hasVoted: boolean;
};

export type JoinFactionResponse = {
  type: 'join-faction';
  success: boolean;
  faction?: FactionType;
  message: string;
};

export type VoteResponse = {
  type: 'vote';
  success: boolean;
  message: string;
};

export type GameStateResponse = {
  type: 'game-state';
  gameState: GameState;
  playerFaction?: FactionType | undefined;
  hasVoted: boolean;
};

export type RestartGameResponse = {
  type: 'restart-game';
  success: boolean;
  message: string;
};
