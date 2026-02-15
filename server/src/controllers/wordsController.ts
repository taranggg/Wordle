import { Request, Response } from "express";
import { getDailyWord, WORDS } from "../utils/dailyWords.js";

export function getDailyWordHandler(_req: Request, res: Response): void {
  try {
    const word = getDailyWord();
    const today = new Date().toISOString().slice(0, 10);
    res.status(200).json({ success: true, word, date: today });
  } catch {
    res.status(500).json({ message: "Failed to get daily word." });
  }
}

export function getRandomWord(_req: Request, res: Response): void {
  try {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    res.status(200).json({ success: true, word });
  } catch {
    res.status(500).json({ message: "Failed to get random word." });
  }
}
