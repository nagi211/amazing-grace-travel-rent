import { certifications } from "../data/certifications";
import "./Certifications.css";

export default function Certifications() {
  return (
    <section id="certifications" className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Credentials</span>
          <h2 className="section-title">Certified &amp; Trusted</h2>
          <p className="section-subtitle">
            Professional certifications that back up the care we put into every event.
          </p>
        </div>

        <div className="certifications-grid">
          {certifications.map((cert) => (
            <figure className="card certification-card" key={cert.id}>
              <div className="certification-media">
                <img src={cert.image} alt={cert.title} loading="lazy" />
              </div>
              <figcaption>
                <p className="certification-title">{cert.title}</p>
                <p className="certification-issuer">{cert.issuer}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
