import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWord extends Document {
  word: string;
}

const wordSchema = new Schema<IWord>({
  word: { type: String, required: true, unique: true },
});

export const Word: Model<IWord> = mongoose.model<IWord>("Word", wordSchema);
