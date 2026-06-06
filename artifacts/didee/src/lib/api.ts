const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

export const USER_TOKEN_KEY = "didee.user.token";
export const ADMIN_TOKEN_KEY = "didee.admin.token";

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export function getUserToken(): string | null {
  try { return localStorage.getItem(USER_TOKEN_KEY); } catch { return null; }
}

export function setUserToken(token: string): void {
  try { localStorage.setItem(USER_TOKEN_KEY, token); } catch {}
}

export function clearUserToken(): void {
  try { localStorage.removeItem(USER_TOKEN_KEY); } catch {}
}

export function getAdminToken(): string | null {
  try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; }
}

export function setAdminToken(token: string): void {
  try { localStorage.setItem(ADMIN_TOKEN_KEY, token); } catch {}
}

export function clearAdminToken(): void {
  try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch {}
}

function buildHeaders(token: string | null, extra?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {};
  if (extra) {
    Object.entries(extra as Record<string, string>).forEach(([k, v]) => { headers[k] = v; });
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export function authedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getUserToken();
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: buildHeaders(token, options.headers),
  });
}

export function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: buildHeaders(token, options.headers),
  });
}

export { API_BASE };
