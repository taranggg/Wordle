import bcrypt from "bcrypt";
import { User } from "../models/User.js";
const DEFAULT_USERNAME = "admin";
const DEFAULT_EMAIL = "admin@wordle.local";
const DEFAULT_PASSWORD = "Admin@123";
const DEFAULT_FIRST_NAME = "Admin";
export async function seedAdmin() {
    const username = (process.env.ADMIN_USERNAME ?? DEFAULT_USERNAME).trim();
    const email = (process.env.ADMIN_EMAIL ?? DEFAULT_EMAIL).trim().toLowerCase();
    const plainPassword = process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD;
    const firstName = (process.env.ADMIN_FIRST_NAME ?? DEFAULT_FIRST_NAME).trim();
    const existing = await User.findOne({
        $or: [{ email }, { username }],
    });
    if (existing)
        return;
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    await User.create({
        firstName,
        lastName: "",
        username,
        email,
        password: hashedPassword,
    });
}
//# sourceMappingURL=seedAdmin.js.map