import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { COLS, ROWS, getColorForType, Piece } from '../constants';

interface BoardProps {
  board: (string | null)[];
  activePiece: {
    pos: { x: number; y: number };
    piece: Piece;
  } | null;
  ghostPiecePos: { x: number; y: number } | null;
}

export const TetrisBoard = ({ board, activePiece, ghostPiecePos }: BoardProps) => {
  // Create a combined grid for rendering
  const renderBoard = useMemo(() => {
    const displayBoard = [...board];

    // Add ghost piece
    if (activePiece && ghostPiecePos) {
      activePiece.piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = ghostPiecePos.y + y;
            const boardX = ghostPiecePos.x + x;
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
               // Only show ghost if not overlapping with active piece
               displayBoard[boardY * COLS + boardX] = displayBoard[boardY * COLS + boardX] || 'GHOST';
            }
          }
        });
      });
    }

    // Add active piece
    if (activePiece) {
      activePiece.piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = activePiece.pos.y + y;
            const boardX = activePiece.pos.x + x;
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              displayBoard[boardY * COLS + boardX] = activePiece.piece.type;
            }
          }
        });
      });
    }

    return displayBoard;
  }, [board, activePiece, ghostPiecePos]);

  return (
    <div 
      className="grid gap-[2px] bg-[rgba(20,20,35,0.5)] p-[4px] border-2 border-[#1a1a2e] shadow-[0_0_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(74,144,226,0.1)] rounded-sm"
      style={{ 
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        width: 'max-content'
      }}
    >
      {renderBoard.map((type, i) => (
        <Cell key={i} type={type} />
      ))}
    </div>
  );
};

const Cell: React.FC<{ type: string | null }> = ({ type }) => {
  const isGhost = type === 'GHOST';
  const color = isGhost ? 'rgba(255, 255, 255, 0.05)' : getColorForType(type);

  return (
    <motion.div
      initial={false}
      animate={{
        scale: type ? 1 : 0.95,
        opacity: type ? 1 : 0.5,
      }}
      className="w-7 h-7 sm:w-8 sm:h-8 rounded-[1px] relative flex items-center justify-center transition-all duration-200"
      style={{
        backgroundColor: color,
        boxShadow: type && !isGhost ? `0 0 15px ${color}, inset 0 0 10px rgba(255, 255, 255, 0.3)` : 'none',
        border: !type ? '1px solid rgba(255, 255, 255, 0.02)' : 'none',
      }}
    >
        {type && !isGhost && (
            <div className="absolute inset-0 border-t border-l border-white/20 rounded-[1px]" />
        )}
        {isGhost && (
            <div className="absolute inset-0 border border-white/10 rounded-[1px] border-dashed" />
        )}
    </motion.div>
  );
};
