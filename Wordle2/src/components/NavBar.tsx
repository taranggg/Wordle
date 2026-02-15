import { Menu } from "lucide-react";
import wordleLogo from "../assets/wordlelogo.png";
import ThemeToggleButton from "./ThemeToggleButton";

interface MobNavBarProps {
  onMenuClick: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  isGuest?: boolean;
}

export function MobNavBar({
  onMenuClick,
  isDark,
  toggleTheme,
}: MobNavBarProps) {
  const iconColor = isDark ? "#fff" : "#222";
  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3 bg-transparent">
        <button
          onClick={onMenuClick}
          className="hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full transition"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" color={iconColor} />
        </button>

        <div className="flex items-center justify-center">
          <img
            src={wordleLogo}
            alt="Wordle Logo"
            width={120}
            height={40}
            className="object-contain"
            draggable={false}
          />
        </div>

        <ThemeToggleButton toggled={isDark} onToggle={toggleTheme} />
      </nav>
    </>
  );
}

export function MenuButton({
  onClick,
  isDark,
}: {
  onClick: () => void;
  isDark: boolean;
}) {
  const iconColor = isDark ? "#fff" : "#222";
  return (
    <button
      onClick={onClick}
      className="hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full transition"
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6" color={iconColor} />
    </button>
  );
}

export function ProfileButton({
  isDark,
  toggleTheme,
  iconSize = 22,
}: {
  isDark: boolean;
  toggleTheme: () => void;
  iconSize?: number;
  isGuest?: boolean;
  user: { name: string } | null;
}) {
  return (
    <ThemeToggleButton
      toggled={isDark}
      onToggle={toggleTheme}
      size={iconSize}
    />
  );
}
