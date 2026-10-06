/**
 * =====================================================================
 * 冰岛真实感极光模拟引擎 (Aurora Borealis Canvas Engine)
 * =====================================================================
 * 基于动态波形叠加与多重平滑高斯漫射，模拟夜空中的极光光带与闪烁繁星。
 */

class AuroraEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.time = 0;
    this.stars = [];
    this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    this.isRunning = false;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = e.touches[0].clientX;
        this.mouse.targetY = e.touches[0].clientY;
      }
    });

    this.createStars();
    this.start();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.createStars();
  }

  createStars() {
    this.stars = [];
    const count = Math.floor((this.width * this.height) / 6000);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.75),
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  handleMouseMove(e) {
    this.mouse.targetX = e.clientX;
    this.mouse.targetY = e.clientY;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      requestAnimationFrame(this.animate);
    }
  }

  stop() {
    this.isRunning = false;
  }

  drawStars() {
    const ctx = this.ctx;
    for (const star of this.stars) {
      star.phase += star.speed;
      const flicker = Math.sin(star.phase) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(235, 245, 255, ${star.alpha * flicker})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawAuroraBand(points, colorStop1, colorStop2, colorStop3, blurAmount) {
    const ctx = this.ctx;
    ctx.save();
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.globalCompositeOperation = 'screen';

    const grad = ctx.createLinearGradient(0, points[0].y - 80, 0, points[0].y + 160);
    grad.addColorStop(0, colorStop1);
    grad.addColorStop(0.35, colorStop2);
    grad.addColorStop(0.8, colorStop3);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
    }

    const last = points[points.length - 1];
    ctx.lineTo(last.x, this.height);
    ctx.lineTo(points[0].x, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  animate() {
    if (!this.isRunning) return;

    this.time += 0.008;

    // Smooth mouse follow
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Deep night sky background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#040810');
    bgGrad.addColorStop(0.4, '#07121e');
    bgGrad.addColorStop(0.8, '#091624');
    bgGrad.addColorStop(1, '#0c0f14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Stars
    this.drawStars();

    // 3. Multi-layer Aurora curtains (Emerald green, Cyan, Violet)
    const step = 45;
    const cols = Math.ceil(this.width / step) + 2;

    const mouseInfluence = (x, y) => {
      const dx = x - this.mouse.x;
      const dy = y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 350) {
        return Math.sin((dist / 350) * Math.PI) * 25;
      }
      return 0;
    };

    // Layer 1: Emerald & Mint Green (Main body)
    const points1 = [];
    const baseHeight1 = this.height * 0.28;
    for (let i = 0; i < cols; i++) {
      const x = (i - 1) * step;
      const wave = Math.sin(this.time * 1.1 + x * 0.0035) * 60 +
                   Math.cos(this.time * 0.8 + x * 0.007) * 35 +
                   Math.sin(this.time * 2.0 + x * 0.012) * 15;
      const y = baseHeight1 + wave + mouseInfluence(x, baseHeight1);
      points1.push({ x, y });
    }
    this.drawAuroraBand(
      points1,
      'rgba(46, 213, 115, 0.0)',
      'rgba(46, 213, 115, 0.45)',
      'rgba(30, 144, 255, 0.2)',
      24
    );

    // Layer 2: Electric Cyan & Ice Blue (Highlight)
    const points2 = [];
    const baseHeight2 = this.height * 0.22;
    for (let i = 0; i < cols; i++) {
      const x = (i - 1) * step;
      const wave = Math.sin(this.time * 1.4 + x * 0.004 + 1.2) * 55 +
                   Math.cos(this.time * 0.9 + x * 0.008) * 30;
      const y = baseHeight2 + wave + mouseInfluence(x, baseHeight2);
      points2.push({ x, y });
    }
    this.drawAuroraBand(
      points2,
      'rgba(0, 242, 254, 0.0)',
      'rgba(0, 210, 211, 0.5)',
      'rgba(72, 52, 212, 0.25)',
      20
    );

    // Layer 3: Mystical Violet & Magenta (Crown of Iceland Aurora)
    const points3 = [];
    const baseHeight3 = this.height * 0.16;
    for (let i = 0; i < cols; i++) {
      const x = (i - 1) * step;
      const wave = Math.cos(this.time * 0.8 + x * 0.003) * 50 +
                   Math.sin(this.time * 1.3 + x * 0.006 + 2.0) * 35;
      const y = baseHeight3 + wave + mouseInfluence(x, baseHeight3);
      points3.push({ x, y });
    }
    this.drawAuroraBand(
      points3,
      'rgba(197, 108, 240, 0.0)',
      'rgba(165, 94, 234, 0.35)',
      'rgba(46, 213, 115, 0.15)',
      28
    );

    // Layer 4: Vertical Light Rays (Curtain shimmer)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const rayCount = 12;
    for (let r = 0; r < rayCount; r++) {
      const rx = (this.width / rayCount) * r + Math.sin(this.time * 1.5 + r) * 40;
      const rayAlpha = (Math.sin(this.time * 2.2 + r * 1.3) * 0.5 + 0.5) * 0.25;
      const rayGrad = ctx.createLinearGradient(rx, 50, rx + 15, baseHeight1 + 180);
      rayGrad.addColorStop(0, 'rgba(46, 213, 115, 0)');
      rayGrad.addColorStop(0.4, `rgba(46, 213, 115, ${rayAlpha})`);
      rayGrad.addColorStop(0.7, `rgba(165, 94, 234, ${rayAlpha * 0.7})`);
      rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = rayGrad;
      ctx.fillRect(rx - 25, 40, 50, baseHeight1 + 150);
    }
    ctx.restore();

    requestAnimationFrame(this.animate);
  }
}

window.AuroraEngine = AuroraEngine;
