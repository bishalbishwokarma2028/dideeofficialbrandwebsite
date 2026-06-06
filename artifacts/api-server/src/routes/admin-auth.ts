import { Router } from "express";
import { signAdminToken, verifyToken, ADMIN_COOKIE, COOKIE_OPTS } from "../lib/jwt.js";

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
  res.json({ success: true, email });
});

// POST /api/admin/logout
router.post("/logout", (_req, res) => {
  res.clearCookie(ADMIN_COOKIE, { path: "/" });
  res.json({ success: true });
});

// GET /api/admin/me
router.get("/me", (req, res) => {
  const token = req.cookies?.[ADMIN_COOKIE];
  if (!token) {
    res.status(401).json({ authenticated: false });
    return;
  }
  try {
    const payload = verifyToken(token);
    if (payload?.adminAuthenticated) {
      res.json({ authenticated: true, email: payload.adminEmail });
    } else {
      res.status(401).json({ authenticated: false });
    }
  } catch {
    res.clearCookie(ADMIN_COOKIE, { path: "/" });
    res.status(401).json({ authenticated: false });
  }
});

export default router;
