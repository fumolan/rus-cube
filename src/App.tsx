/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Pause, Play, Zap } from 'lucide-react';
import { useTetris } from './useTetris';
import { TetrisBoard } from './components/TetrisBoard';
import { ScoreCard, NextPiece } from './components/Display';
import { Controls } from './components/Controls';

export default function App() {
  const {
    board,
    activePiece,
    nextPiece,
    ghostPiecePos,
    score,
    lines,
    level,
    gameOver,
    isPaused,
    setIsPaused,
    resetGame,
    move,
    handleRotate,
    hardDrop,
  } = useTetris();

  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('tetris-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tetris-high-score', score.toString());
    }
  }, [score, highScore]);

  return (
    <div className="min-h-screen bg-dark-bg text-zinc-100 flex flex-col items-center justify-center p-8 selection:bg-neon-blue/30 font-sans">
      {/* Immersive background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 blur-[120px] rounded-full opacity-30" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent" />
      </div>

      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-12 relative z-10 w-full max-w-7xl">
        {/* Left Column: Primary Stats */}
        <div className="flex flex-col gap-6 w-full sm:w-auto xl:w-64">
           <header className="mb-4 xl:hidden text-center">
            <h1 className="text-4xl font-black italic tracking-tighter neon-text flex items-center justify-center gap-3">
              <Zap className="text-neon-blue fill-neon-blue" size={32} />
              NEON FUSION
            </h1>
          </header>
          
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
            <ScoreCard label="Score" value={score} neon />
            <ScoreCard label="Level" value={level} />
            <ScoreCard label="Lines" value={lines} />
          </div>
        </div>

        {/* Center Column: Game Grid */}
        <div className="relative group">
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 h-[80%] w-[1px] bg-gradient-to-b from-transparent via-neon-blue/30 to-transparent hidden xl:block" />
          
          <TetrisBoard 
            board={board} 
            activePiece={activePiece} 
            ghostPiecePos={ghostPiecePos} 
          />

          <AnimatePresence>
            {isPaused && !gameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 backdrop-blur-md bg-black/60 flex items-center justify-center rounded-sm border border-neon-blue/20"
              >
                <div className="flex flex-col items-center gap-6">
                  <Pause size={64} className="text-neon-blue animate-pulse" />
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-12 py-4 bg-neon-blue text-black font-black uppercase tracking-[0.2em] rounded-sm hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,240,240,0.4)]"
                  >
                    Resume
                  </button>
                </div>
              </motion.div>
            )}

            {gameOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center rounded-sm border-2 border-red-500/30 p-8 text-center"
              >
                <Trophy size={64} className="text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">System Failure</h2>
                <div className="space-y-1 mb-10 w-full">
                  <p className="text-zinc-500 uppercase text-[0.6rem] font-mono tracking-widest">Final Record</p>
                  <p className="text-5xl font-black text-white font-mono" style={{ fontFamily: "'Courier New', Courier, monospace" }}>{score.toString().padStart(7, '0')}</p>
                </div>
                <button 
                  onClick={resetGame}
                  className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-[0.3em] rounded-sm hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                >
                  <RefreshCcw size={24} />
                  Reboot System
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Next Piece & Secondary Stats */}
        <aside className="flex flex-col gap-6 w-full sm:w-auto xl:w-64">
          <header className="hidden xl:block mb-6">
            <h1 className="text-4xl font-black italic tracking-tighter neon-text flex items-center gap-3">
              <Zap className="text-neon-blue fill-neon-blue" size={32} />
              NEON FUSION
            </h1>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
            <NextPiece piece={nextPiece} />
            <ScoreCard label="High Score" value={highScore} />
            
            <div className="glass-panel p-6 flex flex-col gap-3 text-[10px] font-mono tracking-widest">
              <span className="text-white/40 uppercase text-[0.6rem] mb-2">Controls Interface</span>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/60">MOVE</span>
                <span className="text-neon-blue">ARROWS</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/60">ROTATE</span>
                <span className="text-neon-blue">UP / W</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/60">DROP</span>
                <span className="text-neon-blue">SPACE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">PAUSE</span>
                <span className="text-neon-blue">P</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Controls 
        onMoveLeft={() => move({ x: -1, y: 0 })}
        onMoveRight={() => move({ x: 1, y: 0 })}
        onMoveDown={() => move({ x: 0, y: 1 })}
        onRotate={handleRotate}
        onHardDrop={hardDrop}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
      />

      <div className="absolute bottom-12 left-12 flex items-center gap-4 opacity-40 hidden xl:flex">
        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
        <span className="text-[10px] tracking-[0.4em] uppercase font-mono">System Active - v2.4.0</span>
      </div>
    </div>
  );
}

