import { Router } from "express";
import rateLimit from "express-rate-limit";
import { signin, signup, me, logout, } from "../controllers/authController.js";
import { signinValidation, signupValidation, handleValidationErrors, } from "../middleware/validateAuth.js";
const authRouter = Router();
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
export default authRouter;
//# sourceMappingURL=auth.js.map