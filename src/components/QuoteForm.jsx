import { useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { rentals } from "../data/rentals";
import { packages } from "../data/packages";
import { submitQuoteRequest } from "../lib/submitQuote";
import { useCart } from "../context/CartContext";
import "./QuoteForm.css";

const EVENT_TYPES = [
  "Birthday",
  "Family Gathering",
  "Party",
  "Wedding",
  "Baby Shower",
  "Community / Group Event",
  "Other",
];

const RENTAL_OPTIONS = [
  ...rentals.map((r) => r.name),
  ...packages.map((p) => p.name),
  "Multiple Items (Cart)",
  "Not sure — help me choose",
];

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  eventDate: "",
  eventType: "",
  guestCount: "",
  rentalNeeded: "",
  eventLocation: "",
  details: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9()+\-.\s]{7,20}$/;

function validate(values) {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!values.email.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Please enter a valid email address.";
  if (!values.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!PHONE_PATTERN.test(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (!values.eventDate) errors.eventDate = "Please select your event date.";
  if (!values.eventType) errors.eventType = "Please select an event type.";
  if (!values.guestCount) errors.guestCount = "Please enter your expected guest count.";
  else if (Number(values.guestCount) <= 0) errors.guestCount = "Guest count must be greater than 0.";
  if (!values.rentalNeeded) errors.rentalNeeded = "Please select what you're interested in.";
  return errors;
}

export default function QuoteForm({ prefillInterest }) {
  const { pendingRequest, clearPendingRequest } = useCart();
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [lastPrefill, setLastPrefill] = useState(prefillInterest);

  if (prefillInterest && prefillInterest !== lastPrefill) {
    setLastPrefill(prefillInterest);
    setValues((v) => ({ ...v, rentalNeeded: prefillInterest }));
  }

  useEffect(() => {
    if (!pendingRequest) return;
    setValues((v) => ({ ...v, rentalNeeded: pendingRequest.interest, details: pendingRequest.details }));
    clearPendingRequest();
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
  }, [pendingRequest, clearPendingRequest]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      await submitQuoteRequest(values);
      setStatus("success");
      setValues(EMPTY_FORM);
    } catch {
      setStatus("idle");
      setErrors({ form: "Something went wrong submitting your request. Please try again or email us directly." });
    }
  }

  return (
    <section id="quote" className="section quote-section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Request a Quote</span>
          <h2 className="section-title">Let's Plan Your Celebration</h2>
          <p className="section-subtitle">
            Tell us a little about your event and we'll get back to you with availability and
            pricing.
          </p>
        </div>

        <div className="quote-card">
          {status === "success" ? (
            <div className="quote-success">
              <div className="quote-success-icon">
                <CheckCircle2 size={32} />
              </div>
              <h3>Mahalo! Your request has been received.</h3>
              <p>
                We'll get back to you with availability and pricing as soon as we can. In the
                meantime, feel free to message us on Facebook if you have any questions.
              </p>
              <button type="button" className="btn btn-primary" onClick={() => setStatus("idle")}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="quote-form-grid">
                <Field
                  label="Full Name"
                  name="fullName"
                  required
                  value={values.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  autoComplete="email"
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  required
                  value={values.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <Field
                  label="Event Date"
                  name="eventDate"
                  type="date"
                  required
                  value={values.eventDate}
                  onChange={handleChange}
                  error={errors.eventDate}
                />
                <Field
                  label="Event Type"
                  name="eventType"
                  as="select"
                  required
                  value={values.eventType}
                  onChange={handleChange}
                  error={errors.eventType}
                  options={["", ...EVENT_TYPES]}
                  placeholder="Select event type"
                />
                <Field
                  label="Number of Guests"
                  name="guestCount"
                  type="number"
                  min="1"
                  required
                  value={values.guestCount}
                  onChange={handleChange}
                  error={errors.guestCount}
                />
                <Field
                  label="Rental / Package Needed"
                  name="rentalNeeded"
                  as="select"
                  required
                  value={values.rentalNeeded}
                  onChange={handleChange}
                  error={errors.rentalNeeded}
                  options={["", ...RENTAL_OPTIONS]}
                  placeholder="Select an option"
                />
                <Field
                  label="Event Location"
                  name="eventLocation"
                  value={values.eventLocation}
                  onChange={handleChange}
                  placeholder="e.g. Kapolei, Oahu"
                />
                <Field
                  label="Additional Details"
                  name="details"
                  as="textarea"
                  rows={4}
                  fullWidth
                  value={values.details}
                  onChange={handleChange}
                  placeholder="Tell us more about your event or what you're looking for."
                />
              </div>

              <div className="quote-submit-row">
                {errors.form && <span className="field-error">{errors.form}</span>}
                <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
                  {status === "submitting" ? "Sending..." : "Request My Quote"}
                  <Send size={16} />
                </button>
                <p className="quote-submit-note">We'll get back to you with availability and pricing.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  required,
  error,
  as = "input",
  type = "text",
  options,
  placeholder,
  fullWidth,
  ...rest
}) {
  const inputClass = error ? "has-error" : "";
  const fieldClass = fullWidth ? "field field-full" : "field";

  return (
    <div className={fieldClass}>
      <label htmlFor={name}>
        {label} {required && <span className="field-required">*</span>}
      </label>
      {as === "select" ? (
        <select id={name} name={name} className={inputClass} {...rest}>
          {options.map((opt) => (
            <option key={opt || "placeholder"} value={opt} disabled={opt === ""}>
              {opt === "" ? placeholder : opt}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea id={name} name={name} className={inputClass} placeholder={placeholder} {...rest} />
      ) : (
        <input id={name} name={name} type={type} className={inputClass} placeholder={placeholder} {...rest} />
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
