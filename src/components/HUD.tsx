import React from 'react';
import { GameStats } from '../types/game';
import { Heart, Flame, Ghost, Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface HUDProps {
  stats: GameStats;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isGoalReached = stats.applesCollected >= stats.targetApples;

  return (
    <div className="absolute inset-0 pointer-events-none p-4 md:p-6 flex flex-col justify-between select-none">
      {/* Top Status Bar */}
      <div className="flex items-start justify-between gap-4">
        {/* Left Cluster: Hearts & Apples */}
        <div className="flex flex-col gap-2">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-lg">
            <span className="text-xs font-semibold text-slate-300 mr-1 font-korean-title">생명력</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <Heart
                  key={i}
                  size={18}
                  className={`transition-transform duration-300 ${
                    i < stats.lives
                      ? 'text-red-500 fill-red-500 scale-100 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                      : 'text-slate-600 fill-slate-800 scale-90 opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Apples Counter */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 shadow-lg ${
              isGoalReached
                ? 'bg-amber-950/80 border-amber-500/80 shadow-amber-500/20 animate-pulse'
                : 'bg-slate-900/80 backdrop-blur-md border-slate-700/60'
            }`}
          >
            <span className="text-base select-none">🍎</span>
            <span className="text-xs font-semibold text-slate-300 font-korean-title">사과</span>
            <div className="flex items-baseline gap-1 font-mono tabular-nums text-sm font-bold">
              <span className={isGoalReached ? 'text-amber-400 text-base' : 'text-emerald-400'}>
                {stats.applesCollected}
              </span>
              <span className="text-slate-500 text-xs">/ {stats.targetApples}</span>
            </div>
            {isGoalReached && (
              <span className="text-[11px] font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-900/60 border border-amber-600/50">
                전달 가능!
              </span>
            )}
          </div>
        </div>

        {/* Center: Spicy Hot Pepper Boost Bar */}
        {stats.isSpicyActive && (
          <div className="flex flex-col items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-950/90 via-orange-950/90 to-red-950/90 rounded-2xl border border-red-500/80 shadow-lg shadow-red-500/30 animate-pulse">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-300 tracking-wide">
              <Flame size={15} className="text-orange-400 fill-orange-400 animate-bounce" />
              <span>홍고추 매운맛 폭주!</span>
              <span className="font-mono tabular-nums text-amber-300">
                {Math.ceil(stats.spicyPercent * 7.0)}s
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-32 h-1.5 bg-red-950 rounded-full overflow-hidden border border-red-800">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-100 rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, stats.spicyPercent * 100))}%` }}
              />
            </div>
          </div>
        )}

        {/* Right Cluster: Ghost Count, Timer & Sound/Pause Controls */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {/* Ghost counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-lg text-xs">
              <Ghost size={16} className="text-purple-400" />
              <span className="text-slate-300 font-korean-title">걸신</span>
              <span className="font-mono tabular-nums font-bold text-purple-300">
                {stats.ghostCount}
              </span>
            </div>

            {/* Time */}
            <div className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-lg font-mono tabular-nums text-xs font-bold text-slate-200">
              {formatTime(stats.elapsedTime)}
            </div>
          </div>

          {/* Interactive Controls (Pointer-events auto) */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={onTogglePause}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 text-slate-300 hover:text-white transition-colors shadow-lg active:scale-95"
              title={isPaused ? '계속하기' : '일시정지'}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 text-slate-300 hover:text-white transition-colors shadow-lg active:scale-95"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Goal Notification Toast when 5 apples collected */}
      {isGoalReached && (
        <div className="self-center mb-6 px-5 py-2.5 bg-amber-950/90 border-2 border-amber-400 rounded-2xl shadow-xl shadow-amber-500/30 flex items-center gap-3 animate-bounce">
          <span className="text-2xl animate-spin">🏮</span>
          <div className="text-center">
            <p className="text-xs font-bold text-amber-300 font-korean-title">
              사과 5개를 모두 모았습니다!
            </p>
            <p className="text-[11px] text-amber-100">
              북쪽 사당에 계신 <span className="text-red-400 font-bold">붉은 귀신</span>님께 전달하여 승리하세요!
            </p>
          </div>
          <span className="text-2xl">🍎</span>
        </div>
      )}
    </div>
  );
};
