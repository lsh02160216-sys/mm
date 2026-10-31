import React from 'react';
import { Direction } from '../types/game';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface VirtualControlsProps {
  onDirectionChange: (dir: Direction) => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({ onDirectionChange }) => {
  return (
    <div className="md:hidden absolute bottom-4 left-4 z-20 pointer-events-auto">
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-36 h-36 bg-slate-900/60 backdrop-blur-md p-1.5 rounded-3xl border border-slate-700/50 shadow-2xl">
        {/* Top */}
        <div className="col-start-2 row-start-1">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onDirectionChange(0);
            }}
            onMouseDown={() => onDirectionChange(0)}
            className="w-full h-full rounded-2xl bg-slate-800/80 active:bg-amber-500/80 flex items-center justify-center text-slate-200 active:text-white transition-all shadow border border-slate-600/40"
          >
            <ArrowUp size={20} />
          </button>
        </div>

        {/* Left */}
        <div className="col-start-1 row-start-2">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onDirectionChange(3);
            }}
            onMouseDown={() => onDirectionChange(3)}
            className="w-full h-full rounded-2xl bg-slate-800/80 active:bg-amber-500/80 flex items-center justify-center text-slate-200 active:text-white transition-all shadow border border-slate-600/40"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Center Indicator */}
        <div className="col-start-2 row-start-2 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-700/60" />
        </div>

        {/* Right */}
        <div className="col-start-3 row-start-2">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onDirectionChange(1);
            }}
            onMouseDown={() => onDirectionChange(1)}
            className="w-full h-full rounded-2xl bg-slate-800/80 active:bg-amber-500/80 flex items-center justify-center text-slate-200 active:text-white transition-all shadow border border-slate-600/40"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Down */}
        <div className="col-start-2 row-start-3">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onDirectionChange(2);
            }}
            onMouseDown={() => onDirectionChange(2)}
            className="w-full h-full rounded-2xl bg-slate-800/80 active:bg-amber-500/80 flex items-center justify-center text-slate-200 active:text-white transition-all shadow border border-slate-600/40"
          >
            <ArrowDown size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
