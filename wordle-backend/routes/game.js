const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

router.post("/", async (req, res) => {
  try {
    const { username, score } = req.body;
    const game = new Game({ username, score });
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const topGames = await Game.find().sort({ score: -1 }).limit(10);
    res.json(topGames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
