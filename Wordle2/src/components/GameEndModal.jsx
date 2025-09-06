import { motion, AnimatePresence } from "framer-motion";

export default function GameEndModal({ isOpen, isWin, answer, onPlayAgain }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.7, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative w-80 max-w-[90vw] rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center border-4 border-dashed
              ${
                isWin
                  ? "bg-yellow-200 border-yellow-400"
                  : "bg-pink-200 border-pink-400"
              }
            `}
            style={{
              boxShadow: isWin
                ? "0 0 40px 10px #facc15aa"
                : "0 0 40px 10px #f472b6aa",
            }}
          >
            <div className="text-5xl mb-2 animate-bounce">
              {isWin ? "🎉" : "😵"}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isWin ? "You Win!" : "Game Over!"}
            </h2>
            <p className="mb-4 text-lg font-mono">
              {isWin ? "You cracked the word!" : `The word was: `}
              {!isWin && (
                <span className="font-extrabold text-pink-700 ml-1 animate-pulse">
                  {answer}
                </span>
              )}
            </p>
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95, rotate: 5 }}
              className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-bold text-lg shadow-lg border-2 border-white/60 hover:from-pink-400 hover:to-yellow-400 transition-all duration-200"
              onClick={onPlayAgain}
            >
              {isWin ? "Play Again! 🚀" : "Try Again! 🔄"}
            </motion.button>
            <div className="absolute -top-6 right-6 text-3xl animate-spin-slow select-none pointer-events-none">
              {isWin ? "✨" : "💀"}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add this to your game logic and show when the game ends!
