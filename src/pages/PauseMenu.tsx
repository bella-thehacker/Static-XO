import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { Play, RotateCcw, Settings, Home } from 'lucide-react';

export default function PauseMenu() {
  const { togglePause, resetMatch, setScreen } = useGameStore();

  const handleResume = () => {
    soundManager.playClick();
    togglePause();
  };

  const handleRestart = () => {
    soundManager.playClick();
    soundManager.playGlitch();
    resetMatch();
  };

  const handleSettings = () => {
    soundManager.playClick();
    setScreen('settings');
  };

  const handleQuit = () => {
    soundManager.playClick();
    soundManager.playGlitch();
    setScreen('menu');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(18, 0, 32, 0.85)', backdropFilter: 'blur(4px)' }}
    >
      <div 
        className="p-8 rounded w-80 flex flex-col items-center"
        style={{
          background: 'rgba(43, 0, 66, 0.9)',
          border: '1px solid var(--cyan)',
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 30px rgba(0, 240, 255, 0.05)',
        }}
      >
        {/* Pause title */}
        <h2 
          className="font-pixel text-lg mb-1 glow-cyan"
          style={{ color: 'var(--cyan)' }}
        >
          SIGNAL PAUSED
        </h2>
        <p 
          className="font-terminal text-sm mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          Connection suspended
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleResume}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn flex items-center justify-center gap-3"
          >
            <Play size={16} />
            RESUME
          </button>

          <button
            onClick={handleRestart}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn retro-btn-secondary flex items-center justify-center gap-3"
          >
            <RotateCcw size={16} />
            RESTART
          </button>

          <button
            onClick={handleSettings}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn flex items-center justify-center gap-3"
            style={{ borderColor: 'var(--lavender)', color: 'var(--lavender)' }}
          >
            <Settings size={16} />
            SETTINGS
          </button>

          <button
            onClick={handleQuit}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn flex items-center justify-center gap-3"
            style={{ borderColor: 'var(--magenta)', color: 'var(--magenta)' }}
          >
            <Home size={16} />
            QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}
