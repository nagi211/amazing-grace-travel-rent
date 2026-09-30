import { useEffect, useState } from "react";
import {
  Armchair,
  Tent,
  Table2,
  Heart,
  Music,
  ClipboardList,
  Sparkles,
  Layers,
  Lightbulb,
  Users,
  Truck,
  Settings,
  Wrench,
  Plus,
  Check,
  X,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  pricingGroups,
  staffingRate,
  fulfillmentNote,
  pricingDisclaimer,
  planningPackages,
} from "../data/pricing";
import { useCart } from "../context/CartContext";
import PlaceholderImage from "../components/PlaceholderImage";
import "./Pricing.css";

const ICONS = { Armchair, Tent, Table2, Heart, Music, ClipboardList, Sparkles, Layers, Lightbulb, LayoutGrid };

const TONE_BY_CATEGORY = {
  chairs: "ocean",
  tables: "coral",
  tents: "gold",
  flooring: "ocean",
  "linens-chinaware": "green",
  lighting: "gold",
  "decor-displays": "coral",
  "ceremony-services": "green",
  entertainment: "ocean",
  "coordination-planning": "gold",
};

const FULFILLMENT_STEPS = [
  { icon: Truck, label: "Delivery" },
  { icon: Settings, label: "Set Up" },
  { icon: Wrench, label: "Breakdown" },
  { icon: Users, label: "Staffing" },
];

