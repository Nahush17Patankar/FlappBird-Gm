import React from 'react';
import { Play, Info } from 'lucide-react';
import { BIRD_SKINS } from '../constants';
import { GameMode, ThemeId, BirdSkinId } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

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
  onOpenAbout: () => void;
}

export const StartScreenOverlay: React.FC<StartScreenOverlayProps> = ({
  currentSkin,
  onSelectSkin,
  onStartGame,
  onOpenAbout,
}) => {
  return (
    <div
      id="start-screen-overlay"
      className="absolute inset-0 flex flex-col items-center justify-between p-4 sm:p-5 pt-16 sm:pt-16 z-20 pointer-events-none select-none"
    >
      {/* Top Header: Flappy Bird name and Start Flight button placed at the top (comfortable medium size on mobile) */}
      <div className="w-full flex flex-col items-center gap-3 text-center pointer-events-auto mt-1 sm:mt-2">
        <h1
          id="game-main-title"
          className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-300 drop-shadow-[0_2px_12px_rgba(6,182,212,0.6)]"
        >
          Flappy Bird
        </h1>

        <button
          id="btn-main-start"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStartGame();
          }}
          className="group relative px-6 py-2.5 sm:px-7 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-cyan-500/35 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer border border-cyan-300/50"
        >
          <Play className="w-4 h-4 fill-white shrink-0" />
          <span>Start Flight</span>
        </button>

        <p className="text-xs text-slate-300/90 font-medium drop-shadow-md">
          Tap anywhere or press Space to flap
        </p>
      </div>

      {/* Middle: Clean open space showcasing the animated bird and crystal background */}
      <div className="flex-1" />

      {/* Bottom Bar: Astral & Cyber skins + About Me button + PWA Install */}
      <div className="w-full flex items-center justify-between pointer-events-auto gap-2">
        {/* Skin Selection: Astral and Cyber only */}
        <div className="flex items-center gap-1.5 bg-slate-950/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800/80 shadow-md">
          {[
            { id: 'astral', label: 'Astral', color: BIRD_SKINS.astral?.primaryColor || '#38bdf8' },
            { id: 'cyber_falcon', label: 'Cyber', color: BIRD_SKINS.cyber_falcon?.primaryColor || '#06b6d4' },
          ].map((skin) => (
            <button
              key={skin.id}
              type="button"
              onClick={() => onSelectSkin(skin.id as BirdSkinId)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all flex items-center gap-1.5 ${
                currentSkin === skin.id
                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-sm'
                  : 'border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: skin.color }}
              />
              <span>{skin.label}</span>
            </button>
          ))}
        </div>

        {/* Right side: About Me & Install */}
        <div className="flex items-center gap-2">
          <button
            id="btn-open-about"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAbout();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-[11px] font-medium text-slate-300 hover:text-cyan-300 transition-colors shadow-sm cursor-pointer"
            title="About Nahush Patankar"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>About Me</span>
          </button>

          <PWAInstallButton variant="compact" />
        </div>
      </div>
    </div>
  );
};

