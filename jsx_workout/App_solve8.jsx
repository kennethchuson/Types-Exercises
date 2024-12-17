import React, { useState } from "react";
import { create } from "zustand";

// Define the Todo type and Zustand store
type Todo = {
  id: number;
  text: string;
};

type TodoState = {
  todos: Todo[];
  sharedBoard: string[]; // Shared Tic-Tac-Toe board state
  isXTurn: boolean; // Shared turn state for all tasks
  winner: string | null; // Track the winner
  folders: string[]; // File system structure
  addTodo: (text: string) => void;
  updateBoard: (index: number) => void;
  deleteTodo: (id: number) => void;
  resetBoard: () => void;
  createFolder: (row: number, col: number) => void; // Create folder based on X/O placement
};

const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  sharedBoard: Array(9).fill(""), // Initialize shared Tic-Tac-Toe board
  isXTurn: true, // Shared turn state for all tasks
  winner: null, // Track the winner ("X" or "O")
  folders: [], // Initialize an empty folder structure
  addTodo: (text: string) =>
    set((state) => {
      if (state.todos.length === 0) {
        // If no tasks are left, reset the shared board
        return {
          todos: [
            ...state.todos,
            {
              id: Date.now(),
              text,
            },
          ],
          sharedBoard: Array(9).fill(""), // Reset board when adding the first task
          winner: null, // Reset winner when adding a new task
        };
      }
      return {
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text,
          },
        ],
      };
    }),
  updateBoard: (index: number) =>
    set((state) => {
      if (state.sharedBoard[index] || state.winner) return state; // Prevent further moves if there's a winner

      const newBoard = [...state.sharedBoard];
      newBoard[index] = state.isXTurn ? "X" : "O";

      const winner = checkWinner(newBoard);

      // Create folder based on X and O positions
      const row = Math.floor(index / 3);
      const col = index % 3;
      state.createFolder(row, col); // Create folder on each move

      return {
        sharedBoard: newBoard,
        isXTurn: !state.isXTurn,
        winner: winner, // Set the winner if found
      };
    }),
  deleteTodo: (id: number) =>
    set((state) => {
      const updatedTodos = state.todos.filter((todo) => todo.id !== id);

      // If no tasks are left, reset the shared board
      if (updatedTodos.length === 0) {
        return {
          todos: updatedTodos,
          sharedBoard: Array(9).fill(""), // Reset the shared board when all tasks are deleted
          winner: null, // Reset winner
          folders: [], // Reset folder structure
        };
      }
      return { todos: updatedTodos };
    }),
  resetBoard: () =>
    set({ sharedBoard: Array(9).fill(""), winner: null, folders: [] }), // Function to reset the board
  createFolder: (row: number, col: number) =>
    set((state) => {
      let newFolders = [...state.folders];

      // Handle creation of folders based on X and O
      if (state.isXTurn) {
        // X on rows: Create a folder at the row level
        if (!newFolders[row]) {
          newFolders[row] = `Folder for Row ${row}`;
        }
        // X on columns: Create a file folder at the column level
        if (!newFolders[`col-${col}`]) {
          newFolders[`col-${col}`] = `File Folder for Column ${col}`;
        }
      } else {
        // O on rows: Create a folder inside the previously created X folder
        if (newFolders[row]) {
          newFolders[row] += ` -> O folder at row ${row}`;
        }
        // O on columns: Create a folder outside the previously created X folder
        if (newFolders[`col-${col}`]) {
          newFolders[`col-${col}`] += ` -> O folder at column ${col}`;
        }
      }

      return { folders: newFolders };
    }),
}));

// Helper function to check for a winner
const checkWinner = (board: string[]) => {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return the winner ("X" or "O")
    }
  }
  return null;
};

// Tic-Tac-Toe Component
const TicTacToe: React.FC<{ id: number }> = ({ id }) => {
  const { sharedBoard, isXTurn, winner, updateBoard } = useTodoStore();

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 40px)" }}>
        {sharedBoard.map((cell, index) => {
          let backgroundColor = "";
          if (winner) {
            // If there is a winner, color the grid based on the winner
            backgroundColor = winner === "X" ? "blue" : "yellow";
          }

          return (
            <div
              key={index}
              onClick={() => updateBoard(index)}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid black",
                fontSize: "24px",
                cursor: winner ? "not-allowed" : "pointer", // Disable click after winner
                backgroundColor: backgroundColor,
              }}
            >
              {cell}
            </div>
          );
        })}
      </div>
      <p>
        {winner ? `Winner: ${winner}` : `Next Turn: ${isXTurn ? "X" : "O"}`}
      </p>
    </div>
  );
};

// TodoInput Component
const TodoInput: React.FC = () => {
  const [text, setText] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleAddTodo = () => {
    if (text.trim() !== "") {
      addTodo(text);
      setText("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={handleAddTodo}>Add</button>
    </div>
  );
};

// TodoList Component
const TodoList: React.FC = () => {
  const { todos, deleteTodo, folders } = useTodoStore();

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <div>
            <strong>{todo.text}</strong>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
          <TicTacToe id={todo.id} />
          <div>
            <h3>Folder Structure for Task {todo.text}</h3>
            <ul>
              {folders.map((folder, index) => (
                <li key={index}>{folder}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <div>
      <h1>Todo App with Dynamic File System</h1>
      <TodoInput />
      <TodoList />
    </div>
  );
};

export default App;
