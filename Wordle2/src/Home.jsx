import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameEndModal from "./components/GameEndModal";
import "./Home.css";
import GameBoard from "./components/GameBoard";
import MenuModal from "./components/MenuModal";
import { MenuButton, MobNavBar, ProfileButton } from "./components/Navbar";
import { useTheme } from "./context/ThemeContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useWindowDimensions } from "./hooks/dimensions";
import wordleLogo from "./assets/wordlelogo.png";
import WordOfTheDay from "./components/Wotd.jsx";
import OnScreenKeyboard from "./components/OnScreenKeyboard.jsx";

const GUEST_GAMES_STORAGE_KEY = "wordle_guest_games_count";
export const GUEST_GAMES_LIMIT = 8;

function getStoredGuestCount() {
  try {
    const n = parseInt(
      localStorage.getItem(GUEST_GAMES_STORAGE_KEY) || "0",
      10,
    );
    return Number.isFinite(n) ? Math.min(Math.max(0, n), GUEST_GAMES_LIMIT) : 0;
  } catch {
    return 0;
  }
}

function HomeMobile({
  backgroundStyle,
  isDark,
  toggleTheme,
  menuOpen,
  toggleMenu,
  setMenuOpen,
  dayWord,
  handleKeyInput,
  recentGames,
  onGameEndAddHistory,
  user,
  guestLimitReached,
  guestGamesPlayed,
  guestGamesLimit,
  onLoginClick,
  onSignupClick,
}) {
  const [gameEnd, setGameEnd] = useState({
    open: false,
    win: false,
    answer: "",
  });

  const handleGameEndModal = ({ result, word }) => {
    setGameEnd({ open: true, win: result === "win", answer: word });
    onGameEndAddHistory && onGameEndAddHistory({ result, word });
  };

  const handlePlayAgain = () => {
    setGameEnd({ open: false, win: false, answer: "" });
    window.location.reload();
  };

  if (guestLimitReached) {
    return (
      <div
        className="min-h-screen p-4 pb-24 flex flex-col items-center justify-center"
        style={backgroundStyle}
      >
        <MobNavBar
          onMenuClick={toggleMenu}
          isDark={isDark}
          toggleTheme={toggleTheme}
          isGuest
        />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 max-w-sm text-center">
          <p className="text-xl font-semibold opacity-90">
            You've played 8 games as a guest.
          </p>
          <p className="text-sm opacity-80">
            Sign in or create an account to keep playing. Guest history is not
            stored.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onLoginClick}
              className="px-5 py-2.5 rounded-full bg-slate-600 hover:bg-slate-700 text-white font-semibold"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onSignupClick}
              className="px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Sign up
            </button>
          </div>
        </div>
        <MenuModal
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          playerId="Guest"
          isDark={isDark}
          dayWord={dayWord}
          recentGames={recentGames}
          isGuest
          guestGamesPlayed={guestGamesPlayed}
          guestGamesLimit={guestGamesLimit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24" style={backgroundStyle}>
      <MobNavBar
        onMenuClick={toggleMenu}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isGuest={!user}
      />

      <div className="flex-1 mt-4 mb-10">
        <GameBoard
          username={user?.username ?? "Guest"}
          onGameEnd={handleGameEndModal}
          isDark={isDark}
        />
      </div>

      <OnScreenKeyboard onKeyPress={handleKeyInput} />

      <MenuModal
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        playerId={user?.username ?? "Guest"}
        isDark={isDark}
        dayWord={dayWord}
        recentGames={recentGames}
        isGuest={!user}
        guestGamesPlayed={guestGamesPlayed}
        guestGamesLimit={guestGamesLimit}
      />

      <GameEndModal
        isOpen={gameEnd.open}
        isWin={gameEnd.win}
        answer={gameEnd.answer}
        onPlayAgain={handlePlayAgain}
        guestLimitReached={guestLimitReached}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
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
  recentGames,
  onGameEndAddHistory,
  user,
  guestLimitReached,
  guestGamesPlayed,
  guestGamesLimit,
  onLoginClick,
  onSignupClick,
}) {
  const [gameEnd, setGameEnd] = useState({
    open: false,
    win: false,
    answer: "",
  });

  const handleGameEndModal = ({ result, word }) => {
    setGameEnd({ open: true, win: result === "win", answer: word });
    onGameEndAddHistory && onGameEndAddHistory({ result, word });
  };

  const handlePlayAgain = () => {
    setGameEnd({ open: false, win: false, answer: "" });
    window.location.reload();
  };

  if (guestLimitReached) {
    return (
      <div
        className="min-h-screen p-6 flex flex-col"
        style={{ ...backgroundStyle, fontFamily: "'Quicksand', sans-serif" }}
      >
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
            user={null}
            toggleTheme={toggleTheme}
            isGuest
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 max-w-md text-center">
          <p className="text-xl font-semibold opacity-90">
            You've played 8 games as a guest.
          </p>
          <p className="text-sm opacity-80">
            Sign in or create an account to keep playing. Guest history is not
            stored.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onLoginClick}
              className="px-5 py-2.5 rounded-full bg-slate-600 hover:bg-slate-700 text-white font-semibold"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onSignupClick}
              className="px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Sign up
            </button>
          </div>
        </div>
        <MenuModal
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          playerId="Guest"
          isDark={isDark}
          dayWord={dayWord}
          recentGames={recentGames}
          isGuest
          guestGamesPlayed={guestGamesPlayed}
          guestGamesLimit={guestGamesLimit}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 flex flex-col"
      style={{ ...backgroundStyle, fontFamily: "'Quicksand', sans-serif" }}
    >
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
          user={user ? { name: user.username } : null}
          toggleTheme={toggleTheme}
          isGuest={!user}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center mt-4">
        <GameBoard
          username={user?.username ?? "Guest"}
          onGameEnd={handleGameEndModal}
          isDark={isDark}
        />
      </div>

      <div className="mt-4">
        <OnScreenKeyboard isDark={isDark} />
      </div>

      <MenuModal
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        playerId={user?.username ?? "Guest"}
        isDark={isDark}
        dayWord={dayWord}
        recentGames={recentGames}
        isGuest={!user}
        guestGamesPlayed={guestGamesPlayed}
        guestGamesLimit={guestGamesLimit}
      />

      <GameEndModal
        isOpen={gameEnd.open}
        isWin={gameEnd.win}
        answer={gameEnd.answer}
        onPlayAgain={handlePlayAgain}
        guestLimitReached={guestLimitReached}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
      />
    </div>
  );
}

