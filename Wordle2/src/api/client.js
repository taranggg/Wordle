const getApiUrl = () => import.meta.env.VITE_API_URL || "http://localhost:5000";

export function apiUrl(path) {
  const base = getApiUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function authFetch(path, options = {}) {
  const url = apiUrl(path);
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return res;
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
