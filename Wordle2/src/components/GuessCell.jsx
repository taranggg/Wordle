import { useEffect, useState } from "react";
import "../style/GuessCell.css";

export default function GuessCell({
  letter = "",
  status = "",
  isDark,
  compact,
}) {
  const [animate, setAnimate] = useState(false);
  const [prevLetter, setPrevLetter] = useState("");

  useEffect(() => {
    if (letter && !prevLetter) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
    setPrevLetter(letter);
  }, [letter]);

  const base = compact
    ? "min-w-0 w-14 h-14 text-xl flex items-center justify-center border font-bold uppercase rounded transition-all duration-300 mx-1.5"
    : "min-w-0 w-10 h-10 text-base " +
      "sm:w-12 sm:h-12 sm:text-lg " +
      "md:w-14 md:h-14 md:text-xl " +
      "lg:w-16 lg:h-16 lg:text-2xl " +
      "flex items-center justify-center border font-bold uppercase rounded transition-all duration-300 mx-1";

  const statusColors = isDark
    ? {
        correct: "bg-green-500/70 text-white border-green-600/80",
        present: "bg-yellow-400/70 text-white border-yellow-500/80",
        absent: "bg-gray-400/70 text-white border-gray-500/80",
      }
    : {
        correct: "bg-green-500/50 text-white border-green-600/80",
        present: "bg-yellow-400/50 text-white border-yellow-500/80",
        absent: "bg-gray-400/50 text-white border-gray-500/80",
      };

  const defaultStyle = isDark
    ? "bg-white/10 text-white border-white/20"
    : "bg-black/10 text-gray-900 border-black/20";

  const colorClass = status ? statusColors[status] : defaultStyle;

  return (
    <div className={`${base} ${colorClass} ${animate ? "flip" : ""}`}>
      {letter}
    </div>
  );
}
