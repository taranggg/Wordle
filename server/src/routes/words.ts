import { Router } from "express";
import {
  getDailyWordHandler,
  getRandomWord,
} from "../controllers/wordsController.js";

const router = Router();

router.get("/daily", getDailyWordHandler);
router.get("/random", getRandomWord);

export default router;
