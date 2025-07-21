const mongoose = require("mongoose");


const wordSchema = mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
    }
})

const Word = mongoose.model("Word", wordSchema);
module.exports = Word;
