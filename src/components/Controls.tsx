import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, RotateCw, Pause, Play } from 'lucide-react';

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const Controls = ({ 
  onMoveLeft, 
  onMoveRight, 
  onMoveDown, 
  onRotate, 
  onHardDrop,
  isPaused,
  onTogglePause
}: ControlsProps) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mt-8 sm:hidden">
      <div className="grid grid-cols-3 gap-4">
        <div />
        <ControlButton onClick={onRotate} icon={<RotateCw size={24} />} className="bg-blue-500/20 text-blue-400 border-blue-500/50" />
        <div />
        
        <ControlButton onClick={onMoveLeft} icon={<ArrowLeft size={24} />} className="bg-zinc-800 text-zinc-400 border-zinc-700" />
        <ControlButton onClick={onMoveDown} icon={<ArrowDown size={24} />} className="bg-zinc-800 text-zinc-400 border-zinc-700" />
        <ControlButton onClick={onMoveRight} icon={<ArrowRight size={24} />} className="bg-zinc-800 text-zinc-400 border-zinc-700" />
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={onHardDrop}
          className="flex-1 py-4 bg-zinc-800 rounded-2xl border border-zinc-700 text-zinc-400 font-bold uppercase tracking-widest active:scale-95 transition-transform"
        >
          Hard Drop
        </button>
         <button 
          onClick={onTogglePause}
          className="flex items-center justify-center p-4 bg-zinc-800 rounded-2xl border border-zinc-700 text-zinc-400 active:scale-95 transition-transform"
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
      </div>
    </div>
  );
};

const ControlButton = ({ onClick, icon, className = "" }: { onClick: () => void, icon: React.ReactNode, className?: string }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-2xl border flex items-center justify-center active:scale-90 transition-all ${className}`}
  >
    {icon}
  </button>
);
