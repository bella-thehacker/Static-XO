import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { ArrowLeft, Volume2, VolumeX, Monitor, Sparkles, Trash2 } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, setScreen, previousScreen, resetProgress } = useGameStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleBack = () => {
    soundManager.playClick();
    setScreen(previousScreen || 'menu');
  };

  const handleToggle = (key: keyof typeof settings) => {
    soundManager.playClick();
    updateSettings({ [key]: !settings[key] });
  };

  const handleSliderChange = (key: 'grainIntensity' | 'flickerIntensity', value: number) => {
    updateSettings({ [key]: value });
  };

  const handleResetProgress = () => {
    soundManager.playGlitch();
    resetProgress();
    setShowResetConfirm(false);
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
            CALIBRATE
          </h1>
          <p 
            className="font-terminal text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Adjust system parameters
          </p>
        </div>
      </div>

      {/* Settings Panel */}
      <div 
        className="w-full max-w-lg space-y-4"
      >
        {/* CRT Effects Section */}
        <div 
          className="p-4 rounded"
          style={{
            background: 'rgba(18, 0, 32, 0.8)',
            border: '1px solid rgba(177, 156, 217, 0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={16} style={{ color: 'var(--cyan)' }} />
            <h2 
              className="font-pixel text-xs"
              style={{ color: 'var(--cyan)' }}
            >
              DISPLAY
            </h2>
          </div>

          <div className="space-y-4">
            {/* CRT Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-terminal text-sm" style={{ color: 'var(--text-primary)' }}>
                  CRT Effects
                </p>
                <p className="font-terminal text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Enable retro monitor simulation
                </p>
              </div>
              <button
                onClick={() => handleToggle('crtEffect')}
                className={`toggle-switch ${settings.crtEffect ? 'active' : ''}`}
              />
            </div>

            {/* Scanlines Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-terminal text-sm" style={{ color: 'var(--text-primary)' }}>
                  Scanlines
                </p>
                <p className="font-terminal text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Horizontal CRT scanline overlay
                </p>
              </div>
              <button
                onClick={() => handleToggle('scanlines')}
                className={`toggle-switch ${settings.scanlines ? 'active' : ''}`}
              />
            </div>

            {/* Grain Intensity */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="font-terminal text-sm" style={{ color: 'var(--text-primary)' }}>
                  Static Intensity
                </p>
                <p className="font-terminal text-sm" style={{ color: 'var(--cyan)' }}>
                  {Math.round(settings.grainIntensity * 100)}%
                </p>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.grainIntensity * 100}
                onChange={(e) => handleSliderChange('grainIntensity', Number(e.target.value) / 100)}
                className="settings-slider"
              />
            </div>

            {/* Flicker Intensity */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="font-terminal text-sm" style={{ color: 'var(--text-primary)' }}>
                  Flicker Intensity
                </p>
                <p className="font-terminal text-sm" style={{ color: 'var(--cyan)' }}>
                  {Math.round(settings.flickerIntensity * 100)}%
                </p>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.flickerIntensity * 100}
                onChange={(e) => handleSliderChange('flickerIntensity', Number(e.target.value) / 100)}
                className="settings-slider"
              />
            </div>

            {/* Chromatic Aberration Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-terminal text-sm" style={{ color: 'var(--text-primary)' }}>
                  Chromatic Aberration
                </p>
                <p className="font-terminal text-xs" style={{ color: 'var(--text-secondary)' }}>
                  RGB color channel separation
                </p>
              </div>
              <button
                onClick={() => handleToggle('chromaticAberration')}
                className={`toggle-switch ${settings.chromaticAberration ? 'active' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Audio Section */}
        <div 
          className="p-4 rounded"
          style={{
            background: 'rgba(18, 0, 32, 0.8)',
            border: '1px solid rgba(177, 156, 217, 0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            {settings.soundEnabled ? (
              <Volume2 size={16} style={{ color: 'var(--cyan)' }} />
            ) : (
              <VolumeX size={16} style={{ color: 'var(--magenta)' }} />
            )}
            <h2 
              className="font-pixel text-xs"
              style={{ color: 'var(--cyan)' }}
            >
              AUDIO
            </h2>
          </div>

          <div className="space-y-4">
            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-terminal text-sm" style={{ color: 'var(--text-primary)' }}>
                  Sound Effects
                </p>
                <p className="font-terminal text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Game sounds and feedback
                </p>
              </div>
              <button
                onClick={() => handleToggle('soundEnabled')}
                className={`toggle-switch ${settings.soundEnabled ? 'active' : ''}`}
              />
            </div>

            {/* Music Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-terminal text-sm" style={{ color: 'var(--text-primary)' }}>
                  Ambient Static
                </p>
                <p className="font-terminal text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Background noise hum
                </p>
              </div>
              <button
                onClick={() => handleToggle('musicEnabled')}
                className={`toggle-switch ${settings.musicEnabled ? 'active' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div 
          className="p-4 rounded"
          style={{
            background: 'rgba(255, 0, 60, 0.05)',
            border: '1px solid rgba(255, 0, 60, 0.3)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} style={{ color: 'var(--magenta)' }} />
            <h2 
              className="font-pixel text-xs"
              style={{ color: 'var(--magenta)' }}
            >
              SYSTEM
            </h2>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              onMouseEnter={() => soundManager.playMenuHover()}
              className="retro-btn retro-btn-secondary flex items-center justify-center gap-3 w-full"
            >
              <Trash2 size={14} />
              RESET ALL PROGRESS
            </button>
          ) : (
            <div className="space-y-3">
              <p 
                className="font-terminal text-sm text-center"
                style={{ color: 'var(--magenta)' }}
              >
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleResetProgress}
                  className="retro-btn retro-btn-secondary flex-1 text-center"
                >
                  CONFIRM
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="retro-btn flex-1 text-center"
                  style={{ borderColor: 'var(--lavender)', color: 'var(--lavender)' }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
