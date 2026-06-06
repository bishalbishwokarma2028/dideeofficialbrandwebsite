---
name: Supabase Sync
description: How user registration syncs to Supabase Auth on this project.
---

The API server fires `syncUserToSupabase()` (fire-and-forget) after every successful registration.

**Rule:** Use `supabaseAdmin.auth.admin.createUser({ email_confirm: true })` — this creates users as immediately confirmed and visible in the Supabase dashboard. The anon-key `signUp()` fallback creates unconfirmed users.

**Why:** `signUp()` with the anon key requires email confirmation before users appear as active in Supabase Auth. The service role key bypasses this.

**How to apply:** `SUPABASE_SERVICE_ROLE_KEY` env var must be set. When set, the admin client is used automatically. If missing, falls back to anon `signUp()` (users show as Unconfirmed).

Key files: `artifacts/api-server/src/lib/supabase.ts`, `artifacts/api-server/src/routes/auth.ts`
