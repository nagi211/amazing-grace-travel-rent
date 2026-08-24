import { MessageCircle } from "lucide-react";
import { business } from "../data/business";
import "./FinalCTA.css";

export default function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container final-cta-inner">
        <h2>Planning Something Special? Let's Make It Memorable.</h2>
        <p>
          Tell us what you're planning and we'll help you find the right rental or package for
          your celebration.
        </p>
        <div className="final-cta-actions">
          <a href="#quote" className="btn btn-gold">
            Request a Quote
          </a>
          <a href={business.messengerUrl} target="_blank" rel="noreferrer" className="btn btn-white">
            <MessageCircle size={17} /> Message Us
          </a>
        </div>
      </div>
    </section>
  );
}
