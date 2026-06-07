export function dbError(e: any): string {
  const cause = e?.cause;
  if (cause?.message) return cause.message;
  if (cause?.detail) return cause.detail;
  const msg: string = e?.message ?? "Unknown database error";
  if (msg.startsWith("Failed query:")) {
    const lines = msg.split("\n").map((l: string) => l.trim()).filter(Boolean);
    const last = lines[lines.length - 1];
    return last && last !== msg ? last : "Database query failed — check table schema in Supabase";
  }
  return msg;
}
