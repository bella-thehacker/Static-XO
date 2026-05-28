// Sound system using Web Audio API for authentic retro arcade sounds

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private static instance: SoundManager;
  
  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }
  
  init() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
  }
  
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
  
  private createOscillator(
    frequency: number, 
    type: OscillatorType, 
    duration: number, 
    volume: number = 0.1,
    fadeOut: boolean = true
  ) {
    if (!this.enabled || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    if (fadeOut) {
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    }
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + duration);
  }
  
  playPlaceMark(player: 'X' | 'O') {
    const freq = player === 'X' ? 880 : 660;
    this.createOscillator(freq, 'square', 0.08, 0.08);
    this.createOscillator(freq * 2, 'sine', 0.05, 0.04);
  }
  
  playHover() {
    this.createOscillator(2000, 'sine', 0.02, 0.02, false);
  }
  
  playWin() {
    if (!this.enabled || !this.audioContext) return;
    
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, 'square', 0.15, 0.1);
        this.createOscillator(freq * 1.5, 'sine', 0.1, 0.05);
      }, i * 100);
    });
  }
  
  playLose() {
    if (!this.enabled || !this.audioContext) return;
    
    const notes = [400, 350, 300, 200];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, 'sawtooth', 0.2, 0.08);
      }, i * 150);
    });
  }
  
  playDraw() {
    this.createOscillator(440, 'sine', 0.3, 0.06);
  }
  
  playClick() {
    this.createOscillator(1000, 'square', 0.05, 0.05, false);
  }
  
  playGlitch() {
    if (!this.enabled || !this.audioContext) return;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const freq = Math.random() * 2000 + 100;
        this.createOscillator(freq, 'sawtooth', 0.05, 0.03);
      }, i * 30);
    }
  }
  
  playMenuHover() {
    this.createOscillator(1500, 'sine', 0.03, 0.02, false);
  }
  
  playRoundStart() {
    if (!this.enabled || !this.audioContext) return;
    
    const notes = [330, 440, 550];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, 'square', 0.1, 0.06);
      }, i * 80);
    });
  }
  
  playUnlock() {
    if (!this.enabled || !this.audioContext) return;
    
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, 'sine', 0.15, 0.08);
      }, i * 120);
    });
  }
}

export const soundManager = SoundManager.getInstance();
