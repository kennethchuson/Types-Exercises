import React, { useState, useEffect, useRef } from "react";
import { create } from "zustand";

type MazeStore = {
  maze: number[][];
  path: [number, number][];
  setMaze: (maze: number[][]) => void;
  setPath: (path: [number, number][]) => void;
};

const useMazeStore = create<MazeStore>((set) => ({
  maze: [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1],
  ],
  path: [],
  setMaze: (maze) => set({ maze }),
  setPath: (path) => set({ path }),
}));

const MiniPingPong: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ballPosition, setBallPosition] = useState({
    x: Math.random() * 70 + 5,
    y: Math.random() * 70 + 5,
  });
  const [ballVelocity, setBallVelocity] = useState({ dx: 2, dy: 2 });

  const paddleWidth = 40;
  const paddleHeight = 5;
  const paddleY = 70;
  const [paddleX, setPaddleX] = useState(20);

  const updateGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 80, 80); // Clear the canvas
    const { x, y } = ballPosition;
    const { dx, dy } = ballVelocity;

    // Draw the ball
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // Draw the paddle
    ctx.fillStyle = "black";
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

    // Update ball position
    let newX = x + dx;
    let newY = y + dy;

    // Bounce off walls
    if (newX + 5 > 80 || newX - 5 < 0) {
      setBallVelocity((v) => ({ ...v, dx: -v.dx }));
    }
    if (newY - 5 < 0) {
      setBallVelocity((v) => ({ ...v, dy: -v.dy }));
    }

    // Bounce off paddle
    if (newY + 5 > paddleY && newX > paddleX && newX < paddleX + paddleWidth) {
      setBallVelocity((v) => ({ ...v, dy: -v.dy }));
    }

    // Ball out of bounds
    if (newY > 80) {
      setBallPosition({ x: Math.random() * 70 + 5, y: 5 });
      setBallVelocity({ dx: 2, dy: 2 });
      return;
    }

    // Update ball position
    setBallPosition({ x: newX, y: newY });
  };

  const movePaddle = (event: React.MouseEvent) => {
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    setPaddleX(
      Math.max(0, Math.min(80 - paddleWidth, mouseX - paddleWidth / 2))
    );
  };

  useEffect(() => {
    const interval = setInterval(updateGame, 30);
    return () => clearInterval(interval);
  }, [ballPosition, ballVelocity]);

  return (
    <canvas
      ref={canvasRef}
      width="80"
      height="80"
      style={{ border: "1px solid black" }}
      onMouseMove={movePaddle}
    />
  );
};

const App: React.FC = () => {
  const { maze, setMaze, path, setPath } = useMazeStore();
  const [animatedPath, setAnimatedPath] = useState<[number, number][]>([]);
  const [solved, setSolved] = useState(false);
  const [animating, setAnimating] = useState(false);

  const solveMazeDFS = () => {
    const n = maze.length;
    const m = maze[0].length;
    const visited: boolean[][] = Array.from({ length: n }, () =>
      Array(m).fill(false)
    );
    const result: [number, number][] = [];

    const isSafe = (x: number, y: number): boolean =>
      x >= 0 && y >= 0 && x < n && y < m && maze[x][y] === 1 && !visited[x][y];

    const dfs = (x: number, y: number): boolean => {
      if (x === n - 1 && y === m - 1) {
        result.push([x, y]);
        return true;
      }

      if (isSafe(x, y)) {
        visited[x][y] = true;
        result.push([x, y]);

        if (dfs(x + 1, y)) return true;
        if (dfs(x, y + 1)) return true;
        if (dfs(x - 1, y)) return true;
        if (dfs(x, y - 1)) return true;

        result.pop();
        visited[x][y] = false;
      }
      return false;
    };

    if (dfs(0, 0)) {
      setPath(result);
      setSolved(true);
      animatePath(result);
    } else {
      alert("No solution found!");
    }
  };

  const animatePath = (solutionPath: [number, number][]) => {
    setAnimating(true);
    const steps: [number, number][] = [];
    let index = 0;

    const interval = setInterval(() => {
      if (index < solutionPath.length) {
        steps.push(solutionPath[index]);
        setAnimatedPath([...steps]);
        index++;
      } else {
        clearInterval(interval);
        setAnimating(false);
      }
    }, 200);
  };

  const resetMaze = () => {
    setPath([]);
    setAnimatedPath([]);
    setSolved(false);
    setAnimating(false);
  };

  const randomizeWalls = () => {
    const rows = maze.length;
    const cols = maze[0].length;

    const newMaze = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) =>
        (i === 0 && j === 0) || (i === rows - 1 && j === cols - 1)
          ? 1
          : Math.random() > 0.7
          ? 0
          : 1
      )
    );

    setMaze(newMaze);
    resetMaze();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Rat in a Maze with Mini Ping Pong</h1>
      <div>
        {maze.map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "center" }}>
            {row.map((cell, j) => {
              const isPath = animatedPath.some(([x, y]) => x === i && y === j);
              return (
                <div
                  key={j}
                  style={{
                    width: "80px",
                    height: "80px",
                    border: "1px solid black",
                    backgroundColor: isPath
                      ? "lightgreen"
                      : cell === 1
                      ? "white"
                      : "gray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {isPath && <MiniPingPong />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button
        onClick={solveMazeDFS}
        disabled={solved || animating}
        style={{ margin: "10px" }}
      >
        Solve
      </button>
      <button onClick={resetMaze} style={{ margin: "10px" }}>
        Reset
      </button>
      <button
        onClick={randomizeWalls}
        disabled={animating}
        style={{ margin: "10px" }}
      >
        Randomize Walls
      </button>
    </div>
  );
};

export default App;
