import { Router } from "express";
import passport from "passport";
import rateLimit from "express-rate-limit";
import { signin, signup, me, logout, googleCallback, } from "../controllers/authController.js";
import { signinValidation, signupValidation, handleValidationErrors, } from "../middleware/validateAuth.js";
import { env } from "../config/env.js";
const authRouter = Router();
const hasGoogleConfig = () => Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
const signinLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many sign-in attempts. Try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { message: "Too many sign-up attempts. Try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
authRouter.post("/signin", signinLimiter, signinValidation, handleValidationErrors, signin);
authRouter.post("/signup", signupLimiter, signupValidation, handleValidationErrors, signup);
authRouter.get("/me", me);
authRouter.post("/logout", logout);
authRouter.get("/google", (req, res, next) => {
    if (!hasGoogleConfig()) {
        res.status(503).json({ message: "Google sign-in is not configured." });
        return;
    }
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});
authRouter.get("/google/callback", (req, res, next) => {
    if (!hasGoogleConfig()) {
        res.redirect(`${env.FRONTEND_ORIGIN}/login?error=google`);
        return;
    }
    passport.authenticate("google", { session: false }, (err, user) => {
        if (err || !user) {
            res.redirect(`${env.FRONTEND_ORIGIN}/login?error=google`);
            return;
        }
        req.user = user;
        googleCallback(req, res);
    })(req, res, next);
});
export default authRouter;
//# sourceMappingURL=auth.js.map