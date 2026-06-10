export const AUTH_TOKEN_KEY = "nashik_access_token";
export const AUTH_USER_KEY = "nashik_user";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
};

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
  exp: number;
  iat: number;
};

const PROVIDER_ROLES = new Set([
  "PLUMBER",
  "ELECTRICIAN",
  "GARAGE",
  "PEST_CONTROL",
  "WASHER",
]);

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return true;
  }
  return Date.now() >= payload.exp * 1000;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    clearAuth();
    return null;
  }
  return token;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

const TOKEN_COOKIE = "nashik_access_token";
const IDLE_MAX_AGE_SECONDS = 20 * 60;

function setTokenCookie(token: string) {
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${IDLE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

function clearTokenCookie() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function saveAuth(accessToken: string, user: AuthUser) {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  setTokenCookie(accessToken);
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  clearTokenCookie();
}

export function getDashboardPath(role: string): string {
  if (role === "ADMIN") {
    return "/admin";
  }
  if (role === "CUSTOMER") {
    return "/customer";
  }
  if (PROVIDER_ROLES.has(role)) {
    return "/provider";
  }
  return "/login";
}

export function roleToUiId(role: string): string {
  const map: Record<string, string> = {
    CUSTOMER: "customer",
    PLUMBER: "plumber",
    ELECTRICIAN: "electrician",
    GARAGE: "garage",
    PEST_CONTROL: "pestcontrol",
    WASHER: "washer",
    ADMIN: "admin",
  };
  return map[role] ?? role.toLowerCase();
}
