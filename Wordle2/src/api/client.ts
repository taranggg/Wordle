import type { GameRecord, LeaderboardRow } from "../types/api";

const DEFAULT_TIMEOUT_MS = 15000;

const getApiUrl = (): string =>
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:8000";

export function apiUrl(path: string): string {
  const base = getApiUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function authFetch(
  path: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> {
  const url = apiUrl(path);
  const timeoutMs = options.timeout ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal ?? controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export interface SigninResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
}

export async function authWithGoogle(token: string): Promise<SigninResponse> {
  const res = await authFetch("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  const data = (await res.json().catch(() => ({}))) as { detail?: string };
  if (!res.ok) throw new Error(data.detail ?? "Google sign in failed.");
  return data as SigninResponse;
}

export async function getMe(): Promise<{
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
} | null> {
  const res = await authFetch("/api/auth/me");
  const data = (await res.json().catch(() => ({}))) as { user?: unknown };
  if (!res.ok) return null;
  return (
    (data.user as {
      id: string;
      username: string;
      email: string;
      firstName: string;
      lastName?: string;
      avatar?: string;
    }) ?? null
  );
}

export async function logout(): Promise<void> {
  await authFetch("/api/auth/logout", { method: "POST" });
}

export interface CreateGamePayload {
  wordText: string;
  attempts: number;
  status: "win" | "loss";
  score: number;
}

export async function createGame(
  payload: CreateGamePayload,
): Promise<{ success: boolean; game: GameRecord }> {
  const res = await authFetch("/api/games", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) throw new Error(data.message ?? "Failed to save game.");
  return data as { success: boolean; game: GameRecord };
}

export async function getGamesHistory(): Promise<GameRecord[]> {
  const res = await authFetch("/api/games/history");
  const data = (await res.json().catch(() => ({}))) as { games?: GameRecord[] };
  if (!res.ok) return [];
  return data.games ?? [];
}

export async function getDailyWord(): Promise<{
  success: boolean;
  word: string;
  date: string;
}> {
  const res = await authFetch("/api/words/daily");
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) throw new Error(data.message ?? "Failed to get daily word.");
  return data as { success: boolean; word: string; date: string };
}

export async function getRandomWord(): Promise<{
  success: boolean;
  word: string;
}> {
  const res = await authFetch("/api/words/random");
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) throw new Error(data.message ?? "Failed to get random word.");
  return data as { success: boolean; word: string };
}

export async function getLeaderboard(
  period = "all",
): Promise<{ leaderboard: LeaderboardRow[]; period: string }> {
  const res = await authFetch(`/api/leaderboard?period=${period}`);
  const data = (await res.json().catch(() => ({}))) as {
    leaderboard?: LeaderboardRow[];
    period?: string;
  };
  if (!res.ok) return { leaderboard: [], period };
  return {
    leaderboard: data.leaderboard ?? [],
    period: data.period ?? period,
  };
}
