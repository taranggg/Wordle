import { useState } from "react";
import GameEndModal from "./components/GameEndModal";
import GameBoard from "./components/GameBoard";
import MenuModal from "./components/MenuModal";
import { MobNavBar } from "./components/Navbar";
import OnScreenKeyboard from "./components/OnScreenKeyboard";

export default function HomeMobile({
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
    onGameEndAddHistory?.(payload);
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
    <div
      className="home-mobile min-h-screen flex flex-col"
      style={backgroundStyle}
    >
      <header className="flex-shrink-0 sticky top-0 z-40 bg-black/5 backdrop-blur-md border-b border-white/10">
        <MobNavBar
          onMenuClick={toggleMenu}
          isDark={isDark}
          toggleTheme={toggleTheme}
          isGuest={!user}
        />
        <div className="flex gap-2 justify-center px-4 pb-3 -mt-1">
          <button
            type="button"
            onClick={() => setIsDailyMode(false)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              !isDailyMode
                ? "bg-green-600 text-white shadow-md"
                : "bg-white/20 text-white/90 hover:bg-white/30"
            }`}
          >
            Random
          </button>
          <button
            type="button"
            onClick={() => setIsDailyMode(true)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              isDailyMode
                ? "bg-green-600 text-white shadow-md"
                : "bg-white/20 text-white/90 hover:bg-white/30"
            }`}
          >
            Daily
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 px-3 pt-4 pb-2">
        <div className="flex-1 flex flex-col items-center min-h-0 overflow-y-auto">
          <GameBoard
            key={gameKey}
            username={user?.username ?? "Guest"}
            onGameEnd={handleGameEndModal}
            isDark={isDark}
            useDailyWord={isDailyMode}
            isGuest={!user}
            compactHint
          />
        </div>
        <div className="flex-shrink-0 pt-3 pb-safe">
          <OnScreenKeyboard isDark={isDark} />
        </div>
      </main>

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
