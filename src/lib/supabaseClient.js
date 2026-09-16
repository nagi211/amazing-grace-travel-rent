import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// This client is for public, unauthenticated use only (quote submissions,
// estimate-chat session tracking) — never sign in on it. Session
// persistence is deliberately off: without this, if the same browser is
// ever used to log into /admin, this client would start attaching that
// admin session to every request (Supabase's default behavior for a
// client instance), and public inserts would get rejected by RLS since
// the `authenticated` role has no insert policy on these tables — only
// `anon` does, on purpose. See lib/supabaseAdminClient.js for the admin
// panel's separate, session-persisting client.
//
// `createClient` throws synchronously if the URL is missing, which would
// crash the entire site (including pages that don't touch Supabase) before
// the env vars are configured. Fall back to `null` instead — callers must
// check for it — so the rest of the app keeps working regardless.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          // Distinct from the admin client's storage key — same-key, same-
          // browser-context clients log a "multiple GoTrueClient instances"
          // warning even when persistence is off on one of them.
          storageKey: "sb-public-noop-auth",
        },
      })
    : null;

if (!supabase) {
  console.warn(
    "Supabase env vars are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). " +
      "Quote submissions and the admin panel won't work until they're set."
  );
}
