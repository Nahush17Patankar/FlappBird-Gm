import React from 'react';
import { Play, Sparkles, Trophy, Shield, Flame, Compass } from 'lucide-react';
import { THEMES, BIRD_SKINS } from '../constants';
import { GameMode, ThemeId, BirdSkinId } from '../types';

interface StartScreenOverlayProps {
  bestScore: number;
  totalGems: number;
  currentMode: GameMode;
  currentTheme: ThemeId;
  currentSkin: BirdSkinId;
  onSelectMode: (mode: GameMode) => void;
  onSelectTheme: (theme: ThemeId) => void;
  onSelectSkin: (skin: BirdSkinId) => void;
  onStartGame: () => void;
}

export const StartScreenOverlay: React.FC<StartScreenOverlayProps> = ({
  bestScore,
  totalGems,
  currentMode,
  currentTheme,
  currentSkin,
  onSelectMode,
  onSelectTheme,
  onSelectSkin,
  onStartGame,
}) => {
  return (
    <div
      id="start-screen-overlay"
      className="absolute inset-0 flex flex-col items-center justify-between p-6 z-20 pointer-events-none select-none"
    >
      {/* Top Banner / Best Score */}
      <div className="w-full flex justify-between items-center pointer-events-auto">
        <div
          id="badge-best-score"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-xs font-semibold text-slate-300 shadow-md"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>High Score: <strong className="text-white">{bestScore}</strong></span>
        </div>

        {totalGems > 0 && (
          <div
            id="badge-total-gems"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 backdrop-blur-md text-xs font-semibold text-amber-300 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalGems} Gems</span>
          </div>
        )}
      </div>

      {/* Middle: Title & Tap to Start Call-to-Action */}
      <div className="flex flex-col items-center gap-4 text-center my-auto pointer-events-auto">
        {/* Title */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              Arcade Evolution
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          <h1
            id="game-main-title"
            className="text-4xl sm:text-5xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_4px_24px_rgba(6,182,212,0.6)]"
          >
            Flappy Bird
          </h1>
          <p className="text-sm font-medium text-slate-300 mt-1 max-w-[280px]">
            Navigate ethereal crystal spires and collect celestial starlight
          </p>
        </div>

        {/* Big Start Button */}
        <button
          id="btn-main-start"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStartGame();
          }}
          className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-base tracking-wide shadow-xl shadow-cyan-500/30 active:scale-95 transition-all flex items-center gap-3 cursor-pointer border border-cyan-400/40"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>START FLIGHT</span>
        </button>

        {/* Tap instruction */}
        <p className="text-xs text-slate-400 animate-pulse font-medium">
          Tap anywhere or press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono">Space</kbd> to flap
        </p>
      </div>

      {/* Bottom: Quick Selectors (Realm & Skin & Mode) */}
      <div className="w-full max-w-sm flex flex-col gap-3 pointer-events-auto bg-slate-950/75 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/80 shadow-2xl">
        {/* Game Mode Switcher */}
        <div className="flex items-center justify-between gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onSelectMode('classic')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentMode === 'classic'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Classic
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('zen')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              currentMode === 'zen'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3 h-3" />
            Zen Mode
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('hardcore')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              currentMode === 'hardcore'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3" />
            Hardcore
          </button>
        </div>

        {/* Quick Realm / Theme Selector */}
        <div className="flex items-center justify-between gap-1.5">
          {Object.values(THEMES).map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all truncate text-center ${
                currentTheme === theme.id
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                  : 'border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {theme.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Quick Bird Skin Selector */}
        <div className="flex items-center justify-between gap-1.5">
          {Object.values(BIRD_SKINS).map((skin) => (
            <button
              key={skin.id}
              type="button"
              onClick={() => onSelectSkin(skin.id)}
              className={`flex-1 py-1 px-1 rounded-xl text-[10px] font-medium border transition-all flex items-center justify-center gap-1 ${
                currentSkin === skin.id
                  ? 'border-purple-400 bg-purple-950/60 text-purple-200'
                  : 'border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: skin.primaryColor }}
              />
              <span className="truncate">{skin.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
