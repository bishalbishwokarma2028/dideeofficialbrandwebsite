import jwt from "jsonwebtoken";

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
