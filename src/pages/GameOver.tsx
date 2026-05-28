import { useEffect, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { RotateCcw, Home, ArrowRight, Star } from 'lucide-react';

export default function GameOver() {
  const { 
    gameState, 
    selectedLevel, 
    resetMatch, 
    setScreen, 
    completeLevel,
    levels,
    startLevel,
  } = useGameStore();

  const isMatchWon = gameState.scores.X > gameState.scores.O;
  const isMatchLost = gameState.scores.O > gameState.scores.X;
  const isDraw = gameState.scores.X === gameState.scores.O;

  // Calculate stars earned
  const starsEarned = useMemo(() => {
    if (!selectedLevel) return 0;
    if (isMatchLost || isDraw) return 0;
    
    let stars = 1; // Win = 1 star
    
    // No draws in match = 2 stars
    const roundsPlayed = gameState.round;
    const requiredWins = Math.ceil(selectedLevel.matchLength / 2);
    if (gameState.scores.X === requiredWins && roundsPlayed === requiredWins) {
      stars = 3; // Perfect victory
    } else if (gameState.scores.X === requiredWins) {
      stars = 2;
    }
    
    return stars;
  }, [gameState, selectedLevel, isMatchLost, isDraw]);

  useEffect(() => {
    if (isMatchWon) {
      soundManager.playWin();
      if (selectedLevel) {
        completeLevel(starsEarned);
      }
    } else if (isMatchLost) {
      soundManager.playLose();
    } else {
      soundManager.playDraw();
    }
  }, []);

  const handleRestart = () => {
    soundManager.playClick();
    soundManager.playGlitch();
    if (selectedLevel) {
      startLevel(selectedLevel);
    } else {
      resetMatch();
    }
  };

  const handleNextLevel = () => {
    soundManager.playClick();
    if (selectedLevel) {
      const nextLevel = levels.find(l => l.id === selectedLevel.id + 1);
      if (nextLevel && nextLevel.unlocked) {
        startLevel(nextLevel);
      } else {
        setScreen('levelSelect');
      }
    }
  };

  const handleMenu = () => {
    soundManager.playClick();
    soundManager.playGlitch();
    setScreen('menu');
  };

  const getTitle = () => {
    if (isMatchWon) return 'SYNC ESTABLISHED';
    if (isMatchLost) return 'SIGNAL TERMINATED';
    return 'DEADLOCK';
  };

  const getColor = () => {
    if (isMatchWon) return 'var(--cyan)';
    if (isMatchLost) return 'var(--magenta)';
    return 'var(--lavender)';
  };

  const nextLevel = selectedLevel ? levels.find(l => l.id === selectedLevel.id + 1) : null;
  const hasNextLevel = nextLevel?.unlocked ?? false;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(18, 0, 32, 0.9)', backdropFilter: 'blur(6px)' }}
    >
      <div 
        className="p-8 rounded w-96 max-w-[90vw] flex flex-col items-center channel-change"
        style={{
          background: 'rgba(43, 0, 66, 0.95)',
          border: `1px solid ${getColor()}`,
          boxShadow: `0 0 40px ${getColor()}30, inset 0 0 40px ${getColor()}10`,
        }}
      >
        {/* Title */}
        <h2 
          className="font-pixel text-lg mb-2 text-center"
          style={{ 
            color: getColor(),
            textShadow: `0 0 20px ${getColor()}`,
          }}
        >
          {getTitle()}
        </h2>

        {/* Subtitle */}
        <p 
          className="font-terminal text-sm mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          {isMatchWon ? 'Signal synchronized successfully' : 
           isMatchLost ? 'Connection lost to hostile signal' : 
           'Neither signal could establish dominance'}
        </p>

        {/* Score summary */}
        <div 
          className="flex items-center gap-6 mb-6 px-6 py-3 rounded"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <div className="text-center">
            <p className="font-pixel text-[0.5rem]" style={{ color: 'var(--cyan)' }}>P1</p>
            <p className="font-terminal text-2xl" style={{ color: 'var(--cyan)' }}>
              {gameState.scores.X}
            </p>
          </div>
          <p className="font-terminal text-lg" style={{ color: 'var(--text-secondary)' }}>-</p>
          <div className="text-center">
            <p className="font-pixel text-[0.5rem]" style={{ color: 'var(--magenta)' }}>
              {selectedLevel ? 'CPU' : 'P2'}
            </p>
            <p className="font-terminal text-2xl" style={{ color: 'var(--magenta)' }}>
              {gameState.scores.O}
            </p>
          </div>
        </div>

        {/* Stars earned */}
        {isMatchWon && selectedLevel && (
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={24}
                className={`transition-all duration-500 ${star <= starsEarned ? 'earned scale-100' : 'scale-75'}`}
                fill={star <= starsEarned ? 'var(--green-neon)' : 'none'}
                style={{ 
                  color: star <= starsEarned ? 'var(--green-neon)' : 'rgba(177, 156, 217, 0.3)',
                  transitionDelay: `${star * 200}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          {hasNextLevel && isMatchWon && (
            <button
              onClick={handleNextLevel}
              onMouseEnter={() => soundManager.playMenuHover()}
              className="retro-btn flex items-center justify-center gap-3"
            >
              <ArrowRight size={16} />
              NEXT SIGNAL
            </button>
          )}

          <button
            onClick={handleRestart}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn retro-btn-secondary flex items-center justify-center gap-3"
          >
            <RotateCcw size={16} />
            RETRY
          </button>

          <button
            onClick={handleMenu}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn flex items-center justify-center gap-3"
            style={{ borderColor: 'var(--lavender)', color: 'var(--lavender)' }}
          >
            <Home size={16} />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
