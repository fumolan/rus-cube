import { useCallback, useEffect, useMemo, useState } from 'react';
import { COLS, getColorForType, INITIAL_SPEED, MIN_SPEED, Piece, PIECES, PieceType, ROWS, SPEED_INCREMENT } from './constants';

export function useTetris() {
  const [board, setBoard] = useState<(string | null)[]>(Array(ROWS * COLS).fill(null));
  const [activePiece, setActivePiece] = useState<{
    pos: { x: number; y: number };
    piece: Piece;
  } | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const getRandomPiece = useCallback(() => {
    const keys = Object.keys(PIECES) as PieceType[];
    const type = keys[Math.floor(Math.random() * keys.length)];
    return PIECES[type];
  }, []);

  const spawnPiece = useCallback((p?: Piece) => {
    const piece = p || getRandomPiece();
    const x = Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2);
    const newPiece = { pos: { x, y: 0 }, piece };

    if (checkCollision(newPiece.pos, newPiece.piece.shape, board)) {
      setGameOver(true);
      return null;
    }
    setActivePiece(newPiece);
    return newPiece;
  }, [board, getRandomPiece]);

  const checkCollision = (pos: { x: number; y: number }, shape: number[][], currentBoard: (string | null)[]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (
            newX < 0 ||
            newX >= COLS ||
            newY >= ROWS ||
            (newY >= 0 && currentBoard[newY * COLS + newX] !== null)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = (matrix: number[][]) => {
    const n = matrix.length;
    const res = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        res[c][n - 1 - r] = matrix[r][c];
      }
    }
    return res;
  };

  const handleRotate = useCallback(() => {
    if (!activePiece || gameOver || isPaused) return;
    const newShape = rotate(activePiece.piece.shape);
    if (!checkCollision(activePiece.pos, newShape, board)) {
      setActivePiece({ ...activePiece, piece: { ...activePiece.piece, shape: newShape } });
    }
  }, [activePiece, board, gameOver, isPaused]);

  const move = useCallback((dir: { x: number; y: number }) => {
    if (!activePiece || gameOver || isPaused) return false;
    const newPos = { x: activePiece.pos.x + dir.x, y: activePiece.pos.y + dir.y };
    if (!checkCollision(newPos, activePiece.piece.shape, board)) {
      setActivePiece({ ...activePiece, pos: newPos });
      return true;
    }
    return false;
  }, [activePiece, board, gameOver, isPaused]);

  const lockPiece = useCallback(() => {
    if (!activePiece) return;

    const newBoard = [...board];
    activePiece.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = activePiece.pos.y + y;
          const boardX = activePiece.pos.x + x;
          if (boardY >= 0) {
            newBoard[boardY * COLS + boardX] = activePiece.piece.type;
          }
        }
      });
    });

    // Check lines
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      let isFull = true;
      for (let x = 0; x < COLS; x++) {
        if (newBoard[y * COLS + x] === null) {
          isFull = false;
          break;
        }
      }
      if (isFull) {
        linesCleared++;
        newBoard.splice(y * COLS, COLS);
        newBoard.unshift(...Array(COLS).fill(null));
        y++; // Re-check the same row index which now has the row from above
      }
    }

    if (linesCleared > 0) {
      const linePoints = [0, 100, 300, 500, 800];
      setScore(s => s + linePoints[linesCleared] * level);
      setLines(l => l + linesCleared);
      if (Math.floor((lines + linesCleared) / 10) > Math.floor(lines / 10)) {
        setLevel(lev => lev + 1);
      }
    }

    setBoard(newBoard);
    const next = nextPiece || getRandomPiece();
    const newNext = getRandomPiece();
    setNextPiece(newNext);
    spawnPiece(next);
  }, [activePiece, board, lines, level, nextPiece, getRandomPiece, spawnPiece]);

  const handleDrop = useCallback(() => {
    if (!move({ x: 0, y: 1 })) {
      lockPiece();
    }
  }, [move, lockPiece]);

  const hardDrop = useCallback(() => {
    if (!activePiece || gameOver || isPaused) return;
    let newY = activePiece.pos.y;
    while (!checkCollision({ x: activePiece.pos.x, y: newY + 1 }, activePiece.piece.shape, board)) {
      newY++;
    }
    const finalPos = { x: activePiece.pos.x, y: newY };
    
    // Explicitly update board and clear lines for hard drop
    const newBoard = [...board];
    activePiece.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = finalPos.y + y;
          const boardX = finalPos.x + x;
          if (boardY >= 0) {
            newBoard[boardY * COLS + boardX] = activePiece.piece.type;
          }
        }
      });
    });

    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      let isFull = true;
      for (let x = 0; x < COLS; x++) {
        if (newBoard[y * COLS + x] === null) {
          isFull = false;
          break;
        }
      }
      if (isFull) {
        linesCleared++;
        newBoard.splice(y * COLS, COLS);
        newBoard.unshift(...Array(COLS).fill(null));
        y++;
      }
    }

    if (linesCleared > 0) {
      const linePoints = [0, 100, 300, 500, 800];
      setScore(s => s + linePoints[linesCleared] * level);
      setLines(l => l + linesCleared);
      if (Math.floor((lines + linesCleared) / 10) > Math.floor(lines / 10)) {
        setLevel(lev => lev + 1);
      }
    }

    setBoard(newBoard);
    const next = nextPiece || getRandomPiece();
    setNextPiece(getRandomPiece());
    
    // Reset active piece to the top
    const startX = Math.floor(COLS / 2) - Math.floor(next.shape[0].length / 2);
    const pieceToSpawn = { pos: { x: startX, y: 0 }, piece: next };
    if (checkCollision(pieceToSpawn.pos, pieceToSpawn.piece.shape, newBoard)) {
      setGameOver(true);
      setActivePiece(null);
    } else {
      setActivePiece(pieceToSpawn);
    }
    
    setScore(s => s + (newY - activePiece.pos.y) * 2);
  }, [activePiece, board, gameOver, isPaused, level, lines, nextPiece, getRandomPiece]);

  const ghostPiecePos = useMemo(() => {
    if (!activePiece) return null;
    let ghostY = activePiece.pos.y;
    while (!checkCollision({ x: activePiece.pos.x, y: ghostY + 1 }, activePiece.piece.shape, board)) {
      ghostY++;
    }
    return { x: activePiece.pos.x, y: ghostY };
  }, [activePiece, board]);

  const resetGame = useCallback(() => {
    setBoard(Array(ROWS * COLS).fill(null));
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    const first = getRandomPiece();
    const second = getRandomPiece();
    setActivePiece({ pos: { x: Math.floor(COLS / 2) - Math.floor(first.shape[0].length / 2), y: 0 }, piece: first });
    setNextPiece(second);
  }, [getRandomPiece]);

  // Start game
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    const speed = Math.max(MIN_SPEED, INITIAL_SPEED * Math.pow(SPEED_INCREMENT, level - 1));
    const interval = setInterval(handleDrop, speed);
    return () => clearInterval(interval);
  }, [handleDrop, gameOver, isPaused, level]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          move({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          move({ x: 1, y: 0 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          move({ x: 0, y: 1 });
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleRotate();
          break;
        case ' ':
          hardDrop();
          break;
        case 'p':
        case 'P':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, handleRotate, hardDrop, gameOver]);

  return {
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
  };
}
