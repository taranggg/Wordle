import React from "react";

const userStats = {
  matchesPlayed: 128,
  winRate: "87%",
  currentStreak: 12,
  maxStreak: 23,
};

const globalLeaderboard = [
  { name: "WordMaster", score: 2847, streak: 45, winRate: "98%" },
  { name: "LetterLover", score: 2634, streak: 32, winRate: "95%" },
  { name: "PuzzlePro", score: 2521, streak: 28, winRate: "92%" },
  { name: "You", score: 2156, streak: 12, winRate: "87%" },
];

export default function LeaderboardSection({ isDark }) {
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <div
      className={`w-full max-w-md mx-auto p-4 space-y-6 ${textColor} h-full flex flex-col`}
    >
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(userStats).map(([key, value]) => (
          <StatCard
            key={key}
            label={formatLabel(key)}
            value={value}
            isDark={isDark}
          />
        ))}
      </div>

      <div
        className={`rounded-xl p-4 border shadow-xl backdrop-blur-md bg-white/10 border-white/20 flex-1 flex flex-col min-h-0 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <h2 className={`text-lg font-semibold mb-3 ${subTextColor}`}>
          🌐 Global Leaderboard
        </h2>
        <div className="flex-1 min-h-0 overflow-y-auto p-5 scrollbar-hidden">
          <ul className="space-y-3">
            {globalLeaderboard.map((player, i) => {
              const isYou = player.name === "You";
              const isTop = i === 0;
              let customStyle = "";

              if (isTop) {
                customStyle =
                  "border-yellow-400 bg-yellow-100/10 shadow-yellow-400/50";
              } else if (isYou) {
                customStyle =
                  "border-green-400 bg-green-100/10 shadow-green-400/50";
              }

              return (
                <li
                  key={player.name}
                  className={`flex items-center justify-between p-3 rounded-lg group transition-transform duration-300 hover:scale-105 
                    border-2 backdrop-blur-md ${customStyle} ${
                      !isTop && !isYou ? "bg-white/10 border-white/20" : ""
                    }`}
                  style={{
                    boxShadow:
                      isTop || isYou
                        ? `0 0 15px 4px ${
                            isTop
                              ? "rgba(234,179,8,0.5)"
                              : "rgba(34,197,94,0.4)"
                          }`
                        : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold">{i + 1}</div>
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className={`text-sm ${subTextColor}`}>
                        {player.winRate} • {player.streak} streak
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold">{player.score}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, isDark }) {
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg text-center shadow-xl border border-white/20 transform transition-transform duration-300 hover:scale-105">
      <div className={`text-xl font-bold ${textColor}`}>{value}</div>
      <div className={`text-sm ${subTextColor}`}>{label}</div>
    </div>
  );
}

function formatLabel(key) {
  switch (key) {
    case "matchesPlayed":
      return "Matches Played";
    case "winRate":
      return "Win Rate";
    case "currentStreak":
      return "Current Streak";
    case "maxStreak":
      return "Max Streak";
    default:
      return key;
  }
}
