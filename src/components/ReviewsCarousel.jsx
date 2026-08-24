import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import "./ReviewsCarousel.css";

const SLIDE_DURATION = 5000;
const DESKTOP_QUERY = "(min-width: 720px)";
const DESKTOP_PER_PAGE = 3;
const MOBILE_PER_PAGE = 1;

function useItemsPerPage() {
  const [perPage, setPerPage] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
      ? DESKTOP_PER_PAGE
      : MOBILE_PER_PAGE
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (e) => setPerPage(e.matches ? DESKTOP_PER_PAGE : MOBILE_PER_PAGE);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return perPage;
}

function chunk(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

export default function ReviewsCarousel({ reviews }) {
  const perPage = useItemsPerPage();
  const pages = useMemo(() => chunk(reviews, perPage), [reviews, perPage]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [perPage]);

  useEffect(() => {
    if (pages.length <= 1) return;
    const timer = setInterval(() => {
      setPage((current) => (current + 1) % pages.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [pages.length]);

  return (
    <div className="reviews-carousel">
      <div className="reviews-carousel-viewport">
        <div
          className="reviews-carousel-track"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((pageReviews, pageIndex) => (
            <div className="reviews-carousel-page" key={pageIndex}>
              {pageReviews.map((review) => (
                <div className="card review-card" key={review.id}>
                  <div className="review-stars" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="review-quote">"{review.quote}"</p>
                  <p className="review-name">{review.name}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 && (
        <div className="reviews-carousel-dots">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`reviews-carousel-dot${i === page ? " is-active" : ""}`}
              aria-label={`Show reviews ${i + 1}`}
              aria-current={i === page}
              onClick={() => setPage(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
