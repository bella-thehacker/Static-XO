import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import IntroAnimation from '../components/IntroAnimation';
import { Play, Users, Settings, HelpCircle } from 'lucide-react';

export default function MainMenu() {
  const setScreen = useGameStore((state) => state.setScreen);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const profile = useGameStore((state) => state.profile);
  const [crtOn, setCrtOn] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // CRT turn-on effect
    setCrtOn(true);
    const timer = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAI = () => {
    soundManager.playClick();
    setGameMode('ai');
    setScreen('levelSelect');
  };

  const handleLocalMatch = () => {
    soundManager.playClick();
    setGameMode('local');
    
    // Start a quick local match at level 3 difficulty
    const levels = useGameStore.getState().levels;
    const quickLevel = { ...levels[2], matchLength: 3 };
    useGameStore.getState().startLevel(quickLevel);
  };

  const handleSettings = () => {
    soundManager.playClick();
    setScreen('settings');
  };

  const handleHowToPlay = () => {
    soundManager.playClick();
    setScreen('howToPlay');
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center relative ${crtOn ? 'crt-on' : 'opacity-0'}`}
    >
      <IntroAnimation />

      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div 
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Logo */}
        <div className="mb-4">
          <img 
            src="/logo_glitch.png" 
            alt="STATIC XO" 
            className="w-72 md:w-96 h-auto drop-shadow-[0_0_30px_rgba(0,240,255,0.5)]"
          />
        </div>

        {/* Tagline */}
        <p 
          className="font-terminal text-lg md:text-xl tracking-widest mb-12"
          style={{ color: 'var(--lavender)' }}
        >
          <span className="blink">_</span>INSERT COIN TO BEGIN
        </p>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 w-72">
          <button
            onClick={handlePlayAI}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn flex items-center justify-center gap-3 group"
          >
            <Play size={16} className="group-hover:scale-110 transition-transform" />
            START SIGNAL
          </button>

          <button
            onClick={handleLocalMatch}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn retro-btn-secondary flex items-center justify-center gap-3 group"
          >
            <Users size={16} className="group-hover:scale-110 transition-transform" />
            LOCAL MATCH
          </button>

          <button
            onClick={handleSettings}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn flex items-center justify-center gap-3 group"
            style={{ borderColor: 'var(--lavender)', color: 'var(--lavender)' }}
          >
            <Settings size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            CALIBRATE
          </button>

          <button
            onClick={handleHowToPlay}
            onMouseEnter={() => soundManager.playMenuHover()}
            className="retro-btn flex items-center justify-center gap-3 group"
            style={{ borderColor: 'var(--lavender)', color: 'var(--lavender)' }}
          >
            <HelpCircle size={16} className="group-hover:scale-110 transition-transform" />
            HOW TO PLAY
          </button>
        </div>

        {/* Player stats */}
        {profile.gamesPlayed > 0 && (
          <div 
            className="mt-10 font-terminal text-sm tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>GAMES: {profile.gamesPlayed}</span>
            <span className="mx-4">|</span>
            <span style={{ color: 'var(--cyan)' }}>W: {profile.gamesWon}</span>
            <span className="mx-2">|</span>
            <span style={{ color: 'var(--magenta)' }}>L: {profile.gamesLost}</span>
            <span className="mx-2">|</span>
            <span style={{ color: 'var(--lavender)' }}>LVL: {profile.highestLevel}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div 
        className="absolute bottom-6 left-0 right-0 text-center"
      >
        <p 
          className="font-terminal text-xs tracking-widest"
          style={{ color: 'rgba(177, 156, 217, 0.5)' }}
        >
          CTRL CODE SOLUTIONS &copy; 2026
        </p>
      </div>
    </div>
  );
}
