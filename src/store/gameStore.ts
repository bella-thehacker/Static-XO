import { create } from 'zustand';
import type { 
  GameScreen, 
  GameMode, 
  Board, 
  CellValue, 
  GameState, 
  Settings,
  LevelConfig,
  PlayerProfile
} from '@/types/game';

const createEmptyBoard = (): Board => [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const DEFAULT_LEVELS: LevelConfig[] = [
  { id: 1, name: 'BROKEN ROM', subtitle: 'ERR_001', matchLength: 1, aiDepth: 0, mistakeChance: 1.0, description: 'Completely random. No logic detected.', unlocked: true, stars: 0, completed: false },
  { id: 2, name: 'FLICKER_V1', subtitle: 'WARN_002', matchLength: 3, aiDepth: 0, mistakeChance: 0.8, description: 'Occasional awareness. Mostly noise.', unlocked: false, stars: 0, completed: false },
  { id: 3, name: 'TUBE_GLOW', subtitle: 'BOOT_003', matchLength: 3, aiDepth: 1, mistakeChance: 0.5, description: 'Basic pattern recognition active.', unlocked: false, stars: 0, completed: false },
  { id: 4, name: 'ANALOG_Sig', subtitle: 'SYNC_004', matchLength: 5, aiDepth: 2, mistakeChance: 0.3, description: 'Signal stabilizing. Blocks obvious traps.', unlocked: false, stars: 0, completed: false },
  { id: 5, name: 'PHOSPHOR_T', subtitle: 'LINK_005', matchLength: 5, aiDepth: 4, mistakeChance: 0.15, description: 'Strategic depth detected. Beware.', unlocked: false, stars: 0, completed: false },
  { id: 6, name: 'STATIC_MAS', subtitle: 'WARN_006', matchLength: 7, aiDepth: 6, mistakeChance: 0.05, description: 'Nearly perfect. One mistake allowed.', unlocked: false, stars: 0, completed: false },
  { id: 7, name: 'HARD_DRIVE', subtitle: 'CRIT_007', matchLength: 7, aiDepth: 9, mistakeChance: 0, description: 'Perfect play. Cannot be defeated.', unlocked: false, stars: 0, completed: false },
  { id: 8, name: 'DEEP_MEM', subtitle: 'FATL_008', matchLength: 9, aiDepth: 9, mistakeChance: 0, description: 'Perfect and fast. No hesitation.', unlocked: false, stars: 0, completed: false },
  { id: 9, name: 'NEURAL_GLI', subtitle: 'OVLD_009', matchLength: 9, aiDepth: 9, mistakeChance: 0, description: 'System override imminent.', unlocked: false, stars: 0, completed: false },
  { id: 10, name: 'THE STATIC', subtitle: 'END_010', matchLength: 11, aiDepth: 9, mistakeChance: 0, description: 'THE SIGNAL IS EVERYTHING.', unlocked: false, stars: 0, completed: false },
];

const DEFAULT_SETTINGS: Settings = {
  crtEffect: true,
  scanlines: true,
  grainIntensity: 0.08,
  flickerIntensity: 0.05,
  soundEnabled: true,
  musicEnabled: true,
  chromaticAberration: true,
  difficulty: 'medium',
};

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'PLAYER_1',
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  gamesDrawn: 0,
  highestLevel: 1,
  totalStars: 0,
};

interface GameStore {
  // Navigation
  screen: GameScreen;
  previousScreen: GameScreen | null;
  setScreen: (screen: GameScreen) => void;
  
  // Game mode
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  
  // Game state
  gameState: GameState;
  selectedLevel: LevelConfig | null;
  levels: LevelConfig[];
  
  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Profile
  profile: PlayerProfile;
  updateProfile: (profile: Partial<PlayerProfile>) => void;
  
  // Actions
  startLevel: (level: LevelConfig) => void;
  makeMove: (row: number, col: number) => void;
  resetBoard: () => void;
  resetMatch: () => void;
  completeLevel: (stars: number) => void;
  checkWin: (board: Board, row: number, col: number) => { winner: CellValue; line: number[][] } | null;
  getAvailableMoves: (board: Board) => { row: number; col: number }[];
  minimax: (board: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number) => number;
  aiMove: () => void;
  togglePause: () => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'menu',
  previousScreen: null,
  setScreen: (screen) => set((state) => ({ 
    screen, 
    previousScreen: state.screen 
  })),
  
