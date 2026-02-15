import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const MotionSpan = motion.span;

interface ThemeToggleButtonProps {
  toggled: boolean;
  onToggle: () => void;
  size?: number;
}

export default function ThemeToggleButton({
  toggled,
  onToggle,
  size = 24,
}: ThemeToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="relative flex items-center justify-center focus:outline-none p-1 rounded-full hover:opacity-80 transition-opacity"
      style={{ width: size + 8, height: size + 8 }}
    >
      <AnimatePresence initial={false} mode="wait">
        {toggled ? (
          <MotionSpan
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute"
            style={{ color: "#FACC15" }}
          >
            <Moon size={size} />
          </MotionSpan>
        ) : (
          <MotionSpan
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute"
            style={{ color: "#374151" }}
          >
            <Sun size={size} />
          </MotionSpan>
        )}
      </AnimatePresence>
    </button>
  );
}
