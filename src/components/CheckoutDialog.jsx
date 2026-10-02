import { useState } from "react";
import { X, CheckCircle2, Send } from "lucide-react";
import { formatMoney } from "../context/CartContext";
import { formatTime12h } from "../lib/dateUtils";
import { pricingDisclaimer } from "../data/pricing";
import { submitQuoteRequest } from "../lib/submitQuote";
import "./CheckoutDialog.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9()+\-.\s]{7,20}$/;

// Confirms a cart checkout inline (no payment collected here — see
// AdminDashboard's "Checkouts" tab, where payment_status is set by hand
// once a deposit or payment is collected manually).
export default function CheckoutDialog({
  items,
  subtotal,
  fulfillment,
  startDate,
  endDate,
  startTime,
  endTime,
  onClose,
  onSuccess,
}) {
  const fulfillmentLabel = fulfillment === "pickup" ? "Pickup" : "Delivery";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  function validate() {
    const next = {};
    if (!fullName.trim()) next.fullName = "Please enter your full name.";
    if (!email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_PATTERN.test(email)) next.email = "Please enter a valid email address.";
    if (!phone.trim()) next.phone = "Please enter your phone number.";
    else if (!PHONE_PATTERN.test(phone)) next.phone = "Please enter a valid phone number.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    const lines = items.map((i) => `- ${i.name} x${i.qty} — ${formatMoney(i.amount * i.qty)}`);
    const start = formatTime12h(startTime);
    const end = formatTime12h(endTime);
    const dateLine =
      startDate && endDate && endDate !== startDate
        ? `Rental dates: ${startDate} – ${endDate}`
        : startDate
          ? `Rental date: ${startDate}`
          : null;
    const timeLine = start && end ? `Rental time: ${start} – ${end}` : null;
    const details = [
      `Fulfillment: ${fulfillmentLabel}`,
      "",
      "Cart checkout:",
      ...lines,
      "",
      `Estimated total: ${formatMoney(subtotal)} (${pricingDisclaimer.toLowerCase()})`,
      ...(dateLine ? ["", dateLine] : []),
      ...(timeLine ? [timeLine] : []),
    ].join("\n");

    try {
      await submitQuoteRequest(
        {
          fullName,
          email,
          phone,
          eventDate: startDate || "",
          eventType: "",
          guestCount: "",
          rentalNeeded: `Multiple Items (Cart Checkout — ${fulfillmentLabel})`,
          eventLocation,
          details,
        },
        items
      );
      setStatus("success");
    } catch {
      setStatus("idle");
      setErrors({ form: "Something went wrong submitting your request. Please try again or email us directly." });
    }
  }

  return (
    <div
      className="checkout-dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm checkout"
      onClick={onClose}
    >
      <div className="checkout-dialog" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="checkout-dialog-close" aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>

        {status === "success" ? (
          <div className="checkout-dialog-success">
            <div className="checkout-dialog-success-icon">
              <CheckCircle2 size={32} />
            </div>
            <h3>Mahalo, {fullName.split(" ")[0]}!</h3>
            <p>
              We've received your booking request and will follow up within 24 hours to confirm
              availability and arrange payment.
            </p>
            <button type="button" className="btn btn-primary" onClick={onSuccess}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="checkout-dialog-title">Confirm Your Booking Request</h3>

            <div className="checkout-dialog-summary">
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.name} x{item.qty}
                    </span>
                    <span>{formatMoney(item.amount * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="checkout-dialog-meta checkout-dialog-fulfillment">{fulfillmentLabel}</p>
              {startDate && (
                <p className="checkout-dialog-meta">
                  {endDate && endDate !== startDate ? `${startDate} – ${endDate}` : startDate}
                  {startTime && endTime ? ` · ${formatTime12h(startTime)} – ${formatTime12h(endTime)}` : ""}
                </p>
              )}
              <div className="checkout-dialog-total">
                <span>Estimated Total</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="checkout-dialog-form">
              <label className="checkout-field">
                Full Name *
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={errors.fullName ? "has-error" : ""}
                />
                {errors.fullName && <span className="checkout-field-error">{errors.fullName}</span>}
              </label>
              <label className="checkout-field">
                Email *
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "has-error" : ""}
                />
                {errors.email && <span className="checkout-field-error">{errors.email}</span>}
              </label>
              <label className="checkout-field">
                Phone *
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={errors.phone ? "has-error" : ""}
                />
                {errors.phone && <span className="checkout-field-error">{errors.phone}</span>}
              </label>
              <label className="checkout-field">
                Event Location
                <input
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Kapolei, Oahu"
                />
              </label>

              {errors.form && <span className="checkout-field-error">{errors.form}</span>}

              <button type="submit" className="btn btn-primary btn-block" disabled={status === "submitting"}>
                {status === "submitting" ? "Submitting..." : "Confirm & Submit"}
                <Send size={16} />
              </button>
              <p className="checkout-dialog-note">
                We'll follow up to confirm availability and arrange payment or a deposit.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