  gameMode: 'ai',
  setGameMode: (mode) => set({ gameMode: mode }),
  
  gameState: {
    board: createEmptyBoard(),
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    scores: { X: 0, O: 0 },
    round: 1,
    moveHistory: [],
  },
  selectedLevel: null,
  levels: DEFAULT_LEVELS,
  
  settings: DEFAULT_SETTINGS,
  updateSettings: (newSettings) => set((state) => ({ 
    settings: { ...state.settings, ...newSettings } 
  })),
  
  profile: DEFAULT_PROFILE,
  updateProfile: (newProfile) => set((state) => ({ 
    profile: { ...state.profile, ...newProfile } 
  })),
  
  startLevel: (level) => set({
    selectedLevel: level,
    gameState: {
      board: createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
      scores: { X: 0, O: 0 },
      round: 1,
      moveHistory: [],
    },
    screen: 'playing',
  }),
  
  makeMove: (row, col) => {
    const state = get();
    const { gameState } = state;
    
    if (gameState.winner || gameState.board[row][col]) return;
    
    const newBoard = gameState.board.map(r => [...r]);
    newBoard[row][col] = gameState.currentPlayer;
    
    const newHistory = [...gameState.moveHistory, { row, col, player: gameState.currentPlayer }];
    
    const winResult = get().checkWin(newBoard, row, col);
    
    if (winResult) {
      const newScores = { ...gameState.scores };
      newScores[winResult.winner!]++;
      
      const winnerPlayer = winResult.winner;
      const requiredWins = Math.ceil((state.selectedLevel?.matchLength || 1) / 2);
      
      if (newScores.X >= requiredWins || newScores.O >= requiredWins) {
        set({
          gameState: {
            ...gameState,
            board: newBoard,
            winner: winnerPlayer,
            winningLine: winResult.line,
            scores: newScores,
            moveHistory: newHistory,
          },
          screen: 'gameOver',
        });
      } else {
        set({
          gameState: {
            ...gameState,
            board: newBoard,
            winningLine: winResult.line,
            scores: newScores,
            round: gameState.round + 1,
            moveHistory: newHistory,
          },
        });
        
        setTimeout(() => {
          set((s) => ({
            gameState: {
              ...s.gameState,
              board: createEmptyBoard(),
              currentPlayer: 'X',
              winner: null,
              winningLine: null,
            },
          }));
        }, 1500);
      }
      return;
    }
    
    const isDraw = newBoard.every(r => r.every(c => c !== null));
    if (isDraw) {
      set({
        gameState: {
          ...gameState,
          board: newBoard,
          winner: 'draw',
          moveHistory: newHistory,
        },
      });
      
      setTimeout(() => {
        set((s) => ({
          gameState: {
            ...s.gameState,
            board: createEmptyBoard(),
            currentPlayer: 'X',
            winner: null,
          },
        }));
      }, 1500);
      return;
    }
    
    set({
      gameState: {
        ...gameState,
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
        moveHistory: newHistory,
      },
    });
  },
  
  checkWin: (board, row, col) => {
    const player = board[row][col];
    if (!player) return null;
    
    const lines = [
      // Horizontal
      [[row, 0], [row, 1], [row, 2]],
      // Vertical
      [[0, col], [1, col], [2, col]],
      // Diagonal
      [[0, 0], [1, 1], [2, 2]],
      // Anti-diagonal
      [[0, 2], [1, 1], [2, 0]],
    ];
    
    for (const line of lines) {
      if (line.every(([r, c]) => board[r][c] === player)) {
        return { winner: player, line };
      }
    }
    
    return null;
  },
  
