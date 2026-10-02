import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart, formatMoney, DELIVERY_MINIMUM } from "../context/CartContext";
import { pricingDisclaimer } from "../data/pricing";
import { todayISODate } from "../lib/dateUtils";
import CheckoutDialog from "./CheckoutDialog";
import "./CartDrawer.css";

export default function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, updateQty, removeItem, clearCart } = useCart();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const meetsMinimum = subtotal > DELIVERY_MINIMUM;
  const hasDuration = Boolean(startDate && endDate);
  const canCheckout = meetsMinimum && hasDuration;

  function handleStartDateChange(value) {
    setStartDate(value);
    if (!endDate || value > endDate) setEndDate(value);
  }

  function handleCheckoutSuccess() {
    setIsCheckoutOpen(false);
    clearCart();
    closeCart();
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-drawer-header">
          <h3>
            <ShoppingCart size={18} /> Your Cart {itemCount > 0 && `(${itemCount})`}
          </h3>
          <button type="button" className="cart-drawer-close" aria-label="Close cart" onClick={closeCart}>
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <p>Your cart is empty.</p>
            <p>Browse rentals and add items to build your event list.</p>
            <Link to="/pricing" className="btn btn-primary" onClick={closeCart}>
              Browse Pricing <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-drawer-items">
              {items.map((item) => (
                <li key={item.id} className="cart-drawer-item">
                  <div className="cart-drawer-item-info">
                    <span className="cart-drawer-item-name">{item.name}</span>
                    <span className="cart-drawer-item-price">
                      {formatMoney(item.amount)}
                      {item.unit ? ` / ${item.unit}` : ""}
                    </span>
                  </div>
                  <div className="cart-drawer-item-controls">
                    <div className="cart-drawer-qty">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-drawer-remove"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-drawer-footer">
              <div className="cart-drawer-datetime">
                <div className="cart-drawer-time-row">
                  <label className="cart-drawer-field">
                    Start Date
                    <input
                      type="date"
                      min={todayISODate()}
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                    />
                  </label>
                  <label className="cart-drawer-field">
                    End Date
                    <input
                      type="date"
                      min={startDate || todayISODate()}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </label>
                </div>
                <div className="cart-drawer-time-row">
                  <label className="cart-drawer-field">
                    Start Time
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  </label>
                  <label className="cart-drawer-field">
                    End Time
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                  </label>
                </div>
              </div>

              <div className="cart-drawer-total">
                <span>Estimated Total</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              <p className="cart-drawer-disclaimer">{pricingDisclaimer} — final pricing confirmed with your quote.</p>
              <button
                type="button"
                className="btn btn-primary btn-block"
                disabled={!canCheckout}
                onClick={() => setIsCheckoutOpen(true)}
              >
                Checkout
              </button>
              {!meetsMinimum && (
                <p className="cart-drawer-minimum-note">
                  Add {formatMoney(DELIVERY_MINIMUM - subtotal)} more to unlock checkout (${DELIVERY_MINIMUM}{" "}
                  minimum).
                </p>
              )}
              {meetsMinimum && !hasDuration && (
                <p className="cart-drawer-minimum-note">Pick your rental start and end date to checkout.</p>
              )}
              <button type="button" className="cart-drawer-clear" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>

      {isCheckoutOpen && (
        <CheckoutDialog
          items={items}
          subtotal={subtotal}
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
