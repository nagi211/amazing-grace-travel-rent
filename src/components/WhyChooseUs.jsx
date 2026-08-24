import { HandCoins, Heart, Home, MapPin } from "lucide-react";
import "./WhyChooseUs.css";

const FEATURES = [
  {
    icon: HandCoins,
    title: "Affordable",
    description: "We believe special celebrations shouldn't have to break the budget.",
  },
  {
    icon: Heart,
    title: "Personal",
    description: "Every event is different, so we offer personalized options.",
  },
  {
    icon: Home,
    title: "Family-Owned",
    description: "You'll be working with a local family business that genuinely cares.",
  },
  {
    icon: MapPin,
    title: "Local",
    description: "Proudly serving customers in Oahu, Hawaii.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Why Amazing Grace</span>
          <h2 className="section-title">Why Choose Amazing Grace</h2>
        </div>

        <div className="why-grid">
          {FEATURES.map((feature) => (
            <div className="card why-card" key={feature.title}>
              <div className="why-card-icon">
                <feature.icon size={24} strokeWidth={2} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
