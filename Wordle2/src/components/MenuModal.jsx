import { Dialog } from "@headlessui/react";
import { Trophy, History, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import LeaderboardSection from "./LeaderBoard";
import HistorySection from "./HistorySection";
import { useWindowDimensions } from "../hooks/dimensions";

export default function MenuModal({ isOpen, onClose, isDark }) {
  const [tab, setTab] = useState("leaderboard");
  const { isMobile } = useWindowDimensions();

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

          {/* Toggle Tabs */}
          <div className="flex bg-white/10 rounded-full overflow-hidden mb-4 w-fit mx-auto p-1 shadow-inner">
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
            <button
              onClick={() => setTab("history")}
              className={`px-5 py-2 font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                tab === "history"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-300"
              } rounded-full`}
            >
              <History className="w-5 h-5" />
              History
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 w-full overflow-hidden">
            {tab === "leaderboard" ? (
              <LeaderboardSection isDark={isDark} />
            ) : (
              <HistorySection isDark={isDark} />
            )}
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}
