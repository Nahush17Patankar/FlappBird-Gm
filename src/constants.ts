import { BirdSkinConfig, ThemeConfig } from './types';

// Asset background paths
export const THEMES: Record<string, ThemeConfig> = {
  celestial: {
    id: 'celestial',
    name: 'Astral Aurora',
    description: 'Ethereal realm of glowing crystal monoliths & star dust',
    bgImage: '/src/assets/images/celestial_sky_bg_1789550997540.jpg',
    primaryColor: '#06b6d4', // cyan-500
    accentColor: '#a855f7', // purple-500
    crystalColor1: '#38bdf8', // sky-400
    crystalColor2: '#c084fc', // purple-400
    groundColor1: '#0f172a',
    groundColor2: '#1e1b4b',
    pillarStyle: 'crystal',
    ambientParticles: {
      count: 28,
      color: 'rgba(168, 85, 247, 0.45)',
      speed: 0.35,
    },
  },
  cyber: {
    id: 'cyber',
    name: 'Neon Cyberpunk',
    description: 'Futuristic synthwave grid with laser towers & holograms',
    bgImage: '/src/assets/images/cyber_neon_sky_1789551022191.jpg',
    primaryColor: '#f43f5e', // rose-500
    accentColor: '#06b6d4', // cyan-500
    crystalColor1: '#ec4899', // pink-500
    crystalColor2: '#06b6d4', // cyan-500
    groundColor1: '#09090b',
    groundColor2: '#18181b',
    pillarStyle: 'cyber',
    ambientParticles: {
      count: 32,
      color: 'rgba(236, 72, 153, 0.45)',
      speed: 0.5,
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Gilded Solarpunk',
    description: 'Ancient sunlit marble pillars & warm amber clouds',
    bgImage: '/src/assets/images/golden_sunset_sky_1789551037015.jpg',
    primaryColor: '#f59e0b', // amber-500
    accentColor: '#fbbf24', // amber-400
    crystalColor1: '#f59e0b', // amber-500
    crystalColor2: '#fde68a', // amber-200
    groundColor1: '#1c1917',
    groundColor2: '#292524',
    pillarStyle: 'ancient',
    ambientParticles: {
      count: 24,
      color: 'rgba(251, 191, 36, 0.4)',
      speed: 0.28,
    },
  },
};

export const BIRD_SKINS: Record<string, BirdSkinConfig> = {
  astral: {
    id: 'astral',
    name: 'Astral Spirit',
    subtitle: 'Luminescent celestial messenger with stardust trails',
    primaryColor: '#38bdf8', // sky-400
    secondaryColor: '#c084fc', // purple-400
    glowColor: 'rgba(56, 189, 248, 0.65)',
    trailColor: 'rgba(192, 132, 252, 0.5)',
    eyeColor: '#ffffff',
    beakColor: '#fde047',
    featherType: 'ethereal',
  },
  cyber_falcon: {
    id: 'cyber_falcon',
    name: 'Cyber Falcon',
    subtitle: 'Ion-boosted stealth drone with plasma wings',
    primaryColor: '#06b6d4', // cyan-500
    secondaryColor: '#f43f5e', // rose-500
    glowColor: 'rgba(6, 182, 212, 0.7)',
    trailColor: 'rgba(244, 63, 94, 0.55)',
    eyeColor: '#22d3ee',
    beakColor: '#94a3b8',
    featherType: 'plasma',
  },
  solar_phoenix: {
    id: 'solar_phoenix',
    name: 'Solar Phoenix',
    subtitle: 'Living ember born from the heart of a dying sun',
    primaryColor: '#f59e0b', // amber-500
    secondaryColor: '#ef4444', // red-500
    glowColor: 'rgba(245, 158, 11, 0.75)',
    trailColor: 'rgba(239, 68, 68, 0.5)',
    eyeColor: '#fef08a',
    beakColor: '#d97706',
    featherType: 'flame',
  },
  void_raven: {
    id: 'void_raven',
    name: 'Void Raven',
    subtitle: 'Mystic bird from the deep rift with cosmic mist',
    primaryColor: '#818cf8', // indigo-400
    secondaryColor: '#ec4899', // pink-500
    glowColor: 'rgba(129, 140, 248, 0.65)',
    trailColor: 'rgba(236, 72, 153, 0.5)',
    eyeColor: '#e0e7ff',
    beakColor: '#475569',
    featherType: 'void',
  },
};

export const GAME_CONSTANTS = {
  CANVAS_VIRTUAL_WIDTH: 440,
  CANVAS_VIRTUAL_HEIGHT: 720,
  GROUND_HEIGHT: 85,
  BIRD_RADIUS: 17,
  HITBOX_RADIUS: 14, // Fair forgiving collision detection
  GRAVITY: 980, // pixels per sec^2
  FLAP_VELOCITY: -340, // pixels per sec
  MAX_FALL_SPEED: 580,
  SCROLL_SPEED_BASE: 170, // pixels per sec
  OBSTACLE_WIDTH: 74,
  OBSTACLE_GAP: 155, // Height of gap
  OBSTACLE_MIN_HEIGHT: 70,
  OBSTACLE_SPACING: 260, // Distance between consecutive pillars
  MAX_TRAIL_LENGTH: 16,
};

export const MEDALS = [
  { threshold: 100, name: 'Celestial', color: '#c084fc', icon: 'Sparkles' },
  { threshold: 50, name: 'Gold', color: '#fbbf24', icon: 'Trophy' },
  { threshold: 25, name: 'Silver', color: '#cbd5e1', icon: 'Award' },
  { threshold: 10, name: 'Bronze', color: '#d97706', icon: 'Medal' },
  { threshold: 0, name: 'Initiate', color: '#64748b', icon: 'Compass' },
];
