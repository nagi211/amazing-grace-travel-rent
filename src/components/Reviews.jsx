import { ThumbsUp } from "lucide-react";
import { reviews, reviewStats } from "../data/reviews";
import ReviewsCarousel from "./ReviewsCarousel";
import "./Reviews.css";

export default function Reviews() {
  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Reviews</span>
          <h2 className="section-title" id="reviews-title">
            What Customers Are Saying
          </h2>
        </div>

        <div className="reviews-stat">
          <span className="reviews-stat-badge">
            <ThumbsUp size={16} /> {reviewStats.recommendPercent}% Recommended
          </span>
          <span className="reviews-stat-count">Based on {reviewStats.reviewCount} Facebook &amp; Google reviews</span>
        </div>

        <ReviewsCarousel reviews={reviews} />
      </div>
    </section>
  );
}
