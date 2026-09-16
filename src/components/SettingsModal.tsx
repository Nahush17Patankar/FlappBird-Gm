import React from 'react';
import { X, Volume2, Music, Shield, Sparkles, Flame, Check, Trash2, Download } from 'lucide-react';
import { THEMES, BIRD_SKINS } from '../constants';
import { GameMode, ThemeId, BirdSkinId, GameSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsModalProps {
  settings: GameSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetScore: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
  onResetScore,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-40 animate-in fade-in duration-150"
    >
      <div
        id="settings-dialog"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col gap-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Customization & Settings</h2>
          </div>
          <button
            id="btn-close-settings"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Visual Realms (Themes) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Realm & Unique Visuals
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(THEMES).map((theme) => {
              const isSelected = settings.themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onUpdateSettings({ themeId: theme.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/40 shadow-md shadow-cyan-950/50'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Visual Realm Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 relative">
                      <img
                        src={theme.bgImage}
                        alt={theme.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        {theme.name}
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                      </span>
                      <span className="text-[11px] text-slate-400 line-clamp-1">{theme.description}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Bird Characters (Skins) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Bird Character & Particles
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(BIRD_SKINS).map((skin) => {
              const isSelected = settings.skinId === skin.id;
              return (
                <button
                  key={skin.id}
                  type="button"
                  onClick={() => onUpdateSettings({ skinId: skin.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/40 shadow-md shadow-purple-950/40'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: skin.primaryColor }}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: skin.secondaryColor }}
                      />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                  </div>
                  <span className="text-xs font-bold text-white">{skin.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{skin.subtitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Game Mode */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Flight Difficulty Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'classic', label: 'Classic', desc: 'Standard Flappy challenge' },
              { id: 'zen', label: 'Zen Mode', desc: 'Shield deflect, no sudden death' },
              { id: 'hardcore', label: 'Hardcore', desc: 'Faster speed & moving pillars' },
            ].map((m) => {
              const isSelected = settings.mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onUpdateSettings({ mode: m.id as GameMode })}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/60 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold block">{m.label}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Audio & FX */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Audio & FX</label>

          <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-slate-950/50">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium">Sound Effects (Synthesizer)</span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-slate-950/50">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium">Ambient Atmospheric Drone</span>
            </div>
            <input
              type="checkbox"
              checked={settings.ambientMusicEnabled}
              onChange={(e) => onUpdateSettings({ ambientMusicEnabled: e.target.checked })}
              className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* 5. Install App as PWA */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Install App</label>
          <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Download className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Install to your home screen or desktop for full-screen offline gameplay.</span>
            </div>
            <PWAInstallButton variant="full" />
          </div>
        </div>

        {/* Reset High Score */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
          <button
            type="button"
            onClick={onResetScore}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2 rounded hover:bg-rose-950/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset High Score</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition-all cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
