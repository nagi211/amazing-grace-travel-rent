import { Mail, MapPin, MessageCircle } from "lucide-react";
import { business } from "../data/business";
import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="section section-alt">
      <div className="container contact-inner">
        <div className="card contact-card">
          <h3>{business.name}</h3>
          <p className="contact-location">
            <MapPin size={16} /> {business.location}
          </p>

          <div className="contact-details">
            <a className="contact-email-link" href={`mailto:${business.email}`}>
              {business.email}
            </a>
          </div>

          <div className="contact-actions">
            <a href={`mailto:${business.email}`} className="btn btn-primary">
              <Mail size={17} /> Email Us
            </a>
            <a href={business.messengerUrl} target="_blank" rel="noreferrer" className="btn btn-gold">
              <MessageCircle size={17} /> Message Us on Facebook
            </a>
          </div>

          <p className="contact-note">
            We typically respond as soon as we can — for the fastest reply, Facebook Messenger
            works great.
          </p>
        </div>
      </div>
    </section>
  );
}
