/**
 * Web Audio API procedural sound synthesizer for Hanok Ghost Escape.
 * No external audio files required, operates reliably in any browser.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientInterval: number | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
    return this.isMuted;
  }

  public startAmbient() {
    if (this.isMuted) return;
    this.initContext();
    if (this.ambientInterval) return;

    // Ambient night wind + soft Korean pentatonic bells every few seconds
    const pentatonicNotes = [293.66, 329.63, 392.00, 440.00, 523.25, 587.33]; // D4, E4, G4, A4, C5, D5 (Korean Pyeongjo scale)
    this.ambientInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      if (Math.random() > 0.4) {
        const note = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
        this.playWindChime(note);
      }
    }, 2800);
  }

  public stopAmbient() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  private playWindChime(freq: number) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    } catch {
      // Ignore audio context exceptions
    }
  }

  /**
   * Sound when picking up an apple: Bright, happy pentatonic chime
   */
  public playApplePickup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.38);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Sound when eating red pepper: fiery whoosh, rapid rising sizzle
   */
  public playPepperBoost() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Fiery rising pitch
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      // Add high sizzle
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1200, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.4);
      gain2.gain.setValueAtTime(0.08, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.55);
    } catch {
      // Ignore
    }
  }

  /**
   * Sound when damaged by hungry ghost: Korean Buk/Gong thud with distortion
   */
  public playHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Heavy drum thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      // Low spooky tone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(80, now);
      osc2.frequency.linearRampToValueAtTime(60, now + 0.4);

      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
      osc2.start(now);
      osc2.stop(now + 0.5);
    } catch {
      // Ignore
    }
  }

  /**
   * Sound when a new ghost spawns in the village: Ominous low spirit bell
   */
  public playGhostSpawn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(164.81, now); // E3
      osc.frequency.exponentialRampToValueAtTime(110.0, now + 1.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch {
      // Ignore
    }
  }

  /**
   * Victory sound: Celebratory Korean festival gong & fanfares
   */
  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const victoryNotes = [392, 440, 523.25, 659.25, 783.99, 1046.5];
      victoryNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.85);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Game Over sound: Descending sorrowful chords
   */
  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 392, 329.63, 261.63, 220];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.2);

        gain.gain.setValueAtTime(0, now + idx * 0.2);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.2 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.2 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.2);
        osc.stop(now + idx * 0.2 + 0.95);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundController();
