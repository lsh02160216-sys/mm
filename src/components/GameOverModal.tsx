import React from 'react';
import { GameStats } from '../types/game';
import { Skull, Clock, RotateCcw, Lightbulb } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart }) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-red-900/60 rounded-3xl p-6 md:p-8 shadow-2xl shadow-red-950/50 text-center flex flex-col items-center">
        {/* Ghost Icon */}
        <div className="w-20 h-20 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-4xl mb-3 shadow-lg shadow-purple-900/40 animate-pulse">
          👻
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-bold mb-2">
          <Skull size={14} />
          <span>기운 소진</span>
        </div>

        <h2 className="text-3xl font-extrabold text-white font-korean-title mb-2">
          걸신들에게 잡혔습니다!
        </h2>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          한옥마을 골목길을 배회하던 걸신들에게 기운을 모두 빼앗겼습니다.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
            <span className="text-xl mb-0.5">🍎</span>
            <span className="text-[11px] text-slate-400 font-korean-title">모은 사과</span>
            <span className="font-mono tabular-nums text-base font-bold text-amber-400">
              {stats.applesCollected} / {stats.targetApples}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
            <Clock size={18} className="text-sky-400 mb-1" />
            <span className="text-[11px] text-slate-400 font-korean-title">생존 시간</span>
            <span className="font-mono tabular-nums text-base font-bold text-slate-200">
              {formatTime(stats.elapsedTime)}
            </span>
          </div>
        </div>

        {/* Strategy Tip */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left mb-6 w-full">
          <Lightbulb size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-400">전략 팁:</strong> 마을 곳곳의{' '}
            <span className="text-red-400 font-bold">홍고추</span>를 먹으면 매워서 걸신보다 훨씬 빠르게 질주할 수 있습니다!
          </p>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-red-600/30 transition-all font-korean-title cursor-pointer active:scale-95"
        >
          <RotateCcw size={18} />
          <span>다시 도전하기</span>
        </button>
      </div>
    </div>
  );
};
