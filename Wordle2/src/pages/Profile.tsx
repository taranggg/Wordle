import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGamesHistory } from "../api/client";
import { User, Trophy, ArrowLeft } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [games, setGames] = useState<
    Array<{ _id: string; status: string; score?: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getGamesHistory()
        .then(setGames)
        .catch(() => setGames([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const wins = games.filter((g) => g.status === "win").length;
  const totalScore = games.reduce((acc, g) => acc + (g.score ?? 0), 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#2c2c2c]">
        <p className="text-white">Sign in to view your profile.</p>
        <Link to="/login" className="text-green-400 ml-2 underline">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] text-white p-6">
      <div className="max-w-md mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to game
        </Link>

        <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-green-600/50 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
              {user.firstName && (
                <p className="text-gray-300 text-sm">
                  {user.firstName}
                  {user.lastName ? ` ${user.lastName}` : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-purple-300 mb-4">
            <Trophy className="w-5 h-5" />
            Stats
          </h2>
          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/10 p-4 text-center">
                <p className="text-3xl font-bold text-green-400">
                  {games.length}
                </p>
                <p className="text-sm text-gray-400">Games played</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">{wins}</p>
                <p className="text-sm text-gray-400">Wins</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 text-center col-span-2">
                <p className="text-3xl font-bold text-blue-400">{totalScore}</p>
                <p className="text-sm text-gray-400">Total score</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
