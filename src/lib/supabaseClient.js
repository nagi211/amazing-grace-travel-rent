import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// `createClient` throws synchronously if the URL is missing, which would
// crash the entire site (including pages that don't touch Supabase) before
// the env vars are configured. Fall back to `null` instead — callers must
// check for it — so the rest of the app keeps working regardless.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!supabase) {
  console.warn(
    "Supabase env vars are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). " +
      "Quote submissions and the admin panel won't work until they're set."
  );
}
