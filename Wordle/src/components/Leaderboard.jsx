import React, { useEffect, useState } from "react";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/games/leaderboard");
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4  text-gray-800 dark:text-slate-200">
        🏆 Leaderboard
      </h2>
      <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-hidden">
        {players.map((player, index) => (
          <li
            key={player._id}
            className="flex justify-between p-2 bg-white shadow rounded"
          >
            <span>
              #{index + 1} {player.username}
            </span>
            <span>{player.wins} wins</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
