import { business } from "../data/business";
import "./DeliveryNotice.css";

export default function DeliveryNotice() {
  return (
    <section className="delivery-notice" aria-label="Delivery and pickup information">
      <div className="container">
        <div className="delivery-notice-inner">
          <p>
            <strong>Delivery and Pickup</strong> fees apply based on location
          </p>
          <p className="delivery-notice-minimum">$250 minimum order required for delivery service</p>
          <p className="delivery-notice-follow">
            <strong>Follow us</strong> on{" "}
            <a href={business.instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>{" "}
            to see examples of our work
          </p>
        </div>
      </div>
    </section>
  );
}
