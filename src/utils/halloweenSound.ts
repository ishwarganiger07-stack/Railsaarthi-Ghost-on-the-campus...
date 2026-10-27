/**
 * Halloween Continuous Soundtrack & Sound Engine using Web Audio API
 * Generates an eerie, continuous looping Halloween soundtrack with haunting music box chords,
 * resonant wind layers, deep subterranean drone, and interactive spooky sound effects.
 */

class HalloweenSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private volume = 0.5;
  private masterGain: GainNode | null = null;

  // Ambient soundtrack state
  private isSoundtrackPlaying = false;
  private droneGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private musicBoxInterval: number | null = null;
  private windInterval: number | null = null;
  private stateChangeListeners: Array<(isPlaying: boolean, isMuted: boolean) => void> = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public subscribe(cb: (isPlaying: boolean, isMuted: boolean) => void): () => void {
    this.stateChangeListeners.push(cb);
    cb(this.isSoundtrackPlaying, this.isMuted);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.stateChangeListeners.forEach((l) => l(this.isSoundtrackPlaying, this.isMuted));
  }

  /**
   * Start continuous background Halloween soundtrack
   */
  public startContinuousSoundtrack() {
    if (this.isSoundtrackPlaying) return;

    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;

      const now = ctx.currentTime;

      // 1. Layer 1: Eerie Subterranean Drone (deep oscillating minor chords)
      this.droneGain = ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.18, now + 2.0);
      this.droneGain.connect(this.masterGain);

      // Low roots: C2 (65.41Hz), G2 (98.00Hz), Eb2 (77.78Hz), F#2 (92.50Hz) - Diminished/Minor tension
      const baseFreqs = [65.41, 77.78, 98.0, 130.81];
      this.droneOscillators = baseFreqs.map((f, i) => {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        // Subtle slow pitch detune for eerie tension
        lfo.frequency.setValueAtTime(0.15 + i * 0.08, now);
        lfoGain.gain.setValueAtTime(1.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.connect(this.droneGain!);

        lfo.start(now);
        osc.start(now);
        return osc;
      });

      // 2. Layer 2: Haunting Music Box / Celesta Melodic Sequence
      // Classic spooky Halloween motifs in C Minor / D Minor
      const melodyNotes = [
        523.25, // C5
        554.37, // C#5 (Tritone/Phrygian creepiness)
        493.88, // B4
        440.00, // A4
        415.30, // Ab4
        392.00, // G4
        329.63, // E4
        311.13, // Eb4
        587.33, // D5
        622.25, // Eb5
        493.88, // B4
        440.00, // A4
      ];

      let noteIdx = 0;
      this.musicBoxInterval = window.setInterval(() => {
        if (!this.isSoundtrackPlaying || this.isMuted) return;
        try {
          const c = this.getContext();
          const t = c.currentTime;
          const freq = melodyNotes[noteIdx % melodyNotes.length];
          noteIdx++;

          // Bell/celesta strike
          const noteOsc = c.createOscillator();
          const noteGain = c.createGain();
          const noteFilter = c.createBiquadFilter();

          noteOsc.type = 'sine';
          noteOsc.frequency.setValueAtTime(freq, t);

          noteFilter.type = 'lowpass';
          noteFilter.frequency.setValueAtTime(1800, t);

          noteGain.gain.setValueAtTime(0.001, t);
          noteGain.gain.linearRampToValueAtTime(0.12, t + 0.04);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

          noteOsc.connect(noteFilter);
          noteFilter.connect(noteGain);
          noteGain.connect(this.masterGain!);

          noteOsc.start(t);
          noteOsc.stop(t + 1.7);

          // Random ghost harmonic overtone
          if (Math.random() > 0.6) {
            const harmonicOsc = c.createOscillator();
            const harmonicGain = c.createGain();
            harmonicOsc.type = 'triangle';
            harmonicOsc.frequency.setValueAtTime(freq * 1.5, t);
            harmonicGain.gain.setValueAtTime(0.03, t);
            harmonicGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
            harmonicOsc.connect(harmonicGain);
            harmonicGain.connect(this.masterGain!);
            harmonicOsc.start(t);
            harmonicOsc.stop(t + 1.3);
          }
        } catch (e) {
          // ignore transient audio context shifts
        }
      }, 1200);

      // 3. Layer 3: Periodic Ghost Wind Howl every 7 seconds
      this.windInterval = window.setInterval(() => {
        if (!this.isSoundtrackPlaying || this.isMuted) return;
        this.playSubtleWindSweep();
      }, 7000);

      this.isSoundtrackPlaying = true;
      this.notify();
    } catch (e) {
      console.warn('Continuous soundtrack initialization deferred:', e);
    }
  }

  /**
   * Gentle continuous atmospheric wind sweep
   */
  private playSubtleWindSweep() {
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;
      const dur = 4.0;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(260 + Math.random() * 80, now + dur * 0.5);
      osc.frequency.exponentialRampToValueAtTime(130, now + dur);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(220, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + dur * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + dur);
    } catch (e) {}
  }

  /**
   * Stop continuous background Halloween soundtrack
   */
  public stopContinuousSoundtrack() {
    if (!this.isSoundtrackPlaying) return;

    if (this.musicBoxInterval) {
      clearInterval(this.musicBoxInterval);
      this.musicBoxInterval = null;
    }
    if (this.windInterval) {
      clearInterval(this.windInterval);
      this.windInterval = null;
    }

    if (this.droneGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          this.droneOscillators.forEach((osc) => {
            try {
              osc.stop();
            } catch (e) {}
          });
          this.droneOscillators = [];
        }, 900);
      } catch (e) {}
    }

    this.isSoundtrackPlaying = false;
    this.notify();
  }

  /**
   * Toggle between playing and stopped
   */
  public toggleSoundtrack(): boolean {
    if (this.isSoundtrackPlaying) {
      this.stopContinuousSoundtrack();
      return false;
    } else {
      this.startContinuousSoundtrack();
      return true;
    }
  }

  /**
   * Toggle mute
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, now);
    }
    this.notify();
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isSoundtrackPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Ghost Train Whistle
   */
  public playGhostTrainWhistle() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 2.4;
      const freqs = [293.66, 349.23, 440.0, 587.33];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.94, now + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200 + idx * 300, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08 / freqs.length, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain || ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  /**
   * Haunted Station Bell
   */
  public playHauntedBell() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 2.0;
      const freqs = [440, 880, 1320, 1760];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() * 4 - 2), now);

        gain.gain.setValueAtTime(0.1 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  /**
   * Spooky Wind / Ghostly Howl
   */
  public playSpookyWind() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 2.2;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(180, now + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.Q.setValueAtTime(4, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.7);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  /**
   * Ghostly giggle / chime when clicking a floating creature
   */
  public playGhostChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const freqs = [659.25, 783.99, 987.77, 1318.51];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.06, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.45);
      });
    } catch (e) {}
  }
}

export const halloweenAudio = new HalloweenSoundEngine();
