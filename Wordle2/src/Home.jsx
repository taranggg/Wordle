import { useState } from "react";
import GameEndModal from "./components/GameEndModal";
import "./Home.css";
import GameBoard from "./components/GameBoard";
import MenuModal from "./components/MenuModal";
import { MenuButton, MobNavBar, ProfileButton } from "./components/Navbar";
import { useTheme } from "./context/ThemeContext.jsx";
import { useWindowDimensions } from "./hooks/dimensions";
import wordleLogo from "./assets/wordlelogo.png";
import WordOfTheDay from "./components/Wotd.jsx";
import OnScreenKeyboard from "./components/OnScreenKeyboard.jsx";

function HomeMobile({
  backgroundStyle,
  isDark,
  toggleTheme,
  menuOpen,
  toggleMenu,
  setMenuOpen,
  handleGameEnd,
  dayWord,
  handleKeyInput,
}) {
  const [gameEnd, setGameEnd] = useState({
    open: false,
    win: false,
    answer: "",
  });

  const handleGameEndModal = ({ result, word }) => {
    setGameEnd({ open: true, win: result === "win", answer: word });
    handleGameEnd && handleGameEnd({ result, word });
  };

  const handlePlayAgain = () => {
    setGameEnd({ open: false, win: false, answer: "" });
    window.location.reload(); // or trigger a game reset logic
  };

  return (
    <div className="min-h-screen p-4 pb-24" style={backgroundStyle}>
      <MobNavBar
        onMenuClick={toggleMenu}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <WordOfTheDay dayWord={dayWord} isDark={isDark} />

      <div className="flex-1 mt-4 mb-10">
        <GameBoard
          username="Tarang"
          onGameEnd={handleGameEndModal}
          isDark={isDark}
        />
      </div>

      <OnScreenKeyboard onKeyPress={handleKeyInput} />

      <MenuModal
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        playerId="You"
        isDark={isDark}
      />

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
  handleGameEnd,
  dayWord,
}) {
  const [gameEnd, setGameEnd] = useState({
    open: false,
    win: false,
    answer: "",
  });

  const handleGameEndModal = ({ result, word }) => {
    setGameEnd({ open: true, win: result === "win", answer: word });
    handleGameEnd && handleGameEnd({ result, word });
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <MenuButton onClick={toggleMenu} isDark={isDark} />
        <div className="flex flex-col items-start">
          <img
            src={wordleLogo}
            alt="Wordle Logo"
            width={220}
            height={140}
            className="object-contain"
            draggable={false}
          />
          <p className="text-gray-500 text-lg flex items-center drop-shadow-lg">
            Guess the word in Six tries...
          </p>
        </div>
        <ProfileButton
          isDark={isDark}
          user={{ name: "Tarang" }}
          toggleTheme={toggleTheme}
        />
      </div>

      {/* Word of the Day */}
      <WordOfTheDay
        dayWord={dayWord}
        isDark={isDark}
        buttonPosition={{ left: "2.5rem", top: "6rem" }}
      />

      {/* Game Board */}
      <div className="flex-1 flex flex-col items-center justify-center mt-4">
        <GameBoard
          username="Tarang"
          onGameEnd={handleGameEndModal}
          isDark={isDark}
        />
      </div>

      {/* Keyboard */}
      <div className="mt-4">
        <OnScreenKeyboard isDark={isDark} />
      </div>

      {/* Menu */}
      <MenuModal
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        playerId="You"
        isDark={isDark}
      />

      <GameEndModal
        isOpen={gameEnd.open}
        isWin={gameEnd.win}
        answer={gameEnd.answer}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}

export default function Home({ dayWord }) {
  const { isDark, toggleTheme } = useTheme();
  const { isMobile } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleGameEnd = ({ result, word }) => {
    console.log("Game ended:", result, word);
  };

  const handleKeyInput = (key) => {
    console.log("Key pressed from screen:", key);
    // TODO: forward this to GameBoard if needed
  };

  const backgroundStyle = {
    background: isDark
      ? "linear-gradient(135deg, #232526 0%, #770101 100%)"
      : "linear-gradient(135deg, #a8edea 0%, #FCE8AF 100%)",
  };

  const homeProps = {
    backgroundStyle,
    isDark,
    toggleTheme,
    menuOpen,
    toggleMenu,
    setMenuOpen,
    handleGameEnd,
    dayWord,
    handleKeyInput,
  };

  return isMobile ? <HomeMobile {...homeProps} /> : <HomeDesk {...homeProps} />;
}
