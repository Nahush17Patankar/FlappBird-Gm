import React from 'react';
import { Volume2, VolumeX, Pause, Play, Settings as SettingsIcon, Gem, Sparkles } from 'lucide-react';
import { GameMode, GameState } from '../types';

interface GameHUDProps {
  score: number;
  gemsCount: number;
  gameState: GameState;
  gameMode: GameMode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onOpenSettings: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  gemsCount,
  gameState,
  gameMode,
  soundEnabled,
  onToggleSound,
  onTogglePause,
  onOpenSettings,
}) => {
  return (
    <div className="absolute inset-x-0 top-0 p-4 pointer-events-none flex justify-between items-start select-none z-20">
      {/* Top Left: Gems & Mode (shown during active gameplay or pause) */}
      <div className="flex flex-col gap-1.5 pointer-events-auto">
        {/* Gems Pill */}
        {gameState !== 'idle' && (
          <div
            id="hud-gems-counter"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 border border-amber-500/40 backdrop-blur-md shadow-lg shadow-amber-950/20 text-amber-300 text-xs font-semibold tracking-wide"
          >
            <Gem className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30 animate-pulse" />
            <span>{gemsCount}</span>
          </div>
        )}

        {/* Mode Tag */}
        {gameState !== 'idle' && gameMode !== 'classic' && (
          <div
            id="hud-gamemode-tag"
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border ${
              gameMode === 'zen'
                ? 'bg-purple-900/60 border-purple-400/40 text-purple-200'
                : 'bg-rose-900/60 border-rose-400/40 text-rose-200'
            }`}
          >
            {gameMode === 'zen' ? 'Zen Mode' : 'Hardcore'}
          </div>
        )}
      </div>

      {/* Top Center: Main Score (Prominent during active game, hidden when idle) */}
      <div className="flex flex-col items-center pointer-events-none">
        {gameState !== 'idle' && (
          <span
            id="hud-main-score"
            className="text-4xl sm:text-5xl font-black text-white drop-shadow-[0_4px_16px_rgba(56,189,248,0.6)] tracking-tight"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(56,189,248,0.5)' }}
          >
            {score}
          </span>
        )}
      </div>

      {/* Top Right: Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Sound Toggle */}
        <button
          id="btn-hud-sound"
          type="button"
          onClick={onToggleSound}
          className="p-2 rounded-full bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/60 text-slate-200 backdrop-blur-md transition-all active:scale-95 shadow-md"
          title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Pause Toggle (only when playing or paused) */}
        {(gameState === 'playing' || gameState === 'paused') && (
          <button
            id="btn-hud-pause"
            type="button"
            onClick={onTogglePause}
            className="p-2 rounded-full bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/60 text-slate-200 backdrop-blur-md transition-all active:scale-95 shadow-md"
            title={gameState === 'paused' ? 'Resume Game' : 'Pause Game'}
          >
            {gameState === 'paused' ? <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>
        )}

        {/* Settings / Customize */}
        <button
          id="btn-hud-settings"
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-full bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/60 text-slate-200 backdrop-blur-md transition-all active:scale-95 shadow-md"
          title="Themes & Customization"
        >
          <SettingsIcon className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
};
