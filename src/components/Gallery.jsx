import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { galleryCategories, galleryItems } from "../data/gallery";
import PlaceholderImage from "./PlaceholderImage";
import "./Gallery.css";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeItem, setActiveItem] = useState(null);

  const items =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  useEffect(() => {
    if (!activeItem) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeItem]);

  return (
    <section id="gallery" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Gallery</span>
          <h2 className="section-title">See It in Action</h2>
          <p className="section-subtitle">
            A look at our rentals, packages and celebrations from real Oahu events.
          </p>
        </div>

        <div className="gallery-filters" role="tablist" aria-label="Filter gallery by category">
          {galleryCategories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={`gallery-filter-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="gallery-item"
              onClick={() => setActiveItem(item)}
              aria-label={`View ${item.caption}`}
            >
              <PlaceholderImage
                src={item.image}
                icon={item.icon}
                tone={item.tone}
                alt={item.caption}
                iconSize={34}
              />
            </button>
          ))}
        </div>
      </div>

      {activeItem && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.caption}
          onClick={() => setActiveItem(null)}
        >
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              aria-label="Close"
              onClick={() => setActiveItem(null)}
            >
              <X size={20} />
            </button>
            <div className="lightbox-content">
              <PlaceholderImage
                src={activeItem.image}
                icon={activeItem.icon}
                tone={activeItem.tone}
                alt={activeItem.caption}
                iconSize={56}
              />
              <span className="lightbox-caption">{activeItem.caption}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
