import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGame extends Document {
  wordText: string;
  attempts: number;
  status: "win" | "loss";
  score: number;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const gameSchema = new Schema<IGame>(
  {
    wordText: { type: String, required: true },
    attempts: { type: Number, required: true },
    status: { type: String, enum: ["win", "loss"], required: true },
    score: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

gameSchema.index({ userId: 1, createdAt: -1 });

export const Game: Model<IGame> = mongoose.model<IGame>("Game", gameSchema);