  getAvailableMoves: (board) => {
    const moves: { row: number; col: number }[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (!board[r][c]) moves.push({ row: r, col: c });
      }
    }
    return moves;
  },
  
  minimax: (board, depth, isMaximizing, alpha, beta) => {
    const state = get();
    const moves = state.getAvailableMoves(board);
    
    // Check terminal states
    for (const move of moves) {
      const testBoard = board.map(r => [...r]);
      testBoard[move.row][move.col] = isMaximizing ? 'O' : 'X';
      const winResult = state.checkWin(testBoard, move.row, move.col);
      if (winResult) {
        return isMaximizing ? 10 - depth : depth - 10;
      }
    }
    
    if (moves.length === 0 || depth === 0) return 0;
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const newBoard = board.map(r => [...r]);
        newBoard[move.row][move.col] = 'O';
        const evalScore = state.minimax(newBoard, depth - 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const newBoard = board.map(r => [...r]);
        newBoard[move.row][move.col] = 'X';
        const evalScore = state.minimax(newBoard, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  },
  
  aiMove: () => {
    const state = get();
    const { gameState, selectedLevel } = state;
    
    if (!selectedLevel || gameState.winner) return;
    
    const level = selectedLevel;
    const moves = state.getAvailableMoves(gameState.board);
    if (moves.length === 0) return;
    
    let chosenMove;
    
    // Mistake chance: pick random
    if (Math.random() < level.mistakeChance) {
      chosenMove = moves[Math.floor(Math.random() * moves.length)];
    } else if (level.aiDepth === 0) {
      // Random but try to win or block if obvious
      // Check if AI can win
      for (const move of moves) {
        const testBoard = gameState.board.map(r => [...r]);
        testBoard[move.row][move.col] = 'O';
        if (state.checkWin(testBoard, move.row, move.col)) {
          chosenMove = move;
          break;
        }
      }
      // Check if need to block
      if (!chosenMove) {
        for (const move of moves) {
          const testBoard = gameState.board.map(r => [...r]);
          testBoard[move.row][move.col] = 'X';
          if (state.checkWin(testBoard, move.row, move.col)) {
            chosenMove = move;
            break;
          }
        }
      }
      if (!chosenMove) {
        chosenMove = moves[Math.floor(Math.random() * moves.length)];
      }
    } else {
      // Minimax
      let bestScore = -Infinity;
      let bestMoves: { row: number; col: number }[] = [];
      
      for (const move of moves) {
        const newBoard = gameState.board.map(r => [...r]);
        newBoard[move.row][move.col] = 'O';
        const score = state.minimax(newBoard, level.aiDepth - 1, false, -Infinity, Infinity);
        
        if (score > bestScore) {
          bestScore = score;
          bestMoves = [move];
        } else if (score === bestScore) {
          bestMoves.push(move);
        }
      }
      
      chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }
    
    setTimeout(() => {
      state.makeMove(chosenMove.row, chosenMove.col);
    }, 400 + Math.random() * 600);
  },
  
  resetBoard: () => set((state) => ({
    gameState: {
      ...state.gameState,
      board: createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
    },
  })),
  
  resetMatch: () => set((state) => ({
    gameState: {
      ...state.gameState,
      board: createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
      scores: { X: 0, O: 0 },
      round: 1,
      moveHistory: [],
    },
    screen: 'playing',
  })),
  
  completeLevel: (stars) => set((state) => {
    if (!state.selectedLevel) return state;
    
    const newLevels = state.levels.map(l => {
      if (l.id === state.selectedLevel!.id) {
        return { ...l, completed: true, stars: Math.max(l.stars, stars) };
      }
      if (l.id === state.selectedLevel!.id + 1) {
        return { ...l, unlocked: true };
      }
      return l;
    });
    
    const newProfile = {
      ...state.profile,
      gamesPlayed: state.profile.gamesPlayed + 1,
      gamesWon: state.profile.gamesWon + (state.gameState.scores.X > state.gameState.scores.O ? 1 : 0),
      gamesLost: state.profile.gamesLost + (state.gameState.scores.X < state.gameState.scores.O ? 1 : 0),
      highestLevel: Math.max(state.profile.highestLevel, state.selectedLevel.id),
      totalStars: newLevels.reduce((acc, l) => acc + l.stars, 0),
    };
    
    return { levels: newLevels, profile: newProfile };
  }),
  
  togglePause: () => set((state) => ({
    screen: state.screen === 'paused' ? 'playing' : 'paused',
  })),
  
  resetProgress: () => set({
    levels: DEFAULT_LEVELS,
    profile: DEFAULT_PROFILE,
  }),
}));
