import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ onResume, onRestart }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        <h3 className="text-2xl font-extrabold text-white font-korean-title mb-6">
          잠시 멈춤
        </h3>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onResume}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-md font-korean-title cursor-pointer active:scale-95"
          >
            <Play size={18} />
            <span>계속하기 (Esc)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all border border-slate-700 font-korean-title cursor-pointer active:scale-95"
          >
            <RotateCcw size={18} />
            <span>처음부터 다시</span>
          </button>
        </div>
      </div>
    </div>
  );
};
