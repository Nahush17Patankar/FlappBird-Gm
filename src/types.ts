export type GameMode = 'classic' | 'zen' | 'hardcore';

export type ThemeId = 'celestial' | 'cyber' | 'sunset';

export type BirdSkinId = 'astral' | 'cyber_falcon' | 'solar_phoenix' | 'void_raven';

export type GameState = 'idle' | 'countdown' | 'playing' | 'paused' | 'gameover';

export interface BirdTrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
  color: string;
}

export interface Bird {
  x: number;
  y: number;
  vy: number;
  radius: number;
  rotation: number;
  wingPhase: number;
  wingSpeed: number;
  trail: BirdTrailPoint[];
  eyeBlinkTimer: number;
  squish: number; // For squash & stretch animation
  invulnerableTime: number; // Used in Zen mode after collision
}

export interface Gem {
  y: number;
  collected: boolean;
  animTime: number;
  value: number;
}

export interface Obstacle {
  id: number;
  x: number;
  width: number;
  topHeight: number;
  bottomY: number;
  gap: number;
  passed: boolean;
  isMoving?: boolean;
  moveRange?: number;
  initialTopHeight?: number;
  moveSpeed?: number;
  moveOffset?: number;
  gem?: Gem;
  runeGlow: number;
}

export type ParticleShape = 'circle' | 'shard' | 'star' | 'feather' | 'spark' | 'ring';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape: ParticleShape;
  rotation?: number;
  vRot?: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

export interface GameSettings {
  mode: GameMode;
  themeId: ThemeId;
  skinId: BirdSkinId;
  soundEnabled: boolean;
  ambientMusicEnabled: boolean;
  screenShakeEnabled: boolean;
}

export interface GameStats {
  score: number;
  bestScore: number;
  gemsCount: number;
  totalGems: number;
  gamesPlayed: number;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  bgImage: string;
  primaryColor: string;
  accentColor: string;
  crystalColor1: string;
  crystalColor2: string;
  groundColor1: string;
  groundColor2: string;
  pillarStyle: 'crystal' | 'cyber' | 'ancient';
  ambientParticles: {
    count: number;
    color: string;
    speed: number;
  };
}

export interface BirdSkinConfig {
  id: BirdSkinId;
  name: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  trailColor: string;
  eyeColor: string;
  beakColor: string;
  featherType: 'ethereal' | 'plasma' | 'flame' | 'void';
}
