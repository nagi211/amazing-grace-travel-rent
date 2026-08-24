import { business } from "../data/business";
import "./MobileActionBar.css";

export default function MobileActionBar() {
  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <a href="#quote">📩 Request Quote</a>
      <a href={business.messengerUrl} target="_blank" rel="noreferrer">
        💬 Message
      </a>
    </nav>
  );
}
