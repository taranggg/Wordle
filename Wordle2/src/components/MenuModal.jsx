import { Dialog } from "@headlessui/react";
import { History, X, LogOut, LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import HistorySection from "./HistorySection";
import { useWindowDimensions } from "../hooks/dimensions";
import WordOfTheDay from "./Wotd";
import { useAuth } from "../context/AuthContext";

export default function MenuModal({
  isOpen,
  onClose,
  isDark,
  dayWord,
  recentGames,
  isGuest,
  guestGamesPlayed,
  guestGamesLimit,
}) {
  const { isMobile } = useWindowDimensions();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate("/login", { replace: true });
  };

  const mobileVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  const desktopVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        className={`fixed inset-0 flex ${
          isMobile ? "items-end justify-center" : "items-start justify-start"
        }`}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={isMobile ? mobileVariants : desktopVariants}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6,
          }}
          className={`bg-[#39393a5d] text-white shadow-xl z-50 relative flex flex-col ${
            isMobile
              ? "w-full h-full rounded-none pt-16 pb-4" // Fullscreen mobile
              : "w-[90vw] h-full rounded-r-xl pt-4 pb-4 max-w-lg" // Drawer style on desktop
          } p-4`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-white hover:bg-white/10 rounded-full p-2 transition-colors z-10"
            aria-label="Close"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Only show History tab for now */}
          <div className="flex bg-white/10 rounded-full overflow-hidden mb-4 w-fit mx-auto p-1 shadow-inner">
            {/*
            <button
              onClick={() => setTab("leaderboard")}
              className={`px-5 py-2 font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                tab === "leaderboard"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-300"
              } rounded-full`}
            >
              <Trophy className="w-5 h-5" />
              Leaderboard
            </button>
            */}
            <button
              className={`px-5 py-2 font-semibold flex items-center justify-center gap-2 transition-all text-sm bg-green-600 text-white shadow-md rounded-full`}
              disabled
            >
              <History className="w-5 h-5" />
              History
            </button>
          </div>

          {/* Word of the Day at the top of sidebar */}
          <div className="mb-4 flex justify-center">
            <WordOfTheDay isDark={isDark} dayWord={dayWord} />
          </div>
          {/* Only show History content */}
          <div className="flex-1 w-full overflow-hidden min-h-0">
            <HistorySection isDark={isDark} recentGames={recentGames} />
          </div>

          {/* Auth: Sign in / Sign up for guest, Sign out for logged-in */}
          <div className="pt-4 border-t border-white/20 space-y-2">
            {isGuest ? (
              <>
                {typeof guestGamesPlayed === "number" && (
                  <p className="text-center text-sm text-white/70 py-1">
                    Playing as guest ({guestGamesPlayed}/{guestGamesLimit ?? 8}{" "}
                    games). History is not stored.
                  </p>
                )}
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-green-300 hover:bg-white/10 transition"
                >
                  <LogIn className="w-5 h-5" />
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-blue-300 hover:bg-white/10 transition"
                >
                  <UserPlus className="w-5 h-5" />
                  Create account
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-300 hover:bg-white/10 transition"
              >
                <LogOut className="w-5 h-5" />
                Sign out
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}
