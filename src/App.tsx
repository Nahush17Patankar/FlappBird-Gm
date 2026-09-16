import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { StartScreenOverlay } from './components/StartScreenOverlay';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { CountdownOverlay } from './components/CountdownOverlay';
import { GameMode, GameSettings, GameState, GameStats, ThemeId, BirdSkinId } from './types';
import { sound } from './audio';
import { Play } from 'lucide-react';

const SETTINGS_STORAGE_KEY = 'flappy_odyssey_settings_v1';
const STATS_STORAGE_KEY = 'flappy_odyssey_stats_v1';

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'classic',
  themeId: 'celestial',
  skinId: 'astral',
  soundEnabled: true,
  ambientMusicEnabled: false,
  screenShakeEnabled: true,
};

const DEFAULT_STATS: GameStats = {
  score: 0,
  bestScore: 0,
  gemsCount: 0,
  totalGems: 0,
  gamesPlayed: 0,
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [countdownValue, setCountdownValue] = useState<number>(3);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const countdownTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Settings State with localStorage persistence
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore local storage error
    }
    return DEFAULT_SETTINGS;
  });

  // Stats State with localStorage persistence
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore local storage error
    }
    return DEFAULT_STATS;
  });

  // Clear running countdown timers
  const clearCountdownTimers = useCallback(() => {
    countdownTimeoutsRef.current.forEach((t) => clearTimeout(t));
    countdownTimeoutsRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearCountdownTimers();
  }, [clearCountdownTimers]);

  // Start 3-second countdown before game starts or restarts
  const handleStartCountdown = useCallback(() => {
    clearCountdownTimers();
    setCountdownValue(3);
    setGameState('countdown');
    sound.playCountdownTick(false);

    // 2 seconds remaining
    const t1 = setTimeout(() => {
      setCountdownValue(2);
      sound.playCountdownTick(false);
    }, 1000);

    // 1 second remaining
    const t2 = setTimeout(() => {
      setCountdownValue(1);
      sound.playCountdownTick(false);
    }, 2000);

    // 0: GO / FLY!
    const t3 = setTimeout(() => {
      setCountdownValue(0);
      sound.playCountdownTick(true);
    }, 3000);

    // Launch into active flight
    const t4 = setTimeout(() => {
      setGameState('playing');
    }, 3600);

    countdownTimeoutsRef.current = [t1, t2, t3, t4];
  }, [clearCountdownTimers]);

  // Save settings when changed
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Safe fallback
    }
  }, [settings]);

  // Save stats when changed
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Safe fallback
    }
  }, [stats]);

  const handleUpdateSettings = (newPartial: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  const handleResetScore = () => {
    if (window.confirm('Reset your high score and collected gems?')) {
      setStats((prev) => ({
        ...prev,
        score: 0,
        bestScore: 0,
        gemsCount: 0,
        totalGems: 0,
      }));
      setIsSettingsOpen(false);
    }
  };

  const isNewBestScore = stats.score >= stats.bestScore && stats.score > 0;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center font-sans antialiased text-slate-100">
      {/* Outer ambient gradient glow */}
      <div className="absolute inset-0 bg-radial from-slate-900/60 via-slate-950/90 to-slate-950 pointer-events-none" />

      {/* Main Game Card Shell */}
      <div className="relative w-full h-full max-w-[480px] max-h-[800px] sm:h-[94vh] sm:rounded-3xl sm:border sm:border-slate-800/80 shadow-2xl shadow-indigo-950/50 flex flex-col items-center justify-center overflow-hidden bg-slate-950">
        {/* Game Canvas Container */}
        <GameCanvas
          gameState={gameState}
          settings={settings}
          stats={stats}
          onStateChange={setGameState}
          onUpdateStats={setStats}
          onStartCountdown={handleStartCountdown}
        />

        {/* HUD Overlay (Score, Sound, Pause, Settings) */}
        <GameHUD
          score={stats.score}
          gemsCount={stats.gemsCount}
          gameState={gameState}
          gameMode={settings.mode}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          onTogglePause={() => {
            if (gameState === 'playing') {
              setGameState('paused');
            } else if (gameState === 'paused') {
              setGameState('playing');
            }
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Countdown 3-Second Overlay */}
        {gameState === 'countdown' && (
          <CountdownOverlay countdownValue={countdownValue} />
        )}

        {/* Start Screen Overlay */}
        {gameState === 'idle' && (
          <StartScreenOverlay
            bestScore={stats.bestScore}
            totalGems={stats.totalGems}
            currentMode={settings.mode}
            currentTheme={settings.themeId}
            currentSkin={settings.skinId}
            onSelectMode={(mode: GameMode) => handleUpdateSettings({ mode })}
            onSelectTheme={(themeId: ThemeId) => handleUpdateSettings({ themeId })}
            onSelectSkin={(skinId: BirdSkinId) => handleUpdateSettings({ skinId })}
            onStartGame={handleStartCountdown}
          />
        )}

        {/* Game Over Modal */}
        {gameState === 'gameover' && (
          <GameOverModal
            score={stats.score}
            bestScore={stats.bestScore}
            gemsCount={stats.gemsCount}
            isNewBest={isNewBestScore}
            onRestart={handleStartCountdown}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Paused Overlay */}
        {gameState === 'paused' && (
          <div
            id="paused-overlay"
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-30"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-2xl font-black uppercase tracking-wider text-cyan-400">
                Flight Suspended
              </span>
              <p className="text-xs text-slate-300">Press P or tap resume to continue</p>
              <button
                id="btn-resume-game"
                type="button"
                onClick={() => setGameState('playing')}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Resume</span>
              </button>
            </div>
          </div>
        )}

        {/* Settings & Customization Modal */}
        <SettingsModal
          settings={settings}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={handleUpdateSettings}
          onResetScore={handleResetScore}
        />
      </div>
    </main>
  );
}
