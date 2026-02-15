import { Document, Model } from "mongoose";
export interface IUser extends Document {
    firstName: string;
    lastName?: string;
    username: string;
    email: string;
    password?: string;
    gender?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: Model<IUser>;
//# sourceMappingURL=User.d.ts.map