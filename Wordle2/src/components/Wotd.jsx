import React, { useState } from "react";
import { BookOpen, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WordOfTheDay({
  dayWord,
  isDark,
  buttonPosition = { left: "3rem", top: "4.5rem" },
}) {
  const [showCard, setShowCard] = useState(false);

  if (!dayWord?.word) return null;

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      {!showCard && (
        <button
          onClick={() => setShowCard(true)}
          className="flex items-start p-3 mb-2 animate-pulse hover:scale-105 transition-transform absolute"
          style={{
            left: buttonPosition.left,
            top: buttonPosition.top,
            transform: "translateX(-40%)",
          }}
          aria-label="Show Word of the Day"
        >
          <BookOpen className="w-7 h-7 text-yellow-500 drop-shadow-lg" />
        </button>
      )}
      {/* Sliding Card */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className={`w-full max-w-xs sm:max-w-md rounded-2xl p-4 border shadow-lg flex flex-col items-center relative
              ${
                isDark
                  ? "bg-gray-200/20 border-white/30"
                  : "bg-white/20 border-zinc-200"
              }
            `}
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
              fontFamily: "'Quicksand', sans-serif",
            }}
          >
            {/* Minimize Button */}
            <button
              onClick={() => setShowCard(false)}
              className={`absolute top-2 right-2 p-1 rounded-full transition
                ${isDark ? "hover:bg-white/20" : "hover:bg-zinc-200"}
              `}
              aria-label="Minimize"
            >
              <Minus
                className={`w-4 h-4 ${isDark ? "text-white" : "text-zinc-700"}`}
              />
            </button>
            <h1
              className={`text-xl font-bold text-center font-quicksand mb-1 drop-shadow
              ${isDark ? "text-amber-100" : "text-yellow-700"}
            `}
            >
              Word of the Day
            </h1>
            <div className="text-center">
              <span
                className={`block text-base font-semibold
                ${isDark ? "text-white" : "text-zinc-800"}
              `}
              >
                {dayWord.word.toUpperCase()}
              </span>
              {dayWord.phonetic && (
                <span
                  className={`block text-sm mb-1
                  ${isDark ? "text-green-200" : "text-green-700"}
                `}
                >
                  {dayWord.phonetic}
                </span>
              )}
              <span
                className={`block text-sm italic mt-1
                ${isDark ? "text-white/90" : "text-zinc-600"}
              `}
              >
                {dayWord.meaning}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
