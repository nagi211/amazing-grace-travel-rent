import { useState } from "react";
import { Armchair, Tent, Table2, Heart, Music, ClipboardList, Users, Truck, Settings, Wrench, Plus, Check } from "lucide-react";
import {
  pricingGroups,
  staffingRate,
  fulfillmentNote,
  pricingDisclaimer,
  planningPackages,
} from "../data/pricing";
import { useCart } from "../context/CartContext";
import "./RentalPricing.css";

const ICONS = { Armchair, Tent, Table2, Heart, Music, ClipboardList };

const FULFILLMENT_STEPS = [
  { icon: Truck, label: "Delivery" },
  { icon: Settings, label: "Set Up" },
  { icon: Wrench, label: "Breakdown" },
  { icon: Users, label: "Staffing" },
];

export default function RentalPricing() {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(null);

  function handleAdd(item) {
    addItem(item);
    setJustAdded(item.id);
    setTimeout(() => setJustAdded((current) => (current === item.id ? null : current)), 1200);
  }

  return (
    <section id="pricing" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Pricing</span>
          <h2 className="section-title">Rental Pricing &amp; Packages</h2>
          <p className="section-subtitle">
            A full look at our à la carte rentals and service packages. Add items to your cart to
            build out your event before requesting a quote.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingGroups.map((group) => {
            const Icon = ICONS[group.icon] || Armchair;
            return (
              <div className="card pricing-card" key={group.id}>
                <div className="pricing-card-header">
                  <span className="pricing-card-icon">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <h3>{group.title}</h3>
                </div>
                <ul className="pricing-list">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      {item.image && (
                        <span className="pricing-item-thumb">
                          <img src={item.image} alt={item.name} loading="lazy" />
                        </span>
                      )}
                      <div className="pricing-item-info">
                        <span className="pricing-item-name">{item.name}</span>
                        {item.note && <span className="pricing-item-note">{item.note}</span>}
                      </div>
                      <span className="pricing-item-price">{item.price}</span>
                      <button
                        type="button"
                        className="pricing-item-add"
                        aria-label={`Add ${item.name} to cart`}
                        onClick={() => handleAdd(item)}
                      >
                        {justAdded === item.id ? <Check size={16} /> : <Plus size={16} />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="planning-packages">
          {planningPackages.map((pkg) => (
            <details className="card planning-package" key={pkg.id}>
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
              <button type="button" className="btn btn-outline planning-package-add" onClick={() => handleAdd(pkg)}>
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
    </section>
  );
}
