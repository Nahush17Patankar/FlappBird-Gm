import { GAME_CONSTANTS, THEMES, BIRD_SKINS } from '../constants';
import { Bird, Obstacle, Particle, FloatingText, ThemeId, BirdSkinId } from '../types';

export class GameRenderer {
  private bgImages: Map<string, HTMLImageElement> = new Map();
  private stars: Array<{ x: number; y: number; size: number; alpha: number; speed: number; pulseSpeed: number }> = [];

  constructor() {
    this.initStars();
    this.preloadBackgrounds();
  }

  private initStars() {
    this.stars = [];
    for (let i = 0; i < 45; i++) {
      this.stars.push({
        x: Math.random() * GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH,
        y: Math.random() * (GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT),
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 15 + 10,
        pulseSpeed: Math.random() * 2 + 1,
      });
    }
  }

  private preloadBackgrounds() {
    Object.values(THEMES).forEach((theme) => {
      this.ensureBackgroundImage(theme.id, theme.bgImage);
    });
  }

  private ensureBackgroundImage(themeId: string, bgImageSrc: string): HTMLImageElement | undefined {
    let img = this.bgImages.get(themeId);
    if (!img) {
      img = new Image();
      img.src = bgImageSrc;
      img.onload = () => {
        this.bgImages.set(themeId, img!);
      };
      this.bgImages.set(themeId, img);
    }
    return img;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    bird: Bird,
    obstacles: Obstacle[],
    particles: Particle[],
    floatingTexts: FloatingText[],
    themeId: ThemeId,
    skinId: BirdSkinId,
    distanceTraveled: number,
    gameTime: number,
    shakeOffsetX: number = 0,
    shakeOffsetY: number = 0
  ) {
    const theme = THEMES[themeId] || THEMES.celestial;
    const skin = BIRD_SKINS[skinId] || BIRD_SKINS.astral;
    const width = GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH;
    const height = GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT;

    ctx.save();
    // Screen shake
    ctx.translate(shakeOffsetX, shakeOffsetY);

    // 1. Clear & Background (Static, stationary)
    this.drawBackground(ctx, theme, distanceTraveled, gameTime, width, height);

    // 2. Ambient floating dust / stars
    this.drawAmbientDust(ctx, distanceTraveled, gameTime, theme);

    // 3. Obstacles (Crystal monoliths / Cyber towers / Ancient pillars)
    obstacles.forEach((obs) => {
      this.drawObstacle(ctx, obs, theme, gameTime);
    });

    // 4. Ground
    this.drawGround(ctx, theme, distanceTraveled, width, height);

    // 5. Particles behind bird
    this.drawParticles(ctx, particles);

    // 6. Bird Trail
    this.drawBirdTrail(ctx, bird, skin);

    // 7. Bird Character
    this.drawBird(ctx, bird, skin, gameTime);

    // 8. Floating Texts (e.g. "+5", "CLOSE CALL!")
    this.drawFloatingTexts(ctx, floatingTexts);

    ctx.restore();
  }

  private drawBackground(
    ctx: CanvasRenderingContext2D,
    theme: typeof THEMES.celestial,
    _distanceTraveled: number,
    gameTime: number,
    width: number,
    height: number
  ) {
    let bgImg = this.bgImages.get(theme.id);
    if (!bgImg) {
      bgImg = this.ensureBackgroundImage(theme.id, theme.bgImage);
    }

    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      // Aspect-ratio preserving cover calculation (center-crop, no stretching)
      const imgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
      const targetRatio = width / height;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (targetRatio > imgRatio) {
        drawW = width;
        drawH = width / imgRatio;
        drawY = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * imgRatio;
        drawX = (width - drawW) / 2;
      }

      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);

