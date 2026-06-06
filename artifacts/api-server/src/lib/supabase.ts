import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[Supabase] SUPABASE_URL or SUPABASE_ANON_KEY not set — Supabase sync disabled.");
}

// Admin client (service role key) — can create confirmed users immediately
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

// Anon client — fallback (users appear as "Unconfirmed" in Supabase dashboard)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export async function syncUserToSupabase(opts: {
  email: string;
  password: string;
  name: string;
  phone?: string | null;
}): Promise<void> {
  // Prefer admin client — creates confirmed users that appear immediately in Supabase Auth
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: opts.email,
        password: opts.password,
        email_confirm: true,
        user_metadata: {
          name: opts.name,
          phone: opts.phone ?? null,
          source: "didee-website",
        },
      });
      if (error) {
        if (error.message?.includes("already been registered") || error.message?.includes("already exists")) return;
        console.warn("[Supabase] Admin createUser warning:", error.message);
      } else {
        console.info("[Supabase] User synced (confirmed):", data.user?.email);
      }
    } catch (err) {
      console.warn("[Supabase] Admin sync failed (non-fatal):", err);
    }
    return;
  }

  // Fallback: anon signUp — users appear as Unconfirmed until email is confirmed
  // To fix: disable "Confirm email" in Supabase Dashboard > Authentication > Providers > Email
  if (supabase) {
    try {
      const { error } = await supabase.auth.signUp({
        email: opts.email,
        password: opts.password,
        options: {
          data: {
            name: opts.name,
            phone: opts.phone ?? null,
            source: "didee-website",
          },
        },
      });
      if (error) {
        if (error.message?.includes("already registered")) return;
        console.warn("[Supabase] signUp warning:", error.message);
      } else {
        console.info("[Supabase] User synced (unconfirmed):", opts.email);
      }
    } catch (err) {
      console.warn("[Supabase] Sync failed (non-fatal):", err);
    }
  }
}
