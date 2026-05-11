import { motion } from 'motion/react';
import { getColorForType, Piece } from '../constants';

export const NextPiece = ({ piece }: { piece: Piece | null }) => {
  if (!piece) return null;

  return (
    <div className="glass-panel p-6 flex flex-col items-center min-w-[160px]">
      <span className="text-[0.7rem] uppercase tracking-widest text-white/50 mb-4">Next</span>
      <div 
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)` }}
      >
        {piece.shape.flat().map((val, i) => {
          const color = getColorForType(piece.type);
          return (
            <div
              key={i}
              className="w-5 h-5 rounded-[1px] transition-all duration-300"
              style={{ 
                backgroundColor: val ? color : 'transparent',
                boxShadow: val ? `0 0 10px ${color}` : 'none'
              }}
            >
               {val !== 0 && (
                  <div className="w-full h-full border-t border-l border-white/20" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ScoreCard = ({ label, value, neon }: { label: string; value: number | string; neon?: boolean }) => (
  <div className="glass-panel p-6 flex flex-col gap-1 min-w-[160px]">
    <span className="text-[0.7rem] uppercase tracking-widest text-white/50">{label}</span>
    <motion.span 
      key={value}
      initial={{ y: -5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`text-2xl font-bold font-mono text-white ${neon ? 'neon-text' : ''}`}
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {String(value).padStart(6, '0')}
    </motion.span>
  </div>
);
