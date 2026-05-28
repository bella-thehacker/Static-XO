export type CellValue = 'X' | 'O' | null;
export type Board = CellValue[][];

export type GameScreen = 
  | 'menu' 
  | 'levelSelect' 
  | 'playing' 
  | 'paused' 
  | 'gameOver' 
  | 'settings' 
  | 'howToPlay';

export type GameMode = 'ai' | 'local' | 'multiplayer';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  matchLength: number; // best of N
  aiDepth: number;
  mistakeChance: number; // 0-1
  description: string;
  unlocked: boolean;
  stars: number; // 0-3
  completed: boolean;
}

export interface GameState {
  board: Board;
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | 'draw' | null;
  winningLine: number[][] | null;
  scores: { X: number; O: number };
  round: number;
  moveHistory: { row: number; col: number; player: 'X' | 'O' }[];
}

export interface Settings {
  crtEffect: boolean;
  scanlines: boolean;
  grainIntensity: number; // 0-1
  flickerIntensity: number; // 0-1
  soundEnabled: boolean;
  musicEnabled: boolean;
  chromaticAberration: boolean;
  difficulty: Difficulty;
}

export interface PlayerProfile {
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  highestLevel: number;
  totalStars: number;
}
