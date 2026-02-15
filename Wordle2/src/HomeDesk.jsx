import { useState, useCallback } from "react";
import GameEndModal from "./components/GameEndModal";
import GameBoard from "./components/GameBoard";
import MenuModal from "./components/MenuModal";
import { MenuButton, ProfileButton } from "./components/Navbar";
import OnScreenKeyboard from "./components/OnScreenKeyboard";
import HintCard from "./components/HintCard";
import wordleLogo from "./assets/wordlelogo.png";
import { Lightbulb } from "lucide-react";

const glassNav = (isDark) =>
  isDark
    ? "bg-white/10 backdrop-blur-xl border border-white/20"
    : "bg-white/30 backdrop-blur-xl border border-white/40";
const glassCard = (isDark) =>
  isDark
    ? "bg-white/12 backdrop-blur-2xl border border-white/25"
    : "bg-white/40 backdrop-blur-2xl border border-white/50";

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
  const [hintData, setHintData] = useState({
    hints: [],
    availableHintCount: 0,
  });
  const [hintOpen, setHintOpen] = useState(false);
  const onHintData = useCallback(
    (data) => setHintData(data || { hints: [], availableHintCount: 0 }),
    [],
  );

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
        className="home-desk min-h-screen flex flex-col items-center justify-center p-6"
        style={{ ...backgroundStyle, fontFamily: "'Quicksand', sans-serif" }}
      >
        <nav
          className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 ${glassNav(isDark)}`}
        >
          <MenuButton onClick={toggleMenu} isDark={isDark} />
          <img
            src={wordleLogo}
            alt="Wordle"
            className="h-8 w-auto object-contain opacity-90"
            draggable={false}
          />
          <ProfileButton
            isDark={isDark}
            user={null}
            toggleTheme={toggleTheme}
            isGuest
            iconSize={22}
          />
        </nav>
        <div
          className={`w-full max-w-md rounded-3xl p-8 text-center ${glassCard(isDark)}`}
        >
          <p
            className={`text-xl font-semibold ${
              isDark ? "text-white/95" : "text-gray-800"
            }`}
          >
            You've played 8 games as a guest.
          </p>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-white/70" : "text-gray-600"
            }`}
          >
            Sign in or create an account to keep playing. Guest history is not
            stored.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-xl px-5 py-2.5 bg-white/20 hover:bg-white/30 font-semibold transition-colors"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onSignupClick}
              className="rounded-xl px-5 py-2.5 bg-green-500/80 hover:bg-green-500 font-semibold text-white transition-colors"
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
      className="home-desk min-h-screen flex flex-col"
      style={{ ...backgroundStyle, fontFamily: "'Quicksand', sans-serif" }}
    >
      {/* Top bar: slimmer, same icon sizes */}
      <nav
        className={`flex-shrink-0 flex items-center justify-between gap-3 px-4 py-2 ${glassNav(isDark)}`}
      >
        <MenuButton onClick={toggleMenu} isDark={isDark} />
        <div className="flex items-center gap-4">
          <img
            src={wordleLogo}
            alt="Wordle"
            className="h-9 w-auto object-contain opacity-95"
            draggable={false}
          />
          <span
            className={`hidden sm:inline text-sm ${
              isDark ? "text-white/60" : "text-gray-500"
            }`}
          >
            Guess in six tries
          </span>
          <div className="flex rounded-full p-1 bg-white/10">
            <button
              type="button"
              onClick={() => setIsDailyMode(false)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                !isDailyMode
                  ? "bg-white/30 text-white shadow-inner"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Random
            </button>
            <button
              type="button"
              onClick={() => setIsDailyMode(true)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isDailyMode
                  ? "bg-white/30 text-white shadow-inner"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Daily
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setHintOpen((o) => !o)}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? "hover:bg-white/15" : "hover:bg-black/10"
              }`}
              title="Hint"
              aria-expanded={hintOpen}
            >
              <Lightbulb
                size={20}
                className={
                  hintData.availableHintCount > 0
                    ? "text-yellow-400"
                    : "text-white/50"
                }
              />
            </button>
            {hintOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  aria-hidden="true"
                  onClick={() => setHintOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-40 w-72">
                  <HintCard
                    hints={hintData.hints}
                    availableHintCount={hintData.availableHintCount}
                    isDark={isDark}
                    compact
                    noCard
                  />
                </div>
              </>
            )}
          </div>
          <ProfileButton
            isDark={isDark}
            user={user ? { name: user.username } : null}
            toggleTheme={toggleTheme}
            isGuest={!user}
            iconSize={22}
          />
        </div>
      </nav>

      {/* Main: board + keyboard only, no extra card */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 py-4 gap-4">
        <div className="flex-shrink-0 w-full max-w-sm flex justify-center">
          <GameBoard
            key={gameKey}
            username={user?.username ?? "Guest"}
            onGameEnd={handleGameEndModal}
            isDark={isDark}
            useDailyWord={isDailyMode}
            isGuest={!user}
            denseDesktop
            hideHint
            onHintData={onHintData}
          />
        </div>
        <div className="flex-shrink-0 w-full max-w-md flex justify-center">
          <OnScreenKeyboard isDark={isDark} compact noWrapper />
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
