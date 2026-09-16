import React from 'react';
import { Sparkles } from 'lucide-react';

interface CountdownOverlayProps {
  countdownValue: number; // 3, 2, 1, or 0 (which means GO/FLY)
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ countdownValue }) => {
  const isGo = countdownValue <= 0;
  const displayText = isGo ? 'FLY!' : countdownValue.toString();

  return (
    <div
      id="countdown-overlay"
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 select-none bg-slate-950/40 backdrop-blur-[2px]"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Expanding ambient ring */}
        <div
          key={countdownValue}
          className="absolute w-36 h-36 rounded-full border-2 border-cyan-400/60 animate-ping"
          style={{ animationDuration: '0.85s', animationIterationCount: 1 }}
        />

        {/* Glow backdrop disc */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-b from-slate-900/90 to-indigo-950/90 border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center backdrop-blur-md">
          {/* Animated Countdown Text */}
          <span
            key={`text-${countdownValue}`}
            className={`font-black tracking-wider drop-shadow-[0_2px_12px_rgba(6,182,212,0.8)] animate-in zoom-in-50 duration-200 ${
              isGo
                ? 'text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'
                : 'text-5xl text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400'
            }`}
          >
            {displayText}
          </span>
        </div>

        {/* Subtext info */}
        <div className="mt-4 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-semibold text-slate-300 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{isGo ? 'Soar through the spires!' : 'Get ready to flap...'}</span>
        </div>
      </div>
    </div>
  );
};
