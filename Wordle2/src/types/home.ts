import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type { User } from "./api";
import type { DayWordData, RecentGameDisplay } from "./api";

export interface HomeLayoutProps {
  backgroundStyle: CSSProperties;
  isDark: boolean;
  toggleTheme: () => void;
  menuOpen: boolean;
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
  dayWord: DayWordData;
  recentGames: RecentGameDisplay[];
  onGameEndAddHistory: (payload: {
    result: string;
    word: string;
    lastGuessStatus?: string[];
    attempts?: number;
  }) => void;
  user: User | null;
  guestLimitReached: boolean;
  guestGamesPlayed: number;
  guestGamesLimit: number;
  onLoginClick: () => void;
  onSignupClick: () => void;
  isDailyMode: boolean;
  setIsDailyMode: (v: boolean) => void;
  gameKey: number;
  setGameKey: Dispatch<SetStateAction<number>>;
}
