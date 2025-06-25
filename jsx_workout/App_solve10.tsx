import React, { useState, useEffect, useCallback } from 'react';

// Define TypeScript interfaces
interface Cell {
  filled: boolean;
  letter: string;
  color: string;
  current?: boolean;
}

interface Tetromino {
  shape: number[][];
  color: string;
  letters: string[];
  x: number;
  y: number;
}

interface FoundWord {
  word: string;
  positions: { x: number; y: number }[];
}

const styles = `
.App {
  text-align: center;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
  color: white;
}

h1 {
  margin-bottom: 20px;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.game-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.game-board {
  position: relative;
  background: #222;
  border: 3px solid #444;
  border-radius: 10px;
  padding: 10px;
}

.board-row {
  display: flex;
}

.cell {
  width: 30px;
  height: 30px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.cell.filled {
  border: 1px solid #555;
}

.cell.current {
  box-shadow: inset 0 0 10px rgba(255,255,255,0.3);
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.9);
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #ff6b6b;
}

.game-over h2 {
  color: #ff6b6b;
  margin-bottom: 20px;
}

.game-over button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.game-over button:hover {
  background: #45b7aa;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 200px;
}

.score-panel {
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.score-panel div {
  margin: 8px 0;
  font-size: 18px;
}

.target-word {
  color: #ffd93d;
  font-weight: bold;
  font-size: 20px !important;
}

.next-piece {
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.next-piece h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.next-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.next-row {
  display: flex;
}

.next-cell {
  width: 20px;
  height: 20px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.found-words {
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.found-words h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.words-list {
  max-height: 150px;
  overflow-y: auto;
}

.found-word {
  background: #4ecdc4;
  color: white;
  padding: 5px 10px;
  margin: 3px 0;
  border-radius: 15px;
  font-weight: bold;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.controls {
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.controls h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.controls div {
  margin: 5px 0;
  font-size: 14px;
}

button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #ee5a52;
}

@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
    align-items: center;
  }
  
  .cell {
    width: 25px;
    height: 25px;
    font-size: 12px;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const WORDS = ['REACT', 'GAMES', 'PIXEL', 'BLOCK', 'SCORE', 'MAGIC', 'QUICK', 'FLASH', 'BROWN', 'WORLD'];

const TETROMINOES: { [key: string]: { shape: number[][]; color: string } } = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }
};

const getRandomLetter = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

const createEmptyBoard = (): Cell[][] => {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() =>
      Array(BOARD_WIDTH)
        .fill(null)
        .map(() => ({ filled: false, letter: '', color: '' }))
    );
};

const getRandomTetromino = (): Tetromino => {
  const types = Object.keys(TETROMINOES);
  const type = types[Math.floor(Math.random() * types.length)];
  const tetromino = TETROMINOES[type];

  const letters: string[] = [];
  let letterCount = 0;
  for (let row of tetromino.shape) {
    for (let cell of row) {
      if (cell) letterCount++;
    }
  }

  for (let i = 0; i < letterCount; i++) {
    letters.push(getRandomLetter());
  }

  return {
    shape: tetromino.shape,
    color: tetromino.color,
    letters,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
    y: 0,
  };
};

const rotatePiece = (piece: Tetromino): Tetromino => {
  const rotated = piece.shape[0].map((_, i) =>
    piece.shape.map((row) => row[i]).reverse()
  );
  return { ...piece, shape: rotated };
};

const isValidMove = (board: Cell[][], piece: Tetromino, dx: number, dy: number): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.x + x + dx;
        const newY = piece.y + y + dy;

        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        if (newY >= 0 && board[newY][newX].filled) {
          return false;
        }
      }
    }
  }
  return true;
};

const placePiece = (board: Cell[][], piece: Tetromino): Cell[][] => {
  const newBoard = board.map((row) => [...row]);
  let letterIndex = 0;

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = {
            filled: true,
            letter: piece.letters[letterIndex],
            color: piece.color,
          };
        }
        letterIndex++;
      }
    }
  }
  return newBoard;
};

const clearLines = (board: Cell[][]): { board: Cell[][]; linesCleared: number } => {
  const newBoard: Cell[][] = [];
  let linesCleared = 0;

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (!board[y].every((cell) => cell.filled)) {
      newBoard.push([...board[y]]);
    } else {
      linesCleared++;
    }
  }

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(
      Array(BOARD_WIDTH)
        .fill(null)
        .map(() => ({ filled: false, letter: '', color: '' }))
    );
  }

  return { board: newBoard, linesCleared };
};

const checkForWords = (board: Cell[][]): FoundWord[] => {
  const foundWords: FoundWord[] = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    let word = '';
    let positions: { x: number; y: number }[] = [];

    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x].filled && board[y][x].letter) {
        word += board[y][x].letter;
        positions.push({ x, y });
      } else {
        if (word.length >= 3 && WORDS.includes(word)) {
          foundWords.push({ word, positions: [...positions] });
        }
        word = '';
        positions = [];
      }
    }
    if (word.length >= 3 && WORDS.includes(word)) {
      foundWords.push({ word, positions });
    }
  }

  return foundWords;
};

export default function App() {
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Tetromino>(getRandomTetromino());
  const [nextPiece, setNextPiece] = useState<Tetromino>(getRandomTetromino());
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [targetWord, setTargetWord] = useState<string>(
    WORDS[Math.floor(Math.random() * WORDS.length)]
  );

  const dropPiece = useCallback((): void => {
    if (gameOver || isPaused) return;

    if (isValidMove(board, currentPiece, 0, 1)) {
      setCurrentPiece((prev) => ({ ...prev, y: prev.y + 1 }));
    } else {
      const newBoard = placePiece(board, currentPiece);

      const words = checkForWords(newBoard);
      if (words.length > 0) {
        setFoundWords((prev) => [...prev, ...words]);
        setScore((prev) => prev + words.length * 100);
      }

      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      setBoard(clearedBoard);
      setScore((prev) => prev + linesCleared * 100 * level);

      const targetFound = words.some((w) => w.word === targetWord);
      if (targetFound) {
        setScore((prev) => prev + 500);
        setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
      }

      if (currentPiece.y <= 1) {
        setGameOver(true);
        return;
      }

      setCurrentPiece(nextPiece);
      setNextPiece(getRandomTetromino());
    }
  }, [board, currentPiece, gameOver, isPaused, level, targetWord, nextPiece]);

  useEffect(() => {
    const interval = setInterval(dropPiece, Math.max(100, 1000 - (level - 1) * 100));
    return () => clearInterval(interval);
  }, [dropPiece, level]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (isValidMove(board, currentPiece, -1, 0)) {
            setCurrentPiece((prev) => ({ ...prev, x: prev.x - 1 }));
          }
          break;
        case 'ArrowRight':
          if (isValidMove(board, currentPiece, 1, 0)) {
            setCurrentPiece((prev) => ({ ...prev, x: prev.x + 1 }));
          }
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
        case ' ':
          const rotated = rotatePiece(currentPiece);
          if (isValidMove(board, rotated, 0, 0)) {
            setCurrentPiece(rotated);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board, currentPiece, gameOver, isPaused, dropPiece]);

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    let letterIndex = 0;
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = {
              filled: true,
              letter: currentPiece.letters[letterIndex],
              color: currentPiece.color,
              current: true,
            };
          }
          letterIndex++;
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="board-row">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`cell ${cell.filled ? 'filled' : ''} ${cell.current ? 'current' : ''}`}
            style={{ backgroundColor: cell.filled ? cell.color : '#000' }}
          >
            {cell.letter}
          </div>
        ))}
      </div>
    ));
  };

  const renderNextPiece = () => {
    let letterIndex = 0;
    return nextPiece.shape.map((row, y) => (
      <div key={y} className="next-row">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`next-cell ${cell ? 'filled' : ''}`}
            style={{ backgroundColor: cell ? nextPiece.color : 'transparent' }}
          >
            {cell ? nextPiece.letters[letterIndex++] : ''}
          </div>
        ))}
      </div>
    ));
  };

  const restartGame = (): void => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomTetromino());
    setNextPiece(getRandomTetromino());
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setFoundWords([]);
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
  };

  return (
    <div className="App">
      <h1>Tetris + Wordle</h1>
      <div className="game-container">
        <div className="game-board">
          {renderBoard()}
          {gameOver && (
            <div className="game-over">
              <h2>Game Over!</h2>
              <button onClick={restartGame}>Play Again</button>
            </div>
          )}
        </div>

        <div className="game-info">
          <div className="score-panel">
            <div>Score: {score}</div>
            <div>Level: {level}</div>
            <div className="target-word">Target: {targetWord}</div>
          </div>

          <div className="next-piece">
            <h3>Next:</h3>
            <div className="next-preview">{renderNextPiece()}</div>
          </div>

          <div className="found-words">
            <h3>Words Found:</h3>
            <div className="words-list">
              {foundWords.slice(-5).map((item, i) => (
                <div key={i} className="found-word">{item.word}</div>
              ))}
            </div>
          </div>

          <div className="controls">
            <h3>Controls:</h3>
            <div>← → Move</div>
            <div>↓ Drop</div>
            <div>↑ or Space: Rotate</div>
          </div>

          <button onClick={() => setIsPaused(!isPaused)}>{isPaused ? 'Resume' : 'Pause'}</button>
        </div>
      </div>
    </div>
  );
}
