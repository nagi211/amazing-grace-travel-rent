// Vercel serverless function — sends a "we got your request" confirmation
// email to the customer right after they submit a quote request or cart
// checkout. Best-effort only: the booking itself (the Supabase insert in
// src/lib/submitQuote.js) already succeeded before this is ever called, so
// a failure here should never surface as an error to the customer — it
// just means they don't get the extra confirmation email this time.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { fullName, email, summary } = req.body || {};
  if (!email) {
    res.status(400).json({ error: "Missing email" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet (no RESEND_API_KEY in the Vercel project's env
    // vars) — report "skipped" rather than erroring, so this can ship
    // ahead of the Resend account actually being set up.
    res.status(200).json({ skipped: true });
    return;
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL || "Amazing Grace <onboarding@resend.dev>";
  const firstName = (fullName || "").trim().split(" ")[0] || "there";

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: email,
        subject: "We've received your request — Amazing Grace Travels, Events and Rentals",
        html: `
          <div style="font-family: Georgia, serif; color: #1e2a30; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #063245; margin-bottom: 4px;">Mahalo, ${escapeHtml(firstName)}!</h2>
            <p>We've received your request and will follow up within 24 hours with availability and pricing.</p>
            ${
              summary
                ? `<div style="white-space: pre-line; background: #f7f3ea; padding: 16px; border-radius: 12px; font-size: 14px; margin: 16px 0;">${escapeHtml(summary)}</div>`
                : ""
            }
            <p>In the meantime, feel free to reach out on Facebook or Instagram if you have any questions.</p>
            <p style="margin-top: 24px;">— Amazing Grace Travels, Events and Rentals</p>
          </div>
        `,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend send failed:", resendRes.status, errText);
      res.status(200).json({ sent: false });
      return;
    }

    res.status(200).json({ sent: true });
  } catch (err) {
    console.error("Resend request threw:", err);
    res.status(200).json({ sent: false });
  }
}
