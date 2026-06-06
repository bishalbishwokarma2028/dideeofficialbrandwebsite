import jwt from "jsonwebtoken";
import type { Request } from "express";

const SECRET = process.env.SESSION_SECRET ?? "didee-secret-fallback";

export const ADMIN_COOKIE = "didee.admin.token";
export const USER_COOKIE = "didee.user.token";

const isProduction = process.env.NODE_ENV === "production";

export const COOKIE_OPTS = {
  httpOnly: true,
  path: "/",
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export function signAdminToken(email: string): string {
  return jwt.sign({ adminAuthenticated: true, adminEmail: email }, SECRET, { expiresIn: "7d" });
}

export function signUserToken(userId: number, email: string, name: string): string {
  return jwt.sign({ userId, userEmail: email, userName: name }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, SECRET);
}

export function extractAdminToken(req: Request): string | null {
  const auth = req.headers?.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return (req.cookies as any)?.[ADMIN_COOKIE] ?? null;
}

export function extractUserToken(req: Request): string | null {
  const auth = req.headers?.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return (req.cookies as any)?.[USER_COOKIE] ?? null;
}

export function isAdminRequest(req: Request): boolean {
  const token = extractAdminToken(req);
  if (!token) return false;
  try {
    const payload = verifyToken(token);
    return !!payload?.adminAuthenticated;
  } catch {
    return false;
  }
}

export function getUserIdFromRequest(req: Request): number | null {
  const token = extractUserToken(req);
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return payload?.userId ?? null;
  } catch {
    return null;
  }
}
