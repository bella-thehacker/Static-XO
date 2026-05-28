import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { ArrowLeft, MousePointer, Trophy, AlertTriangle, Zap } from 'lucide-react';

export default function HowToPlay() {
  const setScreen = useGameStore((state) => state.setScreen);
  const previousScreen = useGameStore((state) => state.previousScreen);

  const handleBack = () => {
    soundManager.playClick();
    setScreen(previousScreen || 'menu');
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 crt-on">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center mb-8">
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
            SIGNAL MANUAL
          </h1>
          <p 
            className="font-terminal text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Operating instructions
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-lg space-y-4">
        {/* Objective */}
        <div 
          className="p-4 rounded"
          style={{
            background: 'rgba(18, 0, 32, 0.8)',
            border: '1px solid rgba(177, 156, 217, 0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} style={{ color: 'var(--green-neon)' }} />
            <h2 
              className="font-pixel text-xs"
              style={{ color: 'var(--green-neon)' }}
            >
              OBJECTIVE
            </h2>
          </div>
          <p className="font-terminal text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            Be the first player to place three of your marks (X or O) in a horizontal, 
            vertical, or diagonal row on the 3x3 grid. The match is played as a 
            &quot;Best of N&quot; series — win the required number of rounds to defeat the signal.
          </p>
        </div>

        {/* Controls */}
        <div 
          className="p-4 rounded"
          style={{
            background: 'rgba(18, 0, 32, 0.8)',
            border: '1px solid rgba(177, 156, 217, 0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MousePointer size={16} style={{ color: 'var(--cyan)' }} />
            <h2 
              className="font-pixel text-xs"
              style={{ color: 'var(--cyan)' }}
            >
              CONTROLS
            </h2>
          </div>
          <div className="space-y-2 font-terminal text-sm" style={{ color: 'var(--text-primary)' }}>
            <p>
              <span style={{ color: 'var(--cyan)' }}>CLICK / TAP</span> — Place your mark on an empty cell
            </p>
            <p>
              <span style={{ color: 'var(--cyan)' }}>HOVER</span> — Preview your mark before placing
            </p>
            <p>
              <span style={{ color: 'var(--cyan)' }}>PAUSE BUTTON</span> — Suspend the signal
            </p>
          </div>
        </div>

        {/* Game Modes */}
        <div 
          className="p-4 rounded"
          style={{
            background: 'rgba(18, 0, 32, 0.8)',
            border: '1px solid rgba(177, 156, 217, 0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} style={{ color: 'var(--lavender)' }} />
            <h2 
              className="font-pixel text-xs"
              style={{ color: 'var(--lavender)' }}
            >
              SIGNALS
            </h2>
          </div>
          <p className="font-terminal text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>
            There are 10 signals to defeat, each with increasing intelligence:
          </p>
          <div className="space-y-1 font-terminal text-xs" style={{ color: 'var(--text-secondary)' }}>
            <p style={{ color: 'var(--green-neon)' }}>01-02: Random noise — unpredictable but weak</p>
            <p style={{ color: 'var(--cyan)' }}>03-04: Basic pattern recognition</p>
            <p style={{ color: 'var(--lavender)' }}>05-06: Strategic depth, blocks traps</p>
            <p style={{ color: 'var(--magenta)' }}>07-08: Near-perfect play, minimal mistakes</p>
            <p style={{ color: '#FF4400' }}>09-10: Perfect play. Survival is victory.</p>
          </div>
        </div>

        {/* Tips */}
        <div 
          className="p-4 rounded"
          style={{
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} style={{ color: 'var(--cyan)' }} />
            <h2 
              className="font-pixel text-xs"
              style={{ color: 'var(--cyan)' }}
            >
              TACTICAL NOTES
            </h2>
          </div>
          <div className="space-y-2 font-terminal text-sm" style={{ color: 'var(--text-primary)' }}>
            <p>
              • Take the center square when possible — it controls the most lines.
            </p>
            <p>
              • Create &quot;forks&quot; — positions where you have two ways to win next turn.
            </p>
            <p>
              • Against higher signals, the best you can achieve is often a draw.
            </p>
            <p>
              • The AI may make mistakes at lower difficulty levels. Watch for them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
