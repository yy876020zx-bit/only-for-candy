/**
 * =====================================================================
 * 电影感生日蛋糕与许愿交互引擎 (Cinematic Cake & Wish Engine)
 * =====================================================================
 * 包含：
 * 1. 柔光聚光灯与写实蜡烛火苗呼吸动画
 * 2. 交互式吹灭蜡烛 (点击/轻触/轻吹)
 * 3. 熄灭后轻烟弥散与细腻星芒爆炸粒子系统 (Iceland Stardust)
 * 4. 电影台词渐入渐出仪式感控制
 */

class CakeSceneEngine {
  constructor(containerId, canvasId, audioEngine) {
    this.container = document.getElementById(containerId);
    this.canvas = document.getElementById(canvasId);
    this.audioEngine = audioEngine;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.isBlown = false;
    this.particles = [];
    this.smokeParticles = [];
    this.flameFlicker = 1;
    this.flameTime = 0;
    this.animId = null;

    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Bind candle click
    const flameEl = document.getElementById('cake-flame');
    const candleHitbox = document.getElementById('candle-hitbox');
    const blowBtn = document.getElementById('blow-candle-btn');

    const handleBlow = (e) => {
      e?.preventDefault();
      if (!this.isBlown) {
        this.blowCandle();
      }
    };

    if (flameEl) flameEl.addEventListener('click', handleBlow);
    if (candleHitbox) candleHitbox.addEventListener('click', handleBlow);
    if (blowBtn) blowBtn.addEventListener('click', handleBlow);

    this.startFlameLoop();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startFlameLoop() {
    const loop = () => {
      this.flameTime += 0.05;
      if (!this.isBlown) {
        // Natural flame flicker
        this.flameFlicker = 0.95 + Math.sin(this.flameTime * 4.5) * 0.08 + Math.cos(this.flameTime * 7.2) * 0.05;
        const flameEl = document.getElementById('cake-flame');
        const glowEl = document.getElementById('cake-glow');
        if (flameEl) {
          const scaleY = this.flameFlicker;
          const scaleX = 1 + (1 - scaleY) * 0.6;
          const skewX = Math.sin(this.flameTime * 3) * 4;
          flameEl.style.transform = `scale(${scaleX}, ${scaleY}) skewX(${skewX}deg)`;
        }
        if (glowEl) {
          glowEl.style.opacity = (0.7 + Math.sin(this.flameTime * 5) * 0.15).toFixed(2);
        }
      }

      this.renderParticles();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  blowCandle() {
    if (this.isBlown) return;
    this.isBlown = true;

    // 1. Play sound effects
    if (this.audioEngine) {
      this.audioEngine.playBlowSound();
      setTimeout(() => {
        this.audioEngine.playChimeSound();
      }, 400);
    }

    // 2. Extinguish flame with visual effect
    const flameEl = document.getElementById('cake-flame');
    const glowEl = document.getElementById('cake-glow');
    const promptEl = document.getElementById('cake-prompt');
    const blowBtn = document.getElementById('blow-candle-btn');

    if (flameEl) flameEl.classList.add('extinguished');
    if (glowEl) glowEl.style.opacity = '0';
    if (blowBtn) blowBtn.style.display = 'none';

    // 3. Emit delicate smoke particles from candle wick
    this.createSmoke();

    // 4. Starlight burst explosion across the entire screen
    setTimeout(() => {
      this.createStarlightBurst();
    }, 250);

    // 5. Cinematic Subtitle Transitions
    const subtitleEl = document.getElementById('cake-subtitles');
    const subLine1 = document.getElementById('sub-line-1');
    const subLine2 = document.getElementById('sub-line-2');
    const nextEpisodeBtn = document.getElementById('cake-next-ep-btn');

    if (promptEl) {
      promptEl.style.opacity = '0';
    }

    if (subLine1) {
      subLine1.textContent = window.ANYI_CONFIG?.cake?.afterBlowLine1 || "“愿望不用告诉任何人。”";
      subLine1.classList.remove('hidden-text');
      subLine1.classList.add('fade-in-glow');
    }

    setTimeout(() => {
      if (subLine2) {
        subLine2.textContent = window.ANYI_CONFIG?.cake?.afterBlowLine2 || "“希望它真的会实现。”";
        subLine2.classList.remove('hidden-text');
        subLine2.classList.add('fade-in-glow');
      }
    }, 3200);

    setTimeout(() => {
      if (nextEpisodeBtn) {
        nextEpisodeBtn.classList.remove('hidden');
        nextEpisodeBtn.classList.add('fade-in-glow');
      }
    }, 6000);
  }

  createSmoke() {
    const candle = document.getElementById('cake-candle');
    if (!candle) return;
    const rect = candle.getBoundingClientRect();
    const wickX = rect.left + rect.width / 2;
    const wickY = rect.top;

    for (let i = 0; i < 35; i++) {
      this.smokeParticles.push({
        x: wickX + (Math.random() - 0.5) * 6,
        y: wickY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 1.8 - 0.5,
        radius: Math.random() * 4 + 2,
        alpha: 0.6,
        decay: Math.random() * 0.008 + 0.004,
        drift: Math.random() * 0.02
      });
    }
  }

  createStarlightBurst() {
    const candle = document.getElementById('cake-candle');
    const rect = candle ? candle.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 };
    const originX = rect.left + rect.width / 2;
    const originY = rect.top;

    const count = 220;
    const colors = [
      '#ffeaa7', // warm gold
      '#fdcb6e', // amber
      '#55efc4', // mint aurora
      '#81ecec', // cyan star
      '#a29bfe', // soft violet
      '#ffffff'  // diamond white
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 1.5;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2, // slight upward float
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.007 + 0.003,
        twinkleSpeed: Math.random() * 0.1 + 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        gravity: 0.025
      });
    }
  }

