import { Game } from "../models/Game.js";
export async function createGame(req, res) {
    try {
        const { wordText, attempts, status, score } = req.body;
        if (!wordText ||
            typeof attempts !== "number" ||
            !["win", "loss"].includes(status ?? "") ||
            typeof score !== "number") {
            res.status(400).json({ message: "Invalid game data." });
            return;
        }
        const game = await Game.create({
            wordText: String(wordText).toUpperCase().slice(0, 20),
            attempts: Math.min(10, Math.max(1, attempts)),
            status: status,
            score: Math.min(1000, Math.max(0, score)),
            userId: req.user._id,
        });
        res.status(201).json({ success: true, game });
    }
    catch {
        res.status(500).json({ message: "Failed to save game." });
    }
}
export async function getMyHistory(req, res) {
    try {
        const games = await Game.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        res.status(200).json({ success: true, games });
    }
    catch {
        res.status(500).json({ message: "Failed to load history." });
    }
}
//# sourceMappingURL=gamesController.js.map