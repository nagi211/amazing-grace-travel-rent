import { Truck } from "lucide-react";
import { business } from "../data/business";
import "./DeliveryNotice.css";

export default function DeliveryNotice() {
  return (
    <div className="delivery-notice" aria-label="Delivery and pickup information">
      <div className="container delivery-notice-inner">
        <span className="delivery-notice-text">
          <Truck size={28} strokeWidth={2.2} />
          <span>
            Delivery &amp; Pickup fees apply based on location
            <span className="delivery-notice-dash"> — </span>
            <br className="delivery-notice-break" />
            $250 minimum for delivery
          </span>
        </span>
        <a href={business.instagramUrl} target="_blank" rel="noreferrer" className="delivery-notice-follow">
          Follow us on Instagram
        </a>
      </div>
    </div>
  );
}
