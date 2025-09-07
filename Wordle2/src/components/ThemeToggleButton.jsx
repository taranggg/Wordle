import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggleButton({ toggled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="relative flex items-center justify-center focus:outline-none"
      style={{ width: "2.5rem", height: "2.5rem" }}
    >
      <AnimatePresence initial={false} mode="wait">
        {toggled ? (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute"
            style={{ color: "#FACC15", fontSize: "2.5rem" }}
          >
            <Moon size={40} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute"
            style={{ color: "#374151", fontSize: "2.5rem" }}
          >
            <Sun size={40} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
