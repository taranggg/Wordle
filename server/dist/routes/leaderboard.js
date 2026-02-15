import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";
const router = Router();
router.get("/", getLeaderboard);
export default router;
//# sourceMappingURL=leaderboard.js.map