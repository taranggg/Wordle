import { useState, useEffect } from "react";
import { getLeaderboard } from "../api/client";
import { Trophy } from "lucide-react";

export default function LeaderboardSection({ isDark }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(period)
      .then((data) => setLeaderboard(data.leaderboard || []))
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
  }, [period]);

  const textColor = isDark ? "text-white" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <div
      className={`w-full max-w-md px-4 space-y-4 ${textColor} mx-auto flex flex-col items-center h-full`}
      style={{ minHeight: 0 }}
    >
      <div className="w-full flex-1 flex flex-col items-center pt-4 min-h-0 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg">
        <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 mt-4 text-purple-400">
          <Trophy className="w-5 h-5" />
          Leaderboard
        </h2>

        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => setPeriod("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              period === "all"
                ? "bg-green-600 text-white"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            All time
          </button>
          <button
            type="button"
            onClick={() => setPeriod("daily")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              period === "daily"
                ? "bg-green-600 text-white"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Today
          </button>
        </div>

        <div className="mt-2 flex-1 w-full p-4 overflow-y-auto scrollbar-hidden min-h-0">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading…</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No scores yet. Play to get on the board!
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((row) => (
                <div
                  key={row.rank}
                  className="flex items-center justify-between rounded-xl p-3 bg-white/10 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        row.rank === 1
                          ? "bg-yellow-500 text-black"
                          : row.rank === 2
                            ? "bg-gray-400 text-black"
                            : row.rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-white/20"
                      }`}
                    >
                      {row.rank}
                    </span>
                    <span className="font-semibold">{row.username}</span>
                  </div>
                  <div className={`text-sm ${subTextColor}`}>
                    {row.totalScore} pts · {row.wins} W
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
