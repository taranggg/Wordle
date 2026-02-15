import React from "react";
import GuessCell from "./GuessCell";

const WORD_LENGTH = 5;

export default function GuessRow({ guess, isDark, compact }) {
  return (
    <div
      className={`flex justify-center ${compact ? "space-x-0.5" : "space-x-1"}`}
    >
      {Array.from({ length: WORD_LENGTH }).map((_, j) => {
        const letter = guess ? guess.word[j] : "";
        const status = guess ? guess.status[j] : "";
        return (
          <GuessCell
            key={j}
            letter={letter}
            status={status}
            isDark={isDark}
            compact={compact}
          />
        );
      })}
    </div>
  );
}
