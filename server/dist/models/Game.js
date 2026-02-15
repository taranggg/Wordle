import mongoose, { Schema } from "mongoose";
const gameSchema = new Schema({
    wordText: { type: String, required: true },
    attempts: { type: Number, required: true },
    status: { type: String, enum: ["win", "loss"], required: true },
    score: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
gameSchema.index({ userId: 1, createdAt: -1 });
export const Game = mongoose.model("Game", gameSchema);
//# sourceMappingURL=Game.js.map