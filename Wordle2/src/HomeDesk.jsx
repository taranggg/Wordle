import { useState } from "react";
import GameEndModal from "./components/GameEndModal";
import GameBoard from "./components/GameBoard";
import MenuModal from "./components/MenuModal";
import { MenuButton, ProfileButton } from "./components/Navbar";
import OnScreenKeyboard from "./components/OnScreenKeyboard";
import wordleLogo from "./assets/wordlelogo.png";

export default function HomeDesk({
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
        className="home-desk min-h-screen flex flex-col"
        style={{ ...backgroundStyle, fontFamily: "'Quicksand', sans-serif" }}
      >
        <header className="flex-shrink-0 flex items-center justify-between gap-4 px-4 py-4 md:px-8 md:py-5 bg-black/5 backdrop-blur-md border-b border-white/10">
          <MenuButton onClick={toggleMenu} isDark={isDark} />
          <div className="flex flex-col items-center min-w-0 flex-1">
            <img
              src={wordleLogo}
              alt="Wordle Logo"
              width={200}
              height={80}
              className="object-contain h-12 md:h-14 w-auto"
              draggable={false}
            />
            <p
              className={`text-sm md:text-base mt-0.5 ${
                isDark ? "text-white/60" : "text-gray-500"
              }`}
            >
              Guess the word in six tries
            </p>
          </div>
          <ProfileButton
            isDark={isDark}
            user={null}
            toggleTheme={toggleTheme}
            isGuest
          />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 max-w-md text-center px-4 py-8">
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
      className="home-desk h-screen min-h-[600px] flex flex-col overflow-hidden"
      style={{ ...backgroundStyle, fontFamily: "'Quicksand', sans-serif" }}
    >
      <header className="flex-shrink-0 flex items-center justify-between gap-2 sm:gap-4 px-3 py-2 sm:px-6 sm:py-3 bg-black/5 backdrop-blur-md border-b border-white/10">
        <div className="flex-shrink-0">
          <MenuButton onClick={toggleMenu} isDark={isDark} />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 min-w-0 flex-1 justify-center">
          <img
            src={wordleLogo}
            alt="Wordle Logo"
            width={160}
            height={64}
            className="object-contain h-9 sm:h-10 w-auto"
            draggable={false}
          />
          <p
            className={`text-xs sm:text-sm hidden sm:block ${
              isDark ? "text-white/60" : "text-gray-500"
            }`}
          >
            Guess the word in six tries
          </p>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsDailyMode(false)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                !isDailyMode
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              Random
            </button>
            <button
              type="button"
              onClick={() => setIsDailyMode(true)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isDailyMode
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              Daily
            </button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <ProfileButton
            isDark={isDark}
            user={user ? { name: user.username } : null}
            toggleTheme={toggleTheme}
            isGuest={!user}
          />
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 max-w-5xl mx-auto w-full">
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center lg:justify-center gap-2 sm:gap-3 min-w-0">
          <GameBoard
            key={gameKey}
            username={user?.username ?? "Guest"}
            onGameEnd={handleGameEndModal}
            isDark={isDark}
            useDailyWord={isDailyMode}
            isGuest={!user}
            denseDesktop
          />
        </div>
        <div className="flex-shrink-0 flex items-center justify-center lg:min-w-[280px]">
          <OnScreenKeyboard isDark={isDark} compact />
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
