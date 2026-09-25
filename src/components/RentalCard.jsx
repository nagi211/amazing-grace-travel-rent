import { Link } from "react-router-dom";
import PlaceholderImage from "./PlaceholderImage";
import "./RentalCard.css";

export default function RentalCard({ rental, onViewDetails }) {
  return (
    <article className="card rental-card">
      <div className="rental-card-media">
        <PlaceholderImage
          src={rental.image}
          icon={rental.icon}
          tone={rental.tone}
          alt={rental.name}
        />
      </div>
      <div className="rental-card-body">
        <h3>{rental.name}</h3>
        <p>{rental.description}</p>
        <div className="rental-card-actions">
          {rental.pricingLink && (
            <Link to={rental.pricingLink} className="btn btn-primary">
              Browse Pricing
            </Link>
          )}
          <a
            href="/#quote"
            className={rental.pricingLink ? "btn btn-outline" : "btn btn-primary"}
            onClick={() => onViewDetails?.(rental.name)}
          >
            Request a Quote
          </a>
        </div>
      </div>
    </article>
  );
}
