import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { soundManager } from './lib/sounds';
import MainMenu from './pages/MainMenu';
import LevelSelect from './pages/LevelSelect';
import GamePlay from './pages/GamePlay';
import PauseMenu from './pages/PauseMenu';
import GameOver from './pages/GameOver';
import Settings from './pages/Settings';
import HowToPlay from './pages/HowToPlay';
import CRTOverlay from './components/CRTOverlay';
import './App.css';

function App() {
  const screen = useGameStore((state) => state.screen);
  const settings = useGameStore((state) => state.settings);

  useEffect(() => {
    soundManager.init();
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const renderScreen = () => {
    switch (screen) {
      case 'menu':
        return <MainMenu />;
      case 'levelSelect':
        return <LevelSelect />;
      case 'playing':
        return <GamePlay />;
      case 'paused':
        return (
          <>
            <GamePlay />
            <PauseMenu />
          </>
        );
      case 'gameOver':
        return (
          <>
            <GamePlay />
            <GameOver />
          </>
        );
      case 'settings':
        return <Settings />;
      case 'howToPlay':
        return <HowToPlay />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#120020]">
      {/* Background wallpaper */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url(/bg_vaporwave.jpg)' }}
      />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen w-screen">
        {renderScreen()}
      </div>
      
      {/* CRT Effects */}
      <CRTOverlay />
    </div>
  );
}

export default App;
