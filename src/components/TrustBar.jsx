import { Star, MapPin, Heart, DollarSign } from "lucide-react";
import "./TrustBar.css";

const ITEMS = [
  { icon: Star, label: "Family-Owned Business" },
  { icon: MapPin, label: "Proudly Serving Oahu" },
  { icon: Heart, label: "Personalized Service" },
  { icon: DollarSign, label: "Affordable Packages" },
];

export default function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Why customers trust us">
      <div className="container trust-bar-inner">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div className="trust-item" key={label}>
            <Icon size={20} strokeWidth={2.2} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
