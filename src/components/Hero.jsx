import { ArrowRight } from "lucide-react";
import HeroCarousel from "./HeroCarousel";
import "./Hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="hero-badge">🌺 Aloha from Oahu</span>
          <h1 className="hero-title">Celebrate Life's Special Moments with Aloha</h1>
          <p className="hero-subtitle">
            Affordable event rentals and personalized packages from a family-owned Oahu business
            that cares about making your celebration special.
          </p>
          <div className="hero-actions">
            <a href="#rentals" className="btn btn-gold">
              Browse Rentals <ArrowRight size={18} />
            </a>
            <a href="#quote" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff" }}>
              Request a Quote
            </a>
          </div>
          <div className="hero-trust">
            <span>Family-Owned</span>
            <span>Oahu, Hawaii</span>
            <span>Personalized Service</span>
          </div>
        </div>

        <div className="hero-media">
          <div className="hero-media-frame">
            <HeroCarousel />
          </div>
        </div>
      </div>

      <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path
          fill="var(--color-bg)"
          d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,90 L0,90 Z"
        />
      </svg>
    </section>
  );
}
