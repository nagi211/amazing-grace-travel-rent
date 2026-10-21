import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { partnerCategories, partners } from "../data/partners";
import "./Partners.css";

export default function Partners() {
  const [activePartner, setActivePartner] = useState(null);
  const [mediaIndex, setMediaIndex] = useState(0);

  function openPartner(partner) {
    setActivePartner(partner);
    setMediaIndex(0);
  }

  function closePartner() {
    setActivePartner(null);
  }

  function step(delta) {
    const count = activePartner.media.length;
    setMediaIndex((i) => (i + delta + count) % count);
  }

  useEffect(() => {
    if (!activePartner) return;
    const count = activePartner.media.length;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closePartner();
      if (e.key === "ArrowRight") setMediaIndex((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setMediaIndex((i) => (i - 1 + count) % count);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activePartner]);

  return (
    <section id="partners" className="section partners-section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Our Partners</span>
          <h2 className="section-title">Partners We Love</h2>
          <p className="section-subtitle">
            Trusted local partners who make planning your celebration even easier.
          </p>
        </div>

        {partnerCategories.map((category) => {
          const items = partners.filter((p) => p.category === category.id);
          if (items.length === 0) return null;

          return (
            <div className="partners-category" key={category.id}>
              <h3 className="partners-category-title">{category.label}</h3>
              <div className="partners-grid">
                {items.map((partner) => (
                  <button
                    type="button"
                    key={partner.id}
                    className="card partner-card"
                    onClick={() => openPartner(partner)}
                  >
                    <div className="partner-card-media">
                      <img src={partner.media[0].src} alt={partner.name} loading="lazy" />
                    </div>
                    <div className="partner-card-body">
                      <span className="partner-card-category">{category.label.replace(/s$/, "")}</span>
                      <h4>{partner.name}</h4>
                      <p>{partner.tagline}</p>
                      {partner.location && (
                        <span className="partner-card-location">
                          <MapPin size={13} /> {partner.location}
                        </span>
                      )}
                      <span className="partner-card-cta">View Venue →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {activePartner && (
        <div
          className="partners-lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={activePartner.name}
          onClick={closePartner}
        >
          <div className="partners-lightbox" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="partners-lightbox-close" aria-label="Close" onClick={closePartner}>
              <X size={20} />
            </button>

            <div className="partners-lightbox-media">
              {activePartner.media[mediaIndex].type === "video" ? (
                <video
                  key={activePartner.media[mediaIndex].src}
                  src={activePartner.media[mediaIndex].src}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img src={activePartner.media[mediaIndex].src} alt={activePartner.name} />
              )}

              {activePartner.media.length > 1 && (
                <>
                  <button
                    type="button"
                    className="partners-lightbox-nav prev"
                    aria-label="Previous"
                    onClick={() => step(-1)}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="partners-lightbox-nav next"
                    aria-label="Next"
                    onClick={() => step(1)}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="partners-lightbox-dots">
                    {activePartner.media.map((item, i) => (
                      <button
                        key={item.src}
                        type="button"
                        className={`partners-lightbox-dot ${i === mediaIndex ? "is-active" : ""}`}
                        aria-label={`Go to item ${i + 1}`}
                        onClick={() => setMediaIndex(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="partners-lightbox-info">
              <span className="partners-lightbox-eyebrow">
                <Sparkles size={13} /> Venue Partner
              </span>
              <h3>{activePartner.name}</h3>
              <p className="partners-lightbox-tagline">{activePartner.tagline}</p>
              {activePartner.location && (
                <span className="partners-lightbox-location">
                  <MapPin size={14} /> {activePartner.location}
                </span>
              )}
              <p className="partners-lightbox-description">{activePartner.description}</p>

              {activePartner.highlights && (
                <ul className="partners-lightbox-highlights">
                  {activePartner.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}

              {activePartner.packages && (
                <div className="partners-lightbox-packages">
                  <h4>Wedding Packages</h4>
                  <ul>
                    {activePartner.packages.map((pkg) => (
                      <li key={pkg.name}>
                        <strong>{pkg.name}</strong>
                        <span>
                          {pkg.type} · {pkg.guests}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a href="#contact" className="btn btn-primary partners-lightbox-cta" onClick={closePartner}>
                Ask Us About This Venue
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
