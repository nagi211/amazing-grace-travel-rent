// Web push subscribe/unsubscribe for the admin dashboard. See
// supabase/schema.sql's push_subscriptions table and api/notify.js (the
// serverless function that actually sends the pushes using these saved
// subscriptions + the VAPID private key).
import { supabaseAdmin } from "./supabaseAdminClient";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function isPushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function getExistingSubscription() {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!registration) return null;
  return registration.pushManager.getSubscription();
}

export async function enablePushNotifications(adminUserId) {
  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!vapidKey) throw new Error("Push notifications aren't configured yet.");
  if (!isPushSupported()) throw new Error("This browser doesn't support push notifications.");

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notification permission was not granted.");

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  }

  const json = subscription.toJSON();
  if (!supabaseAdmin) throw new Error("Supabase is not configured.");

  const { error } = await supabaseAdmin.from("push_subscriptions").upsert(
    {
      admin_user_id: adminUserId,
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
    { onConflict: "endpoint" }
  );
  if (error) throw error;

  return subscription;
}

export async function disablePushNotifications() {
  const subscription = await getExistingSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();

  if (supabaseAdmin) {
    await supabaseAdmin.from("push_subscriptions").delete().eq("endpoint", endpoint);
  }
}
