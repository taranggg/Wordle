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
import { createGame, getGamesHistory } from "./api/client";

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
  recentGames,
  onGameEndAddHistory,
  user,
  guestLimitReached,
  guestGamesPlayed,
  guestGamesLimit,
  onLoginClick,
  onSignupClick,
  isDailyMode,
  setIsDailyMode,
  gameKey,
  setGameKey,
}) {
  const [gameEnd, setGameEnd] = useState({
    open: false,
    win: false,
    answer: "",
    lastGuessStatus: [],
    attempts: 0,
  });

  const handleGameEndModal = (payload) => {
    setGameEnd({
      open: true,
      win: payload.result === "win",
      answer: payload.word,
      lastGuessStatus: payload.lastGuessStatus,
      attempts: payload.attempts,
    });
    onGameEndAddHistory && onGameEndAddHistory(payload);
  };

  const handlePlayAgain = () => {
    setGameEnd({
      open: false,
      win: false,
      answer: "",
      lastGuessStatus: [],
      attempts: 0,
    });
    setGameKey((k) => k + 1);
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

      <div className="flex gap-2 justify-center mt-2">
        <button
          type="button"
          onClick={() => setIsDailyMode(false)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            !isDailyMode ? "bg-green-600 text-white" : "bg-white/20"
          }`}
        >
          Random
        </button>
        <button
          type="button"
          onClick={() => setIsDailyMode(true)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            isDailyMode ? "bg-green-600 text-white" : "bg-white/20"
          }`}
        >
          Daily
        </button>
      </div>

      <div className="flex-1 mt-4 mb-10">
        <GameBoard
          key={gameKey}
          username={user?.username ?? "Guest"}
          onGameEnd={handleGameEndModal}
          isDark={isDark}
          useDailyWord={isDailyMode}
          isGuest={!user}
        />
      </div>

      <OnScreenKeyboard isDark={isDark} />

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
        attempts={gameEnd.attempts}
        lastGuessStatus={gameEnd.lastGuessStatus}
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
  isDailyMode,
  setIsDailyMode,
  gameKey,
  setGameKey,
}) {
  const [gameEnd, setGameEnd] = useState({
    open: false,
    win: false,
    answer: "",
    lastGuessStatus: [],
    attempts: 0,
  });

  const handleGameEndModal = (payload) => {
    setGameEnd({
      open: true,
      win: payload.result === "win",
      answer: payload.word,
      lastGuessStatus: payload.lastGuessStatus,
      attempts: payload.attempts,
    });
    onGameEndAddHistory && onGameEndAddHistory(payload);
  };

  const handlePlayAgain = () => {
    setGameEnd({
      open: false,
      win: false,
      answer: "",
      lastGuessStatus: [],
      attempts: 0,
    });
    setGameKey((k) => k + 1);
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
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setIsDailyMode(false)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                !isDailyMode
                  ? "bg-green-600 text-white"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              Random
            </button>
            <button
              type="button"
              onClick={() => setIsDailyMode(true)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                isDailyMode
                  ? "bg-green-600 text-white"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              Daily
            </button>
          </div>
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
          key={gameKey}
          username={user?.username ?? "Guest"}
          onGameEnd={handleGameEndModal}
          isDark={isDark}
          useDailyWord={isDailyMode}
          isGuest={!user}
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
        attempts={gameEnd.attempts}
        lastGuessStatus={gameEnd.lastGuessStatus}
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
  const [serverGames, setServerGames] = useState([]);
  const [isDailyMode, setIsDailyMode] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const isGuest = !user;
  const guestLimitReached = isGuest && guestGamesPlayed >= GUEST_GAMES_LIMIT;

  useEffect(() => {
    localStorage.setItem("recentGames", JSON.stringify(recentGames));
  }, [recentGames]);

  useEffect(() => {
    if (user) {
      getGamesHistory()
        .then((games) => setServerGames(games))
        .catch(() => setServerGames([]));
    } else {
      setServerGames([]);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(GUEST_GAMES_STORAGE_KEY, String(guestGamesPlayed));
  }, [guestGamesPlayed]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const statusToColor = (s) =>
    s === "correct" ? "green" : s === "present" ? "yellow" : "gray";

  const fetchServerHistory = () => {
    if (user) {
      getGamesHistory()
        .then((games) => setServerGames(games))
        .catch(() => {});
    }
  };

  const handleGameEndAddHistory = ({
    result,
    word,
    lastGuessStatus = [],
    attempts = 6,
  }) => {
    const now = new Date();
    const timeString = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const colors = Array.isArray(lastGuessStatus)
      ? lastGuessStatus.map(statusToColor)
      : [];
    const score = result === "win" ? 100 : 10;
    if (!isGuest) {
      setRecentGames((prev) => [
        {
          id: prev.length ? prev[0].id + 1 : 1,
          word: word.toUpperCase(),
          time: timeString,
          status: result === "win" ? "WON" : "LOST",
          result: result === "win" ? "✔" : "✗",
          points: `+${score} points`,
          duration: "-",
          colors,
        },
        ...prev,
      ]);
    }
    if (isGuest && guestGamesPlayed < GUEST_GAMES_LIMIT) {
      setGuestGamesPlayed((c) => Math.min(c + 1, GUEST_GAMES_LIMIT));
    }
    if (user) {
      createGame({
        wordText: word,
        attempts,
        status: result === "win" ? "win" : "loss",
        score,
      })
        .then(() => fetchServerHistory())
        .catch(() => {});
    }
  };

  const onLoginClick = () => navigate("/login");
  const onSignupClick = () => navigate("/register");

  // On-screen keyboard is wired via KeyboardContext (OnScreenKeyboard calls pressKey, GameBoard uses keyPressed)

  const backgroundStyle = {
    background: isDark
      ? "linear-gradient(135deg, #232526 0%, #770101 100%)"
      : "linear-gradient(135deg, #a8edea 0%, #FCE8AF 100%)",
  };

  const displayGames = user
    ? serverGames.map((g, i) => ({
        id: g._id || i,
        word: (g.wordText || "").toUpperCase(),
        time: g.createdAt
          ? new Date(g.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
        status: g.status === "win" ? "WON" : "LOST",
        result: g.status === "win" ? "✔" : "✗",
        points: `+${g.score || 0} points`,
        duration: "-",
        colors: [],
      }))
    : [];

  const homeProps = {
    backgroundStyle,
    isDark,
    toggleTheme,
    menuOpen,
    toggleMenu,
    setMenuOpen,
    dayWord,
    recentGames: displayGames,
    onGameEndAddHistory: handleGameEndAddHistory,
    user,
    guestLimitReached,
    guestGamesPlayed,
    guestGamesLimit: GUEST_GAMES_LIMIT,
    onLoginClick,
    onSignupClick,
    isDailyMode,
    setIsDailyMode: (v) => {
      setIsDailyMode(v);
      setGameKey((k) => k + 1);
    },
    gameKey,
    setGameKey,
  };

  return isMobile ? <HomeMobile {...homeProps} /> : <HomeDesk {...homeProps} />;
}
