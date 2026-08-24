// Handles submission of the Request a Quote form.
//
// Sends the request to Formspree, which emails it to the address configured
// on that form (currently nagi.gdr@gmail.com). No backend of our own needed.
//
// Setup (one-time, in the Formspree dashboard at formspree.io):
//   1. Create a free account / form with nagi.gdr@gmail.com as the recipient.
//   2. Copy the form ID from the endpoint Formspree gives you
//      (https://formspree.io/f/XXXXXXX) and paste it below in place of
//      FORM_ID.
const FORM_ID = "meajbqnd";

export async function submitQuoteRequest(values) {
  const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) throw new Error("Submission failed");
  return { ok: true, values };
}
