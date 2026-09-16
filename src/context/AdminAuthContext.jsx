import { createContext, useContext, useEffect, useState } from "react";
import { supabaseAdmin } from "../lib/supabaseAdminClient";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseAdmin) {
      setLoading(false);
      return;
    }

    supabaseAdmin.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabaseAdmin.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signIn(email, password) {
    if (!supabaseAdmin) return { error: new Error("Supabase is not configured.") };
    const { error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signOut() {
    if (!supabaseAdmin) return;
    await supabaseAdmin.auth.signOut();
  }

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    isConfigured: !!supabaseAdmin,
    signIn,
    signOut,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
