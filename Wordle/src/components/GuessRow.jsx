import React from "react";

const WORD_LENGTH = 5;

export default function GuessRow({ guess, animate }) {
  return (
    <div className="flex space-x-1 justify-center">
      {Array.from({ length: WORD_LENGTH }).map((_, j) => {
        const letter = guess ? guess.word[j] : "";
        const status = guess ? guess.status[j] : "";
        const base =
          "w-12 h-12 flex items-center justify-center border text-xl font-bold uppercase";
        const color =
          status === "correct"
            ? "bg-green-500 text-white"
            : status === "present"
            ? "bg-yellow-400 text-white"
            : status === "absent"
            ? "bg-gray-400 text-white"
            : "bg-white text-black";

        return (
          <div
            key={j}
            className={`${base} ${color} rounded ${
              animate ? "animate-bounce" : ""
            }`}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}
