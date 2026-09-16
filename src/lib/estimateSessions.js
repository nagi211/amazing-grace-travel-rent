// Best-effort background tracking of estimate-chat sessions so warm leads
// who never finish the full quote form still show up for follow-up in the
// admin dashboard. Never lets a Supabase hiccup break the chat itself —
// every call swallows its own errors (but logs unexpected ones so real bugs
// don't disappear silently during development).
import { supabase } from "./supabaseClient";

const SESSION_ID_KEY = "agtr-estimate-session-id";
const DUPLICATE_KEY_ERROR = "23505";

export function getSessionId() {
  if (typeof window === "undefined") return null;
  try {
    let id = window.localStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export async function upsertEstimateSession(sessionId, fields) {
  if (!supabase || !sessionId) return;

  const payload = { session_id: sessionId, updated_at: new Date().toISOString(), ...fields };

  try {
    // Plain insert first, rather than .upsert()/ON CONFLICT: Postgres
    // requires SELECT privilege to check for a conflicting row under RLS,
    // which anon deliberately doesn't have here (so the public can't read
    // other visitors' leads). A targeted UPDATE doesn't have that
    // requirement, so fall back to it once we know the row already exists.
    const { error: insertError } = await supabase.from("estimate_sessions").insert(payload);
    if (!insertError) return;

    if (insertError.code === DUPLICATE_KEY_ERROR) {
      const { error: updateError } = await supabase
        .from("estimate_sessions")
        .update(payload)
        .eq("session_id", sessionId);
      if (updateError) console.warn("estimate_sessions update failed:", updateError);
      return;
    }

    console.warn("estimate_sessions insert failed:", insertError);
  } catch (err) {
    console.warn("estimate_sessions save threw:", err);
  }
}
