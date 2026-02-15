import { Game } from "../models/Game.js";
export async function getLeaderboard(req, res) {
    try {
        const period = req.query.period || "all";
        const limit = Math.min(50, parseInt(String(req.query.limit), 10) || 20);
        const match = {};
        if (period === "daily") {
            const start = new Date();
            start.setUTCHours(0, 0, 0, 0);
            match.createdAt = { $gte: start };
        }
        const agg = await Game.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$userId",
                    totalScore: { $sum: "$score" },
                    wins: { $sum: { $cond: [{ $eq: ["$status", "win"] }, 1, 0] } },
                    games: { $sum: 1 },
                },
            },
            { $sort: { totalScore: -1, wins: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    username: "$user.username",
                    totalScore: 1,
                    wins: 1,
                    games: 1,
                },
            },
        ]);
        const leaderboard = agg.map((row, i) => ({
            rank: i + 1,
            username: row.username,
            totalScore: row.totalScore,
            wins: row.wins,
            games: row.games,
        }));
        res.status(200).json({ success: true, leaderboard, period });
    }
    catch {
        res.status(500).json({ message: "Failed to load leaderboard." });
    }
}
//# sourceMappingURL=leaderboardController.js.map