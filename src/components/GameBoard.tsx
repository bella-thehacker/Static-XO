import { useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';

interface GameBoardProps {
  onAiTurn?: () => void;
}

export default function GameBoard({ onAiTurn }: GameBoardProps) {
  const { gameState, makeMove } = useGameStore();
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [animatingCell, setAnimatingCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState.board[row][col] || gameState.winner) return;
    if (gameState.currentPlayer === 'O' && onAiTurn) return;

    soundManager.playPlaceMark('X');
    setAnimatingCell({ row, col });
    makeMove(row, col);

    setTimeout(() => setAnimatingCell(null), 300);
  }, [gameState.board, gameState.winner, gameState.currentPlayer, makeMove, onAiTurn]);

  const handleCellHover = useCallback((row: number, col: number) => {
    if (!gameState.board[row][col] && !gameState.winner) {
      setHoveredCell({ row, col });
      soundManager.playHover();
    }
  }, [gameState.board, gameState.winner]);

  const isWinningCell = (row: number, col: number) => {
    return gameState.winningLine?.some(([r, c]) => r === row && c === col) ?? false;
  };

  const getCellBorder = (row: number, col: number) => {
    const borders: string[] = [];
    if (row < 2) borders.push('border-b');
    if (col < 2) borders.push('border-r');
    return borders.join(' ');
  };

  return (
    <div className="relative">
      {/* Grid */}
      <div 
        className="grid grid-cols-3 gap-0"
        style={{
          width: 'min(80vw, 360px)',
          height: 'min(80vw, 360px)',
        }}
      >
        {gameState.board.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`
                board-cell relative flex items-center justify-center cursor-pointer
                border-[var(--lavender)] border-opacity-40
                ${getCellBorder(rowIdx, colIdx)}
              `}
              style={{
                transition: 'all 0.15s ease',
              }}
              onClick={() => handleCellClick(rowIdx, colIdx)}
              onMouseEnter={() => handleCellHover(rowIdx, colIdx)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {/* Ghost preview on hover */}
              {hoveredCell?.row === rowIdx && 
               hoveredCell?.col === colIdx && 
               !cell && 
               !gameState.winner &&
               gameState.currentPlayer === 'X' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span 
                    className="font-pixel text-4xl ghost-pulse"
                    style={{ 
                      color: 'var(--cyan)',
                      opacity: 0.3,
                    }}
                  >
                    X
                  </span>
                </div>
              )}

              {/* Cell content */}
              {cell && (
                <div 
                  className={`
                    flex items-center justify-center
                    ${animatingCell?.row === rowIdx && animatingCell?.col === colIdx ? 'draw-in' : ''}
                    ${isWinningCell(rowIdx, colIdx) ? 'pulse-glow' : ''}
                  `}
                >
                  {cell === 'X' ? (
                    <svg 
                      width="60" 
                      height="60" 
                      viewBox="0 0 60 60"
                      className={isWinningCell(rowIdx, colIdx) ? '' : ''}
                    >
                      <line
                        x1="12" y1="12" x2="48" y2="48"
                        stroke="var(--cyan)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                          filter: 'drop-shadow(0 0 8px var(--cyan))',
                          strokeDasharray: 200,
                          strokeDashoffset: animatingCell?.row === rowIdx && animatingCell?.col === colIdx ? undefined : 0,
                          animation: animatingCell?.row === rowIdx && animatingCell?.col === colIdx ? 'drawIn 0.25s ease-out forwards' : 'none',
                        }}
                      />
                      <line
                        x1="48" y1="12" x2="12" y2="48"
                        stroke="var(--cyan)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                          filter: 'drop-shadow(0 0 8px var(--cyan))',
                          strokeDasharray: 200,
                          strokeDashoffset: animatingCell?.row === rowIdx && animatingCell?.col === colIdx ? undefined : 0,
                          animation: animatingCell?.row === rowIdx && animatingCell?.col === colIdx ? 'drawIn 0.25s ease-out 0.1s forwards' : 'none',
                        }}
                      />
                    </svg>
                  ) : (
                    <svg 
                      width="60" 
                      height="60" 
                      viewBox="0 0 60 60"
                    >
                      <circle
                        cx="30" cy="30" r="20"
                        fill="none"
                        stroke="var(--magenta)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                          filter: 'drop-shadow(0 0 8px var(--magenta))',
                          strokeDasharray: 200,
                          strokeDashoffset: animatingCell?.row === rowIdx && animatingCell?.col === colIdx ? undefined : 0,
                          animation: animatingCell?.row === rowIdx && animatingCell?.col === colIdx ? 'drawIn 0.3s ease-out forwards' : 'none',
                        }}
                      />
                    </svg>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Winning line overlay */}
      {gameState.winningLine && (
        <WinningLineOverlay line={gameState.winningLine} />
      )}
    </div>
  );
}

function WinningLineOverlay({ line }: { line: number[][] }) {
  const getLineStyle = () => {
    if (line.length !== 3) return {};
    
    const [[r1, c1], [r2, c2], [r3, c3]] = line;
    const cellSize = 33.33; // percentage
    
    // Horizontal
    if (r1 === r2 && r2 === r3) {
      return {
        top: `${(r1 * cellSize) + (cellSize / 2)}%`,
        left: '5%',
        width: '90%',
        height: '4px',
      };
    }
    
    // Vertical
    if (c1 === c2 && c2 === c3) {
      return {
        left: `${(c1 * cellSize) + (cellSize / 2)}%`,
        top: '5%',
        width: '4px',
        height: '90%',
      };
    }
    
    // Diagonal
    if (r1 === c1 && r2 === c2 && r3 === c3) {
      return {
        top: '50%',
        left: '50%',
        width: '127%',
        height: '4px',
        transform: 'translate(-50%, -50%) rotate(45deg)',
      };
    }
    
    // Anti-diagonal
    return {
      top: '50%',
      left: '50%',
      width: '127%',
      height: '4px',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
    };
  };

  const style = getLineStyle();
  const winner = useGameStore((state) => state.gameState.winner);

  return (
    <div
      className="absolute pointer-events-none win-sweep rounded-full"
      style={{
        ...style,
        background: winner === 'X' ? 'var(--cyan)' : 'var(--magenta)',
        boxShadow: winner === 'X' 
          ? '0 0 15px var(--cyan), 0 0 30px var(--cyan)' 
          : '0 0 15px var(--magenta), 0 0 30px var(--magenta)',
        zIndex: 10,
      }}
    />
  );
}
