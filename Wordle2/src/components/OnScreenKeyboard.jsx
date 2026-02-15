import React from "react";
import { motion } from "framer-motion";
import { useKeyboard } from "../context/KeyboardContext";
import { FaLongArrowAltRight } from "react-icons/fa"; // For Enter
import { MdBackspace } from "react-icons/md"; // For Backspace

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export default function OnScreenKeyboard({ isDark, compact = false }) {
  const getKeyColor = (key) => {
    const orangeKeys = ["ENTER", "BACKSPACE", "E", "R", "T", "Y", "O", "L"];
    return orangeKeys.includes(key) ? "bg-orange-400/25" : "bg-black/10";
  };
  const { pressKey } = useKeyboard();
  const handleKeyPress = (key) => {
    pressKey(key);
  };

  const iconSize = compact ? 16 : 20;
  const keySize = compact
    ? "min-w-[22px] max-w-[28px] h-6 sm:h-7 text-[10px] sm:text-xs"
    : "min-w-[28px] max-w-[36px] h-8 sm:h-9 text-xs sm:text-sm";

  return (
    <div className="w-full flex justify-center">
      <div
        className={`w-full rounded-2xl bg-white/30 backdrop-blur-lg shadow-2xl border border-white/40 overflow-hidden box-border ${
          compact ? "max-w-[260px] p-1.5 sm:p-2" : "max-w-md p-2 sm:p-4"
        }`}
      >
        <div
          className={`space-y-0.5 px-0 sm:px-1 ${compact ? "" : "sm:px-2"} mt-0`}
        >
          {KEYS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center gap-0.5 sm:gap-1"
            >
              {row.map((key) => {
                let displayKey = key;
                let isSpecial = false;
                if (key === "ENTER") {
                  displayKey = <FaLongArrowAltRight size={iconSize} />;
                  isSpecial = true;
                }
                if (key === "BACKSPACE") {
                  displayKey = <MdBackspace size={iconSize} />;
                  isSpecial = true;
                }
                return (
                  <motion.button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    whileTap={{ scale: 0.93 }}
                    whileHover={{ scale: 1.04 }}
                    className={`
                      ${getKeyColor(key)}
                      ${isDark ? "text-white" : "text-black"}
                      font-semibold
                      rounded-lg
                      shadow
                      border ${
                        key === "BACKSPACE"
                          ? "border-black/80"
                          : "border-transparent"
                      }
                      transition-all duration-200
                      flex-1 flex items-center justify-center
                      aspect-square
                      ${keySize}
                      ${isSpecial ? "px-0" : "px-1"}
                    `}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {displayKey}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
