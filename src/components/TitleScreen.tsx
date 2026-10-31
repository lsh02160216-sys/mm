import React from 'react';
import { Play, Sparkles, Flame, ShieldAlert, Award } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  highScore: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 md:p-10 overflow-hidden select-none">
      {/* Background Cinematic Artwork */}
      <div className="absolute inset-0 -z-10 bg-slate-950">
        <img
          src="/src/assets/images/hanok_ghost_village_title_1792928711657.jpg"
          alt="한옥마을 달밤 전경"
          className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
        />
        {/* Deep atmospheric overlay scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      {/* Top Header / High score */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-semibold text-amber-300">한국 전통 괴담 아케이드</span>
        </div>
        {highScore > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-xs text-amber-300 font-mono tabular-nums">
            <Award size={14} className="text-amber-400" />
            <span>최고 기록: {highScore}점</span>
          </div>
        )}
      </div>

      {/* Centerpiece: Title Lockup & Lore Briefing */}
      <div className="flex flex-col items-center text-center max-w-3xl z-10 my-auto">
        {/* Bespoke Traditional Korean Title Lockup */}
        <div className="mb-2 inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-widest text-amber-400 uppercase font-korean-title">
          <span>🌕 칠흑 같은 보름달 밤의 골목길</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-korean-title mb-4 drop-shadow-[0_4px_24px_rgba(239,68,68,0.4)]">
          한옥마을 <span className="text-red-500">걸신</span> 피하기
        </h1>

        <p className="text-base md:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
          굶주린 걸신들이 배회하는 깊은 밤의 한옥마을...<br />
          마을 곳곳의 <span className="text-red-400 font-semibold">영험한 사과 5개</span>를 모아
          사당의 <span className="text-amber-400 font-semibold">붉은 귀신</span>께 바쳐 마을을 구원하세요!
        </p>

        {/* Character & Element Cards ("모든 요소들이 캐릭터처럼 생겼어") */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-8">
          {/* Player */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-2xl mb-1">🏃‍♂️</span>
            <span className="text-xs font-bold text-slate-200 font-korean-title">꼬마 도령</span>
            <span className="text-[11px] text-slate-400 mt-0.5">생명력 3개 유지</span>
          </div>

          {/* Hungry Ghost */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-2xl mb-1">👻</span>
            <span className="text-xs font-bold text-purple-300 font-korean-title">걸신 (乞神)</span>
            <span className="text-[11px] text-purple-400/80 mt-0.5">시간 따라 증식!</span>
          </div>

          {/* Red Hot Pepper */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-2xl mb-1">🌶️</span>
            <span className="text-xs font-bold text-red-400 font-korean-title">매운 홍고추</span>
            <span className="text-[11px] text-red-300/80 mt-0.5">초고속 질주 부스터</span>
          </div>

          {/* Red Ghost Shrine */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-2xl mb-1">🏮</span>
            <span className="text-xs font-bold text-amber-400 font-korean-title">붉은 귀신</span>
            <span className="text-[11px] text-amber-300/80 mt-0.5">사과 5개 바치면 승리</span>
          </div>
        </div>

        {/* Primary Start CTA Button */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg md:text-xl font-extrabold text-white bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer font-korean-title"
        >
          <Play size={22} className="fill-white group-hover:translate-x-0.5 transition-transform" />
          <span>게임 시작하기</span>
        </button>
      </div>

      {/* Control Hint Line */}
      <div className="w-full text-center z-10 text-xs text-slate-400">
        <p className="tracking-wide">
          <span className="text-slate-300 font-semibold">이동:</span> 방향키(↑↓←→) 또는 WASD ·{' '}
          <span className="text-slate-300 font-semibold">모바일:</span> 화면 터치 패드 ·{' '}
          <span className="text-slate-300 font-semibold">시작:</span> 스페이스바 / 엔터
        </p>
      </div>
    </div>
  );
};
