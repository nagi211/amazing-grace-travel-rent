import { Phone, Mail } from "lucide-react";
import { business } from "../data/business";
import "./MobileActionBar.css";

export default function MobileActionBar() {
  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <a href={`tel:${business.phone.replace(/\s+/g, "")}`}>
        <Phone size={18} /> Call Us
      </a>
      <a href={`mailto:${business.email}`}>
        <Mail size={18} /> Email Us
      </a>
    </nav>
  );
}
