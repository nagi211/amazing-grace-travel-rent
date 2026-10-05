import { useState } from "react";
import { Mail, Phone, MapPin, Calendar, Trash2 } from "lucide-react";

const STATUSES = ["pending", "contacted", "confirmed", "closed"];
const PAYMENT_STATUSES = [
  { value: "unpaid", label: "Unpaid" },
  { value: "deposit_paid", label: "Deposit Paid" },
  { value: "paid_in_full", label: "Paid in Full" },
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMoney(amount) {
  return `$${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

// Cart-originated bookings (inquiries with cart_items) that cleared the
// $250 checkout minimum. There's no online payment yet, so payment_status
// is set here by hand once a deposit or full payment is collected outside
// the site.
export default function CheckoutsPanel({ inquiries, updateStatus, updatePaymentStatus, deleteInquiry }) {
  const [expandedId, setExpandedId] = useState(null);
  const checkouts = inquiries.filter((row) => Array.isArray(row.cart_items) && row.cart_items.length > 0);

  if (checkouts.length === 0) {
    return (
      <p className="admin-empty">
        No cart checkouts yet — these show up once a customer's cart clears the $250 minimum and they
        confirm their booking request.
      </p>
    );
  }

  return (
    <ul className="admin-list">
      {checkouts.map((row) => {
        const total = row.cart_items.reduce((sum, item) => sum + item.amount * item.qty, 0);
        return (
          <li key={row.id} className="admin-card">
            <button
              type="button"
              className="admin-card-summary"
              onClick={() => setExpandedId((id) => (id === row.id ? null : row.id))}
            >
              <div className="admin-card-summary-main">
                <strong>{row.full_name}</strong>
                <span>{formatMoney(total)}</span>
                <span>{formatDate(row.created_at)}</span>
              </div>
              <div className="admin-card-badges">
                <span className={`admin-status-badge payment-${row.payment_status}`}>
                  {PAYMENT_STATUSES.find((p) => p.value === row.payment_status)?.label || row.payment_status}
                </span>
                <span className={`admin-status-badge status-${row.status}`}>{row.status}</span>
              </div>
            </button>

            {expandedId === row.id && (
              <div className="admin-card-detail">
                <div className="admin-detail-grid">
                  <span>
                    <Mail size={14} /> {row.email}
                  </span>
                  <span>
                    <Phone size={14} /> {row.phone}
                  </span>
                  <span>
                    <Calendar size={14} /> {row.event_date || "No date given"}
                  </span>
                  {row.event_location && (
                    <span>
                      <MapPin size={14} /> {row.event_location}
                    </span>
                  )}
                </div>

                <p className="admin-detail-label">Cart items</p>
                <ul className="admin-cart-list">
                  {row.cart_items.map((item) => (
                    <li key={item.id}>
                      {item.name} x{item.qty} — {formatMoney(item.amount * item.qty)}
                    </li>
                  ))}
                </ul>

                {row.details && (
                  <>
                    <p className="admin-detail-label">Details</p>
                    <p className="admin-detail-notes">{row.details}</p>
                  </>
                )}

                <p className="admin-detail-label">Payment Status</p>
                <div className="admin-status-row">
                  {PAYMENT_STATUSES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`admin-status-btn ${row.payment_status === p.value ? "is-active" : ""}`}
                      onClick={() => updatePaymentStatus(row.id, p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <p className="admin-detail-label">Booking Status</p>
                <div className="admin-status-row">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`admin-status-btn ${row.status === status ? "is-active" : ""}`}
                      onClick={() => updateStatus(row.id, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <button type="button" className="admin-delete-btn" onClick={() => deleteInquiry(row.id)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
