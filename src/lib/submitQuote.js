// Handles submission of the Request a Quote form.
//
// Stores the request in the `inquiries` table in Supabase (see
// supabase/schema.sql) instead of a third-party form service — it shows up
// live in the admin panel at /admin.
import { supabase } from "./supabaseClient";

export async function submitQuoteRequest(values) {
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { error } = await supabase.from("inquiries").insert({
    full_name: values.fullName,
    email: values.email,
    phone: values.phone,
    event_date: values.eventDate || null,
    event_type: values.eventType,
    guest_count: values.guestCount ? Number(values.guestCount) : null,
    rental_needed: values.rentalNeeded,
    event_location: values.eventLocation,
    details: values.details,
  });

  if (error) throw error;
  return { ok: true, values };
}
