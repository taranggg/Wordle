const express = require("express");
const router = express.Router();
const { getDailyWord, getRandomWord } = require("../controllers/words");

router.get("/daily", getDailyWord);
router.get("/random", getRandomWord);

module.exports = router;
