import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    gender: { type: String },
    avatar: { type: String, default: "avatarSenku.png" },
}, { timestamps: true });
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map