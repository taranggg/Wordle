const mongoose = require("mongoose");

const gameSchema = mongoose.Schema(
  {
    wordText: { type: String, required: true },
    attempts: { type: Number, required: true },
    status: { type: String, enum: ["win", "loss"], required: true },
    score: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
