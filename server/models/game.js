const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
    word: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Word",
        required: true,
    },
    attempts: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    score:{
        type: Number,
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
