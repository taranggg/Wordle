import { Router } from "express";
import { createGame, getMyHistory } from "../controllers/gamesController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createGame);
router.get("/history", protect, getMyHistory);

export default router;
