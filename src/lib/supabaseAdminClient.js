import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Separate client instance for the admin panel only (login session,
// inquiries/leads dashboard). Kept apart from lib/supabaseClient.js (the
// public client) so logging into /admin in a browser can never affect how
// that browser's public-facing requests (quote form, estimate chat) are
// authenticated — see the comment in supabaseClient.js for the bug this
// avoids.
export const supabaseAdmin =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
