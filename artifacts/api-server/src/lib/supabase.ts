import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[Supabase] SUPABASE_URL or SUPABASE_ANON_KEY not set — Supabase sync disabled.");
}

// Admin client (service role key) — can create confirmed users and manage storage
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

// Anon client — fallback
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

const STORAGE_BUCKET = "didee-uploads";

async function ensureBucket(): Promise<void> {
  if (!supabaseAdmin) return;
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);
  if (!exists) {
    await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, { public: true });
  }
}

let bucketReady = false;

export async function uploadFileToSupabase(
  buffer: Buffer,
  filename: string,
  mimetype: string,
): Promise<string | null> {
  if (!supabaseAdmin || !supabaseUrl) return null;

  if (!bucketReady) {
    await ensureBucket();
    bucketReady = true;
  }

  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filename, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (error) {
    console.error("[Supabase Storage] Upload error:", error.message);
    return null;
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
