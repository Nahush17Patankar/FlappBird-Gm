import React from 'react';
import { X, User, Briefcase, GraduationCap, Mail, Sparkles, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="about-modal-overlay"
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="about-dialog"
        className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col gap-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">About Me</h2>
          </div>
          <button
            id="btn-close-about"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story / Intro */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Nahush Patankar</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Made by <strong className="text-white font-semibold">Nahush Patankar</strong>, an crazy idiotic person who just vibe coded a game in 2 hrs! 🚀
          </p>
        </div>

        {/* Details List */}
        <div className="flex flex-col gap-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Experience</span>
              <span className="text-slate-200 font-medium">Works at Cognizant</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Education</span>
              <span className="text-slate-200 font-medium">Studied at VIT Vellore</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <Mail className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Contact & Connect</span>
              <a
                href="mailto:nahushpatankar17@gmail.com"
                className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium break-all"
              >
                nahushpatankar17@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Close Action */}
        <button
          id="btn-close-about-action"
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wide transition-all cursor-pointer shadow-md shadow-cyan-500/20"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
