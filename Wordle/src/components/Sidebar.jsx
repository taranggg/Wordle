import React from "react";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";

export default function Sidebar({
  isOpen,
  onClose,
  gameHistory,
  username,
  handleLogout,
}) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } flex flex-col`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <Profile username={username} onLogout={handleLogout} />
        <div>
          <Leaderboard />
        </div>
        <div className=" p-4">
          <h2 className="font-display text-lg mb-4 font-bold text-gray-800 dark:text-slate-200 justify-center">
            🕒 Game History
          </h2>
          <div className="overflow-y-auto flex-1 max-h-60 scrollbar-hidden">
            {gameHistory.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                No games played yet
              </p>
            ) : (
              <ul className="space-y-2 text-sm ">
                {gameHistory.map((entry, i) => (
                  <li
                    key={i}
                    className="flex flex-col text-gray-700 dark:text-slate-300"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">Game {i + 1}:</span>
                      {entry.result === "win" ? "🏆 Won" : "😕 Lost"}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      Word: {entry.word}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
