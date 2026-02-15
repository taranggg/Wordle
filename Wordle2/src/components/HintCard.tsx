import { useState } from "react";
import { Lightbulb } from "lucide-react";

interface HintCardProps {
  hints?: string[];
  isDark?: boolean;
  availableHintCount?: number;
  compact?: boolean;
  noCard?: boolean;
}

export default function HintCard({
  hints = ["This is hint one.", "This is hint two."],
  isDark = false,
  availableHintCount = 0,
  compact = false,
  noCard = false,
}: HintCardProps) {
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

  const content = (
    <>
      <div
        className={`flex items-center justify-between ${compact ? "mb-1.5" : "mb-3"}`}
      >
        <h2
          className={
            compact ? "text-sm font-semibold" : "text-lg font-semibold"
          }
        >
          💡 Hint
        </h2>
        <button
          onClick={revealHint}
          disabled={!hintAvailable}
          title="Reveal next hint"
          className={`p-1 rounded-full transition-all duration-300 ${
            hintAvailable ? "hover:scale-110" : "opacity-40 cursor-not-allowed"
          }`}
        >
          <Lightbulb
            size={compact ? 18 : 22}
            className={`transition-colors duration-300 ${
              hintAvailable ? "text-yellow-400 drop-shadow-md" : "text-gray-500"
            }`}
          />
        </button>
      </div>

      <div className={compact ? "space-y-1" : "space-y-2"}>
        {hints.slice(0, visibleHints).map((hint, idx) => (
          <p
            key={idx}
            className={`leading-snug border-l-4 pl-2 border-yellow-300 animate-fade-in ${
              compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            }`}
          >
            Hint {idx + 1}: {hint}
          </p>
        ))}
      </div>
    </>
  );

  if (noCard) {
    return (
      <div
        className={`rounded-2xl border shadow-md backdrop-blur-md transition-colors duration-300 ${cardStyle} ${
          compact ? "p-2 sm:p-3" : "p-4 sm:p-5"
        }`}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl border shadow-md backdrop-blur-md transition-colors duration-300 ${cardStyle} ${
        compact ? "p-2 sm:p-3" : "p-4 sm:p-5"
      }`}
    >
      {content}
    </div>
  );
}
