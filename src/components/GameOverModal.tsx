import React from 'react';
import { RotateCcw, Trophy, Sparkles, Gem, Award, Palette } from 'lucide-react';
import { MEDALS } from '../constants';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  gemsCount: number;
  isNewBest: boolean;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  gemsCount,
  isNewBest,
  onRestart,
  onOpenSettings,
}) => {
  // Determine medal
  const medal = MEDALS.find((m) => score >= m.threshold) || MEDALS[MEDALS.length - 1];

  return (
    <div
      id="game-over-overlay"
      className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-30 animate-in fade-in duration-200"
    >
      <div
        id="game-over-card"
        className="w-full max-w-sm bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-indigo-950/95 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl shadow-indigo-950/60 text-center flex flex-col items-center gap-4"
      >
        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-300 to-cyan-400">
            Odyssey Ended
          </h2>
          <p className="text-xs text-slate-400 font-medium">The crystalline winds claimed your flight</p>
        </div>

        {/* Score Board */}
        <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
          {/* Main Score vs Best */}
          <div className="grid grid-cols-2 gap-2 text-center divide-x divide-slate-800/80">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Score</span>
              <span className="text-3xl font-black text-white">{score}</span>
            </div>

            <div className="flex flex-col items-center relative">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                Best
              </span>
              <span className="text-3xl font-black text-amber-300">{bestScore}</span>
              {isNewBest && score > 0 && (
                <span className="absolute -top-2 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider animate-bounce">
                  New!
                </span>
              )}
            </div>
          </div>

          {/* Gems and Medal Row */}
          <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Gem className="w-4 h-4 text-amber-400" />
              <span>{gemsCount} Starlight Gems</span>
            </div>

            <div className="flex items-center gap-1.5" style={{ color: medal.color }}>
              <Award className="w-4 h-4" />
              <span className="font-bold">{medal.name}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <button
            id="btn-play-again"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Fly Again (3s Timer)</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/20 rounded">
              Space
            </kbd>
          </button>

          <button
            id="btn-gameover-customize"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white font-medium text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>Switch Realm & Character</span>
          </button>
        </div>
      </div>
    </div>
  );
};