export default function Home({ dayWord }) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);
  const [guestGamesPlayed, setGuestGamesPlayed] = useState(getStoredGuestCount);
  const [recentGames, setRecentGames] = useState(() => {
    try {
      const stored = localStorage.getItem("recentGames");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const isGuest = !user;
  const guestLimitReached = isGuest && guestGamesPlayed >= GUEST_GAMES_LIMIT;

  useEffect(() => {
    localStorage.setItem("recentGames", JSON.stringify(recentGames));
  }, [recentGames]);

  useEffect(() => {
    localStorage.setItem(GUEST_GAMES_STORAGE_KEY, String(guestGamesPlayed));
  }, [guestGamesPlayed]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleGameEndAddHistory = ({ result, word }) => {
    const now = new Date();
    const timeString = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setRecentGames((prev) => [
      {
        id: prev.length ? prev[0].id + 1 : 1,
        word: word.toUpperCase(),
        time: timeString,
        status: result === "win" ? "WON" : "LOST",
        result: result === "win" ? "✔" : "✗",
        points: result === "win" ? "+100 points" : "+10 points",
        duration: "-",
        colors: [],
      },
      ...prev,
    ]);
    if (isGuest && guestGamesPlayed < GUEST_GAMES_LIMIT) {
      setGuestGamesPlayed((c) => Math.min(c + 1, GUEST_GAMES_LIMIT));
    }
  };

  const onLoginClick = () => navigate("/login");
  const onSignupClick = () => navigate("/register");

  const handleKeyInput = (key) => {
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
    dayWord,
    handleKeyInput,
    recentGames,
    onGameEndAddHistory: handleGameEndAddHistory,
    user,
    guestLimitReached,
    guestGamesPlayed,
    guestGamesLimit: GUEST_GAMES_LIMIT,
    onLoginClick,
    onSignupClick,
  };

  return isMobile ? <HomeMobile {...homeProps} /> : <HomeDesk {...homeProps} />;
}
