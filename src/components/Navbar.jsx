import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Rentals", href: "/#rentals" },
  { label: "Pricing", href: "/pricing", accent: true },
  { label: "About Us", href: "/#about" },
  { label: "Gallery", href: "/#gallery" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

// Hash links (e.g. "/#about") must stay plain <a> tags: the browser
// natively handles "same page → just scroll" vs "different page → load
// then scroll to the fragment" for free. React Router's <Link> only does
// client-side navigation and won't auto-scroll to a fragment on a route
// change, which is exactly the bug this fixes — clicking these from
// /pricing did nothing because there's no matching element there and
// nothing navigated back to "/" first.
function NavLink({ href, onClick, children, className }) {
  if (href.includes("#")) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="navbar">
      <div className="navbar-blur-bg" aria-hidden="true" />
      <div className="container navbar-inner">
        <a href="/#home" className="navbar-logo" onClick={() => setOpen(false)}>
          <span className="navbar-logo-mark">
            <img src="/logo_only.png" alt="Amazing Grace Travel and Rentals logo" />
          </span>
          <span className="navbar-logo-text">
            <strong>Amazing Grace</strong>
            <span>Travel &amp; Rentals</span>
          </span>
        </a>

        <nav className="navbar-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className={link.accent ? "navbar-link-pricing" : undefined}
            >
              {link.accent && <Tag size={14} strokeWidth={2.4} />}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <button type="button" className="navbar-cart" aria-label={`Open cart (${itemCount} items)`} onClick={openCart}>
            <ShoppingCart size={22} />
            {itemCount > 0 && <span className="navbar-cart-badge">{itemCount}</span>}
          </button>
          <a href="/#quote" className="btn btn-primary navbar-cta">
            Request a Quote
          </a>
          <button
            type="button"
            className="navbar-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="navbar-mobile-panel">
          <nav className="navbar-mobile-links" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={link.accent ? "navbar-link-pricing" : undefined}
              >
                {link.accent && <Tag size={16} strokeWidth={2.4} />}
                {link.label}
              </NavLink>
            ))}
          </nav>
          <a
            href="/#quote"
            className="btn btn-primary btn-block navbar-mobile-cta"
            onClick={() => setOpen(false)}
          >
            Request a Quote
          </a>
        </div>
      )}
    </header>
  );
}
