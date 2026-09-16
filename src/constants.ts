import { BirdSkinConfig, ThemeConfig } from './types';

// Image imports — Vite will bundle & hash these correctly for both dev and production builds
import floatingIslandsBg from './assets/images/floating_islands_bg_1789569210965.jpg';
import cyberNeonBg from './assets/images/cyber_neon_sky_1789551022191.jpg';
import floatingHavenBg from './assets/images/floating_haven_bg_1789569229987.jpg';
import mysticJungleBg from './assets/images/mystic_jungle_bg_1789569808131.jpg';
import desertCanyonBg from './assets/images/desert_canyon_bg_1789569826011.jpg';

// Asset background paths
export const THEMES: Record<string, ThemeConfig> = {
  celestial: {
    id: 'celestial',
    name: 'Floating Haven',
    description: 'Ethereal floating sky islands with lush foliage & soaring peaks',
    bgImage: floatingIslandsBg,
    primaryColor: '#10b981', // emerald-500
    accentColor: '#38bdf8', // sky-400
    crystalColor1: '#34d399', // emerald-400
    crystalColor2: '#38bdf8', // sky-400
    groundColor1: '#064e3b', // emerald-950
    groundColor2: '#022c22',
    pillarStyle: 'crystal',
    ambientParticles: {
      count: 24,
      color: 'rgba(56, 189, 248, 0.45)',
      speed: 0.35,
    },
  },
  cyber: {
    id: 'cyber',
    name: 'Neon Cyberpunk',
    description: 'Futuristic synthwave grid with laser towers & holograms',
    bgImage: cyberNeonBg,
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
    name: 'Sky Haven Sanctuary',
    description: 'Vibrant mossy floating sky islands bathed in clear azure skies',
    bgImage: floatingHavenBg,
    primaryColor: '#22c55e', // green-500
    accentColor: '#38bdf8', // sky-400
    crystalColor1: '#4ade80', // green-400
    crystalColor2: '#67e8f9', // cyan-300
    groundColor1: '#14532d', // green-900
    groundColor2: '#052e16',
    pillarStyle: 'ancient',
    ambientParticles: {
      count: 22,
      color: 'rgba(74, 222, 128, 0.4)',
      speed: 0.28,
    },
  },
  jungle: {
    id: 'jungle',
    name: 'Mystic Night Canopy',
    description: 'Enchanted nocturnal forest with glowing lanterns, hanging vines & totem pillars',
    bgImage: mysticJungleBg,
    primaryColor: '#10b981', // emerald-500
    accentColor: '#fbbf24', // amber-400
    crystalColor1: '#34d399', // emerald-400
    crystalColor2: '#f59e0b', // amber-500
    groundColor1: '#064e3b', // emerald-950
    groundColor2: '#022c22',
    pillarStyle: 'ancient',
    ambientParticles: {
      count: 26,
      color: 'rgba(251, 191, 36, 0.45)',
      speed: 0.3,
    },
  },
  desert: {
    id: 'desert',
    name: 'Sunbaked Canyon',
    description: 'Sunlit desert canyon bluffs with saguaro cacti under brilliant blue skies',
    bgImage: desertCanyonBg,
    primaryColor: '#f59e0b', // amber-500
    accentColor: '#0ea5e9', // sky-500
    crystalColor1: '#fbbf24', // amber-400
    crystalColor2: '#38bdf8', // sky-400
    groundColor1: '#78350f', // amber-900
    groundColor2: '#451a03',
    pillarStyle: 'ancient',
    ambientParticles: {
      count: 20,
      color: 'rgba(245, 158, 11, 0.35)',
      speed: 0.25,
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