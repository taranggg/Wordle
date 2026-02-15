import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";
import { env } from "./env.js";
import jwt from "jsonwebtoken";

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          `http://localhost:${env.PORT}/api/auth/google/callback`,
        scope: ["profile", "email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.trim().toLowerCase() ?? "";
          const googleId = profile.id;
          const firstName =
            profile.name?.givenName?.trim() ||
            profile.displayName?.trim() ||
            "User";
          const lastName = profile.name?.familyName?.trim() ?? "";
          if (!email) {
            return done(new Error("Google account has no email"), undefined);
          }
          let user = await User.findOne({
            $or: [{ googleId }, { email }],
          });
          if (user) {
            if (!user.googleId) {
              user.googleId = googleId;
              await user.save();
            }
            return done(null, user);
          }
          const baseUsername =
            email
              .replace(/@.*$/, "")
              .replace(/[^a-zA-Z0-9_]/g, "_")
              .slice(0, 20) || "user";
          let username = baseUsername;
          let tries = 0;
          while (await User.findOne({ username })) {
            username = `${baseUsername}${++tries}`;
            if (tries > 1000) {
              return done(new Error("Could not generate username"), undefined);
            }
          }
          user = await User.create({
            firstName,
            lastName,
            username,
            email,
            googleId,
          });
          return done(null, user);
        } catch (err) {
          return done(err as Error, undefined);
        }
      },
    ),
  );
}

export function getGoogleAuthToken(user: { _id: unknown }): string {
  return jwt.sign({ id: String(user._id) }, env.JWT_SECRET, {
    expiresIn: "24h",
    algorithm: "HS256",
  });
}
