import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, Smartphone, X, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGeneralGuide, setShowGeneralGuide] = useState(false);

  // If already installed, hide the button completely
  if (isInstalled) {
    return null;
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowGeneralGuide(true);
    }
  };

  return (
    <>
      <button
        id="btn-pwa-install"
        type="button"
        onClick={handleClick}
        className={`group relative flex items-center justify-center gap-2 rounded-xl font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg ${
          variant === 'full'
            ? 'w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm shadow-cyan-500/25 border border-cyan-400/40'
            : 'px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800/90 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs shadow-cyan-950/40 backdrop-blur-md'
        } ${className}`}
        title="Install Flappy Bird as a native app on your phone or PC"
      >
        <Download className={`${variant === 'full' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-cyan-400 group-hover:animate-bounce`} />
        <span>Install Game</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div
          id="modal-pwa-ios"
          onClick={(e) => {
            e.stopPropagation();
            setShowIOSGuide(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100 flex flex-col gap-4 relative"
          >
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                <p className="text-xs text-slate-400">Play in full-screen anytime</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 py-2 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <Share className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Step 1:</strong> Tap the <strong className="text-cyan-300">Share</strong> icon at the bottom of Safari.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Step 2:</strong> Scroll down and select <strong className="text-cyan-300">Add to Home Screen</strong>.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Browser Guide Modal (when beforeinstallprompt hasn't fired or in iframe) */}
      {showGeneralGuide && (
        <div
          id="modal-pwa-general"
          onClick={(e) => {
            e.stopPropagation();
            setShowGeneralGuide(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100 flex flex-col gap-4 relative"
          >
            <button
              type="button"
              onClick={() => setShowGeneralGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Install Flappy Bird</h3>
                <p className="text-xs text-slate-400">Desktop & Mobile App</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To install directly to your device desktop or home screen:
            </p>

            <div className="flex flex-col gap-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
                <span className="font-semibold text-cyan-300">Chrome / Edge / Brave:</span>
                <span>Click the <strong>Install</strong> icon in the right side of the URL address bar, or click <strong>⋮ (Menu) &gt; Save and share &gt; Install page as app</strong>.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
                <span className="font-semibold text-cyan-300">Android Phone:</span>
                <span>Tap <strong>⋮ &gt; Install App</strong> or <strong>Add to Home screen</strong>.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGeneralGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
