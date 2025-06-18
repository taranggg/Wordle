import React, { useState } from "react";
import { Lightbulb } from "lucide-react";

export default function HintCard({
  hints = ["This is hint one.", "This is hint two."],
  isDark,
  availableHintCount = 0,
}) {
  const [visibleHints, setVisibleHints] = useState(0);

  const revealHint = () => {
    if (visibleHints < availableHintCount) {
      setVisibleHints((prev) => prev + 1);
    }
  };

  const cardStyle = isDark
    ? "bg-white/10 text-white border-white/20"
    : "bg-black/10 text-gray-900 border-black/10";

  const hintAvailable = visibleHints < availableHintCount;

  return (
    <div
      className={`relative p-4 sm:p-5 rounded-2xl border shadow-md backdrop-blur-md transition-colors duration-300 ${cardStyle}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">💡 Hint</h2>
        <button
          onClick={revealHint}
          disabled={!hintAvailable}
          title="Reveal next hint"
          className={`p-1 rounded-full transition-all duration-300 ${
            hintAvailable ? "hover:scale-110" : "opacity-40 cursor-not-allowed"
          }`}
        >
          <Lightbulb
            size={22}
            className={`transition-colors duration-300 ${
              hintAvailable ? "text-yellow-400 drop-shadow-md" : "text-gray-500"
            }`}
          />
        </button>
      </div>

      <div className="space-y-2">
        {hints.slice(0, visibleHints).map((hint, idx) => (
          <p
            key={idx}
            className="text-sm sm:text-base leading-snug border-l-4 pl-2 border-yellow-300 animate-fade-in"
          >
            Hint {idx + 1}: {hint}
          </p>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
