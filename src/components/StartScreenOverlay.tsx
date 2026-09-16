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
  currentTheme,
  currentSkin,
  onSelectTheme,
  onSelectSkin,
  onStartGame,
  onOpenAbout,
}) => {
  const isAstral = currentTheme === 'celestial' || currentSkin === 'astral';
  const isCyber = currentTheme === 'cyber' || currentSkin === 'cyber_falcon';

  const handleSelectAstral = () => {
    onSelectTheme('celestial');
    onSelectSkin('astral');
  };

  const handleSelectCyber = () => {
    onSelectTheme('cyber');
    onSelectSkin('cyber_falcon');
  };

  return (
    <div
      id="start-screen-overlay"
      className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 z-20 pointer-events-none select-none"
    >
      {/* Top clearance for top HUD icons */}
      <div className="h-12 sm:h-14 shrink-0" />

      {/* Center Region: Main Game Menu (Vertical Center Region on mobile) */}
      <div
        id="start-screen-center-menu"
        className="flex-1 flex flex-col items-center justify-center pointer-events-auto text-center px-4 max-w-sm mx-auto w-full my-auto"
      >
        {/* FLAPPY BIRD Title - Medium-sized prominent heading with glowing cyan gradient */}
        <h1
          id="game-main-title"
          className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-300 drop-shadow-[0_2px_16px_rgba(6,182,212,0.65)] mb-[clamp(1rem,2.8vh,2rem)]"
        >
          Flappy Bird
        </h1>

        {/* START FLIGHT Button - Sits naturally below the title with responsive spacing and comfortable touchscreen target */}
        <button
          id="btn-main-start"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStartGame();
          }}
          className="group relative w-full max-w-[220px] min-h-[48px] px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-base tracking-wide shadow-xl shadow-cyan-500/35 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-cyan-300/50 mb-[clamp(0.85rem,2.2vh,1.5rem)]"
        >
          <Play className="w-5 h-5 fill-white shrink-0" />
          <span>Start Flight</span>
        </button>

        {/* Theme Options: [ ASTRAL ] [ CYBER ] - Placed directly under START FLIGHT button, centered horizontally */}
        <div
          id="theme-quick-options"
          className="flex items-center justify-center gap-3 w-full max-w-[260px] mb-[clamp(0.75rem,1.8vh,1.25rem)]"
        >
          {/* Astral Option */}
          <button
            id="btn-option-astral"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectAstral();
            }}
            className={`flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md backdrop-blur-md ${
              isAstral
                ? 'border-cyan-400 bg-cyan-950/85 text-cyan-200 shadow-cyan-950/60 ring-2 ring-cyan-400/50'
                : 'border-slate-800/90 bg-slate-950/80 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: BIRD_SKINS.astral?.primaryColor || '#38bdf8' }}
            />
            <span>Astral</span>
          </button>

          {/* Cyber Option */}
          <button
            id="btn-option-cyber"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectCyber();
            }}
            className={`flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md backdrop-blur-md ${
              isCyber
                ? 'border-rose-400 bg-rose-950/85 text-rose-200 shadow-rose-950/60 ring-2 ring-rose-400/50'
                : 'border-slate-800/90 bg-slate-950/80 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: BIRD_SKINS.cyber_falcon?.primaryColor || '#06b6d4' }}
            />
            <span>Cyber</span>
          </button>
        </div>

        <p className="text-xs text-slate-300/85 font-medium drop-shadow-md">
          Tap anywhere or press Space to flap
        </p>
      </div>

      {/* Bottom Bar: About Me button + PWA Install */}
      <div className="w-full flex items-center justify-between pointer-events-auto gap-2 pt-2 shrink-0">
        <button
          id="btn-open-about"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenAbout();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors shadow-sm cursor-pointer"
          title="About Nahush Patankar"
        >
          <Info className="w-4 h-4 text-cyan-400" />
          <span>About Me</span>
        </button>

        <PWAInstallButton variant="compact" />
      </div>
    </div>
  );
};