  renderParticles() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Render Smoke
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      p.x += p.vx + Math.sin(p.y * p.drift) * 0.6;
      p.y += p.vy;
      p.radius += 0.12;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.smokeParticles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `rgba(220, 220, 230, ${p.alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Render Starlight Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.life -= p.decay;
      p.twinklePhase += p.twinkleSpeed;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      const twinkle = Math.sin(p.twinklePhase) * 0.4 + 0.6;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * twinkle;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow for larger sparks
      if (p.radius > 1.4) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = (p.life * twinkle * 0.35);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  reset() {
    this.isBlown = false;
    this.particles = [];
    this.smokeParticles = [];
    const flameEl = document.getElementById('cake-flame');
    const glowEl = document.getElementById('cake-glow');
    const promptEl = document.getElementById('cake-prompt');
    const blowBtn = document.getElementById('blow-candle-btn');
    const subLine1 = document.getElementById('sub-line-1');
    const subLine2 = document.getElementById('sub-line-2');
    const nextEpisodeBtn = document.getElementById('cake-next-ep-btn');

    if (flameEl) flameEl.classList.remove('extinguished');
    if (glowEl) glowEl.style.opacity = '1';
    if (promptEl) promptEl.style.opacity = '1';
    if (blowBtn) blowBtn.style.display = 'inline-flex';
    if (subLine1) {
      subLine1.textContent = window.ANYI_CONFIG?.cake?.candleSubtitleInitial || "“许一个愿望吧。”";
      subLine1.classList.remove('fade-in-glow');
    }
    if (subLine2) {
      subLine2.textContent = "";
      subLine2.classList.remove('fade-in-glow');
    }
    if (nextEpisodeBtn) {
      nextEpisodeBtn.classList.add('hidden');
      nextEpisodeBtn.classList.remove('fade-in-glow');
    }
  }
}

window.CakeSceneEngine = CakeSceneEngine;
