import mongoose, { Schema } from "mongoose";
const wordSchema = new Schema({
    word: { type: String, required: true, unique: true },
});
export const Word = mongoose.model("Word", wordSchema);
//# sourceMappingURL=Word.js.map