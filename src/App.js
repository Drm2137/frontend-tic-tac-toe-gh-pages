import React, { useState } from "react";
import "./style.css"; // ✅ replaced App.css with style.css

// ✅------------------------------------
// ✅ USER PROFILE LOOKUP COMPONENT
// ✅------------------------------------
function UserProfileLookup() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const fetchUserData = (id) => {
    setLoading(true);
    setUser(null);
    setError(null);
    setNotFound(false);

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => {
        if (!data.id) {
          setNotFound(true);
        } else {
          setUser(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    const id = parseInt(userId);
    if (id >= 1 && id <= 10) {
      fetchUserData(id);
    } else {
      setNotFound(true);
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  return (
    <div className="content-container">
      <h1>User Profile Lookup</h1>
      <div className="lookup-box">
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Enter user ID (1–10)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="lookup-results">
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">Error: {error.message}</p>}
        {notFound && !loading && !error && (
          <p className="error">User not found</p>
        )}
        {user && !loading && !error && (
          <div className="user-card">
            <h2>{user.name}</h2>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Website:</strong> {user.website}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅------------------------------------
// ✅ TIC TAC TOE COMPONENTS
// ✅------------------------------------
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {[0, 1, 2].map((i) => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
      <div className="board-row">
        {[3, 4, 5].map((i) => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
      <div className="board-row">
        {[6, 7, 8].map((i) => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="content-container">
      <h1>Tic Tac Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}

// ✅------------------------------------
// ✅ MAIN APP WITH NAVIGATION BAR & ASSIGNMENT MESSAGE
// ✅------------------------------------
export default function App() {
  const [activeTab, setActiveTab] = useState("tic-tac-toe");

  return (
    <div>
      <nav className="navbar">
        {/* Assignment Message (Left side) */}
        <div className="nav-title">
          Assignment 2 – Mohana Akhil Verma (B00123710)
        </div>

        {/* Navigation Buttons (Center) */}
        <div className="nav-buttons">
          <button
            className={`nav-btn ${activeTab === "tic-tac-toe" ? "active" : ""}`}
            onClick={() => setActiveTab("tic-tac-toe")}
          >
            🕹️ Tic Tac Toe
          </button>
          <button
            className={`nav-btn ${activeTab === "user-lookup" ? "active" : ""}`}
            onClick={() => setActiveTab("user-lookup")}
          >
            👤 User Lookup
          </button>
          <div
            className={`underline ${
              activeTab === "tic-tac-toe" ? "left" : "right"
            }`}
          ></div>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === "tic-tac-toe" && <Game />}
        {activeTab === "user-lookup" && <UserProfileLookup />}
      </main>
    </div>
  );
}

// ✅------------------------------------
// ✅ HELPER FUNCTION: CALCULATE WINNER
// ✅------------------------------------
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