export default function Pricing() {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState(pricingGroups[0].id);
  const [justAdded, setJustAdded] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [galleryIndex, setGalleryIndex] = useState({});

  const activeGroup = pricingGroups.find((g) => g.id === activeCategory);
  const isPlanningTab = activeCategory === "coordination-planning";

  function currentImageSrc(item) {
    if (item.images) return item.images[(galleryIndex[item.id] || 0) % item.images.length];
    return item.image;
  }

  function stepGallery(item, direction) {
    const count = item.images.length;
    setGalleryIndex((current) => {
      const cur = current[item.id] || 0;
      return { ...current, [item.id]: (cur + direction + count) % count };
    });
  }

  function handleAdd(item) {
    const size = item.sizes ? selectedSizes[item.id] || item.sizes[0] : null;
    const cartItem = size
      ? { ...item, id: `${item.id}-${size}`, name: `${item.name} (${size})` }
      : item;
    addItem(cartItem);
    setJustAdded(cartItem.id);
    setTimeout(() => setJustAdded((current) => (current === cartItem.id ? null : current)), 1200);
  }

  useEffect(() => {
    if (!previewItem) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setPreviewItem(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewItem]);

  return (
    <section className="section pricing-page">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Pricing</span>
          <h1 className="section-title">Rental Pricing &amp; Packages</h1>
          <p className="section-subtitle">
            A full look at our à la carte rentals and service packages. Add items to your cart to
            build out your event before requesting a quote.
          </p>
        </div>

        <div className="pricing-tabs" role="tablist" aria-label="Filter pricing by category">
          {pricingGroups.map((group) => {
            const Icon = ICONS[group.icon] || Armchair;
            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === group.id}
                className={`pricing-tab-btn ${activeCategory === group.id ? "active" : ""}`}
                onClick={() => setActiveCategory(group.id)}
              >
                <Icon size={16} strokeWidth={2} /> {group.title}
              </button>
            );
          })}
        </div>

        {isPlanningTab ? (
          <div className="planning-packages-grid">
            {planningPackages.map((pkg) => (
              <details className="card planning-package-card" key={pkg.id}>
                <summary>
                  <span className="planning-package-name">{pkg.name}</span>
                  <span className="planning-package-price">{pkg.price}</span>
                </summary>
                <p className="planning-package-description">{pkg.description}</p>
                {pkg.includes && (
                  <ul className="planning-package-list">
                    {pkg.includes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                {pkg.coverage && (
                  <>
                    <p className="planning-package-sublabel">Coverage</p>
                    <ul className="planning-package-list">
                      {pkg.coverage.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </>
                )}
                {pkg.team && (
                  <>
                    <p className="planning-package-sublabel">Team</p>
                    <ul className="planning-package-list">
                      {pkg.team.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-primary planning-package-add"
                  onClick={() => handleAdd(pkg)}
                >
                  {justAdded === pkg.id ? (
                    <>
                      <Check size={16} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add to Cart
                    </>
                  )}
                </button>
              </details>
            ))}
          </div>
        ) : (
          <div className="pricing-items-grid">
            {activeGroup.items.map((item) => {
              const hasImage = Boolean(item.image || item.images?.length);
              const hasGallery = item.images && item.images.length > 1;
              return (
              <article className="card pricing-item-card" key={item.id}>
                <div className="pricing-item-media-wrap">
                  <button
                    type="button"
                    className="pricing-item-media"
                    aria-label={hasImage ? `View larger image of ${item.name}` : item.name}
                    onClick={() => hasImage && setPreviewItem(item)}
                    disabled={!hasImage}
                  >
                    <PlaceholderImage
                      src={currentImageSrc(item)}
                      icon={activeGroup.icon}
                      tone={TONE_BY_CATEGORY[activeGroup.id] || "ocean"}
                      alt={item.name}
                      iconSize={40}
                      className={item.cover ? "pricing-item-media-cover" : ""}
                    />
                  </button>
                  {hasGallery && (
                    <>
                      <button
                        type="button"
                        className="pricing-gallery-nav pricing-gallery-prev"
                        aria-label="Previous photo"
                        onClick={(e) => {
                          e.stopPropagation();
                          stepGallery(item, -1);
                        }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        className="pricing-gallery-nav pricing-gallery-next"
                        aria-label="Next photo"
                        onClick={(e) => {
                          e.stopPropagation();
                          stepGallery(item, 1);
                        }}
                      >
                        <ChevronRight size={18} />
                      </button>
                      <div className="pricing-gallery-dots">
                        {item.images.map((src, i) => (
                          <button
                            key={src}
                            type="button"
                            className={`pricing-gallery-dot ${
                              i === (galleryIndex[item.id] || 0) ? "active" : ""
                            }`}
                            aria-label={`Show photo ${i + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setGalleryIndex((current) => ({ ...current, [item.id]: i }));
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="pricing-item-card-body">
                  <h3>{item.name}</h3>
                  {item.note && <p className="pricing-item-card-note">{item.note}</p>}
                  {item.sizes && (
                    <label className="pricing-item-card-size">
                      Size
                      <select
                        value={selectedSizes[item.id] || item.sizes[0]}
                        onChange={(e) =>
                          setSelectedSizes((current) => ({ ...current, [item.id]: e.target.value }))
                        }
                      >
                        {item.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <div className="pricing-item-card-footer">
                    <span className="pricing-item-card-price">{item.price}</span>
                    <button
                      type="button"
                      className="btn btn-outline pricing-item-card-add"
                      onClick={() => handleAdd(item)}
                    >
                      {justAdded === `${item.id}${item.sizes ? `-${selectedSizes[item.id] || item.sizes[0]}` : ""}` ? (
                        <>
                          <Check size={16} /> Added
                        </>
                      ) : (
                        <>
                          <Plus size={16} /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        )}

        <div className="pricing-staffing">
          <span className="pricing-staffing-icon">
            <Users size={18} strokeWidth={2} />
          </span>
          <span>
            Staffing: <strong>{staffingRate}</strong>
          </span>
        </div>

        <div className="pricing-fulfillment">
          <div className="pricing-fulfillment-steps">
            {FULFILLMENT_STEPS.map(({ icon: Icon, label }) => (
              <div className="pricing-fulfillment-step" key={label}>
                <Icon size={22} strokeWidth={2} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p>{fulfillmentNote}</p>
        </div>

        <p className="pricing-disclaimer">{pricingDisclaimer}</p>
      </div>

      {previewItem && (
        <div
          className="pricing-lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={previewItem.name}
          onClick={() => setPreviewItem(null)}
        >
          <div className="pricing-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pricing-lightbox-close"
              aria-label="Close"
              onClick={() => setPreviewItem(null)}
            >
              <X size={20} />
            </button>
            <div className="pricing-lightbox-content">
              <img src={currentImageSrc(previewItem)} alt={previewItem.name} />
              {previewItem.images && previewItem.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="pricing-lightbox-nav pricing-lightbox-prev"
                    aria-label="Previous photo"
                    onClick={() => stepGallery(previewItem, -1)}
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className="pricing-lightbox-nav pricing-lightbox-next"
                    aria-label="Next photo"
                    onClick={() => stepGallery(previewItem, 1)}
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
            {previewItem.images && previewItem.images.length > 1 && (
              <div className="pricing-gallery-dots pricing-lightbox-dots">
                {previewItem.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`pricing-gallery-dot ${
                      i === (galleryIndex[previewItem.id] || 0) ? "active" : ""
                    }`}
                    aria-label={`Show photo ${i + 1}`}
                    onClick={() => setGalleryIndex((current) => ({ ...current, [previewItem.id]: i }))}
                  />
                ))}
              </div>
            )}
            <div className="pricing-lightbox-caption">
              <span>{previewItem.name}</span>
              <span className="pricing-lightbox-price">{previewItem.price}</span>
            </div>
            <button
              type="button"
              className="btn btn-primary pricing-lightbox-add"
              onClick={() => handleAdd(previewItem)}
            >
              {justAdded === previewItem.id ? (
                <>
                  <Check size={16} /> Added to Cart
                </>
              ) : (
                <>
                  <Plus size={16} /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
