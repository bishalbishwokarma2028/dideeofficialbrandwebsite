import { Router } from "express";
import { pool } from "@workspace/db";
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

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    res.status(500).json({ error: "Admin credentials not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables on Vercel." });
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

// GET /api/admin/db-status — diagnostic endpoint to verify DB tables exist
router.get("/db-status", async (req, res) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    const tables = result.rows.map((r: any) => r.table_name);

    const required = [
      "users", "products", "collections", "categories", "product_variants",
      "orders", "order_items", "customers", "reviews", "journal_posts",
      "lookbook_items", "cart_items", "contact_messages",
      "newsletter_subscribers", "site_content"
    ];

    const missing = required.filter(t => !tables.includes(t));

    // Check products columns
    const colResult = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'products' AND table_schema = 'public'
    `).catch(() => ({ rows: [] }));
    const productCols = (colResult as any).rows.map((r: any) => r.column_name);

    res.json({
      connected: true,
      tables,
      missing,
      allTablesReady: missing.length === 0,
      products_columns: productCols,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? "✅ set" : "❌ NOT SET",
        SESSION_SECRET: process.env.SESSION_SECRET ? "✅ set" : "❌ NOT SET",
        ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "✅ set" : "❌ NOT SET",
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "✅ set" : "❌ NOT SET",
        SUPABASE_URL: process.env.SUPABASE_URL ? "✅ set" : "❌ NOT SET",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ set" : "❌ NOT SET",
      }
    });
  } catch (e: any) {
    res.status(500).json({ connected: false, error: e.message });
  } finally {
    client.release();
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

export default router;
