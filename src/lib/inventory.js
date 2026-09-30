// Per-item owned quantity, used by the admin dashboard's availability
// calendar. Item metadata (name, category, icon) stays in
// src/data/pricing.js — this table only ever stores a quantity keyed by
// the same item id.
import { supabaseAdmin } from "./supabaseAdminClient";

export async function fetchInventory() {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin.from("inventory").select("*");
  if (error) throw error;
  return data;
}

export async function upsertInventoryQty(itemId, totalQty) {
  if (!supabaseAdmin) throw new Error("Supabase is not configured yet.");
  const { error } = await supabaseAdmin
    .from("inventory")
    .upsert({ item_id: itemId, total_qty: totalQty, updated_at: new Date().toISOString() });
  if (error) throw error;
}
