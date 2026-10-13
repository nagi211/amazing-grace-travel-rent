// Vercel serverless function — pushes a notification to every admin device
// subscribed via src/lib/pushNotifications.js, right after a new checkout
// or quote request is saved. Best-effort only, same posture as
// api/send-confirmation.js: the booking itself already succeeded before
// this is ever called, so failures here are logged and swallowed, never
// surfaced to the customer.
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { title, body, url } = req.body || {};

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || "mailto:inquiries@amazinggrace.events";

  if (!supabaseUrl || !serviceRoleKey || !vapidPublicKey || !vapidPrivateKey) {
    // Not configured yet — report "skipped" so this can ship ahead of the
    // VAPID keys / service role key actually being set in Vercel.
    res.status(200).json({ skipped: true });
    return;
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (error) {
    console.error("Failed to load push_subscriptions:", error);
    res.status(200).json({ sent: 0, failed: 0 });
    return;
  }

  const payload = JSON.stringify({
    title: title || "Amazing Grace Admin",
    body: body || "New activity on the site.",
    url: url || "/admin",
  });

  let sent = 0;
  let failed = 0;

  await Promise.all(
    (subscriptions || []).map(async (row) => {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          payload
        );
        sent += 1;
      } catch (err) {
        failed += 1;
        // 404/410 = the subscription is gone (uninstalled, permission
        // revoked, etc.) — clean it up so future notifies don't keep
        // retrying a dead endpoint.
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
        } else {
          console.error("Push send failed:", err.statusCode, err.body);
        }
      }
    })
  );

  res.status(200).json({ sent, failed });
}
