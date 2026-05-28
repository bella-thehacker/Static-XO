import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { Lock, Star, ArrowLeft, Zap } from 'lucide-react';

export default function LevelSelect() {
  const levels = useGameStore((state) => state.levels);
  const startLevel = useGameStore((state) => state.startLevel);
  const setScreen = useGameStore((state) => state.setScreen);
  const setGameMode = useGameStore((state) => state.setGameMode);

  const handleSelectLevel = (level: typeof levels[0]) => {
    if (!level.unlocked) {
      soundManager.playGlitch();
      return;
    }
    
    soundManager.playClick();
    setGameMode('ai');
    startLevel(level);
    soundManager.playRoundStart();
  };

  const handleBack = () => {
    soundManager.playClick();
    setScreen('menu');
  };

  const getDifficultyColor = (id: number) => {
    if (id <= 2) return 'var(--green-neon)';
    if (id <= 4) return 'var(--cyan)';
    if (id <= 6) return 'var(--lavender)';
    if (id <= 8) return 'var(--magenta)';
    return '#FF4400';
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 crt-on">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center mb-8">
        <button
          onClick={handleBack}
          onMouseEnter={() => soundManager.playMenuHover()}
          className="retro-btn p-2 mr-4"
          style={{ borderColor: 'var(--lavender)', color: 'var(--lavender)' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 
            className="font-pixel text-lg md:text-xl glow-cyan"
            style={{ color: 'var(--cyan)' }}
          >
            SELECT SIGNAL
          </h1>
          <p 
            className="font-terminal text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Choose your opponent
          </p>
        </div>
      </div>

      {/* Level Grid */}
      <div className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-5 gap-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => handleSelectLevel(level)}
            onMouseEnter={() => level.unlocked && soundManager.playMenuHover()}
            className={`
              level-item relative p-3 rounded flex flex-col items-center justify-center
              min-h-[100px] transition-all duration-200
              ${!level.unlocked ? 'locked' : ''}
              ${level.completed ? 'completed' : ''}
            `}
            disabled={!level.unlocked}
          >
            {/* Level number */}
            <span 
              className="font-pixel text-xs absolute top-2 left-2"
              style={{ color: getDifficultyColor(level.id) }}
            >
              {String(level.id).padStart(2, '0')}
            </span>

            {/* Lock icon */}
            {!level.unlocked && (
              <Lock 
                size={24} 
                className="mb-1"
                style={{ color: 'var(--magenta)' }}
              />
            )}

            {/* Level name */}
            {level.unlocked && (
              <>
                <Zap 
                  size={20} 
                  className="mb-1"
                  style={{ color: getDifficultyColor(level.id) }}
                />
                <span 
                  className="font-pixel text-[0.5rem] text-center leading-tight mt-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {level.name}
                </span>
              </>
            )}

            {/* Stars */}
            {level.unlocked && (
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    size={10}
                    className={`star ${star <= level.stars ? 'earned' : ''}`}
                    fill={star <= level.stars ? 'var(--green-neon)' : 'none'}
                  />
                ))}
              </div>
            )}

            {/* Subtle glow on hover */}
            {level.unlocked && (
              <div 
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded"
                style={{
                  boxShadow: `inset 0 0 20px ${getDifficultyColor(level.id)}20`,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Level detail preview */}
      <div 
        className="w-full max-w-2xl mt-6 p-4 rounded"
        style={{ 
          background: 'rgba(18, 0, 32, 0.8)',
          border: '1px solid rgba(177, 156, 217, 0.2)',
        }}
      >
        <p 
          className="font-terminal text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Select a signal to view its parameters. Defeat each signal to unlock the next.
          Higher signals play more strategically and require more rounds to defeat.
        </p>
      </div>
    </div>
  );
}
