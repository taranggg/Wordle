const express = require("express");
const router = express.Router();
const { createGame, getMyHistory } = require("../controllers/games");
const { protect } = require("../middleware/auth");

router.post("/", protect, createGame);
router.get("/history", protect, getMyHistory);

module.exports = router;
