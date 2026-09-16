import { GAME_CONSTANTS, BIRD_SKINS } from '../constants';
import { Bird, Obstacle, Particle, FloatingText, GameMode, BirdSkinId } from '../types';
import { sound } from '../audio';

export interface PhysicsResult {
  scoreGained: number;
  gemsGained: number;
  isGameOver: boolean;
  nearMiss: boolean;
  shakeTime: number;
}

export function createInitialBird(): Bird {
  return {
    x: 110,
    y: 280,
    vy: 0,
    radius: GAME_CONSTANTS.BIRD_RADIUS,
    rotation: 0,
    wingPhase: 0,
    wingSpeed: 10,
    trail: [],
    eyeBlinkTimer: 2.5,
    squish: 1,
    invulnerableTime: 0,
  };
}

export function createInitialObstacles(): Obstacle[] {
  const obstacles: Obstacle[] = [];
  const startX = 480;

  for (let i = 0; i < 4; i++) {
    const x = startX + i * GAME_CONSTANTS.OBSTACLE_SPACING;
    obstacles.push(generateObstacle(i, x, 'classic'));
  }
  return obstacles;
}

export function generateObstacle(id: number, x: number, mode: GameMode): Obstacle {
  const playAreaHeight = GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
  const gap = mode === 'hardcore' ? 140 : mode === 'zen' ? 175 : GAME_CONSTANTS.OBSTACLE_GAP;

  const minTop = GAME_CONSTANTS.OBSTACLE_MIN_HEIGHT;
  const maxTop = playAreaHeight - gap - GAME_CONSTANTS.OBSTACLE_MIN_HEIGHT;
  const topHeight = Math.floor(Math.random() * (maxTop - minTop) + minTop);
  const bottomY = topHeight + gap;

  // 60% chance to spawn a collectible gem in the gap
  const hasGem = Math.random() < 0.65;
  const gemY = topHeight + gap / 2 + (Math.random() * 30 - 15);

  const isMoving = mode === 'hardcore' && Math.random() < 0.5;

  return {
    id,
    x,
    width: GAME_CONSTANTS.OBSTACLE_WIDTH,
    topHeight,
    bottomY,
    gap,
    passed: false,
    isMoving,
    initialTopHeight: topHeight,
    moveSpeed: Math.random() * 1.5 + 1.2,
    moveRange: 35,
    runeGlow: 0,
    gem: hasGem
      ? {
          y: gemY,
          collected: false,
          animTime: Math.random() * 10,
          value: 5,
        }
      : undefined,
  };
}

export function applyFlap(
  bird: Bird,
  skinId: BirdSkinId,
  particles: Particle[]
): void {
  bird.vy = GAME_CONSTANTS.FLAP_VELOCITY;
  bird.squish = 0.78; // Stretch vertically
  bird.wingSpeed = 26; // Flap furiously

  sound.playFlap();

  // Spawn flap ring & sparkles
  const skin = BIRD_SKINS[skinId] || BIRD_SKINS.astral;
  particles.push({
    x: bird.x - 4,
    y: bird.y + 4,
    vx: -40,
    vy: 10,
    size: 14,
    color: skin.glowColor,
    alpha: 0.8,
    decay: 3.5,
    shape: 'ring',
  });

  for (let i = 0; i < 4; i++) {
    particles.push({
      x: bird.x - 10 + Math.random() * 6,
      y: bird.y + Math.random() * 10 - 5,
      vx: -(Math.random() * 60 + 20),
      vy: Math.random() * 50 - 25,
      size: Math.random() * 3 + 2,
      color: skin.primaryColor,
      alpha: 0.9,
      decay: 2.2,
      shape: 'spark',
    });
  }
}