      // Atmospheric gradient tint overlay (kept subtle so the beautiful realm artwork shines through)
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      if (theme.id === 'celestial') {
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.08)');
        gradient.addColorStop(0.6, 'rgba(6, 78, 59, 0.05)');
        gradient.addColorStop(1, 'rgba(6, 78, 59, 0.25)');
      } else if (theme.id === 'cyber') {
        gradient.addColorStop(0, 'rgba(15, 7, 30, 0.4)');
        gradient.addColorStop(0.6, 'rgba(236, 72, 153, 0.15)');
        gradient.addColorStop(1, 'rgba(9, 9, 11, 0.75)');
      } else if (theme.id === 'jungle') {
        gradient.addColorStop(0, 'rgba(6, 78, 59, 0.15)');
        gradient.addColorStop(0.7, 'rgba(2, 44, 34, 0.1)');
        gradient.addColorStop(1, 'rgba(6, 78, 59, 0.35)');
      } else if (theme.id === 'desert') {
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.06)');
        gradient.addColorStop(0.7, 'rgba(120, 53, 15, 0.05)');
        gradient.addColorStop(1, 'rgba(69, 26, 3, 0.25)');
      } else {
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.05)');
        gradient.addColorStop(0.6, 'rgba(20, 83, 45, 0.05)');
        gradient.addColorStop(1, 'rgba(20, 83, 45, 0.25)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Procedural fallback gradient if image is still loading
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, theme.groundColor1);
      grad.addColorStop(0.6, theme.primaryColor);
      grad.addColorStop(1, theme.groundColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Distant floating celestial nebulae or aurora glow
    const auroraX = Math.sin(gameTime * 0.5) * 50;
    const radial = ctx.createRadialGradient(
      width * 0.5 + auroraX,
      height * 0.3,
      20,
      width * 0.5 + auroraX,
      height * 0.3,
      width * 0.65
    );
    radial.addColorStop(0, theme.ambientParticles.color);
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  }

  private drawAmbientDust(
    ctx: CanvasRenderingContext2D,
    distanceTraveled: number,
    gameTime: number,
    theme: typeof THEMES.celestial
  ) {
    const width = GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH;

    this.stars.forEach((star) => {
      const currentX = (star.x - distanceTraveled * 0.35 + width * 10) % width;
      const pulse = Math.sin(gameTime * star.pulseSpeed) * 0.25 + 0.75;
      const alpha = star.alpha * pulse;

      // Soft ambient glow circle (fast hardware-accelerated without shadowBlur)
      ctx.beginPath();
      ctx.arc(currentX, star.y, star.size + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = theme.id === 'cyber' ? `rgba(6, 182, 212, ${alpha * 0.3})` : `rgba(168, 85, 247, ${alpha * 0.3})`;
      ctx.fill();

      // Core star
      ctx.beginPath();
      ctx.arc(currentX, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = theme.id === 'cyber' ? `rgba(6, 182, 212, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    });
  }

  private drawObstacle(
    ctx: CanvasRenderingContext2D,
    obs: Obstacle,
    theme: typeof THEMES.celestial,
    gameTime: number
  ) {
    const { x, width, topHeight, bottomY } = obs;
    const height = GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT;

    // Draw Top Pillar (hangs from top)
    this.drawSpire(ctx, x, 0, width, topHeight, true, theme, obs.runeGlow, gameTime);

    // Draw Bottom Pillar (rises from bottom)
    const bottomHeight = height - GAME_CONSTANTS.GROUND_HEIGHT - bottomY;
    this.drawSpire(ctx, x, bottomY, width, bottomHeight, false, theme, obs.runeGlow, gameTime);

    // Draw Floating Gem if present
    if (obs.gem && !obs.gem.collected) {
      this.drawGem(ctx, x + width / 2, obs.gem.y, obs.gem.animTime + gameTime, theme);
    }

    // Energy field shimmer between tips
    this.drawEnergyField(ctx, x + width / 2, topHeight, bottomY, theme, gameTime);
  }

  private drawSpire(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isTop: boolean,
    theme: typeof THEMES.celestial,
    runeGlow: number,
    gameTime: number
  ) {
    if (h <= 0) return;

    ctx.save();

    if (theme.pillarStyle === 'crystal') {
      // --- CRYSTAL MONOLITH ---
      const tipH = 28;
      const shaftH = Math.max(0, h - tipH);

      // Shaft body gradient
      const shaftGrad = ctx.createLinearGradient(x, 0, x + w, 0);
      shaftGrad.addColorStop(0, '#1e1b4b');
      shaftGrad.addColorStop(0.35, '#3b0764');
      shaftGrad.addColorStop(0.7, '#1e1b4b');
      shaftGrad.addColorStop(1, '#0f172a');

      // Draw shaft
      ctx.fillStyle = shaftGrad;
      const shaftY = isTop ? y : y + tipH;
      ctx.fillRect(x, shaftY, w, shaftH);

      // Crystalline facets on shaft
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.25, shaftY);
      ctx.lineTo(x + w * 0.45, shaftY + shaftH);
      ctx.lineTo(x + w * 0.2, shaftY + shaftH);
      ctx.closePath();
      ctx.fill();

      // Sharp crystal pointed cap
      const tipY = isTop ? y + shaftH : y;
      const pointY = isTop ? tipY + tipH : tipY;
      const baseY = isTop ? tipY : tipY + tipH;

      const tipGrad = ctx.createLinearGradient(x, 0, x + w, 0);
      tipGrad.addColorStop(0, '#60a5fa');
      tipGrad.addColorStop(0.5, '#c084fc');
      tipGrad.addColorStop(1, '#3b82f6');

      ctx.fillStyle = tipGrad;
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x + w / 2, pointY);
      ctx.lineTo(x + w, baseY);
      ctx.closePath();
      ctx.fill();

      // Crystal facet highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.15, baseY);
      ctx.lineTo(x + w / 2, pointY);
      ctx.lineTo(x + w * 0.5, baseY);
      ctx.closePath();
      ctx.fill();

      // Pulsing Leyline down the center
      const leylinePulse = Math.sin(gameTime * 4 + x * 0.02) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.45 * leylinePulse + runeGlow * 0.5})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w / 2, pointY);
      ctx.stroke();

      // Runic glyphs along the monolith
      this.drawRunicGlyphs(ctx, x + w / 2, y + h * 0.5, runeGlow, gameTime);
    } else if (theme.pillarStyle === 'cyber') {
      // --- CYBER LASER TOWER ---
      // Metal tower body
      const cyberGrad = ctx.createLinearGradient(x, 0, x + w, 0);
      cyberGrad.addColorStop(0, '#09090b');
      cyberGrad.addColorStop(0.2, '#18181b');
      cyberGrad.addColorStop(0.8, '#27272a');
      cyberGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = cyberGrad;
      ctx.fillRect(x, y, w, h);

      // Warning hazard stripes near tip
      const capH = 22;
      const capY = isTop ? y + h - capH : y;
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(x, capY, w, 4);

      // Holographic laser circuit lines
      const circuitPulse = Math.sin(gameTime * 6 + x * 0.05) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(244, 63, 94, ${0.6 * circuitPulse})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);

      // Laser emitter head at tip
      ctx.fillStyle = '#f43f5e';
      const emitterY = isTop ? y + h - 5 : y;
      ctx.fillRect(x + w * 0.3, emitterY, w * 0.4, 5);
    } else {
      // --- ANCIENT GILDED PILLAR ---
      const pillarGrad = ctx.createLinearGradient(x, 0, x + w, 0);
      pillarGrad.addColorStop(0, '#292524');
      pillarGrad.addColorStop(0.25, '#78716c');
      pillarGrad.addColorStop(0.65, '#d6d3d1');
      pillarGrad.addColorStop(1, '#292524');
      ctx.fillStyle = pillarGrad;
      ctx.fillRect(x, y, w, h);

      // Fluted column grooves
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 1.5;
      for (let offset = 14; offset < w; offset += 14) {
        ctx.beginPath();
        ctx.moveTo(x + offset, y);
        ctx.lineTo(x + offset, y + h);
        ctx.stroke();
      }

      // Golden Corinthian Capital trim
      const capH = 18;
      const capY = isTop ? y + h - capH : y;
      const goldGrad = ctx.createLinearGradient(x, 0, x + w, 0);
      goldGrad.addColorStop(0, '#b45309');
      goldGrad.addColorStop(0.5, '#fde68a');
      goldGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = goldGrad;
      ctx.fillRect(x - 4, capY, w + 8, capH);
    }

    ctx.restore();
  }

  private drawRunicGlyphs(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    glow: number,
    gameTime: number
  ) {
    const pulse = Math.sin(gameTime * 3) * 0.2 + 0.8;
    ctx.save();
    ctx.strokeStyle = `rgba(192, 132, 252, ${0.4 * pulse + glow * 0.6})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 6;

    // Small runic diamond glyph
    ctx.beginPath();
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx + 8, cy);
    ctx.lineTo(cx, cy + 10);
    ctx.lineTo(cx - 8, cy);
    ctx.closePath();
    ctx.stroke();

    // Inner dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawGem(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    time: number,
    theme: typeof THEMES.celestial
  ) {
    ctx.save();
    const bob = Math.sin(time * 3.5) * 6;
    const spin = Math.cos(time * 3); // 3D spin illusion via scaleX
    const cy = y + bob;

    ctx.translate(x, cy);
    ctx.scale(Math.abs(spin) * 0.8 + 0.2, 1);

    // Outer Aura
    const radial = ctx.createRadialGradient(0, 0, 3, 0, 0, 22);
    radial.addColorStop(0, 'rgba(253, 224, 71, 0.8)');
    radial.addColorStop(0.6, 'rgba(245, 158, 11, 0.4)');
    radial.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // Starlight Diamond Gem
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 12;

    const gemGrad = ctx.createLinearGradient(-10, -14, 10, 14);
    gemGrad.addColorStop(0, '#fef08a');
    gemGrad.addColorStop(0.5, '#f59e0b');
    gemGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = gemGrad;

    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(11, 0);
    ctx.lineTo(0, 14);
    ctx.lineTo(-11, 0);
    ctx.closePath();
    ctx.fill();

    // Facet glint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(11, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawEnergyField(
    ctx: CanvasRenderingContext2D,
    x: number,
    topY: number,
    bottomY: number,
    theme: typeof THEMES.celestial,
    gameTime: number
  ) {
    // Subtle mystical light bridge or particle filament connecting spires
    const gapHeight = bottomY - topY;
    if (gapHeight > 0) {
      const alpha = (Math.sin(gameTime * 2 + x) * 0.08 + 0.09).toFixed(3);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  private drawGround(
    ctx: CanvasRenderingContext2D,
    theme: typeof THEMES.celestial,
    distanceTraveled: number,
    width: number,
    height: number
  ) {
    const groundH = GAME_CONSTANTS.GROUND_HEIGHT;
    const groundY = height - groundH;

    ctx.save();

    // Ground bedrock gradient
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
    groundGrad.addColorStop(0, theme.groundColor1);
    groundGrad.addColorStop(1, theme.groundColor2);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, width, groundH);

    // Glowing surface border line
    ctx.strokeStyle = theme.primaryColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = theme.accentColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Scrolling crystalline shards / cyber grid on ground
    const segmentWidth = 32;
    const offset = (distanceTraveled * 1.0) % segmentWidth;

    for (let x = -segmentWidth; x < width + segmentWidth; x += segmentWidth) {
      const curX = x - offset;
      if (theme.pillarStyle === 'crystal') {
        // Little crystal protrusions along ground
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.moveTo(curX, groundY);
        ctx.lineTo(curX + 6, groundY - 7);
        ctx.lineTo(curX + 12, groundY);
        ctx.closePath();
        ctx.fill();
      } else if (theme.pillarStyle === 'cyber') {
        // Tech grid tick
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(curX, groundY);
        ctx.lineTo(curX, groundY + 14);
        ctx.stroke();
      } else {
        // Gold rune stones
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.beginPath();
        ctx.arc(curX + 8, groundY + 8, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private drawBirdTrail(
    ctx: CanvasRenderingContext2D,
    bird: Bird,
    skin: typeof BIRD_SKINS.astral
  ) {
    if (bird.trail.length < 2) return;

    ctx.save();
    for (let i = 0; i < bird.trail.length; i++) {
      const pt = bird.trail[i];
      const progress = i / bird.trail.length;
      const alpha = pt.alpha * progress;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size * (progress * 0.7 + 0.3), 0, Math.PI * 2);
      ctx.fillStyle = skin.trailColor.replace(/[\d.]+\)$/, `${alpha})`);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawBird(
    ctx: CanvasRenderingContext2D,
    bird: Bird,
    skin: typeof BIRD_SKINS.astral,
    gameTime: number
  ) {
    ctx.save();
    ctx.translate(bird.x, bird.y);

    // Rotation based on velocity
    ctx.rotate(bird.rotation);

    // Squash and stretch scale
    ctx.scale(bird.squish, 2 - bird.squish);

    // Zen Mode invulnerability flicker
    if (bird.invulnerableTime > 0 && Math.floor(bird.invulnerableTime * 15) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Outer Radiant Aura Glow
    const auraGrad = ctx.createRadialGradient(0, 0, 6, 0, 0, 32);
    auraGrad.addColorStop(0, skin.glowColor);
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();

    // 1. Tail Feathers / Jet Thruster
    this.drawBirdTail(ctx, skin, bird.wingPhase);

    // 2. Animated Back Wing (behind body)
    this.drawWing(ctx, skin, bird.wingPhase, -1);

    // 3. Main Body
    this.drawBirdBody(ctx, skin);

    // 4. Character-Specific Accents (Crown / Crest / Cockpit)
    this.drawSkinAccents(ctx, skin, gameTime);

    // 5. Animated Front Wing (in front of body)
    this.drawWing(ctx, skin, bird.wingPhase, 1);

    // 6. Eye & Beak
    this.drawBirdFace(ctx, bird, skin);

    ctx.restore();
  }

  private drawBirdBody(ctx: CanvasRenderingContext2D, skin: typeof BIRD_SKINS.astral) {
    ctx.save();
    // Pearlescent gradient body
    const bodyGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 18);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.35, skin.primaryColor);
    bodyGrad.addColorStop(0.85, skin.secondaryColor);
    bodyGrad.addColorStop(1, '#0f172a');

    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = skin.primaryColor;
    ctx.shadowBlur = 10;

    // Smooth teardrop bird form
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.bezierCurveTo(14, -13, -12, -14, -15, 0);
    ctx.bezierCurveTo(-12, 13, 14, 11, 14, 0);
    ctx.closePath();
    ctx.fill();

    // Soft luminous belly highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-2, 4, 8, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  private drawWing(
    ctx: CanvasRenderingContext2D,
    skin: typeof BIRD_SKINS.astral,
    wingPhase: number,
    layer: number // -1 for back wing, 1 for front
  ) {
    ctx.save();
    // Wing oscillation sine wave: -1 to 1
    const flapAngle = Math.sin(wingPhase) * 0.75 * layer;

    ctx.translate(-2, 2 * layer);
    ctx.rotate(flapAngle);

    const wingGrad = ctx.createLinearGradient(0, 0, -18, -14 * layer);
    wingGrad.addColorStop(0, skin.primaryColor);
    wingGrad.addColorStop(0.6, skin.secondaryColor);
    wingGrad.addColorStop(1, '#ffffff');

    ctx.fillStyle = wingGrad;
    ctx.shadowColor = skin.primaryColor;
    ctx.shadowBlur = 6;

    if (skin.featherType === 'plasma') {
      // Tech angular plasma wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-14, -12 * layer);
      ctx.lineTo(-22, -18 * layer);
      ctx.lineTo(-16, -6 * layer);
      ctx.lineTo(-24, -8 * layer);
      ctx.lineTo(-6, 2 * layer);
      ctx.closePath();
      ctx.fill();
    } else {
      // Curved feathered wing
      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.quadraticCurveTo(-10, -16 * layer, -22, -12 * layer);
      ctx.quadraticCurveTo(-14, -4 * layer, -18, 0);
      ctx.quadraticCurveTo(-8, 4 * layer, 2, 0);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  private drawBirdTail(
    ctx: CanvasRenderingContext2D,
    skin: typeof BIRD_SKINS.astral,
    wingPhase: number
  ) {
    ctx.save();
    const flutter = Math.sin(wingPhase * 1.2) * 3;

    if (skin.featherType === 'plasma') {
      // Dual ion thrust flame
      const thrusterLength = 14 + Math.abs(flutter) * 3;
      const flameGrad = ctx.createLinearGradient(-14, 0, -14 - thrusterLength, 0);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.4, skin.primaryColor);
      flameGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-12, -4);
      ctx.lineTo(-14 - thrusterLength, 0);
      ctx.lineTo(-12, 4);
      ctx.closePath();
      ctx.fill();
    } else {
      // Ethereal ribbon tail feathers
      ctx.strokeStyle = skin.secondaryColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = skin.primaryColor;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(-12, -2);
      ctx.quadraticCurveTo(-22, -6 + flutter, -28, -2 + flutter * 1.5);
      ctx.stroke();

      ctx.strokeStyle = skin.primaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-12, 2);
      ctx.quadraticCurveTo(-20, 6 - flutter, -26, 6 - flutter);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawSkinAccents(
    ctx: CanvasRenderingContext2D,
    skin: typeof BIRD_SKINS.astral,
    gameTime: number
  ) {
    ctx.save();
    if (skin.id === 'astral') {
      // Celestial Halo / Horn Crest
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(-2, -14, 7, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();
    } else if (skin.id === 'solar_phoenix') {
      // Burning Phoenix Crown
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-4, -10);
      ctx.lineTo(-2, -18);
      ctx.lineTo(2, -12);
      ctx.lineTo(6, -16);
      ctx.lineTo(6, -8);
      ctx.closePath();
      ctx.fill();
    } else if (skin.id === 'cyber_falcon') {
      // Neon visor line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, -5);
      ctx.lineTo(13, -1);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawBirdFace(
    ctx: CanvasRenderingContext2D,
    bird: Bird,
    skin: typeof BIRD_SKINS.astral
  ) {
    ctx.save();

    // 1. Beak
    ctx.fillStyle = skin.beakColor;
    ctx.shadowColor = skin.beakColor;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(11, -3);
    ctx.lineTo(21, 1);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.fill();

    // 2. Eye
    const eyeX = 6;
    const eyeY = -4;
    const eyeRadius = 4;

    // Check if blinking
    const isBlinking = bird.eyeBlinkTimer > 0 && bird.eyeBlinkTimer < 0.12;

    if (isBlinking) {
      // Blink slit
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(eyeX - eyeRadius, eyeY);
      ctx.lineTo(eyeX + eyeRadius, eyeY);
      ctx.stroke();
    } else {
      // Outer eye white
      ctx.fillStyle = skin.eyeColor;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(eyeX + 1, eyeY, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Glint shine
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX + 2, eyeY - 1, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
    ctx.save();
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      if (p.rotation !== undefined) {
        ctx.rotate(p.rotation);
      }

      ctx.fillStyle = p.color;

      if (p.shape === 'ring') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.shape === 'shard') {
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.7, p.size);
        ctx.lineTo(-p.size * 0.7, p.size);
        ctx.closePath();
        ctx.fill();
      } else if (p.shape === 'star') {
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.3, -s * 0.3);
        ctx.lineTo(s, 0);
        ctx.lineTo(s * 0.3, s * 0.3);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.3, s * 0.3);
        ctx.lineTo(-s, 0);
        ctx.lineTo(-s * 0.3, -s * 0.3);
        ctx.closePath();
        ctx.fill();
      } else {
        // Circle default
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
    ctx.restore();
  }

  private drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[]) {
    ctx.save();
    texts.forEach((t) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.font = `800 ${t.size}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Outline
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 4;
      ctx.strokeText(t.text, t.x, t.y);

      // Fill
      ctx.fillStyle = t.color;
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 10;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });
    ctx.restore();
  }
}
