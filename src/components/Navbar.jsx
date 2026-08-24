import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Rentals", href: "#rentals" },
  { label: "About Us", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
        <a href="#home" className="navbar-logo" onClick={() => setOpen(false)}>
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
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          <a href="#quote" className="btn btn-primary navbar-cta">
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
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#quote"
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
