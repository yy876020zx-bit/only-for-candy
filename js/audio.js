/**
 * =====================================================================
 * 电影级音效与背景音乐引擎 (Cinema Audio & Sound Engine)
 * =====================================================================
 * 包含：
 * 1. Netflix 式“TUDUM”片头重低音与弦乐氛围合成
 * 2. 纯净韩剧钢琴/合成器氛围和弦循环生成 (无需任何外部音频即可动听)
 * 3. 自动支持 assets/music/bgm.mp3 用户自定义音频无缝覆盖
 * 4. 吹灭蜡烛气流声与流星闪烁清脆音效
 */

class CinemaAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.bgmAudioElement = null;
    this.synthInterval = null;
    this.chordStep = 0;
    this.masterGain = null;

    this.initAudioElement();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initAudioElement() {
    const config = window.ANYI_CONFIG?.audio;
    if (config?.customAudioSrc) {
      this.bgmAudioElement = new Audio(config.customAudioSrc);
      this.bgmAudioElement.loop = true;
      this.bgmAudioElement.volume = 0.5;
      
      // Test if audio can be played or exists
      this.bgmAudioElement.addEventListener('error', () => {
        // If file doesn't exist, gracefully fallback to procedural K-drama piano
        this.bgmAudioElement = null;
      });
    }
  }

  // 1. Netflix-style "TUDUM" Sound Synthesis
  // 1.5. Korean to Chinese Translation Electronic/Chime Audio Effect
  // 1.5. Korean to Chinese Translation Electronic/Chime Audio Effect
  playMarvelIntroSound() {
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      
      // 1. 漫威快速翻页快门咔嗒微声 (Rapid film shutter ticks)
      for (let i = 0; i < 24; i++) {
    const tickTime = now + i * 0.075;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(500 + (i * 40), tickTime);
    gain.gain.setValueAtTime(0.0001, tickTime);
    gain.gain.linearRampToValueAtTime(0.028, tickTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, tickTime + 0.045);
    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(tickTime);
    osc.stop(tickTime + 0.05);
      }

      // 2. 漫威式声浪蓄力上升音 (Cinematic Riser)
      const riser = this.ctx.createOscillator();
      const riserGain = this.ctx.createGain();
      riser.type = "sawtooth";
      riser.frequency.setValueAtTime(110, now);
      riser.frequency.exponentialRampToValueAtTime(880, now + 1.8);
      riserGain.gain.setValueAtTime(0.0001, now);
      riserGain.gain.linearRampToValueAtTime(0.04, now + 1.6);
      riserGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);
      riser.connect(riserGain);
      riserGain.connect(this.masterGain || this.ctx.destination);
      riser.start(now);
      riser.stop(now + 1.9);

      // 3. 2.0秒定格时的撞击重低音 (Impact Boom)
      setTimeout(() => {
    if (!this.ctx) return;
    const t2 = this.ctx.currentTime;
    const boom = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boom.type = "sine";
    boom.frequency.setValueAtTime(130, t2);
    boom.frequency.exponentialRampToValueAtTime(32, t2 + 1.4);
    boomGain.gain.setValueAtTime(0.7, t2);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t2 + 1.6);
    boom.connect(boomGain);
    boomGain.connect(this.masterGain || this.ctx.destination);
    boom.start(t2);
    boom.stop(t2 + 1.6);
      }, 1800);
    } catch (e) {}
  }
  // 1.5. Korean to Chinese Translation Electronic/Chime Audio Effect
  playCatChime() {
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      
      const freqs = [880, 1174.66, 1479.98, 1760, 2349.32];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.06);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.06 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.4);
        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 1.5);
      });

      const hum = this.ctx.createOscillator();
      const humGain = this.ctx.createGain();
      hum.type = "sine";
      hum.frequency.setValueAtTime(140, now);
      hum.frequency.exponentialRampToValueAtTime(80, now + 1.2);
      humGain.gain.setValueAtTime(0.0001, now);
      humGain.gain.linearRampToValueAtTime(0.03, now + 0.1);
      humGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      hum.connect(humGain);
      humGain.connect(this.masterGain || this.ctx.destination);
      hum.start(now);
      hum.stop(now + 1.2);
    } catch (e) {}
  }

  playTranslateEffect() {
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      
      // 1. 梦幻高音译码琴音 (Arpeggio chime: E5, G5, B5, E6, G6)
      const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.045, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 1.2);
        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 1.3);
      });

      // 2. 柔和的字符解密扫描高频微弱泛音
      const sweepOsc = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweepOsc.type = "triangle";
      sweepOsc.frequency.setValueAtTime(440, now);
      sweepOsc.frequency.exponentialRampToValueAtTime(1174.66, now + 1.4);
      sweepGain.gain.setValueAtTime(0.0001, now);
      sweepGain.gain.linearRampToValueAtTime(0.018, now + 0.2);
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      sweepOsc.connect(sweepGain);
      sweepGain.connect(this.masterGain || this.ctx.destination);
      sweepOsc.start(now);
      sweepOsc.stop(now + 1.5);
    } catch (e) {
      console.warn("Translate audio error:", e);
    }
  }

  playGlitchSwitchSound() {
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      
      // 1. 快速电子杂音脉冲 (Noise Burst)
      const bufferSize = this.ctx.sampleRate * 0.09;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain || this.ctx.destination);
      whiteNoise.start(now);

      // 2. 双音高频故障音 (Square Wave Glitch Beep)
      const beep = this.ctx.createOscillator();
      const beepGain = this.ctx.createGain();
      beep.type = "square";
      beep.frequency.setValueAtTime(920, now);
      beep.frequency.setValueAtTime(1480, now + 0.04);
      beepGain.gain.setValueAtTime(0.05, now);
      beepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      beep.connect(beepGain);
      beepGain.connect(this.masterGain || this.ctx.destination);
      beep.start(now);
      beep.stop(now + 0.12);

      // 3. 卡点下潜重低音冲击 (Sub-Bass Kick)
      const kick = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kick.type = "sine";
      kick.frequency.setValueAtTime(150, now);
      kick.frequency.exponentialRampToValueAtTime(38, now + 0.5);
      kickGain.gain.setValueAtTime(0.65, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      kick.connect(kickGain);
      kickGain.connect(this.masterGain || this.ctx.destination);
      kick.start(now);
      kick.stop(now + 0.55);
    } catch (e) {}
  }

  playTudum() {
    try {
      this.ensureContext();
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Sub-bass hit
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(75, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      gain1.gain.setValueAtTime(0.9, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 1.4);

      // Cello / Metallic body swell
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 1.8);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(55, now); // A1 note
      osc2.frequency.setValueAtTime(58, now + 0.12);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.4, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc2.connect(filter);
      filter.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now);
      osc2.stop(now + 2.2);

      // Second harmonic accent
      setTimeout(() => {
        if (!this.ctx) return;
        const now2 = this.ctx.currentTime;
        const osc3 = this.ctx.createOscillator();
        const gain3 = this.ctx.createGain();
        osc3.type = 'triangle';
        osc3.frequency.setValueAtTime(110, now2);
        gain3.gain.setValueAtTime(0.3, now2);
        gain3.gain.exponentialRampToValueAtTime(0.001, now2 + 1.6);
        osc3.connect(gain3);
        gain3.connect(this.masterGain);
        osc3.start(now2);
        osc3.stop(now2 + 1.6);
      }, 140);
    } catch (e) {
      console.warn('Tudum audio error:', e);
    }
  }

  // 2. Procedural K-Drama Emotional Piano/Ambient Chord Progression
  // Fmaj7 -> Em7 -> Dm7 -> Cmaj7 (Very gentle, slow, heartwarming)
  startAmbientMusic() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.updateEqualizerUI(true);

    // Try user mp3 first
    if (this.bgmAudioElement) {
      const playPromise = this.bgmAudioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocked or file missing, switch to procedural Web Audio
          this.startProceduralAmbient();
        });
        return;
      }
    }

    this.startProceduralAmbient();
  }

  startProceduralAmbient() {
    this.ensureContext();
    this.stopProceduralAmbient();

    const chords = [
      // Fmaj7 (F3, A3, C4, E4)
      [174.61, 220.00, 261.63, 329.63],
      // Cmaj7 (C3, G3, B3, E4)
      [130.81, 196.00, 246.94, 329.63],
      // Dm7 (D3, F3, A3, C4)
      [146.83, 174.61, 220.00, 261.63],
      // Am7 (A2, E3, G3, C4)
      [110.00, 164.81, 196.00, 261.63]
    ];

    const playChordStep = () => {
      if (!this.isPlaying || this.isMuted) return;
      this.ensureContext();
      const chord = chords[this.chordStep % chords.length];
      this.chordStep++;

      const now = this.ctx.currentTime;

      // Play soft pad
      chord.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        osc.type = index === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const stagger = index * 0.18;
        const volume = index === 0 ? 0.08 : 0.045;

        gain.gain.setValueAtTime(0.0001, now + stagger);
        gain.gain.linearRampToValueAtTime(volume, now + stagger + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + stagger + 5.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + stagger);
        osc.stop(now + stagger + 6.0);
      });

      // Subtle high bell note like music box
      if (Math.random() > 0.3) {
        setTimeout(() => {
          if (!this.isPlaying || this.isMuted || !this.ctx) return;
          const noteTime = this.ctx.currentTime;
          const bellOsc = this.ctx.createOscillator();
          const bellGain = this.ctx.createGain();
          const highNotes = [523.25, 659.25, 783.99, 880.00, 1046.50];
          const chosen = highNotes[Math.floor(Math.random() * highNotes.length)];

          bellOsc.type = 'sine';
          bellOsc.frequency.setValueAtTime(chosen, noteTime);

          bellGain.gain.setValueAtTime(0.0001, noteTime);
          bellGain.gain.linearRampToValueAtTime(0.03, noteTime + 0.05);
          bellGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.0);

          bellOsc.connect(bellGain);
          bellGain.connect(this.masterGain);
          bellOsc.start(noteTime);
          bellOsc.stop(noteTime + 3.1);
        }, 1200 + Math.random() * 800);
      }
    };

    playChordStep();
    this.synthInterval = setInterval(playChordStep, 4500);
  }

  stopProceduralAmbient() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  stopAmbientMusic() {
    this.isPlaying = false;
    this.stopProceduralAmbient();
    if (this.bgmAudioElement) {
      this.bgmAudioElement.pause();
    }
    this.updateEqualizerUI(false);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    if (this.bgmAudioElement) {
      this.bgmAudioElement.muted = this.isMuted;
    }
    this.updateEqualizerUI(!this.isMuted && this.isPlaying);
    return !this.isMuted;
  }

  // 3. Candle Blow Sound (Gentle breath noise)
  playBlowSound() {
    try {
      this.ensureContext();
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 1.2);
      filter.Q.setValueAtTime(3.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 1.4);
    } catch (e) {
      console.warn('Blow sound error', e);
    }
  }

  // 4. Starlight Sparkle Chimes
  playChimeSound() {
    try {
      this.ensureContext();
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98, 1760.00];

      notes.forEach((freq, idx) => {
        const timeOffset = now + idx * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, timeOffset);

        gain.gain.setValueAtTime(0.0001, timeOffset);
        gain.gain.linearRampToValueAtTime(0.12, timeOffset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + 2.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(timeOffset);
        osc.stop(timeOffset + 2.3);
      });
    } catch (e) {
      console.warn('Chime sound error', e);
    }
  }

  updateEqualizerUI(active) {
    const bars = document.querySelectorAll('.eq-bar');
    bars.forEach(bar => {
      if (active) {
        bar.classList.add('animating');
      } else {
        bar.classList.remove('animating');
      }
    });
    const label = document.getElementById('audio-toggle-label');
    if (label) {
      label.textContent = this.isMuted ? '静音' : (active ? '原声 ON' : '原声 OFF');
    }
  }
}

window.CinemaAudioEngine = CinemaAudioEngine;
