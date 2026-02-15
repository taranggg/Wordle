import { Dialog } from "@headlessui/react";
import { X, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggleButton from "./ThemeToggleButton";
import avatarSenku from "../assets/avatarSenku.png";

const MotionDiv = motion.div;

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  isDark,
  toggleTheme,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0" aria-hidden="true" onClick={onClose} />

      <div className="fixed top-16 right-6 sm:right-10">
        <MotionDiv
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`w-80 rounded-2xl border p-4 shadow-lg backdrop-blur-md
            ${
              isDark
                ? "bg-zinc-900/20 border-white/20 text-white"
                : "bg-white/20 border-zinc-200 text-zinc-900"
            }
          `}
        >
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 rounded-full p-1 transition
              ${
                isDark
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
              }
            `}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className={`rounded-xl shadow-md p-4 mt-6 flex flex-col items-center text-center
                ${isDark ? "bg-zinc-800 text-white" : "bg-white text-zinc-900"}
                `}
            style={{
              background: isDark
                ? "linear-gradient(95deg, #f59e42 60%,#14b8a6 100%)"
                : "linear-gradient(95deg, #14b8a6 60%,  #f59e42 100%)",
            }}
          >
            <img
              src={avatarSenku}
              alt="Avatar"
              className="w-16 h-16 rounded-full border border-gray-300 shadow-sm object-cover"
            />
            <h2
              className={`text-lg font-semibold mt-2 ${
                isDark ? "text-gray-600" : "text-zinc-300"
              }`}
            >
              {user?.name || "Guest"}
            </h2>
            <p
              className={`text-sm ${
                isDark ? "text-gray-600" : "text-zinc-300"
              }`}
            >
              {user?.email || "Not logged in"}
            </p>
          </div>
          <div className="absolute bottom-1 right-2" style={{ zIndex: 10 }}>
            <ThemeToggleButton toggled={isDark} onToggle={toggleTheme} />
          </div>
        </MotionDiv>
      </div>
    </Dialog>
  );
}
