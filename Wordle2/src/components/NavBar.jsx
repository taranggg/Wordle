import { useState } from "react";
import { Menu, User } from "lucide-react";
import wordleLogo from "../assets/wordlelogo.png";
import ProfileModal from "./ProfileModal";

// Mobile NavBar with logo
export function MobNavBar({ onMenuClick, isDark, user, toggleTheme }) {
  const iconColor = isDark ? "#fff" : "#222";
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3 bg-transparent">
        {/* Menu Icon */}
        <button
          onClick={onMenuClick}
          className="hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full transition"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" color={iconColor} />
        </button>

        {/* Logo */}
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

        {/* Profile Icon */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full transition"
          aria-label="Profile"
        >
          <User className="w-6 h-6" color={iconColor} />
        </button>
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    </>
  );
}

// Desktop Menu Button
export function MenuButton({ onClick, isDark }) {
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

// Desktop Profile Button
export function ProfileButton({ isDark, user, toggleTheme }) {
  const iconColor = isDark ? "#fff" : "#222";
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsProfileOpen(true)}
        className="hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full transition"
        aria-label="Profile"
      >
        <User className="w-6 h-6" color={iconColor} />
      </button>
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    </>
  );
}
