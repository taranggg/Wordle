import { Document, Model, Types } from "mongoose";
export interface IGame extends Document {
    wordText: string;
    attempts: number;
    status: "win" | "loss";
    score: number;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Game: Model<IGame>;
//# sourceMappingURL=Game.d.ts.map