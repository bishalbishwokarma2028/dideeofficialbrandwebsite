import { Router } from "express";
import { signAdminToken, verifyToken, isAdminRequest, ADMIN_COOKIE, COOKIE_OPTS } from "../lib/jwt.js";

const router = Router();

const ADMIN_EMAIL = process.env["ADMIN_EMAIL"] ?? "";
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "";

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signAdminToken(email);
  res.cookie(ADMIN_COOKIE, token, COOKIE_OPTS);
  res.json({ success: true, email, token });
});

// POST /api/admin/logout
router.post("/logout", (_req, res) => {
  res.clearCookie(ADMIN_COOKIE, { path: "/" });
  res.json({ success: true });
});

// GET /api/admin/me
router.get("/me", (req, res) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ authenticated: false });
    return;
  }
  try {
    const auth = req.headers?.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : (req.cookies as any)?.[ADMIN_COOKIE];
    const payload = verifyToken(token!);
    res.json({ authenticated: true, email: payload.adminEmail });
  } catch {
    res.clearCookie(ADMIN_COOKIE, { path: "/" });
    res.status(401).json({ authenticated: false });
  }
});

// POST /api/admin/change-password
router.post("/change-password", (req, res) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Both passwords are required" });
    return;
  }
  if (currentPassword !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }
  res.json({ success: true, message: "Password change requires updating the ADMIN_PASSWORD environment variable." });
});

// POST /api/admin/users
router.post("/users", (req, res) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ success: true, message: "Additional admin users require updating environment variables." });
});

export default router;
