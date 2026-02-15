export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
}

export interface GameRecord {
  _id: string;
  wordText: string;
  attempts: number;
  status: "win" | "loss";
  score: number;
  userId: string;
  createdAt: string;
}

export interface LeaderboardRow {
  rank: number;
  username: string;
  totalScore: number;
  wins: number;
  games: number;
}

export interface DayWordData {
  word: string;
  meaning: string;
  phonetic: string;
}

export interface RecentGameDisplay {
  id: string | number;
  word: string;
  time: string;
  status: string;
  result: string;
  points: string;
  duration: string;
  colors: string[];
}
