const DEFAULT_TIMEOUT_MS = 15000;

const getApiUrl = () => import.meta.env.VITE_API_URL || "http://localhost:5000";

export function apiUrl(path) {
  const base = getApiUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function authFetch(path, options = {}) {
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

export async function signin(emailOrUsername, password) {
  const res = await authFetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ emailOrUsername: emailOrUsername.trim(), password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Sign in failed.");
  return data;
}

export async function signup(payload) {
  const res = await authFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Sign up failed.");
  return data;
}

export async function getMe() {
  const res = await authFetch("/api/auth/me");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  return data.user;
}

export async function logout() {
  await authFetch("/api/auth/logout", { method: "POST" });
}

export async function createGame(payload) {
  const res = await authFetch("/api/games", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to save game.");
  return data;
}

export async function getGamesHistory() {
  const res = await authFetch("/api/games/history");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return [];
  return data.games || [];
}

export async function getDailyWord() {
  const res = await authFetch("/api/words/daily");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to get daily word.");
  return data;
}

export async function getRandomWord() {
  const res = await authFetch("/api/words/random");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to get random word.");
  return data;
}

export async function getLeaderboard(period = "all") {
  const res = await authFetch(`/api/leaderboard?period=${period}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { leaderboard: [], period };
  return data;
}
