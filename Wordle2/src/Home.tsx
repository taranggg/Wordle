import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import { useWindowDimensions } from "./hooks/dimensions";
import { createGame, getGamesHistory } from "./api/client";
import HomeMobile from "./HomeMobile";
import HomeDesk from "./HomeDesk";
import type { DayWordData, RecentGameDisplay } from "./types/api";
import type { GameRecord } from "./types/api";
import "./Home.css";

const GUEST_GAMES_STORAGE_KEY = "wordle_guest_games_count";
export const GUEST_GAMES_LIMIT = 8;

function getStoredGuestCount(): number {
  try {
    const n = parseInt(
      localStorage.getItem(GUEST_GAMES_STORAGE_KEY) ?? "0",
      10,
    );
    return Number.isFinite(n) ? Math.min(Math.max(0, n), GUEST_GAMES_LIMIT) : 0;
  } catch {
    return 0;
  }
}

export interface HomeProps {
  dayWord: DayWordData;
}

export default function Home({ dayWord }: HomeProps) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);
  const [guestGamesPlayed, setGuestGamesPlayed] = useState(getStoredGuestCount);
  const [serverGames, setServerGames] = useState<GameRecord[]>([]);
  const [isDailyMode, setIsDailyMode] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const isGuest = !user;
  const guestLimitReached = isGuest && guestGamesPlayed >= GUEST_GAMES_LIMIT;

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
    attempts = 6,
  }: {
    result: string;
    word: string;
    lastGuessStatus?: string[];
    attempts?: number;
  }) => {
    const score = result === "win" ? 100 : 10;
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
    if (isGuest && guestGamesPlayed < GUEST_GAMES_LIMIT) {
      setGuestGamesPlayed((c) => Math.min(c + 1, GUEST_GAMES_LIMIT));
    }
  };

  const onLoginClick = () => navigate("/login");
  const onSignupClick = () => navigate("/register");

  const backgroundStyle: React.CSSProperties = {
    background: isDark
      ? "linear-gradient(135deg, #232526 0%, #770101 100%)"
      : "linear-gradient(135deg, #a8edea 0%, #FCE8AF 100%)",
  };

  const displayGames: RecentGameDisplay[] = user
    ? serverGames.map((g, i) => ({
        id: g._id ?? i,
        word: (g.wordText ?? "").toUpperCase(),
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
        points: `+${g.score ?? 0} points`,
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
    setIsDailyMode: (v: boolean) => {
      setIsDailyMode(v);
      setGameKey((k) => k + 1);
    },
    gameKey,
    setGameKey,
  };

  return isMobile ? <HomeMobile {...homeProps} /> : <HomeDesk {...homeProps} />;
}
