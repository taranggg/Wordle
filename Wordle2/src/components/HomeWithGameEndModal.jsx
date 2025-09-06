import { useState } from "react";
import GameEndModal from "./components/GameEndModal";
// ...existing imports...

function HomeMobile({
  backgroundStyle,
  isDark,
  toggleTheme,
  menuOpen,
  toggleMenu,
  setMenuOpen,
  dayWord,
  handleKeyInput,
}) {
  const [gameEnd, setGameEnd] = useState({
    open: false,
    win: false,
    answer: "",
  });

  const handleGameEnd = ({ result, word }) => {
    setGameEnd({ open: true, win: result === "win", answer: word });
  };

  const handlePlayAgain = () => {
    setGameEnd({ open: false, win: false, answer: "" });
    window.location.reload(); // or trigger a game reset logic
  };

  return (
    <div className="min-h-screen p-4 pb-24" style={backgroundStyle}>
      {/* ...existing code... */}
      <GameBoard username="Tarang" onGameEnd={handleGameEnd} isDark={isDark} />
      {/* ...existing code... */}
      <GameEndModal
        isOpen={gameEnd.open}
        isWin={gameEnd.win}
        answer={gameEnd.answer}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}

function HomeDesk({
  backgroundStyle,
  isDark,
  toggleTheme,
  menuOpen,
  toggleMenu,
  setMenuOpen,
  dayWord,
}) {
  const [gameEnd, setGameEnd] = useState({
    open: false,
    win: false,
    answer: "",
  });

  const handleGameEnd = ({ result, word }) => {
    setGameEnd({ open: true, win: result === "win", answer: word });
  };

  const handlePlayAgain = () => {
    setGameEnd({ open: false, win: false, answer: "" });
    window.location.reload(); // or trigger a game reset logic
  };

  return (
    <div
      className="min-h-screen p-6 flex flex-col"
      style={{ ...backgroundStyle, fontFamily: "'Quicksand', sans-serif" }}
    >
      {/* ...existing code... */}
      <GameBoard username="Tarang" onGameEnd={handleGameEnd} isDark={isDark} />
      {/* ...existing code... */}
      <GameEndModal
        isOpen={gameEnd.open}
        isWin={gameEnd.win}
        answer={gameEnd.answer}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}

// ...existing export default Home...
