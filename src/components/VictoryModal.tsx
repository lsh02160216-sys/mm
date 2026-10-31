import React from 'react';
import { GameStats } from '../types/game';
import { Trophy, Clock, Heart, Flame, RotateCcw } from 'lucide-react';

interface VictoryModalProps {
  stats: GameStats;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ stats, onRestart }) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine Title / Rank based on performance
  let rankTitle = '한옥마을의 구원자';
  if (stats.lives === 3 && stats.elapsedTime < 60) {
    rankTitle = '전설의 신령 도령';
  } else if (stats.lives === 3) {
    rankTitle = '무결점 퇴마사';
  } else if (stats.peppersEaten >= 3) {
    rankTitle = '불타는 고추 질주왕';
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 md:p-8 shadow-2xl shadow-amber-500/20 text-center flex flex-col items-center">
        {/* Dokkaebi Red Ghost Portrait */}
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-400/30 mb-4">
          <img
            src="/src/assets/images/korean_dokebi_red_spirit_1792928712236.jpg"
            alt="붉은 귀신"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Victory Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2">
          <Trophy size={14} className="text-amber-400" />
          <span>성불 의식 대성공 · {rankTitle}</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white font-korean-title mb-2 drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]">
          한옥마을을 구원하셨습니다!
        </h2>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed max-w-md">
          사과 5개를 건네받은 <span className="text-red-400 font-semibold">붉은 귀신</span>이
          마을의 모든 걸신들을 잠재우고 평화를 되찾아 주었습니다.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          {/* Time */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
            <Clock size={16} className="text-sky-400 mb-1" />
            <span className="text-[11px] text-slate-400 font-korean-title">클리어 시간</span>
            <span className="font-mono tabular-nums text-base font-bold text-slate-100">
              {formatTime(stats.elapsedTime)}
            </span>
          </div>

          {/* Remaining Lives */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
            <Heart size={16} className="text-red-400 fill-red-400 mb-1" />
            <span className="text-[11px] text-slate-400 font-korean-title">남은 생명력</span>
            <span className="font-mono tabular-nums text-base font-bold text-red-400">
              {stats.lives} / 3
            </span>
          </div>

          {/* Peppers Eaten */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
            <Flame size={16} className="text-orange-400 fill-orange-400 mb-1" />
            <span className="text-[11px] text-slate-400 font-korean-title">홍고추 섭취</span>
            <span className="font-mono tabular-nums text-base font-bold text-orange-400">
              {stats.peppersEaten}개
            </span>
          </div>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-orange-500/30 transition-all font-korean-title cursor-pointer active:scale-95"
        >
          <RotateCcw size={18} />
          <span>다시 플레이하기</span>
        </button>
      </div>
    </div>
  );
};
