import { useEffect, useState } from "react";
import "./HeroCarousel.css";

const SLIDES = [
  { src: "/slide_1.jpg", alt: "Floral aisle arrangements for an Oahu event" },
  { src: "/slide_2.jpg", alt: "Beachside floral arch installation" },
  { src: "/slide_3.png", alt: "Table centerpiece with table number and greenery" },
  { src: "/slide_4.png", alt: "Welcome sign for a wedding celebration" },
];

const SLIDE_DURATION = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel" role="region" aria-label="Event highlights">
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`hero-carousel-slide${i === index ? " is-active" : ""}`}
        />
      ))}

      <div className="hero-carousel-dots">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={`hero-carousel-dot${i === index ? " is-active" : ""}`}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
