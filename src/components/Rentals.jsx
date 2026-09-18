import { rentals } from "../data/rentals";
import RentalCard from "./RentalCard";
import "./Rentals.css";

export default function Rentals({ onSelectInterest }) {
  return (
    <section id="rentals" className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Rentals</span>
          <h2 className="section-title">Make Your Celebration Special</h2>
          <p className="section-subtitle">
            Affordable rentals and personalized options for the moments that matter.
          </p>
        </div>

        <div className="rentals-grid">
          {rentals.map((rental) => (
            <RentalCard key={rental.id} rental={rental} onViewDetails={onSelectInterest} />
          ))}
        </div>
      </div>
    </section>
  );
}
