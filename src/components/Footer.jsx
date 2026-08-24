import { Mail, MapPin, Palmtree } from "lucide-react";
import { business } from "../data/business";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";
import "./Footer.css";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Rentals", href: "#rentals" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="footer-brand-mark">
                <Palmtree size={20} />
              </span>
              <span className="footer-brand-text">
                <strong>Amazing Grace</strong>
              </span>
            </div>
            <p className="footer-tagline">
              {business.name} — celebrating life's special moments with aloha, grace and care.
            </p>
            <div className="footer-social">
              <a href={business.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href={business.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Explore</h4>
            <nav className="footer-links">
              {LINKS.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <a href={`mailto:${business.email}`}>
                <Mail size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                {business.email}
              </a>
              <span>
                <MapPin size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                {business.location}
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
