import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

export function createClient() {
  if (instance) return instance;
  instance = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storageKey: "scisheet-auth",
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    }
  );
  return instance;
}