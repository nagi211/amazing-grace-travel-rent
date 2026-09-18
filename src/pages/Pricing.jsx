import { useEffect, useState } from "react";
import {
  Armchair,
  Tent,
  Table2,
  Heart,
  Music,
  ClipboardList,
  Sparkles,
  Users,
  Truck,
  Settings,
  Wrench,
  Plus,
  Check,
  X,
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

const ICONS = { Armchair, Tent, Table2, Heart, Music, ClipboardList, Sparkles };

const TONE_BY_CATEGORY = {
  "individual-rentals": "ocean",
  tents: "gold",
  "table-event-setups": "coral",
  "ceremony-services": "green",
  entertainment: "ocean",
  "coordination-planning": "gold",
  "decor-addons": "coral",
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

  const activeGroup = pricingGroups.find((g) => g.id === activeCategory);
  const isPlanningTab = activeCategory === "coordination-planning";

  function handleAdd(item) {
    addItem(item);
    setJustAdded(item.id);
    setTimeout(() => setJustAdded((current) => (current === item.id ? null : current)), 1200);
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
            {activeGroup.items.map((item) => (
              <article className="card pricing-item-card" key={item.id}>
                <button
                  type="button"
                  className="pricing-item-media"
                  aria-label={item.image ? `View larger image of ${item.name}` : item.name}
                  onClick={() => item.image && setPreviewItem(item)}
                  disabled={!item.image}
                >
                  <PlaceholderImage
                    src={item.image}
                    icon={activeGroup.icon}
                    tone={TONE_BY_CATEGORY[activeGroup.id] || "ocean"}
                    alt={item.name}
                    iconSize={40}
                  />
                </button>
                <div className="pricing-item-card-body">
                  <h3>{item.name}</h3>
                  {item.note && <p className="pricing-item-card-note">{item.note}</p>}
                  <div className="pricing-item-card-footer">
                    <span className="pricing-item-card-price">{item.price}</span>
                    <button
                      type="button"
                      className="btn btn-outline pricing-item-card-add"
                      onClick={() => handleAdd(item)}
                    >
                      {justAdded === item.id ? (
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
            ))}
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
              <img src={previewItem.image} alt={previewItem.name} />
            </div>
            <div className="pricing-lightbox-caption">
              <span>{previewItem.name}</span>
              <span className="pricing-lightbox-price">{previewItem.price}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
