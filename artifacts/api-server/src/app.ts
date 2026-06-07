import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { runMigrations } from "./lib/migrate.js";

const app = express();

// Run migrations once per process (works for both local server and Vercel serverless)
let migrated = false;
let migratePromise: Promise<void> | null = null;

app.use(async (_req, _res, next) => {
  if (migrated) return next();
  if (!migratePromise) {
    migratePromise = runMigrations()
      .then(() => { migrated = true; })
      .catch((err) => {
        console.error("[migrate] Failed on first request:", err);
        migratePromise = null;
      });
  }
  try { await migratePromise; } catch {}
  next();
});

app.use(cors({
  origin: (origin, callback) => callback(null, origin ?? true),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple ping — no DB, no auth, instant diagnosis
app.get("/api/ping", (_req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "✅ set" : "❌ MISSING",
      SESSION_SECRET: process.env.SESSION_SECRET ? "✅ set" : "❌ MISSING",
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "✅ set" : "❌ MISSING",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "✅ set" : "❌ MISSING",
      SUPABASE_URL: process.env.SUPABASE_URL ? "✅ set" : "❌ MISSING",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ set" : "❌ MISSING",
      NODE_ENV: process.env.NODE_ENV ?? "not set",
    },
  });
});

app.use("/api", router);

export default app;
