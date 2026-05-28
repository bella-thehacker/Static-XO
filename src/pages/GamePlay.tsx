import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import GameBoard from '../components/GameBoard';
import { Pause, RotateCcw } from 'lucide-react';

export default function GamePlay() {
  const { 
    gameState, 
    selectedLevel, 
    aiMove, 
    togglePause,
    resetMatch,
  } = useGameStore();

  // AI turn handling
  useEffect(() => {
    if (
      selectedLevel && 
      gameState.currentPlayer === 'O' && 
      !gameState.winner
    ) {
      const timer = setTimeout(() => {
        aiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.winner, selectedLevel, aiMove]);

  const handlePause = useCallback(() => {
    soundManager.playClick();
    togglePause();
  }, [togglePause]);

  const handleReset = useCallback(() => {
    soundManager.playClick();
    soundManager.playGlitch();
    resetMatch();
  }, [resetMatch]);

  const requiredWins = selectedLevel ? Math.ceil(selectedLevel.matchLength / 2) : 1;
  const isAiThinking = selectedLevel && gameState.currentPlayer === 'O' && !gameState.winner;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 crt-on">
      {/* Top HUD */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        {/* Player 1 Score */}
        <div className="text-left">
          <p 
            className="font-pixel text-xs mb-1"
            style={{ color: 'var(--cyan)' }}
          >
            P1
          </p>
          <p 
            className="font-terminal text-3xl glow-cyan"
            style={{ color: 'var(--cyan)' }}
          >
            {gameState.scores.X}
          </p>
          <p className="font-terminal text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            /{requiredWins}
          </p>
        </div>

        {/* Center info */}
        <div className="text-center">
          {selectedLevel && (
            <p 
              className="font-pixel text-[0.5rem] tracking-widest mb-1"
              style={{ color: 'var(--lavender)' }}
            >
              {selectedLevel.name}
            </p>
          )}
          <p 
            className="font-terminal text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            ROUND {gameState.round}
          </p>
          
          {/* Turn indicator */}
          <div className="mt-2 h-6 flex items-center justify-center">
            {isAiThinking ? (
              <p 
                className="font-terminal text-sm blink"
                style={{ color: 'var(--magenta)' }}
              >
                CALCULATING...
              </p>
            ) : gameState.winner ? (
              <p 
                className="font-terminal text-sm pulse-glow"
                style={{ 
                  color: gameState.winner === 'X' ? 'var(--cyan)' : 
                         gameState.winner === 'draw' ? 'var(--lavender)' : 'var(--magenta)'
                }}
              >
                {gameState.winner === 'draw' ? 'SIGNAL DEADLOCKED' : `SYNC ${gameState.winner === 'X' ? 'ESTABLISHED' : 'TERMINATED'}`}
              </p>
            ) : (
              <p 
                className="font-terminal text-sm"
                style={{ color: 'var(--cyan)' }}
              >
                PLAYER {gameState.currentPlayer} TURN
              </p>
            )}
          </div>
        </div>

        {/* Player 2 / AI Score */}
        <div className="text-right">
          <p 
            className="font-pixel text-xs mb-1"
            style={{ color: 'var(--magenta)' }}
          >
            {selectedLevel ? 'CPU' : 'P2'}
          </p>
          <p 
            className="font-terminal text-3xl glow-magenta"
            style={{ color: 'var(--magenta)' }}
          >
            {gameState.scores.O}
          </p>
          <p className="font-terminal text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            /{requiredWins}
          </p>
        </div>
      </div>

      {/* Game Board */}
      <GameBoard onAiTurn={selectedLevel ? aiMove : undefined} />

      {/* Bottom controls */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handlePause}
          onMouseEnter={() => soundManager.playMenuHover()}
          className="retro-btn p-3 flex items-center gap-2"
          style={{ borderColor: 'var(--lavender)', color: 'var(--lavender)' }}
        >
          <Pause size={14} />
          <span className="font-pixel text-[0.5rem]">PAUSE</span>
        </button>

        <button
          onClick={handleReset}
          onMouseEnter={() => soundManager.playMenuHover()}
          className="retro-btn p-3 flex items-center gap-2"
          style={{ borderColor: 'var(--magenta)', color: 'var(--magenta)' }}
        >
          <RotateCcw size={14} />
          <span className="font-pixel text-[0.5rem]">RESET</span>
        </button>
      </div>

      {/* Level description */}
      {selectedLevel && (
        <p 
          className="font-terminal text-xs mt-4 text-center max-w-md"
          style={{ color: 'rgba(177, 156, 217, 0.6)' }}
        >
          {selectedLevel.description}
        </p>
      )}
    </div>
  );
}
