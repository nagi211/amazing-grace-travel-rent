import { Heart, Users, ShieldCheck, HandCoins } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import "./About.css";

const VALUES = [
  { icon: Heart, label: "Family Values" },
  { icon: Users, label: "Community" },
  { icon: ShieldCheck, label: "Reliability" },
  { icon: HandCoins, label: "Affordable Options" },
];

export default function About() {
  return (
    <section id="about" className="section section-alt">
      <div className="container about-inner">
        <div className="about-media-frame">
          <PlaceholderImage
            src="/mrc_fam.jpg"
            icon="Users"
            tone="green"
            alt="The Amazing Grace Travel and Rentals family"
            iconSize={56}
          />
        </div>

        <div className="about-copy">
          <span className="eyebrow">About Us</span>
          <h2>A Family Business With Aloha at Heart</h2>
          <p>
            Amazing Grace Travel and Rentals by MRC is a military family-owned business based on
            Oahu, Hawaii. We started this business to help our neighbors celebrate life's special
            moments without the stress — and without the big price tag.
          </p>
          <p>
            From birthdays to family gatherings, we're here to offer affordable, personalized
            service with the kind of care and attention you'd expect from family. When you work
            with us, you're supporting a local Oahu family that genuinely cares about making your
            event a success.
          </p>

          <div className="about-values">
            {VALUES.map(({ icon: Icon, label }) => (
              <div className="about-value" key={label}>
                <Icon size={18} strokeWidth={2.2} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
