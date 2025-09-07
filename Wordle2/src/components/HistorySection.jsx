import React from "react";
// import PerformanceChart from "./PerformanceChart";
import WordOfTheDay from "./Wotd";

const recentGames = [
  {
    id: 247,
    word: "SHINE",
    time: "Today, 2:30 PM",
    status: "WON",
    result: "2/6",
    points: "+125 points",
    duration: "3:42 time",
    colors: ["green", "yellow", "gray", "gray", "gray"],
  },
  {
    id: 246,
    word: "FRAME",
    time: "Yesterday, 8:15 AM",
    status: "WON",
    result: "4/6",
    points: "+89 points",
    duration: "5:23 time",
    colors: ["yellow", "green", "green", "green", "gray"],
  },
  {
    id: 245,
    word: "QUEST",
    time: "Dec 9, 7:45 PM",
    status: "LOST",
    result: "X/6",
    points: "+10 points",
    duration: "8:15 time",
    colors: ["green", "yellow", "gray", "gray", "gray"],
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "WON":
      return {
        border: "border-green-400",
        pill: "bg-green-500",
      };
    case "LOST":
      return {
        border: "border-red-400",
        pill: "bg-red-500",
      };
    default:
      return {
        border: "border-white/20",
        pill: "bg-gray-500",
      };
  }
};

export default function HistorySection({ isDark }) {
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <div
      className={`w-full max-w-md px-4 space-y-4 ${textColor} mx-auto flex flex-col items-center h-full`}
      style={{ minHeight: 0 }}
    >
      <div className="w-full">
        {/* <PerformanceChart isDark={isDark} /> */}
        <div className="my-4 flex justify-center">
          <WordOfTheDay isDark={isDark} />
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col items-center pt-4 min-h-0 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg">
        <h2
          className={`text-base sm:text-lg font-semibold flex items-center gap-2 mt-4 text-purple-400`}
        >
          🎮 Recent Games
        </h2>

        <div className="mt-2 flex-1 w-full p-7 overflow-y-auto scrollbar-hidden min-h-0">
          <div className="flex flex-col space-y-4 w-full">
            {recentGames.map((game) => {
              const { border, pill } = getStatusStyle(game.status);

              return (
                <div
                  key={game.id}
                  className={`rounded-xl p-4 flex flex-col border backdrop-blur-md bg-white/10 transform transition-transform duration-300 hover:scale-105 ${border} w-full max-w-[300px] mx-auto text-sm`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-sm">{`#${game.id} – ${game.word}`}</div>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full font-bold text-white ${pill}`}
                    >
                      {game.status}
                    </div>
                  </div>

                  <div className={`text-xs mb-2 ${subTextColor}`}>
                    {game.time}
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    {game.colors.map((color, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded ${
                          color === "green"
                            ? "bg-green-500"
                            : color === "yellow"
                            ? "bg-yellow-400"
                            : "bg-gray-500"
                        }`}
                      ></div>
                    ))}
                  </div>

                  <div className={`text-xs ${subTextColor}`}>
                    {game.points} • {game.duration}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