export function updatePhysics(
  bird: Bird,
  obstacles: Obstacle[],
  particles: Particle[],
  floatingTexts: FloatingText[],
  dt: number,
  mode: GameMode,
  skinId: BirdSkinId,
  gameTime: number
): PhysicsResult {
  // Clamp delta time to avoid large physics steps
  const safeDt = Math.min(dt, 0.04);
  const result: PhysicsResult = {
    scoreGained: 0,
    gemsGained: 0,
    isGameOver: false,
    nearMiss: false,
    shakeTime: 0,
  };

  const playAreaHeight = GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
  const speed = mode === 'hardcore' ? GAME_CONSTANTS.SCROLL_SPEED_BASE * 1.25 : GAME_CONSTANTS.SCROLL_SPEED_BASE;

  // 1. Bird Physics
  bird.vy += GAME_CONSTANTS.GRAVITY * safeDt;
  if (bird.vy > GAME_CONSTANTS.MAX_FALL_SPEED) {
    bird.vy = GAME_CONSTANTS.MAX_FALL_SPEED;
  }
  bird.y += bird.vy * safeDt;

  // Rotation: tilts up on flap, rolls into dive on fall
  const targetRotation = bird.vy < 0 ? -0.42 : Math.min(Math.PI / 2.2, (bird.vy / 500) * 1.1);
  bird.rotation += (targetRotation - bird.rotation) * (safeDt * 10);

  // Squash & Stretch decay
  bird.squish += (1 - bird.squish) * (safeDt * 8);

  // Wing flap animation
  bird.wingPhase += bird.wingSpeed * safeDt;
  bird.wingSpeed += (12 - bird.wingSpeed) * (safeDt * 4);

  // Eye blinking
  bird.eyeBlinkTimer -= safeDt;
  if (bird.eyeBlinkTimer <= 0) {
    bird.eyeBlinkTimer = Math.random() * 3.5 + 2.0;
  }

  // Invulnerability timer (Zen mode)
  if (bird.invulnerableTime > 0) {
    bird.invulnerableTime -= safeDt;
  }

  // Trail management
  bird.trail.unshift({
    x: bird.x - 14,
    y: bird.y,
    alpha: 0.7,
    size: 6,
    color: '#ffffff',
  });
  if (bird.trail.length > GAME_CONSTANTS.MAX_TRAIL_LENGTH) {
    bird.trail.pop();
  }
  bird.trail.forEach((pt) => {
    pt.x -= speed * safeDt;
    pt.alpha -= safeDt * 1.5;
  });

  // 2. Ceiling & Ground Collisions
  if (bird.y - GAME_CONSTANTS.HITBOX_RADIUS <= 0) {
    bird.y = GAME_CONSTANTS.HITBOX_RADIUS;
    bird.vy = 0;
  }

  if (bird.y + GAME_CONSTANTS.HITBOX_RADIUS >= playAreaHeight) {
    bird.y = playAreaHeight - GAME_CONSTANTS.HITBOX_RADIUS;
    if (mode === 'zen') {
      bird.vy = GAME_CONSTANTS.FLAP_VELOCITY * 0.75;
      bird.invulnerableTime = 1.2;
      sound.playHit();
    } else {
      result.isGameOver = true;
      result.shakeTime = 0.35;
      spawnShatterParticles(bird, particles, skinId);
      sound.playHit();
      sound.playGameOver();
      return result;
    }
  }

  // 3. Update Obstacles
  let maxObstacleX = 0;
  obstacles.forEach((obs) => {
    obs.x -= speed * safeDt;
    if (obs.x > maxObstacleX) {
      maxObstacleX = obs.x;
    }

    // Moving obstacle update (hardcore)
    if (obs.isMoving && obs.initialTopHeight !== undefined && obs.moveRange !== undefined && obs.moveSpeed !== undefined) {
      const offset = Math.sin(gameTime * obs.moveSpeed + obs.id) * obs.moveRange;
      obs.topHeight = Math.max(GAME_CONSTANTS.OBSTACLE_MIN_HEIGHT, obs.initialTopHeight + offset);
      obs.bottomY = obs.topHeight + obs.gap;
      if (obs.gem && !obs.gem.collected) {
        obs.gem.y = obs.topHeight + obs.gap / 2;
      }
    }

    // Rune glow decay
    if (obs.runeGlow > 0) {
      obs.runeGlow = Math.max(0, obs.runeGlow - safeDt * 2);
    }

    // Gem collision
    if (obs.gem && !obs.gem.collected) {
      const gemX = obs.x + obs.width / 2;
      const gemY = obs.gem.y;
      const dist = Math.hypot(bird.x - gemX, bird.y - gemY);

      if (dist < bird.radius + 18) {
        obs.gem.collected = true;
        result.gemsGained += 1;
        result.scoreGained += 5;
        obs.runeGlow = 1;
        sound.playGem();

        // Spawn gem pickup sparkle explosion
        for (let i = 0; i < 14; i++) {
          const angle = (Math.PI * 2 * i) / 14;
          const pSpeed = Math.random() * 120 + 60;
          particles.push({
            x: gemX,
            y: gemY,
            vx: Math.cos(angle) * pSpeed,
            vy: Math.sin(angle) * pSpeed,
            size: Math.random() * 4 + 3,
            color: '#fde047',
            alpha: 1,
            decay: 2.0,
            shape: 'star',
          });
        }

        floatingTexts.push({
          id: Math.random(),
          text: '+5 GEM!',
          x: gemX,
          y: gemY - 10,
          vy: -60,
          alpha: 1,
          color: '#fde047',
          size: 16,
        });
      }
    }

    // Score passing check
    if (!obs.passed && obs.x + obs.width < bird.x) {
      obs.passed = true;
      obs.runeGlow = 1;
      result.scoreGained += 1;
      sound.playScore();

      floatingTexts.push({
        id: Math.random(),
        text: '+1',
        x: bird.x,
        y: bird.y - 24,
        vy: -55,
        alpha: 1,
        color: '#38bdf8',
        size: 20,
      });
    }

    // Near miss detection (within gap, but close to top or bottom pillar tip!)
    if (
      !result.nearMiss &&
      obs.x < bird.x + bird.radius &&
      obs.x + obs.width > bird.x - bird.radius
    ) {
      const distToTop = bird.y - obs.topHeight;
      const distToBottom = obs.bottomY - bird.y;

      if ((distToTop > 0 && distToTop < 24) || (distToBottom > 0 && distToBottom < 24)) {
        result.nearMiss = true;
        result.scoreGained += 2;
        sound.playNearMiss();

        floatingTexts.push({
          id: Math.random(),
          text: 'CLOSE CALL! +2',
          x: bird.x + 20,
          y: bird.y,
          vy: -40,
          alpha: 1,
          color: '#f43f5e',
          size: 14,
        });
      }
    }

    // Obstacle Collision Check
    const birdBox = {
      cx: bird.x,
      cy: bird.y,
      r: GAME_CONSTANTS.HITBOX_RADIUS,
    };

    // Check collision with top pillar (0 to topHeight)
    const hitTop = checkCircleRectCollision(
      birdBox.cx,
      birdBox.cy,
      birdBox.r,
      obs.x,
      0,
      obs.width,
      obs.topHeight
    );

    // Check collision with bottom pillar (bottomY to playAreaHeight)
    const hitBottom = checkCircleRectCollision(
      birdBox.cx,
      birdBox.cy,
      birdBox.r,
      obs.x,
      obs.bottomY,
      obs.width,
      playAreaHeight - obs.bottomY
    );

    if (hitTop || hitBottom) {
      if (mode === 'zen') {
        if (bird.invulnerableTime <= 0) {
          bird.invulnerableTime = 1.6;
          bird.vy = GAME_CONSTANTS.FLAP_VELOCITY * 0.8;
          sound.playHit();
          result.shakeTime = 0.2;

          floatingTexts.push({
            id: Math.random(),
            text: 'SHIELD DEFLECT!',
            x: bird.x,
            y: bird.y - 20,
            vy: -50,
            alpha: 1,
            color: '#a855f7',
            size: 14,
          });
        }
      } else {
        result.isGameOver = true;
        result.shakeTime = 0.4;
        spawnShatterParticles(bird, particles, skinId);
        sound.playHit();
        sound.playGameOver();
      }
    }
  });

  // Recycle off-screen obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    if (obstacles[i].x + obstacles[i].width < -50) {
      obstacles.splice(i, 1);
      const newX = Math.max(maxObstacleX + GAME_CONSTANTS.OBSTACLE_SPACING, GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH + 40);
      obstacles.push(generateObstacle(Date.now() + Math.random(), newX, mode));
    }
  }

  // 4. Update Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * safeDt;
    p.y += p.vy * safeDt;
    p.alpha -= p.decay * safeDt;
    if (p.rotation !== undefined && p.vRot !== undefined) {
      p.rotation += p.vRot * safeDt;
    }
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  // 5. Update Floating Texts
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const t = floatingTexts[i];
    t.y += t.vy * safeDt;
    t.alpha -= safeDt * 1.2;
    if (t.alpha <= 0) {
      floatingTexts.splice(i, 1);
    }
  }

  return result;
}

function checkCircleRectCollision(
  cx: number,
  cy: number,
  radius: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  // Find closest point on rectangle to circle center
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));

  const distanceX = cx - closestX;
  const distanceY = cy - closestY;

  return distanceX * distanceX + distanceY * distanceY < radius * radius;
}

function spawnShatterParticles(bird: Bird, particles: Particle[], skinId: BirdSkinId) {
  const skin = BIRD_SKINS[skinId] || BIRD_SKINS.astral;
  for (let i = 0; i < 28; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 220 + 80;
    particles.push({
      x: bird.x,
      y: bird.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 6 + 3,
      color: Math.random() > 0.4 ? skin.primaryColor : skin.secondaryColor,
      alpha: 1,
      decay: 1.4,
      shape: 'shard',
      rotation: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 8,
    });
  }
}
