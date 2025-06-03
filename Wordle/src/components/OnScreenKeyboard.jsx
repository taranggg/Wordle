import React from "react";

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export default function OnScreenKeyboard({ onKeyPress }) {
  return (
    <div className="mt-6 space-y-2">
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center space-x-1">
          {row.map((key) => {
            const isActionKey = key === "ENTER" || key === "BACKSPACE";
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  px-3 py-2 sm:px-4 sm:py-3 rounded-md text-xs sm:text-sm font-semibold uppercase
                  border shadow-sm transition-all duration-150
                  hover:-translate-y-0.5 active:scale-95
                  space-x-0.5 sm:space-x-1
                  ${
                    isActionKey
                      ? `
                        bg-orange-500 text-white border-orange-400
                       
                      `
                      : `
                        bg-gray-700 text-gray-100 border-gray-500
                       
                      `
                  }
                  hover:shadow-md dark:hover:shadow-lg
                `}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
