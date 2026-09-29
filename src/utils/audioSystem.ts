/**
 * 444 — Audio System (Web Audio API Synthesizer)
 * Atmospheric low-frequency drone, radio static, morse beeps, and signal resonance.
 * Audio is OFF by default as required by specification.
 */

class AudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private isRunning: boolean = false;

  constructor() {
    // Check localStorage for audio preference (defaulting to muted/off)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('444_AUDIO_MUTED');
      this.isMuted = saved === null ? true : saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('444_AUDIO_MUTED', String(this.isMuted));
    }
    if (!this.isMuted) {
      this.initContext();
      this.startDrone();
    } else {
      this.stopDrone();
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    if (this.isMuted === muted) return;
    this.toggleMute();
  }

  /**
   * Start subtle ambient drone (44Hz sub-bass with slow binaural drift)
   */
  public startDrone() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    if (this.isRunning) return;

    try {
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, this.ctx.currentTime);

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(44.4, this.ctx.currentTime); // 44.4 Hz

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(44.0, this.ctx.currentTime);

      this.droneOsc1.connect(this.droneGain);
      this.droneOsc2.connect(this.droneGain);
      this.droneGain.connect(filter);
      filter.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.isRunning = true;
    } catch {
      // Audio context may require user interaction
    }
  }

  public stopDrone() {
    if (!this.isRunning) return;
    try {
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.droneGain?.disconnect();
        } catch {}
        this.isRunning = false;
      }, 500);
    } catch {
      this.isRunning = false;
    }
  }

  /**
   * Short mechanical terminal click
   */
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  /**
   * Play single Morse tone
   */
  public playMorseTone(frequency: number = 720, durationMs: number = 100): Promise<void> {
    return new Promise((resolve) => {
      if (this.isMuted) {
        setTimeout(resolve, durationMs);
        return;
      }
      this.initContext();
      if (!this.ctx) {
        setTimeout(resolve, durationMs);
        return;
      }

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        const attack = 0.008;
        const decay = 0.012;
        const durationSec = durationMs / 1000;

        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + attack);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + durationSec - decay);
        gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + durationSec);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + durationSec);

        setTimeout(resolve, durationMs);
      } catch {
        setTimeout(resolve, durationMs);
      }
    });
  }

  /**
   * Play radio static burst (e.g. signal interruption)
   */
  public playStaticBurst(durationSec: number = 0.3, volume: number = 0.06) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * durationSec;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + durationSec);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {}
  }

  /**
   * Play resonant tone chord on puzzle unlock
   */
  public playSignalUnlocked() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const freqs = [222, 444, 888];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + 1.3);
      });
    } catch {}
  }
}

export const audioSystem = new AudioSystem();
