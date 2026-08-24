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
        <a href="#quote" className="btn btn-outline" onClick={() => onViewDetails?.(rental.name)}>
          View Details
        </a>
      </div>
    </article>
  );
}
