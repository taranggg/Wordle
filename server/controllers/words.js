const { getDailyWord, WORDS } = require("../util/dailyWords");

exports.getDailyWord = (req, res) => {
  try {
    const word = getDailyWord();
    const today = new Date().toISOString().slice(0, 10);
    res.status(200).json({ success: true, word, date: today });
  } catch (err) {
    res.status(500).json({ message: "Failed to get daily word." });
  }
};

exports.getRandomWord = (req, res) => {
  try {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    res.status(200).json({ success: true, word });
  } catch (err) {
    res.status(500).json({ message: "Failed to get random word." });
  }
};
