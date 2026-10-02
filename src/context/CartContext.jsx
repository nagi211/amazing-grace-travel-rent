import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "agtr-cart-items";

// Matches the "$250 minimum for delivery" banner (DeliveryNotice.jsx) — the
// cart's Checkout button stays disabled until the subtotal clears this.
export const DELIVERY_MINIMUM = 250;

function loadStoredItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function formatMoney(amount) {
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadStoredItems);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can fail (private browsing, quota) — the cart just won't persist.
    }
  }, [items]);

  function addItem(item, qty = 1) {
    setItems((current) => {
      const existing = current.find((i) => i.id === item.id);
      if (existing) {
        return current.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...current, { id: item.id, name: item.name, amount: item.amount, unit: item.unit, qty }];
    });
  }

  function updateQty(id, qty) {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((current) => current.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  function removeItem(id) {
    setItems((current) => current.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.amount * i.qty, 0), [items]);

  const value = {
    items,
    itemCount,
    subtotal,
    isOpen,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
