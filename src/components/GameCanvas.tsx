import React, { useRef, useEffect, useCallback } from 'react';
import { GameRenderer } from '../game/renderer';
import {
  createInitialBird,
  createInitialObstacles,
  applyFlap,
  updatePhysics,
} from '../game/physics';
import {
  Bird,
  Obstacle,
  Particle,
  FloatingText,
  GameState,
  GameSettings,
  GameStats,
} from '../types';
import { GAME_CONSTANTS } from '../constants';
import { sound } from '../audio';

interface GameCanvasProps {
  gameState: GameState;
  settings: GameSettings;
  stats: GameStats;
  onStateChange: (state: GameState) => void;
  onUpdateStats: (updater: (prev: GameStats) => GameStats) => void;
  onStartCountdown: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  settings,
  stats,
  onStateChange,
  onUpdateStats,
  onStartCountdown,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);

  // Mutable game simulation state
  const birdRef = useRef<Bird>(createInitialBird());
  const obstaclesRef = useRef<Obstacle[]>(createInitialObstacles());
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const distanceTraveledRef = useRef<number>(0);
  const gameTimeRef = useRef<number>(0);
  const shakeTimerRef = useRef<number>(0);
  const gameOverDelayRef = useRef<number>(0);
  const physicsAccumulatorRef = useRef<number>(0);
  const lastTapTimeRef = useRef<number>(0);

  // Sync ambient sound
  useEffect(() => {
    sound.setSoundEnabled(settings.soundEnabled);
    sound.setAmbientEnabled(settings.ambientMusicEnabled);
    if (settings.ambientMusicEnabled && gameState === 'playing') {
      sound.startAmbient();
    } else if (gameState !== 'playing') {
      sound.stopAmbient();
    }
  }, [settings.soundEnabled, settings.ambientMusicEnabled, gameState]);

  // Initialize renderer once
  useEffect(() => {
    rendererRef.current = new GameRenderer();
  }, []);

  // Reset internal game state
  const resetGame = useCallback(() => {
    birdRef.current = createInitialBird();
    obstaclesRef.current = createInitialObstacles();
    particlesRef.current = [];
    floatingTextsRef.current = [];
    distanceTraveledRef.current = 0;
    shakeTimerRef.current = 0;
    physicsAccumulatorRef.current = 0;
    gameOverDelayRef.current = Date.now();
    onUpdateStats((prev) => ({
      ...prev,
      score: 0,
      gemsCount: 0,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  }, [onUpdateStats]);

  // When transitioning to countdown, reset initial game elements
  useEffect(() => {
    if (gameState === 'countdown') {
      resetGame();
    }
  }, [gameState, resetGame]);

  // Handle flap input with debouncing to prevent double-tap glitches
  const handleFlap = useCallback(() => {
    const now = Date.now();
    // Debounce fast duplicated touches/clicks (under 80ms)
    if (now - lastTapTimeRef.current < 80) return;
    lastTapTimeRef.current = now;

    if (gameState === 'idle') {
      onStartCountdown();
    } else if (gameState === 'countdown') {
      // Gentle wing flutter during countdown without changing altitude
      birdRef.current.wingSpeed = 20;
      birdRef.current.squish = 0.88;
    } else if (gameState === 'playing') {
      applyFlap(birdRef.current, settings.skinId, particlesRef.current);
    } else if (gameState === 'gameover') {
      if (now - gameOverDelayRef.current > 450) {
        onStartCountdown();
      }
    }
  }, [gameState, onStartCountdown, settings.skinId]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        handleFlap();
      } else if (e.code === 'KeyP') {
        if (gameState === 'playing') {
          onStateChange('paused');
        } else if (gameState === 'paused') {
          onStateChange('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlap, gameState, onStateChange]);

  // HiDPI Canvas Setup & Resize Handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasDPR = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vWidth = GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH;
      const vHeight = GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT;

      canvas.width = Math.floor(vWidth * dpr);
      canvas.height = Math.floor(vHeight * dpr);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
      }
    };

    updateCanvasDPR();
    window.addEventListener('resize', updateCanvasDPR);
    return () => window.removeEventListener('resize', updateCanvasDPR);
  }, []);

  // Main 60FPS animation loop with fixed physics timestep
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const FIXED_DT = 1 / 60; // 60 FPS deterministic physics

    const loop = (currentTime: number) => {
      let frameTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Cap maximum frame time to prevent spiraling after tab switch
      if (frameTime > 0.08) frameTime = 0.08;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const renderer = rendererRef.current;

      if (canvas && ctx && renderer) {
        gameTimeRef.current += frameTime;

        // Smooth screen shake decay
        let shakeOffsetX = 0;
        let shakeOffsetY = 0;
        if (settings.screenShakeEnabled && shakeTimerRef.current > 0) {
          shakeTimerRef.current -= frameTime;
          const mag = shakeTimerRef.current * 12;
          shakeOffsetX = (Math.random() - 0.5) * mag;
          shakeOffsetY = (Math.random() - 0.5) * mag;
        }

        if (gameState === 'idle') {
          // Idle floating bird animation - centered gracefully in the upper sky above the title
          const bird = birdRef.current;
          bird.y = 195 + Math.sin(gameTimeRef.current * 3.2) * 8;
          bird.rotation = Math.sin(gameTimeRef.current * 3.2) * 0.08;
          bird.wingPhase += 7 * frameTime;
          bird.squish += (1 - bird.squish) * (frameTime * 6);

          renderer.render(
            ctx,
            bird,
            [],
            particlesRef.current,
            floatingTextsRef.current,
            settings.themeId,
            settings.skinId,
            gameTimeRef.current * 35,
            gameTimeRef.current,
            0,
            0
          );
        } else if (gameState === 'countdown') {
          // Countdown mode: bird hovers in position, obstacles rendered static in starting spots
          const bird = birdRef.current;
          bird.y = 280 + Math.sin(gameTimeRef.current * 3.5) * 8;
          bird.rotation = Math.sin(gameTimeRef.current * 3.5) * 0.06;
          bird.wingPhase += 10 * frameTime;
          bird.squish += (1 - bird.squish) * (frameTime * 6);

          renderer.render(
            ctx,
            bird,
            obstaclesRef.current,
            particlesRef.current,
            floatingTextsRef.current,
            settings.themeId,
            settings.skinId,
            0,
            gameTimeRef.current,
            0,
            0
          );
        } else if (gameState === 'playing') {
          // Fixed timestep accumulator for perfectly smooth, non-glitchy physics
          physicsAccumulatorRef.current += frameTime;

          while (physicsAccumulatorRef.current >= FIXED_DT) {
            distanceTraveledRef.current += GAME_CONSTANTS.SCROLL_SPEED_BASE * FIXED_DT;

            const result = updatePhysics(
              birdRef.current,
              obstaclesRef.current,
              particlesRef.current,
              floatingTextsRef.current,
              FIXED_DT,
              settings.mode,
              settings.skinId,
              gameTimeRef.current
            );

            if (result.shakeTime > 0) {
              shakeTimerRef.current = result.shakeTime;
            }

            // Score and gem gains
            if (result.scoreGained > 0 || result.gemsGained > 0) {
              onUpdateStats((prev) => {
                const newScore = prev.score + result.scoreGained;
                const newBest = Math.max(prev.bestScore, newScore);
                return {
                  ...prev,
                  score: newScore,
                  bestScore: newBest,
                  gemsCount: prev.gemsCount + result.gemsGained,
                  totalGems: prev.totalGems + result.gemsGained,
                };
              });
            }

            // Handle collision game over
            if (result.isGameOver) {
              gameOverDelayRef.current = Date.now();
              onStateChange('gameover');
              break;
            }

            physicsAccumulatorRef.current -= FIXED_DT;
          }

          // Render playing frame
          renderer.render(
            ctx,
            birdRef.current,
            obstaclesRef.current,
            particlesRef.current,
            floatingTextsRef.current,
            settings.themeId,
            settings.skinId,
            distanceTraveledRef.current,
            gameTimeRef.current,
            shakeOffsetX,
            shakeOffsetY
          );
        } else if (gameState === 'paused' || gameState === 'gameover') {
          // Render frozen post-crash or paused frame
          renderer.render(
            ctx,
            birdRef.current,
            obstaclesRef.current,
            particlesRef.current,
            floatingTextsRef.current,
            settings.themeId,
            settings.skinId,
            distanceTraveledRef.current,
            gameTimeRef.current,
            shakeOffsetX,
            shakeOffsetY
          );
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, onStateChange, onUpdateStats, settings]);

  return (
    <div
      ref={containerRef}
      id="game-viewport-container"
      onPointerDown={(e) => {
        // Prevent unwanted text selection or context menus
        e.preventDefault();
        handleFlap();
      }}
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none cursor-pointer bg-transparent touch-none"
    >
      <canvas
        ref={canvasRef}
        id="game-canvas"
        className="w-full h-full object-cover sm:max-w-[480px] sm:max-h-[820px] sm:aspect-[440/720] sm:object-contain sm:rounded-2xl sm:border sm:border-slate-800/60 shadow-2xl shadow-indigo-950/60"
      />
    </div>
  );
};
