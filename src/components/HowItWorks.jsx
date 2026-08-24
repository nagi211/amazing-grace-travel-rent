import { CalendarHeart, ClipboardList, PartyPopper } from "lucide-react";
import "./HowItWorks.css";

const STEPS = [
  {
    icon: CalendarHeart,
    title: "Tell Us About Your Event",
    description: "Choose your event type and tell us what you need.",
  },
  {
    icon: ClipboardList,
    title: "Choose Your Rentals",
    description: "Browse available rentals or ask about a personalized package.",
  },
  {
    icon: PartyPopper,
    title: "Celebrate",
    description: "We'll help make your special occasion easier and more memorable.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section" aria-labelledby="how-it-works-title">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">How It Works</span>
          <h2 className="section-title" id="how-it-works-title">
            Simple, Personal, Stress-Free
          </h2>
        </div>

        <div className="how-grid">
          {STEPS.map((step, index) => (
            <div className="how-step" key={step.title}>
              <div className="how-step-icon">
                <step.icon size={30} strokeWidth={1.8} />
                <span className="how-step-number">{index + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
