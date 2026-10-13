// Handles submission of the Request a Quote form.
//
// Stores the request in the `inquiries` table in Supabase (see
// supabase/schema.sql) instead of a third-party form service — it shows up
// live in the admin panel at /admin.
import { supabase } from "./supabaseClient";

export async function submitQuoteRequest(values, cartItems = null) {
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
    cart_items: cartItems,
  });

  if (error) throw error;

  // Best-effort confirmation email — never let this fail the booking itself
  // (the Supabase insert above already succeeded). Covers both callers of
  // this function: the standalone QuoteForm and the cart's CheckoutDialog.
  try {
    await fetch("/api/send-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        summary: values.details || values.rentalNeeded || null,
      }),
    });
  } catch (err) {
    console.warn("send-confirmation request failed:", err);
  }

  // Best-effort admin push notification — same fire-and-forget posture as
  // the confirmation email above.
  try {
    const isCheckout = Array.isArray(cartItems) && cartItems.length > 0;
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: isCheckout ? "New Checkout" : "New Quote Request",
        body: `${values.fullName} — ${values.rentalNeeded || values.eventType || ""}`.trim(),
        url: "/admin",
      }),
    });
  } catch (err) {
    console.warn("notify request failed:", err);
  }

  return { ok: true, values };
}
